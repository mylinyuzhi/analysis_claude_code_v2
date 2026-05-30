# Symbol Additions — v2.1.156 Tools Subsystem (2.1.143–156 delta)

These mappings consolidate every obfuscated identifier introduced or touched by the **04_tools**
delta for the v2.1.143 → v2.1.156 window: Workflow tool registration into `getAllBaseTools`, the
runtime workflow-enablement gate chain, the AskUserQuestion 2.1.154 model-gated reservation, the
lean/simple-system-prompt eligibility predicate that gates it, the `disallowed-tools` skill/command
frontmatter feature (schema, parser, inline + fork application paths, clear-on-next-message), the
Read PARTIAL-view truncation producer (2.1.145), and the always-on streaming tool-execution
(`eager_input_streaming`) per-model caps (2.1.156).

Each row gives the v2.1.156 obfuscated identifier, the readable name, `file:line`, and type. Every
line was verified by reading
`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` at that location.

Cross-validated against:
- v2.1.156 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/` (`tools.ts`,
  `tools/AskUserQuestionTool/{prompt.ts,AskUserQuestionTool.tsx}`, `skills/loadSkillsDir.ts`,
  `utils/plugins/loadPluginCommands.ts`, `utils/api.ts`,
  `tools/FileReadTool/FileReadTool.ts`, `tools/FileWriteTool/FileWriteTool.ts`,
  `utils/fileStateCache.ts`)
- Module docs: `claude_code_v_2.1.156/analyze/04_tools/{workflow_tool_registration,`
  `ask_user_question_reservation,disallowed_tools_frontmatter,read_partial_view_and_streaming_exec}.md`

> **Line-number notes (single source of truth — corrections vs. the seed):**
> - `X$` (`defineLazyExports`) is **defined** at `cli_inner_pretty.js:55` (`var X$ = (H,$) => {…}`).
>   The seed cited 378080, which is the *call site* `X$(ep6, { WorkflowTool: () => n0_ })`, not the
>   definition. The row below cites the definition (55).
> - `m57` is the namespace object at 216289; its lazy `WORKFLOW_TOOL_NAME` getter is wired at 216290
>   (`X$(m57, { WORKFLOW_TOOL_NAME: () => mx })`); the `mx = "Workflow"` constant is at 216291.
> - `ep6` is the namespace object at 378079; its lazy `WorkflowTool` getter is wired at 378080.
> - `$48` (`cachedWorkflowAvailability`) is the bare `var $48;` declaration at 184789, populated lazily
>   by `KP6` (the seed range pointed at the same line).
> - `gM6` (`isEarlyAccessBuild`, `/-eap($|\[)/i`) is at 143836 (the seed value was truncated
>   mid-token as `isEarlyAcces…`).
> - `j3` (`MODEL_CAPS`) is assigned inside a `T()` thunk at 91835 (`(j3 = { … })`); the
>   `eagerInputStreaming`-carrying records sit in the same table (`Ji$` 91815, `Xi$` 91825).
> - `ez` (`AskUserQuestion`) appears once in the bundle (143388). The seed listed it under both
>   `core_execution` and `core_features`; its home is **`core_features`** (User-interaction tool name),
>   listed once below.

---

## Module: Tools Subsystem — 2.1.143–156 delta

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$48` | `cachedWorkflowAvailability` (module memo for `SL5()` result; populated by `KP6`) | cli_inner_pretty.js:184789 | variable |
| `$j$` | `PARTIAL_VIEW_PREFIX` (`"[Truncated: PARTIAL view — "` system-reminder prefix for truncated Reads) | cli_inner_pretty.js:145392 | constant |
| `_4` | `getSubscriptionTier` (subscription type; `SL5` keys `defaultOn = tier !== "pro"` off it) | cli_inner_pretty.js:131589 | function |
| `_H$` | `workflowToolSlot` (lazy module slot holding `n0_`; spread into `ra()` via `...(_H$ ? [_H$] : [])`) | cli_inner_pretty.js:409408 | variable |
| `aq` | `dedupePreserveOrder` (`[...new Set(H)]` order-preserving dedup used by every rule appender) | cli_inner_pretty.js:40716 | function |
| `BFK` | `getFileUnchangedStub` (returns `mFK` for the `file_unchanged` tool_result) | cli_inner_pretty.js:145350 | function |
| `BjH` | `frontmatterToolListSchema` (Zod `string \| string[]` union reused by every tool-list frontmatter field) | cli_inner_pretty.js:184468 | function |
| `BUK` | `ASK_USER_QUESTION_TOOL_CHIP_WIDTH` (`12` — UI chip width) | cli_inner_pretty.js:143389 | constant |
| `c28` | `appendOrReplaceCommandDenyRules` (stateful setter for `alwaysDenyRules.command`; `"union"` appends, default `"replace"` overwrites) | cli_inner_pretty.js:395738 | function |
| `c45` | `isFullSystemPromptModel` (NOT-lean classifier: Claude 3 / Haiku / Sonnet / Opus ≤4.7; `claude-opus-4-8` excluded) | cli_inner_pretty.js:143847 | function |
| `cd6` | `parseSkillMetadata` (local-dir skill metadata builder; reads `disallowed-tools ?? disallowedTools`) | cli_inner_pretty.js:421555 | function |
| `d45` | `isVelvetCascadeOptIn` (clientData / `tengu_velvet_cascade` gate opt-in into the lean-prompt set) | cli_inner_pretty.js:143839 | function |
| `D0$` | `buildForkedCommandContext` (fork-path builder; emits `{kind:"disallowed_tools"}` context layer) | cli_inner_pretty.js:452910 | function |
| `ep6` | `workflowToolModule` (namespace object whose lazy `WorkflowTool` getter returns `n0_`) | cli_inner_pretty.js:378079 | object |
| `ez` | `ASK_USER_QUESTION_TOOL_NAME` (the string `"AskUserQuestion"`) | cli_inner_pretty.js:143388 | constant |
| `FJ4` | `ensureUnderTokenCap` (throws `TokenCapExceeded` when projected tokens exceed `maxTokens`) | cli_inner_pretty.js:422314 | function |
| `fc` | `parseToolList` (normalizes a frontmatter value to `string[]`; collapses `*` to `["*"]`, null → `[]`) | cli_inner_pretty.js:443196 | function |
| `fI8` | `processUserInput` (user-turn entry; replaces `alwaysDenyRules.command` with this turn's deny list — clear-on-next-message) | cli_inner_pretty.js:590814 | function |
| `FUK` | `ASK_USER_QUESTION_RESERVATION_PROMPT` (the v2.1.154 "Reserve this for decisions…" paragraph injected for lean models) | cli_inner_pretty.js:143394 | constant |
| `fV8` | `appendCommandDenyRules` (pure appender to `toolPermissionContext.alwaysDenyRules.command`, deduped) | cli_inner_pretty.js:452899 | function |
| `GL5` | `commandFrontmatterSchema` (base slash-command/skill frontmatter schema; declares `disallowed-tools` + `disallowedTools` alias) | cli_inner_pretty.js:184480 | object |
| `gJ4` | `readFileBody` (per-type Read body dispatcher; contains the PARTIAL-view token-cap truncation block) | cli_inner_pretty.js:422327 | function |
| `gM6` | `isEarlyAccessBuild` (`/-eap($\|\[)/i` — `-eap` builds are always lean) | cli_inner_pretty.js:143836 | function |
| `H48` | `isWorkflowsDisabledByManagedSettings` (`CLAUDE_CODE_DISABLE_WORKFLOWS` / `disableWorkflows` kill switch) | cli_inner_pretty.js:184750 | function |
| `hL5` | `getUserEnableWorkflowsSetting` (`/config` `enableWorkflows` override; wins over tier default in `NZ`) | cli_inner_pretty.js:184773 | function |
| `HK` | `READ_TOOL_NAME` (the string `"Read"`; interpolated into the next-page paging hint) | cli_inner_pretty.js:145385 | constant |
| `HqH` | `filterToolsByDenyRules` (strips blanket-denied / `effectiveMaxPermission === "blocked"` tools) | cli_inner_pretty.js:409371 | function |
| `hV$` | `applyPermissionLayers` (appends layers to a context, tracking a model override) | cli_inner_pretty.js:453193 | function |
| `iUK` | `registerBaseToolsProvider` (installs `ra` as the cached base-tools provider `nUK`) | cli_inner_pretty.js:143455 | function |
| `IS` | `splitToolSpecList` (paren-aware splitter: `"Bash(git status), Edit"` → `["Bash(git status)","Edit"]`) | cli_inner_pretty.js:442850 | function |
| `j3` | `MODEL_CAPS` (model-id → caps record table; entries carry `eagerInputStreaming`) | cli_inner_pretty.js:91835 | object |
| `Ji$` | `opus47Caps` (Opus 4.7 caps record; `eagerInputStreaming: { bedrock:true, vertex:true }`) | cli_inner_pretty.js:91815 | object |
| `Jk` | `getTools` (production built-in pool after deny-rule + REPL + `isEnabled` mask filtering) | cli_inner_pretty.js:409414 | function |
| `jLz` | `getModelCaps` (maps a normalized model id to its `MODEL_CAPS` record, including `eagerInputStreaming`) | cli_inner_pretty.js:555942 | function |
| `k0` | `initializeBundledTools` (`T()`-wrapped one-time initializer that populates `_H$` + cron/monitor slots, then calls `iUK(ra)`) | cli_inner_pretty.js:409445 | function |
| `k4` | `parseBoolFalse` (env tri-state: explicit-false `0/false/no/off`) | cli_inner_pretty.js:1801 | function |
| `k7` | `hasCapability` (generic org-policy/data-residency capability resolver; backs `r$7("allow_workflows")`) | cli_inner_pretty.js:184697 | function |
| `KP6` | `getWorkflowAvailability` (memoizes `SL5()` into `$48`) | cli_inner_pretty.js:184776 | function |
| `mFK` | `FILE_UNCHANGED_SHORT` (current "Wasted call — file unchanged…" re-read stub phrasing) | cli_inner_pretty.js:145391 | constant |
| `m57` | `workflowToolNameExports` (namespace whose lazy getter returns `mx`/`WORKFLOW_TOOL_NAME`) | cli_inner_pretty.js:216289 | object |
| `mx` | `WORKFLOW_TOOL_NAME` (the string `"Workflow"`) | cli_inner_pretty.js:216291 | constant |
| `n0_` | `WorkflowTool` (the tool object built by `yK`; `name: mx`, `isEnabled: () => NZ()`, lazy schema getters) | cli_inner_pretty.js:378217 | object |
| `NZ` | `isWorkflowsEnabled` (four-layer runtime gate behind `n0_.isEnabled`: `H48 → r$7 → KP6/SL5 → hL5 ?? defaultOn`) | cli_inner_pretty.js:184757 | function |
| `O7` | `normalizeModelId` (model-id canonicalizer used by `c45`/`d45`/`jLz`) | cli_inner_pretty.js:98770 | function |
| `O95` | `FILE_UNCHANGED_LONG` (legacy verbose "File unchanged since last read…" re-read stub phrasing) | cli_inner_pretty.js:145389 | constant |
| `OD` | `isTodoV2Enabled` (TodoV2 feature predicate referenced in the tool array) | cli_inner_pretty.js:237073 | function |
| `OVH` | `modelSupportsStructuredOutputs` (gates the `strict` tool-schema field) | cli_inner_pretty.js:130417 | function |
| `P45` | `TOOL_DEFAULTS` (default tool fields spread by `yK`; supplies `isEnabled: () => !0`) | cli_inner_pretty.js:143499 | object |
| `pQ6` | `codeExecutionTool` (REPL / code-execution tool; Workflow slot is spread immediately after it in `ra`) | cli_inner_pretty.js:401977 | object |
| `pUK` | `ASK_USER_QUESTION_DESCRIPTION` (one-line tool description) | cli_inner_pretty.js:143390 | constant |
| `qkH` | `validateFrontmatterShadow` (emits `tengu_frontmatter_shadow_*` telemetry on schema mismatch/unknown key) | cli_inner_pretty.js:184453 | function |
| `qyK` | `getToolSchemaCache` (session-stable tool-schema cache keyed by `"L:"`/`"F:"` + name) | cli_inner_pretty.js:130649 | function |
| `r$7` | `isWorkflowsAllowedByPolicy` (org-policy gate via `k7("allow_workflows")`) | cli_inner_pretty.js:184770 | function |
| `R7` | `isAgentTeamsEnabled` (agent-teams predicate; gates TeamCreate/TeamDelete in `ra` and schema prop-stripping in `w08`) | cli_inner_pretty.js:240766 | function |
| `ra` | `getAllBaseTools` (exhaustive hand-ordered built-in tool array; source of truth for everything the model could see) | cli_inner_pretty.js:409313 | function |
| `Rz` | `isFirstPartyAnthropicBaseUrl` (true only when `ANTHROPIC_BASE_URL` is unset or `api.anthropic.com`) | cli_inner_pretty.js:91897 | function |
| `SL5` | `computeWorkflowAvailability` (`{available, defaultOn}` from `CLAUDE_CODE_WORKFLOWS` env + `tengu_workflows_enabled` gate + tier) | cli_inner_pretty.js:184780 | function |
| `T6` | `computeEffectivePermissionContext` (folds `permissionLayers` — allowed/disallowed/avoid/effort/model — onto base `toolPermissionContext`) | cli_inner_pretty.js:453162 | function |
| `TL5` | `agentFrontmatterSchema` (agent schema; has only camelCase `disallowedTools`, the pre-2.1.88 form) | cli_inner_pretty.js:184556 | object |
| `tT4` | `wrapAppStateWithToolLayers` (wraps `getAppState` so its `toolPermissionContext` has the command's allow+deny lists applied) | cli_inner_pretty.js:452903 | function |
| `tZ4` | `normalizeToolListOrNull` (inner normalizer `fc`/`hDH` share; returns `null` for nullish input) | cli_inner_pretty.js:443179 | function |
| `UA` | `isFirstPartyish` (provider is firstParty / anthropicAws / gateway; default for unknown model ids in `c45`) | cli_inner_pretty.js:91891 | function |
| `UUK` | `PREVIEW_FEATURE_PROMPT` (markdown/html preview-guidance map appended to the AskUserQuestion prompt) | cli_inner_pretty.js:143398 | object |
| `v8` | `memoize` (lodash `memoize`; wraps the `X3` lean-prompt predicate) | cli_inner_pretty.js:1488 | function |
| `V$` | `getFeatureGate` (GrowthBook/feature-gate reader with default; reads `tengu_cinder_plover`, `tengu_fgts`, `tengu_workflows_enabled`, …) | cli_inner_pretty.js:141101 | function |
| `w08` | `buildToolSchema` (serializes one tool into the API schema; computes `eager_input_streaming` + cache key) | cli_inner_pretty.js:555969 | function |
| `w68` | `isReReadStub` (detects an "unchanged since last read" stub by either `O95` or `mFK` prefix) | cli_inner_pretty.js:145353 | function |
| `wC$` | `getQuestionPreviewFormat` (returns `"markdown" \| "html" \| undefined`) | cli_inner_pretty.js:2829 | function |
| `X$` | `defineLazyExports` (installs getter-backed exports; `X$(ep6,{WorkflowTool:()=>n0_})` at 378080, `X$(m57,…)` at 216290) | cli_inner_pretty.js:55 | function |
| `X3` | `isLeanSystemPrompt` (memoized lean/simple-system-prompt eligibility: `!c45(model) \|\| d45(model)`, env-overridable) | cli_inner_pretty.js:143872 | function |
| `Xg6` | `getToolsForDefaultPreset` (enabled-only name list for `--tools default`; mask-then-filter over `ra()`) | cli_inner_pretty.js:409308 | function |
| `xH` | `parseBoolTrue` (env tri-state: explicit-true `1/true/yes/on`) | cli_inner_pretty.js:1795 | function |
| `Xi$` | `opus48Caps` (Opus 4.8 caps record; `eagerInputStreaming: { bedrock:true, vertex:true }`) | cli_inner_pretty.js:91825 | object |
| `xM6` | `ASK_USER_QUESTION_BASE_PROMPT` (tightened "use this tool only when blocked" base; ships to every model) | cli_inner_pretty.js:143419 | constant |
| `yA4` | `processCommandToMessages` (inline command/skill expander; calls `c28(…,"union")` with the disallowed list) | cli_inner_pretty.js:396582 | function |
| `yK` | `createTool` (tool factory: spread `P45` defaults under the def, preserving getters via `getOwnPropertyDescriptors`) | cli_inner_pretty.js:143482 | function |
| `YtH` | `askUserQuestionTool` (the tool object whose `prompt({model})` injects the reservation) | cli_inner_pretty.js:348809 | object |
| `YV8` | `appendCommandAllowRules` (allow-side mirror of `fV8` on `alwaysAllowRules.command`) | cli_inner_pretty.js:452892 | function |
| `Z6` | `requireLazyModule` (lazy CommonJS-module accessor used to fill the conditional tool slots in `k0`) | cli_inner_pretty.js:39 | function |
| `Zq` | `getAPIProvider` (resolves `firstParty \| bedrock \| vertex \| foundry \| anthropicAws \| mantle`) | cli_inner_pretty.js:91853 | function |
| `zl` | `assembleToolPool` (merges deny-filtered built-ins + skill/MCP tools, sorted as a contiguous built-in prefix, deduped by name) | cli_inner_pretty.js:409374 | function |

---

## Notes on home-index placement

When these rows are merged into the central index, split them as follows (single-source-of-truth):

- **`symbol_index_core_execution.md`** (Tools / LLM API / Agent Loop) —
  `ra` (`getAllBaseTools`), `Xg6` (`getToolsForDefaultPreset`), `Jk` (`getTools`),
  `zl` (`assembleToolPool`), `HqH` (`filterToolsByDenyRules`), `k0` (`initializeBundledTools`),
  `iUK` (`registerBaseToolsProvider`), `yK` (`createTool`), `P45` (`TOOL_DEFAULTS`),
  `Z6` (`requireLazyModule`), `X$` (`defineLazyExports`), `pQ6` (`codeExecutionTool`),
  `w08` (`buildToolSchema`), `qyK` (`getToolSchemaCache`),
  `ez` (`ASK_USER_QUESTION_TOOL_NAME`), `pUK`, `BUK`, `FUK`, `xM6`, `UUK` (AskUserQuestion
  constants — the tool itself is core-execution per the existing index), `YtH`
  (`askUserQuestionTool`), `gJ4` (`readFileBody`), `FJ4` (`ensureUnderTokenCap`),
  `$j$` (`PARTIAL_VIEW_PREFIX`), `HK` (`READ_TOOL_NAME`), `w68` (`isReReadStub`),
  `O95` (`FILE_UNCHANGED_LONG`), `mFK` (`FILE_UNCHANGED_SHORT`), `BFK` (`getFileUnchangedStub`),
  `T6` (`computeEffectivePermissionContext`), `hV$` (`applyPermissionLayers`),
  `yA4` (`processCommandToMessages`), `fI8` (`processUserInput`), `D0$`
  (`buildForkedCommandContext`), `tT4` (`wrapAppStateWithToolLayers`).
- **`symbol_index_core_features.md`** (Workflows / Skills / Slash Commands) —
  `n0_` (`WorkflowTool`), `_H$` (`workflowToolSlot`), `ep6`, `m57`, `mx` (`WORKFLOW_TOOL_NAME`),
  `NZ`, `KP6`, `SL5`, `r$7`, `H48`, `hL5`, `$48` (the workflow gate family; many already in
  `symbol_additions_v2_1_156_workflow.md` — do not double-add), `R7` (`isAgentTeamsEnabled`),
  `OD` (`isTodoV2Enabled`), and the `disallowed-tools` frontmatter schema/parse/apply chain:
  `BjH`, `GL5`, `TL5`, `cd6`, `IS`, `fc`, `tZ4`, `aq`, `c28`, `fV8`, `YV8`, `qkH`.
- **`symbol_index_infra_platform.md`** (Model / Prompt / Permissions / Telemetry) —
  `X3` (`isLeanSystemPrompt`), `c45` (`isFullSystemPromptModel`), `d45` (`isVelvetCascadeOptIn`),
  `gM6` (`isEarlyAccessBuild`), `O7` (`normalizeModelId`), `UA` (`isFirstPartyish`),
  `Zq` (`getAPIProvider`), `Rz` (`isFirstPartyAnthropicBaseUrl`), `j3` (`MODEL_CAPS`),
  `Ji$` (`opus47Caps`), `Xi$` (`opus48Caps`), `jLz` (`getModelCaps`),
  `OVH` (`modelSupportsStructuredOutputs`), `_4` (`getSubscriptionTier`), `k7` (`hasCapability`),
  `V$` (`getFeatureGate`), `wC$` (`getQuestionPreviewFormat`), `v8` (`memoize`),
  `xH` (`parseBoolTrue`), `k4` (`parseBoolFalse`).

> **Overlap with `symbol_additions_v2_1_156_workflow.md`:** the workflow gate family
> (`NZ`, `KP6`, `SL5`, `r$7`, `H48`, `hL5`, `$48`, `mx`, `m57`, `n0_`, `yK`, `P45`) is also
> listed there from the *runtime/definition* angle. They appear here from the *registration/tools*
> angle. When merging into the central index, add each obfuscated id **once**; this file documents
> the registration-side line numbers (identical) and the tools-subsystem role.
