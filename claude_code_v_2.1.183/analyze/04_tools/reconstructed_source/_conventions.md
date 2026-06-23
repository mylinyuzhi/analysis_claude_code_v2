# Reconstruction Conventions — Tools Subsystem (v2.1.183, readable-source restoration)

> **Goal:** a *readable-source-level* restoration of the **entire tools subsystem** as it exists in
> Claude Code **v2.1.183** — the tool **framework** (`Tool`/`buildTool`/`ValidationResult`/
> `ToolUseContext`), the **registry/assembly** pipeline (`getAllBaseTools` → `getTools` →
> `assembleToolPool`), the **wire serialization** (`buildToolSchema` + `eager_input_streaming`), the
> **deferred-tool / ToolSearch** machine, and **every built-in tool at contract level** — written as
> clean TypeScript organized the way the genuine Anthropic source tree (v2.1.88 named-TS at
> `/lyz/codespace/3rd/claude-code/src`) organizes it. This is NOT a delta doc: reconstruct the *whole
> machine* at 2.1.183, including carryover from 2.1.156.

## Three evidence tiers (do not confuse them)

1. **PRIMARY — the v2.1.183 obfuscated bundle + extracted assets**
   - Bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
   - Isolated decls: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js`.
   - **Pre-extracted tool descriptions: `…/extract/assets/tools/<ToolName>.md` (49 files) + `_index.json` + `tools_index.json`** — these are the *verbatim* tool description strings. Use them as the source of truth for each tool's `description`/`prompt` text (do not paraphrase prompt text — quote it).
   - **Every** reconstructed function, constant, branch, Zod field, and string MUST be verified by *reading the exact line(s)* in the bundle. Obfuscated names re-mangle every build — never trust a name from another version; re-derive it here.

2. **SCAFFOLD — the v2.1.156 baseline analysis docs**
   `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/04_tools/` (+ `41_system_reminder/`,
   `44_lean_prompt/` for adjacent gates). They already contain detailed *readable logic* and established
   *readable names* for the unchanged spine (`getAllBaseTools` ra, `getTools` Jk, `assembleToolPool` zl,
   `buildToolSchema` w08, `isDeferredTool` pp, ToolSearch wV$, the AskUserQuestion reservation FUK, the
   lean predicate X3). Inherit consistent readable names and jump-start the logic — but **re-verify every
   claim against the v2.1.183 bundle** (lines + obf names differ). Strong hint, not gospel.

3. **CONVENTION ONLY — the v2.1.88 named-TS source**
   `/lyz/codespace/3rd/claude-code/src`. This is the *shape* to mirror (some tools are gated-out or have
   evolved, so it is convention, not a line-for-line copy):
   - **Framework:** `Tool.ts` (`buildTool`, `ToolDef`, `ValidationResult`, `ToolUseContext`, `ToolResult`,
     `findToolByName`/`toolMatchesName`, `getEmptyToolPermissionContext`), `tools.ts` (`getAllBaseTools`,
     `getToolsForDefaultPreset`, `filterToolsByDenyRules`, `getTools`, `assembleToolPool`, `getMergedTools`,
     `TOOL_PRESETS`/`parseToolPreset`), `constants/tools.ts`, `constants/toolLimits.ts`.
   - **Per-tool layout:** `tools/<Name>Tool/<Name>Tool.tsx` (main object: `name`, `inputSchema`,
     `description`/`prompt(...)`, `isEnabled`, `isReadOnly`, `validateInput`, `checkPermissions`,
     `call`/`async *call`, `renderToolUseMessage`, …), plus `prompt.ts`, `constants.ts`, and helper files.
   - **ToolSearch / deferral:** `tools/ToolSearchTool/{ToolSearchTool.ts,prompt.ts,constants.ts}`.
   Mirror these conventions; cite the 2.1.88 file when you borrow one. The v2.1.88 `tools/` inventory:
   AgentTool, AskUserQuestionTool, BashTool, BriefTool, ConfigTool, EnterPlanModeTool, EnterWorktreeTool,
   ExitPlanModeTool, ExitWorktreeTool, FileEditTool, FileReadTool, FileWriteTool, GlobTool, GrepTool,
   LSPTool, ListMcpResourcesTool, MCPTool, McpAuthTool, NotebookEditTool, PowerShellTool, REPLTool,
   ReadMcpResourceTool, RemoteTriggerTool, ScheduleCronTool, SendMessageTool, SkillTool, SleepTool,
   SyntheticOutputTool, TaskCreateTool, TaskGetTool, TaskListTool, TaskOutputTool, TaskStopTool,
   TaskUpdateTool, TeamCreateTool*, TeamDeleteTool*, TodoWriteTool, ToolSearchTool, WebFetchTool,
   WebSearchTool. (*TeamCreate/TeamDelete were REMOVED in 2.1.178 — do **not** reconstruct them as live
   tools; note their removal where relevant.)

## "Contract level" — what each per-tool file MUST contain

For **every** built-in tool exposed in the v2.1.183 `getAllBaseTools` array (~48; the live inventory is the
49 files in `assets/tools/` minus any non-tool entries), reconstruct its **capability contract**:

- **Identity** — the tool `name` constant (and its obfuscated decl), `userFacingName()` if different.
- **Input schema** — the Zod v4 object, every field with its type + `.describe(...)` text (verify field
  list + describe strings against the bundle; the `assets/tools/<Name>.md` gives the description prose).
- **Description / prompt** — the verbatim description string (quote from `assets/tools/<Name>.md`; if it is
  a `prompt(...)` function with model/context branches, reconstruct the function and quote each branch).
- **Gating** — `isEnabled()` (feature gates / env / model predicates) and `isReadOnly()`.
- **`validateInput`** — the `ValidationResult` checks (the conditions, error messages — quote them).
- **`checkPermissions`** — behavior/decision summary (allow/ask/deny logic; cite the permission helper).
- **`call`** — a faithful behavior summary of what it does + what `ToolResult`/yields it produces. Deep
  internal helpers (e.g. Bash sed-parser, Read truncation geometry) may be **summarized** rather than
  reconstructed line-by-line — but the summary must be source-anchored, and any load-bearing algorithm
  (Read PARTIAL-view truncation, Bash sandbox decision, Grep ripgrep arg build) gets a short reconstructed
  core. Note one-line `// helper: <obf> @line — <what it does>` for each summarized helper.

