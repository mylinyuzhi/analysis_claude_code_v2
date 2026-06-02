# Symbol Index — Core Execution (v2.1.143 → v2.1.156)

This index catalogs obfuscated → readable mappings for the **core execution** symbols introduced or changed between v2.1.143 and v2.1.156. Scope: Agent Loop, Tools (factory / registration / dispatch / AskUserQuestion / Read / streaming executor), LLM API, Agents, Subagent, State, System Prompts (the lean/full prompt assembler + section cache + section builders + tool-description + reminder), and the dynamic-workflow **coordinator** prompt + the workflow **tool factory** / tool-defaults.

For other categories see:

- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Plan, Background Agents, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI, **Dynamic Workflows** (the workflow gate family, caps, journal, keyword, ultracode, `/workflows` viewer)
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model Selection, Prompt-gate predicates, Telemetry
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome/Browser, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands

## File:Line Format

For v2.1.156 the canonical source citation is the single pretty-printed bundle:

```
cli_inner_pretty.js:<line>    (/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js)
```

Unlike the v2.1.142 tree (which also exposed stable per-decl `cli_unpack_pretty/unknown/<id>.js` files), every row here cites the bundle line that was read to verify the mapping. Line numbers can shift as Bun reorganizes the bundle between builds, so always re-grep the identifier if a line looks stale.

---

## Module: Tools — Factory, Defaults & Lazy-Export Plumbing

The tool factory, the shared tool-defaults object, the lazy module/export accessors used to wire conditional tool slots, and the REPL/code-execution tool the Workflow slot is spread next to.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `P45` | TOOL_DEFAULTS (default tool fields — `isEnabled: () => !0`, `checkPermissions`, `toAutoClassifierInput`, … — spread by `yK`) | cli_inner_pretty.js:143499 | object |
| `X$` | defineLazyExports (installs getter-backed exports; `X$(ep6,{WorkflowTool:()=>n0_})` at 378080, `X$(m57,…)` at 216290) | cli_inner_pretty.js:55 | function |
| `Z6` | requireLazyModule (lazy CommonJS-module accessor used to fill conditional tool slots in `k0`) | cli_inner_pretty.js:39 | function |
| `k0` | initializeBundledTools (`T()`-wrapped one-time initializer populating `_H$` + cron/monitor slots, then calls `iUK(ra)`) | cli_inner_pretty.js:409445 | function |
| `pQ6` | codeExecutionTool (REPL / code-execution tool; the Workflow slot is spread immediately after it in `ra`) | cli_inner_pretty.js:401977 | object |
| `yK` | createTool / makeTool (tool factory; spreads `P45` defaults under the def, preserving getters via `getOwnPropertyDescriptors`) | cli_inner_pretty.js:143482 | function |

---

## Module: Tools — Generic Runtime Helpers (Workflow Runtime)

