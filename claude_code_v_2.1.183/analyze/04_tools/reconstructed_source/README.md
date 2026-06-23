# Tools Subsystem — Readable-Source Restoration (v2.1.183)

> **What this is.** A *readable-source-level* reconstruction of the **entire tools subsystem** as it
> exists in Claude Code **v2.1.183** — not a delta, the *whole machine*: the tool **framework**
> (`Tool`/`buildTool`/`ValidationResult`/`ToolUseContext`), the **registry/assembly** pipeline
> (`getAllBaseTools` → `getTools` → `assembleToolPool` → `getMergedTools`), the **wire serializer**
> (`buildToolSchema` + `eager_input_streaming`), the **deferred-tool / ToolSearch** machine, and **every
> built-in tool at contract level** (~48 tools) — written as clean TypeScript organized the way the
> genuine Anthropic source tree organizes it (the v2.1.88 named-TS at `/lyz/codespace/3rd/claude-code/src`).
>
> **Why it exists.** The module front-door [`../README.md`](../README.md) is the *narrative*; this
> directory is the *implementation*, restored top-to-bottom so you can read each tool's contract without
> cross-referencing the obfuscated bundle. Every reconstructed function carries a
> `// 2.1.183: <readable> = <obf> @<line>` anchor so any claim can be re-verified in seconds.

---

## The three evidence tiers (do not confuse them)

These files were built — and adversarially verified — under a strict evidence discipline. The full rules
live in [`_conventions.md`](./_conventions.md); the short version:

1. **PRIMARY — truth.** The v2.1.183 obfuscated bundle
   `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines), the
   isolated decls under `cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js`, and the **49
   pre-extracted tool-description assets** at `extract/assets/tools/<ToolName>.md` (the *verbatim*
   description strings — quoted, never paraphrased). Every symbol, constant, branch, Zod field, and
   string was verified by reading the exact line(s). Obfuscated names re-mangle every build, so all were
   re-derived here (the v2.1.156 serializer `w08` is `CWn`; `getAllBaseTools` `ra`→`LW`).
2. **SCAFFOLD — readable logic & names.** The v2.1.156 baseline analysis docs
   (`../../../claude_code_v_2.1.156/analyze/04_tools/`) supplied the readable logic and the established
   readable names for the unchanged spine (`getAllBaseTools`, `getTools`, `assembleToolPool`,
   `buildToolSchema` w08, `isDeferredTool` pp, ToolSearch). Each claim was re-verified against the 183
   bundle — a strong hint, not gospel.
3. **CONVENTION ONLY — file shape.** The v2.1.88 named-TS source. Some tools are gated-out or have
   evolved there, so it is the *shape* to mirror, not a line-for-line copy: the `Tool.ts`
   (`buildTool`/`ToolDef`/`ValidationResult`/`ToolUseContext`) and `tools.ts`
   (`getAllBaseTools`/`getTools`/`assembleToolPool`) factories, the `tools/<Name>Tool/<Name>Tool.tsx`
   one-tool-per-directory layout (`name`, `inputSchema`, `description`/`prompt(...)`, `isEnabled`,
   `isReadOnly`, `validateInput`, `checkPermissions`, `call`), Zod v4, and ESM `.js` import specifiers
   on `.ts`.

---

## File inventory

Each file restores one slice of the subsystem and carries a header block disclosing its v2.1.183 source
regions, its v2.1.88 convention mirror, the v2.1.156 scaffold doc, and a one-line cross-validation note.
LOC = reconstructed lines.

### Framework (`*.ts`)

| File | Restores | Key v2.1.183 anchors | LOC |
|------|----------|----------------------|----:|
| [`Tool.ts`](./Tool.ts) | The framework type spine + `buildTool` factory: `ValidationResult`/`ToolResult`/`ToolProgress`/`ToolUseContext`, `TOOL_DEFAULTS`, the two-tier WeakMap `findToolByName` cache, `getEmptyToolPermissionContext`. | `pi` :149995, `jJu` :150010, `kO` :149998, `Rc` :149965, `vl` :149984, `UJu` :149974 | 807 |
| [`tools.ts`](./tools.ts) | The registry + assembly pipeline: `getAllBaseTools` (exhaustive built-in array), presets, `filterToolsByDenyRules`, `getTools`, `assembleToolPool`, `getMergedTools`, `useMergedTools`, the run-once `initializeBundledTools` slot population. | `LW` :436517, `zR` :436622, `YY` :436581, `iqe` :539937, `Fce` :436578 | 526 |
| [`toolSchema.ts`](./toolSchema.ts) | The Messages-API wire serializer: `buildToolSchema`, `resolveToolDescription`, the schema cache, the four-way `eager_input_streaming` gate + ENV kill, the `strict` gate, the agent-team prop-strip table, the per-model `MODEL_CAPS`. | `CWn` :581300, `z_f` :581287, `Ed` :95158, `W_f` :581683, `Sl` :293831 | 655 |
| [`deferredTools.ts`](./deferredTools.ts) | The deferral machine: `isDeferredTool` 11-rule ladder, `getNonDeferrableBuiltins`, the keyword scorer (`parseToolName`/`compileTermPatterns`/`searchToolsWithKeywords`), the 5-state delta diff + 4-section `<system-reminder>`, the usage nudge, the `defer_loading` wire stamp. | `G2` :222307, `c1i` :221201, `dUi` :230294, `Qgo` :462347, `eX` :462320 | 1102 |

### Built-in tools (`tools/*.ts`) — ~48 contracts in 28 files

| File | Tool(s) | LOC |
|------|---------|----:|
| [`tools/AgentTool.ts`](./tools/AgentTool.ts) | **Agent** (legacy wire alias "Task") — subagent/fork/teammate/background/remote dispatcher | 891 |
| [`tools/BashTool.ts`](./tools/BashTool.ts) | **Bash** — shell exec; sandbox decision, sed-edit interception, destructive/read-only tagging | 793 |
| [`tools/PowerShellTool.ts`](./tools/PowerShellTool.ts) | **PowerShell** — Windows shell sibling (lazily required) | 605 |
| [`tools/ReadTool.ts`](./tools/ReadTool.ts) | **Read** — text/image/PDF/notebook; the PARTIAL-view truncation geometry | 621 |
| [`tools/WriteTool.ts`](./tools/WriteTool.ts) | **Write** — overwrite-or-create | 366 |
| [`tools/EditTool.ts`](./tools/EditTool.ts) | **Edit** — exact-string replace / `replace_all` | 381 |
| [`tools/NotebookEditTool.ts`](./tools/NotebookEditTool.ts) | **NotebookEdit** — Jupyter cell replace/insert/delete | 378 |
| [`tools/GlobTool.ts`](./tools/GlobTool.ts) | **Glob** — fast path-glob match | 249 |
| [`tools/GrepTool.ts`](./tools/GrepTool.ts) | **Grep** — ripgrep-backed content search (arg-build core) | 538 |
| [`tools/REPLTool.ts`](./tools/REPLTool.ts) | **REPL** — code-execution sandbox wrapping file/exec primitives | 408 |
| [`tools/LSPTool.ts`](./tools/LSPTool.ts) | **LSP** — language-server queries (env-gated, `isLsp`/`shouldDefer`) | 461 |
| [`tools/TaskTools.ts`](./tools/TaskTools.ts) | **TaskCreate / TaskGet / TaskUpdate / TaskList / TaskStop / TaskOutput** — background-task family | 1234 |
| [`tools/CronTools.ts`](./tools/CronTools.ts) | **CronCreate / CronDelete / CronList** — scheduled-routine family | 537 |
| [`tools/McpResourceTools.ts`](./tools/McpResourceTools.ts) | **ListMcpResources / ReadMcpResource / WaitForMcpServers** — MCP resource family | 1114 |
| [`tools/PlanModeTools.ts`](./tools/PlanModeTools.ts) | **EnterPlanMode / ExitPlanMode** — plan-mode transition pair | 851 |
| [`tools/WorktreeTools.ts`](./tools/WorktreeTools.ts) | **EnterWorktree / ExitWorktree** — git-worktree isolation pair | 846 |
| [`tools/AskUserQuestionTool.ts`](./tools/AskUserQuestionTool.ts) | **AskUserQuestion** — structured multiple-choice prompt | 552 |
| [`tools/SkillTool.ts`](./tools/SkillTool.ts) | **Skill** — invoke a registered skill | 439 |
| [`tools/TodoWriteTool.ts`](./tools/TodoWriteTool.ts) | **TodoWrite** — task-list state writer | 382 |
| [`tools/StructuredOutputTool.ts`](./tools/StructuredOutputTool.ts) | **StructuredOutput** (`Em`) — structured-output sink | 285 |
| [`tools/ToolSearchTool.ts`](./tools/ToolSearchTool.ts) | **ToolSearch** — the loader that fetches deferred-tool schemas on demand | 1074 |
| [`tools/WebFetchTool.ts`](./tools/WebFetchTool.ts) | **WebFetch** — fetch + summarize a URL | 530 |
| [`tools/WebSearchTool.ts`](./tools/WebSearchTool.ts) | **WebSearch** — web search | 590 |
| [`tools/SendMessageTool.ts`](./tools/SendMessageTool.ts) | **SendMessage / ListAgents** — cross-agent messaging | 426 |
| [`tools/ScheduleWakeupTool.ts`](./tools/ScheduleWakeupTool.ts) | **ScheduleWakeup** — self-rescheduling (kairos loop) | 250 |
| [`tools/RemoteTriggerTool.ts`](./tools/RemoteTriggerTool.ts) | **RemoteTrigger** — cloud/remote-trigger entrypoint | 307 |
| [`tools/PushNotificationTool.ts`](./tools/PushNotificationTool.ts) | **PushNotification** — surface results to the user | 270 |
| [`tools/OnboardingMiscTools.ts`](./tools/OnboardingMiscTools.ts) | **DesignSync · Projects · Artifact · SendUserFile · SendUserMessage · ShareOnboardingGuide · ShowOnboardingRolePicker** (DesignSync + Projects NEW in 2.1.183) | 849 |
| [`tools/TestingPermissionTool.ts`](./tools/TestingPermissionTool.ts) | **TestingPermission** — permission-test fixture (not user-facing) | 103 |

> **Family grouping.** Where v2.1.88 keeps small sibling tools in separate directories but they share a
> schema/runtime, they are grouped into one file here (the six Task* tools, three Cron* tools, the
> MCP-resource trio, the plan/worktree pairs, the onboarding group) — but each tool keeps its distinct
> `name`/schema/description, separately anchored.

### File boundaries vs the bundle

The v2.1.183 bundle is a single concatenated file, so several reconstructed modules are co-located there
(e.g. the registry slot decls, presets, and `getTools` all live in the @436507–436714 neighborhood). The
split into `Tool.ts` / `tools.ts` / `toolSchema.ts` / `deferredTools.ts` + `tools/<Name>.ts` follows the
v2.1.88 module conventions; each file's header discloses where its content physically sits in the bundle.
The behavior is faithful to those exact lines — only the grouping is a convention choice.

---

## Anchor-comment convention

Every top-level function / const / tool-object carries an inline anchor tying it to 2.1.183 evidence; the
header block names the file's source regions; non-trivial branches and every quoted description/error
string carry an inline `// @<line>`. The dual-name mapping for a renamed function ends with a
`// Mapping: obf→readable, …` comment.

```ts
/**
 * <ReadableName> — <one-line purpose>.
 * 2.1.183 regions covered (cli_inner_pretty.js): <ranges / decl ids>
 * 2.1.88 convention mirror: src/<path>
 * 2.1.156 scaffold: 04_tools/<doc>.md
 * Cross-validation note: <what was re-read in the 183 bundle>.
 */