Group small sibling tools (e.g. the six `Task*` tools, the three `Cron*` tools, the MCP-resource tools)
into one file per family where 2.1.88 keeps them separate but they share a schema/runtime — but keep the
per-tool `name`/schema/description distinct and anchored.

## File format (each reconstructed `.ts`/`.tsx`)

- Clean, idiomatic, **readable** TypeScript — what the original source plausibly looked like. Prefer the
  readable names already used in the 2.1.156 baseline + 2.1.88 src.
- **Every** top-level function/const/tool-object carries an anchor comment tying it to 2.1.183 evidence:
  `// 2.1.183: getAllBaseTools = ra-analog @cli_inner_pretty.js:NNN`. Non-trivial branches and every
  quoted description/error string get an inline `// @<line>` anchor so a reviewer can re-verify any line.
- **File header block** (top of file) listing: the v2.1.183 source regions covered (line ranges / decl
  ids), the 2.1.88 convention mirror (path), the 2.1.156 baseline doc used as scaffold, and a one-line
  cross-validation note (what you re-verified in the 183 bundle).
- **No invented behavior.** If a detail can't be confirmed in the 183 bundle, omit it or mark
  `// UNVERIFIED: …` and report it in your manifest. Faithful-to-source beats plausible-but-guessed.
- Quote prompt/description/error **strings verbatim** from the bundle or `assets/` (these are user-visible
  contract; paraphrase is a defect). Keep obfuscated single-letter locals only where readability doesn't
  suffer; otherwise rename and add a trailing `// Mapping: obf→readable, …` for that function.
- English only.

## Anchor-comment style

```ts
/**
 * Built-in tool registry. Logic-equivalent to v2.1.156 `ra`/`Jk`/`zl`; re-derived for v2.1.183.
 * 2.1.183 regions: cli_inner_pretty.js:NNNNN-NNNNN (getAllBaseTools), :NNNNN (assembleToolPool)
 * 2.1.88 convention: src/tools.ts getAllBaseTools/getTools/assembleToolPool
 * 2.1.156 scaffold: 04_tools/workflow_tool_registration.md (registration pipeline)
 */
// 2.1.183: getAllBaseTools = <obf> @NNNNN
export function getAllBaseTools(): Tools { … }
```

## Do NOT create symbol-mapping tables in these files

Per the project [`CLAUDE.md`](../../../../CLAUDE.md): symbol mappings live ONLY in the central
`00_overview/symbol_index_*.md` + the per-feature `symbol_additions_v2_1_183_tools.md`. In `.ts` files use
inline anchor comments; in the module `README.md` use list-format refs (`` `name` (`OBF`) — desc ``),
never a table. Record any NEW symbol you discover in your manifest so it can be added to the index.
