# Symbol Index — Integration Infrastructure (v2.1.156 → v2.1.183)

This index catalogs obfuscated → readable mappings for **integration infrastructure** symbols that changed between v2.1.156 and v2.1.183: LSP, Chrome/Browser, IDE, UI Components, Plugin System, Code Indexing, Shell Parser, and Slash Commands.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Compact, Auto Memory, Background Agents, Workflow, Agent Team / swarm
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry, Remote Control

## File:Line Format

For v2.1.183, the canonical source citation is `cli_inner_pretty.js:<line>` — `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). v2.1.156 / v2.1.88 citations are tagged as before-pictures.

## Per-feature symbol manifests

The exhaustive per-symbol tables live in the per-feature additions files (linked from [`symbol_index_core_features.md`](symbol_index_core_features.md)).

---

## Module: Agent Team — UI/relay integration

The agent-team subsystem has a small integration surface (the swarm-view pane layout, the `<agent-message>` relay envelope, the `<cross-session-message>` coordinator envelope). Those symbols (e.g. the relay-envelope wrapper `lDa` and its tag const `Nen`) are catalogued under the Agent Team module in [`symbol_index_core_features.md`](symbol_index_core_features.md) and in [`symbol_additions_v2_1_183_agent_team.md`](symbol_additions_v2_1_183_agent_team.md), since they are tightly coupled to the feature rather than to a standalone integration. No new standalone integration symbols (LSP / Chrome / IDE / Plugin) were introduced by the v2.1.178 agent-team redesign.

## Module: Auto Memory — UI renderers (status-line / clickable-file)

The `memory_saved` status-line renderers and the clickable-file row component. The renderer `Svp` (`renderMemorySaved`) itself is tabled under **Module: Auto Memory** in [`symbol_index_core_features.md`](symbol_index_core_features.md) (it is the headline DELTA 6 symbol); its sibling renderers/components live here. Canonical exhaustive home: [`symbol_additions_v2_1_183_auto_memory.md`](symbol_additions_v2_1_183_auto_memory.md) (DELTA 6).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ANa` | `teamMemSavedPart` (builds the "N team memories" summary segment; carryover; v2.1.156 `gk_.teamMemSavedPart`) | cli_inner_pretty.js:382753 | function |
| `Evp` | `renderClickableFile` (per-path key/wrapper rendering each `writtenPaths` entry as a clickable `Hvp`; v2.1.156 `tk_`) | cli_inner_pretty.js:383441 | function |
| `Hvp` | `clickableFile` (clickable file row; `Box` with `onClick → openFile`, hover underline, `basename`; v2.1.156 `ek_`) | cli_inner_pretty.js:383444 | function |
| `SNa` | `statusLineDispatch` (status-line renderer dispatch; for `memory_saved` computes verbose `p = o \|\| !!s` and passes to `Svp`; v2.1.156 `SNa`-analog @393207) | cli_inner_pretty.js:382861 | function |
| `YGn` | `createMemorySavedMessage` (`{type:"system", subtype:"memory_saved", writtenPaths, …}` factory; carries the full `writtenPaths`; carryover; v2.1.156 `CT8`-family) | cli_inner_pretty.js:589751 | function |

## Module: Workflow — Keyword-highlight UI (input-box shimmer)

The input-box keyword-highlight color tokens and rainbow cycler. The keyword-highlight memo `ji` and dismiss toggle `el` are tabled under **Module: Workflow** in [`symbol_index_core_features.md`](symbol_index_core_features.md). Canonical exhaustive home: [`symbol_additions_v2_1_183_workflow.md`](symbol_additions_v2_1_183_workflow.md) (Keyword trigger).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `FZu` | `themeColorTokens` (`autoAccept = "rgb(135,0,255)"` violet, `autoAcceptShimmer = "rgb(208,180,255)"`; the dedicated ultracode keyword shimmer) | cli_inner_pretty.js:154110 | object |
| `Xq` | `rainbowColor` (per-offset rainbow shimmer cycler; still used by ultraplan; byte-identical to v2.1.156 `fI`) | cli_inner_pretty.js:134367 | function |

## Module: Compact — `/config` window-source UI label

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `J5p` | `autoCompactWindowHelpString` (CHANGED DELTA 3: `/config` window-source label; now branches on `'clientdata'`; v2.1.156 `Pn_`) | cli_inner_pretty.js:478040 | function |

## Module: Slash Commands — `/loop` `/goal` `/batch` `/simplify` (Layer-2 reconstruction)

The four user-facing slash commands reconstructed in [`../43_slash_commands/`](../43_slash_commands/) (readable-source restoration; see [`43_slash_commands/registration_and_dispatch.md`](../43_slash_commands/registration_and_dispatch.md)). The **exhaustive** per-symbol table (136 rows across registrar/dispatch, the four commands, shared tool-name constants, and gates) lives in [`symbol_additions_v2_1_183_slash_commands.md`](symbol_additions_v2_1_183_slash_commands.md); the shared/load-bearing anchors are recorded here.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ap` | `registerBundledSkill` (shared bundled-skill registrar; emits `Command{type:'prompt',source:'bundled'}`; v2.1.88 `src/skills/bundledSkills.ts`; `menuDescription` field emitted @546993) | cli_inner_pretty.js:546973 | function |
| `FJn` | `initBundledSkills` (idempotent registry init; registers the three bundled skills + feature-gates) | cli_inner_pretty.js:660991 | function |
| `_1f` | `registerLoopSkill` (`/loop`; 3-way dispatch: legacy cron / dynamic self-pace / loop.md+autonomous default; `aliases:["proactive"]`) | cli_inner_pretty.js:649251 | function |
| `pzl` | `registerBatchSkill` (`/batch`; `disableModelInvocation:true`; coordinator `h$f`@637757 + worker `g$f`) | cli_inner_pretty.js:637828 | function |
| `OKl` | `registerSimplifySkill` (`/simplify`; 4 review-angle agents; prompt `ZOf`@648007) | cli_inner_pretty.js:647978 | function |
| `Cmf` | `goalLocalJsxCommand` (`/goal` interactive `local-jsx`; default-exported `xmf`@562070) | cli_inner_pretty.js:562050 | object |
| `Imf` | `goalCommand` (`/goal` non-interactive `local` twin; `thinClientDispatch:"post-text"`) | cli_inner_pretty.js:562058 | object |
| `Qdt` | `setGoal` (installs the session-scoped empty-matcher `prompt` Stop hook carrying the goal condition) | cli_inner_pretty.js:454466 | function |

> **Routing note.** Per [`/lyz/codespace/analysis_claude_code_v2/CLAUDE.md`](/lyz/codespace/analysis_claude_code_v2/CLAUDE.md), Slash Commands route to this integration index. `/goal`'s Stop-hook plumbing (`Qdt`/`Zdt`/`ego`/`UGn`) is cross-listed under Hooks in [`symbol_index_core_features.md`](symbol_index_core_features.md); the prompt-command dispatch runner (turn injection) is cross-listed under Tools in [`symbol_index_core_execution.md`](symbol_index_core_execution.md).

---

For the v2.1.143→v2.1.156 integration baseline, see the v2.1.156 tree's [`symbol_index_infra_integration.md`](../../../claude_code_v_2.1.156/analyze/00_overview/symbol_index_infra_integration.md).