// 2.1.183: isDeferredTool = G2 @cli_inner_pretty.js:222307-222321
export function isDeferredTool(tool: Tool): boolean { … }
// Mapping: G2→isDeferredTool, c1i→getNonDeferrableBuiltins, DA→TOOL_SEARCH_TOOL_NAME, …
```

**No symbol-mapping tables in these files** (per [`_conventions.md`](./_conventions.md) and the project
`CLAUDE.md`): each `.ts` file is itself the line-anchored symbol map for its slice; the central
`00_overview/symbol_index_*.md` + the per-feature `symbol_additions_v2_1_183_tools.md` hold the tables.
Anything marked `// UNVERIFIED:` is an honest gap (e.g. the `ToolResult`/`ToolProgress` field names that
survive only as object-literal yield shapes; whether `mythos5` caps are reachable through a second caps
path).

---

## Provenance

The reconstruction was driven by a set of **scout anchor dossiers** — one per tool/framework group — that
isolate every decl, branch, gate, and string a reconstructor needs, each with a `cli_inner_pretty.js` line
anchor in the v2.1.183 bundle. They are the verifiable spec behind every file here:

- [`_anchors_framework_registry.md`](./_anchors_framework_registry.md) — framework + registry/assembly
  (`Tool.ts` + `tools.ts`): `buildTool`, `getAllBaseTools`, `getTools`, `assembleToolPool`, the gate
  predicates.