Generic runtime primitives the dynamic-workflow VM executor is built from but which are not workflow-specific: the concurrency semaphore that gates the local/remote agent executors, the deep-clone used to copy agent/script results out of the VM realm, and the `StructuredOutput` tool name + compiler used to force schema-validated subagent output. (Full workflow-runtime analysis is in `42_workflow/workflow_runtime_and_subagents.md`; the workflow-specific runtime symbols live in `symbol_index_core_features.md` Dynamic Workflows.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AP` | structuredClone (generic deep-clone — `using`-resource-traced; used to copy agent/script results out of the VM realm) | cli_inner_pretty.js:9132 | function |
| `BiH` | concurrencyLimiter (generic semaphore factory `BiH(width, fn)`; wraps the local executor at `cG_` `C = BiH(cG_, R)`, remote at `lG_` `b = BiH(lG_, U)`, and the worktree path at width 1 `BiH(1, fSH)` @374947) | cli_inner_pretty.js:268738 | function |
| `iY` | STRUCTURED_OUTPUT_TOOL_NAME (the string `"StructuredOutput"`) | cli_inner_pretty.js:212132 | constant |
| `klH` | compileSchemaTool (Ajv-validate a JSON Schema and build a `StructuredOutput` tool with `inputJSONSchema` = the user schema; memoized in `c97`; `pV5` is the builder at 212104) | cli_inner_pretty.js:212098 | function |

---

## Module: Tools — Base-Tool Pool Assembly & Schema

The exhaustive built-in tool array, the enabled-only preset selectors, the deny-rule / `isEnabled` mask filters, the tool-pool merger, the base-tools provider registration, and the per-tool API-schema serializer + cache.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `HqH` | filterToolsByDenyRules (strips blanket-denied / `effectiveMaxPermission === "blocked"` tools) | cli_inner_pretty.js:409371 | function |
| `Jk` | getTools (production built-in pool after deny-rule + REPL + `isEnabled` mask filtering) | cli_inner_pretty.js:409414 | function |
| `iUK` | registerBaseToolsProvider (installs `ra` as the cached base-tools provider `nUK`) | cli_inner_pretty.js:143455 | function |
| `qyK` | getToolSchemaCache (session-stable tool-schema cache keyed by `"L:"`/`"F:"` + name) | cli_inner_pretty.js:130649 | function |
| `ra` | getAllBaseTools (exhaustive hand-ordered built-in tool array; source of truth for everything the model could see) | cli_inner_pretty.js:409313 | function |
| `w08` | buildToolSchema (serializes one tool into the API schema; computes `eager_input_streaming` + cache key) | cli_inner_pretty.js:555969 | function |
| `Xg6` | getToolsForDefaultPreset (enabled-only name list for `--tools default`; mask-then-filter over `ra()`) | cli_inner_pretty.js:409308 | function |
| `zl` | assembleToolPool (merges deny-filtered built-ins + skill/MCP tools, contiguous built-in prefix, deduped by name) | cli_inner_pretty.js:409374 | function |

---

## Module: Tools — Permission-Layer Folding (Command-Scoped Allow/Deny)

The per-turn permission-context machinery that applies a slash-command/skill's allow + deny lists to the live `toolPermissionContext`, with the clear-on-next-message reset.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `D0$` | buildForkedCommandContext (fork-path builder; emits `{kind:"disallowed_tools"}` context layer) | cli_inner_pretty.js:452910 | function |
| `fI8` | processUserInput (user-turn entry; replaces `alwaysDenyRules.command` with this turn's deny list — clear-on-next-message) | cli_inner_pretty.js:590814 | function |
| `hV$` | applyPermissionLayers (appends layers to a context, tracking a model override) | cli_inner_pretty.js:453193 | function |
| `T6` | computeEffectivePermissionContext (folds `permissionLayers` — allowed/disallowed/avoid/effort/model — onto base `toolPermissionContext`) | cli_inner_pretty.js:453162 | function |
| `tT4` | wrapAppStateWithToolLayers (wraps `getAppState` so its `toolPermissionContext` has the command's allow+deny lists applied) | cli_inner_pretty.js:452903 | function |
| `yA4` | processCommandToMessages (inline command/skill expander; calls `c28(…,"union")` with the disallowed list) | cli_inner_pretty.js:396582 | function |

---

## Module: Tools — AskUserQuestion (2.1.154 Reservation)

The AskUserQuestion tool object whose `prompt({model})` injects the v2.1.154 "reserve this for decisions you genuinely cannot make" paragraph for lean models, plus its name/description/prompt constants and UI chip width.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BUK` | ASK_USER_QUESTION_TOOL_CHIP_WIDTH (`12` — UI chip width) | cli_inner_pretty.js:143389 | constant |
| `ez` | ASK_USER_QUESTION_TOOL_NAME (the string `"AskUserQuestion"`) | cli_inner_pretty.js:143388 | constant |
| `FUK` | ASK_USER_QUESTION_RESERVATION_PROMPT (the v2.1.154 "Reserve this for decisions…" paragraph injected for lean models) | cli_inner_pretty.js:143394 | constant |
| `pUK` | ASK_USER_QUESTION_DESCRIPTION (one-line tool description) | cli_inner_pretty.js:143390 | constant |
| `UUK` | PREVIEW_FEATURE_PROMPT (markdown/html preview-guidance map appended to the AskUserQuestion prompt) | cli_inner_pretty.js:143398 | object |
| `xM6` | ASK_USER_QUESTION_BASE_PROMPT (tightened "use this tool only when blocked" base; ships to every model) | cli_inner_pretty.js:143419 | constant |
| `YtH` | askUserQuestionTool (the tool object whose `prompt({model})` injects the reservation) | cli_inner_pretty.js:348809 | object |

---

## Module: Tools — Read PARTIAL-View Truncation (2.1.145)

The Read body dispatcher, the token-cap guard it raises, the truncation-prefix system-reminder string, and the re-read-stub constants/detectors.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$j$` | PARTIAL_VIEW_PREFIX (`"[Truncated: PARTIAL view — "` system-reminder prefix for truncated Reads) | cli_inner_pretty.js:145392 | constant |
| `BFK` | getFileUnchangedStub (returns `mFK` for the `file_unchanged` tool_result) | cli_inner_pretty.js:145350 | function |
| `FJ4` | ensureUnderTokenCap (throws `TokenCapExceeded` when projected tokens exceed `maxTokens`) | cli_inner_pretty.js:422314 | function |
| `gJ4` | readFileBody (per-type Read body dispatcher; contains the PARTIAL-view token-cap truncation block) | cli_inner_pretty.js:422327 | function |
| `HK` | READ_TOOL_NAME (the string `"Read"`; interpolated into the next-page paging hint) | cli_inner_pretty.js:145385 | constant |
| `mFK` | FILE_UNCHANGED_SHORT (current "Wasted call — file unchanged…" re-read stub phrasing) | cli_inner_pretty.js:145391 | constant |
| `O95` | FILE_UNCHANGED_LONG (legacy verbose "File unchanged since last read…" re-read stub phrasing) | cli_inner_pretty.js:145389 | constant |
| `w68` | isReReadStub (detects an "unchanged since last read" stub by either `O95` or `mFK` prefix) | cli_inner_pretty.js:145353 | function |

---

## Module: System Prompts — Assembler & Section Cache

The main async system-prompt assembler (the terminal switch that picks the lean 1-section body vs the full 6-section body) and the per-session section cache it computes through.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cKq` | isSimplePromptMode (`CLAUDE_CODE_SIMPLE` hard short-circuit → CWD+Date only; predates lean) | cli_inner_pretty.js:555588-555590 | function |
| `DE` | makeSection (wraps name + compute closure into `{name, compute, cacheBreak:false}` cacheable record) | cli_inner_pretty.js:271350-271352 | function |
| `Dv` | initLeanPromptModule (lazy module init that assigns the memoized `X3` gate) | cli_inner_pretty.js:143865-143877 | variable |
| `gm8` | clearSystemPromptSectionCache (clears the per-session section cache Map) | cli_inner_pretty.js:3202-3204 | function |
| `i6$` | latestModelIds (`{opus:"claude-opus-4-8", sonnet:"claude-sonnet-4-6", haiku:…}`; opus = lean default) | cli_inner_pretty.js:555940 | variable |
| `N0` | buildSystemPromptSections (main async assembler; terminal switch picks lean 1-section vs full 6-section body; consumes `X3`) | cli_inner_pretty.js:555614-555658 | function |
| `Qm8` | setSystemPromptSectionCacheEntry (writes a computed section into the cache Map) | cli_inner_pretty.js:3199-3201 | function |
| `SYH` | getSystemPromptSectionCache (accessor for the per-session section cache Map) | cli_inner_pretty.js:3196-3197 | function |
| `uv7` | computeCachedSections (resolves each `DE` section via cache; computes at most once per session) | cli_inner_pretty.js:271353-271362 | function |

---

## Module: System Prompts — Full Section Builders

The six full-prompt section builders (carried forward near-verbatim from v2.1.88 `getSimple*Section`) plus the shared hooks-paragraph builder and the bullet-formatting helper.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BXz` | buildHooksSection (hooks-trust bullet, shared by lean inline and full `# System`) | cli_inner_pretty.js:555418-555420 | function |
| `cXz` | buildFullExecutingActionsSection (full `# Executing actions with care`; largest full block; `rKq==="compact"` variant) | cli_inner_pretty.js:555494-555510 | function |
| `dXz` | buildFullDoingTasksSection (full `# Doing tasks`; gated by `keepCodingInstructions`; `tengu_verified_vs_assumed` bullet) | cli_inner_pretty.js:555461-555493 | function |
| `gXz` | buildFullSystemSection (full `# System`; 6 bullets incl. `BXz` hooks paragraph + context-compression) | cli_inner_pretty.js:555449-555460 | function |
| `lXz` | buildFullUsingToolsSection (full `# Using your tools`; Todo usage, dedicated-tools-over-shell, parallel calls) | cli_inner_pretty.js:555511-555534 | function |
| `oU` | prependBullets (converts string list to ` - bullet` / `  - subbullet` lines) | cli_inner_pretty.js:555439-555441 | function |
| `QXz` | buildFullIntroSection (full intro: "You are an interactive agent…" + cyber-risk + no-URL-guessing) | cli_inner_pretty.js:555442-555448 | function |
| `rXz` | buildFullToneAndStyleSection (full `# Tone and style`; no-emojis, concise, `file_path:line_number`, no colon before tool calls) | cli_inner_pretty.js:555578-555587 | function |

---

## Module: System Prompts — Lean Section & Within-Section Lean Variants

The single lean body section, plus the per-section selectors that swap a lean variant for a full one (anti-verbosity, action-caution, focus-mode, investigate-first), and the clarifying-question policy mode.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ALz` | focusModeFullText (full focus-mode body; spells out "This overrides earlier guidance…") | cli_inner_pretty.js:555896-555897 | constant |
| `fLz` | buildFocusModeSection (focus-mode selector; lean ⇒ `YLz`, full ⇒ `ALz`; null when not focus / non-interactive) | cli_inner_pretty.js:555862-555867 | function |
| `mXz` | buildActionCautionSection (lean-ONLY one-liner condensing the full `# Executing actions` section; null under full) | cli_inner_pretty.js:555414-555417 | function |
| `OLz` | buildInvestigateFirstSection (emits investigate-first guidance unless `rKq` mode is "off") | cli_inner_pretty.js:555878-555881 | function |
| `oXz` | leanHarnessSection (the single lean body: role + cyber-risk + `# Harness` 6 bullets) | cli_inner_pretty.js:555591-555607 | function |
| `rKq` | investigateFirstMode (clarifying-question policy; only opus-4-7 opts in; forced "off" under lean) | cli_inner_pretty.js:555868-555877 | function |
| `uXz` | buildAntiVerbositySection (lean one-liner "Write code that reads like the surrounding code…" vs full `# Text output` block) | cli_inner_pretty.js:555399-555413 | function |
| `YLz` | focusModeLeanText (lean focus-mode body; tighter single-paragraph with enumerated "investigated/found/changed…") | cli_inner_pretty.js:555898-555899 | constant |

---

## Module: System Prompts — Lean-Aware Tool Descriptions & Reminders

Tool descriptions and reminder/memory sub-behaviours that flip on the lean gate `X3`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `HR_` | buildAutoModeReminder (auto-mode classifier; lean models return `[]` — no `auto_mode` reminder injected) | cli_inner_pretty.js:412889-412893 | function |
| `SFK` | isMemoryAutoLoadSection (memory sub-behavior gate; `if (X3(H)) return !1` — suppressed for lean) | cli_inner_pretty.js:145119-145124 | function |
| `W47` | getWebFetchToolDescription (lean ⇒ short blurb, full ⇒ long "IMPORTANT: WebFetch WILL FAIL…"; selected by `X3`) | cli_inner_pretty.js:206793-206797 | function |
| `z44` | getTodoToolDescription (lean ⇒ terse `Y0_`, full ⇒ multi-section `f0_`; selected by `X3`) | cli_inner_pretty.js:376250-376251 | function |

---

## Module: Workflow Coordinator (Dynamic-Workflow Orchestration Prompt)

The coordinator-mode system-prompt builder (Claude as an orchestrator directing workers) and the worker-tool name constants it interpolates. The coordinator pre-dates dynamic workflows (precursor `src/coordinator/coordinatorMode.ts`); the `NZ()`-gated Workflow clause is the v2.1.156 retrofit. The workflow gate family itself (`NZ`, `SL5`, `KP6`, …) lives in [`symbol_index_core_features.md`](symbol_index_core_features.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cf` | SEND_MESSAGE_TOOL_NAME (`"SendMessage"`; coordinator "Continue an existing worker" tool) | cli_inner_pretty.js:216283 | constant |
| `Dk5` | getCoordinatorSystemPrompt (coordinator prompt builder with `NZ`-gated Workflow clause; emits `tengu_feature_ok("coordinator_mode_start")` via `SH` = `emitFeatureOk`) | cli_inner_pretty.js:216506 | function |
| `mx` | WORKFLOW_TOOL_NAME (`"Workflow"`; interpolated into the coordinator's `NZ`-gated clause — full home in core_features) | cli_inner_pretty.js:216291 | constant |
| `n18` | LIST_AGENTS_TOOL_NAME (`"ListAgents"`; cross-session peer discovery in the coordinator prompt) | cli_inner_pretty.js:216292 | constant |
| `nT` | TASK_STOP_TOOL_NAME (`"TaskStop"`; coordinator "Stop a running worker" tool) | cli_inner_pretty.js:216170 | constant |
| `SH` | emitFeatureOk (sync fire-and-forget `d("tengu_feature_ok", {feature_name})`; called as `SH("coordinator_mode_start")` inside `Dk5`) | cli_inner_pretty.js:41590-41592 | function |
| `sq` | AGENT_TOOL_NAME (`"Agent"`; coordinator "Spawn a new worker" tool) | cli_inner_pretty.js:185637 | constant |
| `ZD7` | getWorkerSystemPrompt (coordinator-mode **worker** system prompt: "You are a worker agent executing a task assigned by the coordinator."; exported via `X$(TD7, {getWorkerSystemPrompt, getCoordinatorAgents:Ib5, WORKER_AGENT:GD7})` @236123; contrast point vs the scripted-workflow subagent prompts `iG_`/`aG_`) | cli_inner_pretty.js:236124 | function |

---

## See Also

- [`symbol_index_core_features.md`](symbol_index_core_features.md) — the **Dynamic Workflows** module home: the workflow tool object `n0_` (`workflowTool`), gate family `NZ`/`SL5`/`KP6`/`r$7`/`H48`/`hL5`/`$48`/`i$7`, name exports `mx`/`m57`/`ep6`, schemas `Q0_`/`g0_`, the `meta` parser (`FZ`/`pK4`/`UK4`/…), script persistence (`xFK`/`Hj$`/`O68`/`Y95`), caps/journal/keyword/ultracode, plus the `disallowed-tools` frontmatter chain (`BjH`/`GL5`/`TL5`/`cd6`/`IS`/`fc`/`tZ4`/`aq`/`c28`/`fV8`/`YV8`/`qkH`) and `R7`/`OD`
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — the lean/full **prompt-gate predicates** and model/provider helpers (`X3`, `c45`, `d45`, `gM6`, `O7`, `HD`, `Gi$`, `UA`, `oR`, `Zq`, `MODEL_CAPS` `j3`, `jLz`, `OVH`, `_4`, `k7`, `V$`, `wC$`, env parsers `xH`/`k4`, memoize `v8`/`cx8`, Fast-Mode `Wj`/`m76`/`ki`/`uB`) and the UNC / permission-rule utils (`tm`, `d6H`)
- The v2.1.143 → v2.1.156 per-module symbol-addition tables live in `00_overview/symbol_additions_v2_1_156_*.md`
- The prior window (v2.1.113 → v2.1.142) lives at `../../../claude_code_v_2.1.142/analyze/00_overview/symbol_index_core_execution.md`