- [`_anchors_schema_serialization.md`](./_anchors_schema_serialization.md) — the `buildToolSchema` wire
  path: the cache key, the four-way `eager_input_streaming` gate, the `MODEL_CAPS` table, the agent-team
  prop-strip.
- [`_anchors_deferral_toolsearch.md`](./_anchors_deferral_toolsearch.md) — the deferral machine:
  `isDeferredTool`, `getNonDeferrableBuiltins`, the keyword scorer, the delta diff + system-reminder.
- [`_anchors_tools_file_exec.md`](./_anchors_tools_file_exec.md) — Read/Write/Edit/NotebookEdit/Glob/Grep/
  Bash/PowerShell/REPL/LSP.
- [`_anchors_tools_agent_task.md`](./_anchors_tools_agent_task.md) — the Agent/Task/Skill group.
- [`_anchors_tools_mode_web_mcp.md`](./_anchors_tools_mode_web_mcp.md) — plan-mode / web / MCP-resource
  tools.
- [`_anchors_tools_cron_misc.md`](./_anchors_tools_cron_misc.md) — Cron / RemoteTrigger / StructuredOutput
  / onboarding / misc.
- [`_conventions.md`](./_conventions.md) — the three-tier evidence discipline, the "contract level"
  per-tool requirements, the file-format and anchor-comment rules.

---

## Cross-validation status

Each reconstructed file was produced from its anchor dossier and then independently re-read against the
cited v2.1.183 lines. The consolidated adversarial cross-validation for this module — default-to-FAIL
validators re-reading the framework decls, the serializer gate, the deferral ladder, and a sample of
per-tool contracts directly in the live 2.1.183 bundle — is recorded in
[`../../00_overview/cross_validation_report_tools.md`](../../00_overview/cross_validation_report_tools.md)
(any line-precision drift caught there was fixed in place; no wrong symbol, fabricated line, or incorrect
contract claim). The full re-derived symbol table for this module is
[`../../00_overview/symbol_additions_v2_1_183_tools.md`](../../00_overview/symbol_additions_v2_1_183_tools.md).

---

## Related Symbols

> Symbol mappings live in the central index and the per-feature additions file (never as obf→readable
> tables in these docs). Each reconstructed `.ts` file is itself the authoritative, line-anchored symbol
> map for its slice (via its `// 2.1.183: <readable> = <obf> @<line>` comments).
>
> - [symbol_additions_v2_1_183_tools.md](../../00_overview/symbol_additions_v2_1_183_tools.md) — the
>   consolidated v2.1.183 Tools symbol table (framework + registry + serializer + deferral + every
>   per-tool symbol).
> - [symbol_index_core_execution.md](../../00_overview/symbol_index_core_execution.md) — Tools is the home
>   module (Agent Loop, LLM API, Tools, Agents, Subagent, State).
> - [symbol_index_core_features.md](../../00_overview/symbol_index_core_features.md) — the Workflow/Skill/
>   Todo tool slots, plan mode.
> - [symbol_index_infra_platform.md](../../00_overview/symbol_index_infra_platform.md) — permission
>   deny-rule lookup, model caps, prompt building, the `eager_input_streaming` gate.
> - [symbol_index_infra_integration.md](../../00_overview/symbol_index_infra_integration.md) —
>   MCP-resource tools, the LSP tool, the ToolSearch surface.

Anchor entry points (re-derived v2.1.183 names; each file is the full map):

- `buildTool` (`pi`, cli_inner_pretty.js:149995) — getter-preserving tool factory → `Tool.ts`.
- `getAllBaseTools` (`LW`, cli_inner_pretty.js:436517) / `getTools` (`zR`, cli_inner_pretty.js:436622) — registry pipeline → `tools.ts`.
- `buildToolSchema` (`CWn`, cli_inner_pretty.js:581300) — wire serializer → `toolSchema.ts`.
- `isDeferredTool` (`G2`, cli_inner_pretty.js:222307) — deferral ladder → `deferredTools.ts`.
- `AgentTool` (`f3n`, cli_inner_pretty.js:423505) — subagent dispatcher → `tools/AgentTool.ts`.
- `BashTool` (`Cl`, cli_inner_pretty.js:450669) / `FileReadTool` (`hg`, cli_inner_pretty.js:463520) — exec/read contracts → `tools/BashTool.ts` / `tools/ReadTool.ts`.
