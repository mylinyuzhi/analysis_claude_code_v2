# File Index — v2.1.183 Extracted Source (FOCUSED v2.1.156 → v2.1.183 delta)

This index inventories the files produced by `claude-code-bomb` for Claude Code **v2.1.183**, and maps the **FIVE
user-requested focus features** onto concrete `cli_inner_pretty.js` line regions. It is the entry point for "I want to
read the code for one of the five focus features" — work backward from the asset listing or grep for a stable string,
then jump to the line region below.

> **Scope honesty.** This is **not** a comprehensive module tree. It is a *delta analysis* scoped to five features the
> user asked about, across the **v2.1.156 → v2.1.183** window:
> 1. **Agent Team** — the v2.1.178 implicit-session-team redesign (TeamCreate/TeamDelete removed; teammates spawn via the Agent tool).
> 2. **Dynamic Workflows** — the `ultracode` keyword trigger + per-agent workflow runtime fixes.
> 3. **Background Agents** — the nested-subagent 5-level depth limit, worker env-isolation, lifecycle/surface fixes.
> 4. **Compaction** — `--fallback-model` honored in summarize, the 1M-credits clamp-back, the 6-source window resolver.
> 5. **Auto Memory** — the team/remote memory stores + recall routing, status-line and watcher refinements.
>
> Many other subsystems (plan mode, hooks, skills, permissions, model selection, MCP, UI) **also** changed in this
> window. They are **intentionally out of scope** for this tree and are not inventoried here.

The prior tree (`../../../claude_code_v_2.1.156/analyze/`) covered the **v2.1.143 → v2.1.156** window as a broad
11-module analysis. This tree narrows to five features over **v2.1.156 → v2.1.183** (the bullets in `../CHANGELOG.md`
span releases 2.1.157 through 2.1.183; the headline feature work lands in 2.1.169 / 2.1.172 / 2.1.174 / 2.1.178 /
2.1.181, called out per-region below).

The canonical extraction layout is at `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/`.

> **Citation rule:** every line number below was verified against
> `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`. Cite as `cli_inner_pretty.js:<line>`.
> Line numbers are stable within this build only — they shift across versions; the **string literals / tool names /
> telemetry events are the stable anchor**. Where a line is a v2.1.156 *before-picture*, it is tagged explicitly as
> `(2.1.156)`.

---

## Top-Level Tree

```
extract/                                          (/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/)
├─ cli_inner_pretty.js                      (~23.7 MB / 699,346 lines, one pretty-printed bundle)
├─ cli_inner_pretty.js.PLACEHOLDER.md       (git-ignored note: regenerate from binary or reassemble from cli_unpack_pretty/)
├─ cli_unpack_pretty/                       (per-decl break-up of cli_inner_pretty.js)
│   ├─ _manifest.json                       (~4.0 MB file list — 38,762 entries; per-decl name + kind + bytes)
│   ├─ _summary.json                        ([] empty in this build — use _manifest.json for counts)
│   └─ decls/
│       ├─ functions/<id>.js                (15,476 function decls)
│       ├─ vars/<id>.js                     (22,535 var decls)
│       ├─ classes/<id>.js                  (277 class decls)
│       ├─ ExpressionStatement/<id>.js      (468 top-level expression statements — registrations/IIFEs)
│       └─ IfStatement/<id>.js              (1 top-level if-statement — runtime guard)
└─ assets/
    ├─ _summary.json                        (asset counts — see table below)
    ├─ prompts/, prompts_index.json         (428 prompts, ~1.98 MB; index entries: {file,len,offset,headline})
    ├─ system_prompts/                      (12 per-prompt JSON files — top-level identity/steering/tool-section prompts)
    ├─ tools/                               (51 files = 49 tool .md + _index.json + 1 legacy noise entry; see below)
    ├─ tools_index.json                     (1 entry "explain_command" — legacy flat index, superseded by tools/_index.json)
    ├─ slash_commands.json                  (123 slash command names)
    ├─ env_vars.json                        ({all:677, claude_anthropic:326, bun:1, node:3} — object, not a flat array)
    ├─ cli_flags.json                       ({flags:882, subcommands:0} — object; subcommand bucket empty this build)
    ├─ feature_gates.json                   (1,402 `tengu_*` / experiment keys)
    ├─ endpoints.json                       ({total_urls:414, by_host:126 hosts} — object)
    └─ long_strings/                        (50 string-literal files over a size threshold)
```

### Asset summary (`assets/_summary.json`)

| Key | Value | vs 2.1.156 | Notes |
|-----|-------|------------|-------|
| `source_size` | 23,659,299 | up from ~21.5 MB | the pretty bundle grew ~10 % |
| `prompts_total` | 428 | up from 372 | the prompt corpus grew with new tool/skill bodies |
| `prompts_chars` | 1,976,209 | up from 1,191,127 | ~1.98 MB of prompt text (+66 %) |
| `tools_unique` | 1 | unchanged | legacy detector under-counts; real per-tool inventory is in `assets/tools/` (49 tools) |
| `slash_commands` | 123 | up from 115 | many entries are filesystem-path false positives (see Slash Commands note) |
| `env_vars` | 677 | down from 690 | net shrink; the focus features ADD env vars (see below) but others were pruned |
| `urls` / `hosts` | 414 / 126 | up from 390 / 118 | |
| `cli_flags` | 882 | up from 846 | |
| `cli_subcommands` | 0 | down from 18 | the `subcommands` bucket is **empty** in this build's extractor (categorization changed; not a feature removal) |
| `feature_gates` | 1,402 | up from 1,227 | the `tengu_*` experiment set grew ~14 % across the window |

> **Build metadata** (from `assets/` corroboration, see `../_asset_anchors.md`): version 2.1.183, build_sha
> `9d251abdbce0c0a6190d290add83634e0ab481f6`, build_time `2026-06-18T23:04:10Z`, bun 1.4.0.

### What changed in the extraction layout vs 2.1.156

1. **`cli_unpack_pretty/_summary.json` is empty (`[]`)** in this build — decl counts must be read from `_manifest.json`
   (38,762 entries: 15,476 `fn-decl`, 11,202 `var-decl` + 11,338 `var-decl-empty`, 277 `class-decl`, 468
   `ExpressionStatement`, 1 `IfStatement`). The decl trees themselves (`decls/{functions,vars,classes,
   ExpressionStatement,IfStatement}`) are present and populated as before.
2. **Tool surface changed (focus-feature signal).** `assets/tools/_index.json` carries **49 tools**. Relative to
   2.1.156: **`TeamCreate` and `TeamDelete` are REMOVED** (grep=0 in the bundle — this is the headline 2.1.178 Agent
   Team redesign), and **`WaitForMcpServers` is NEW**. The web/managed-surface tools (`Projects`, `Artifact`,
   `SendUserFile`, `SendUserMessage`, `ShareOnboardingGuide`, `ShowOnboardingRolePicker`) are also present. Two stray
   detector-noise entries remain (`eval_registered__${...}`, `explain_command`, plus an `mcp` pseudo-tool).
3. **`env_vars.json` / `cli_flags.json` / `endpoints.json` remain categorized JSON objects** (as in 2.1.156).
   `cli_flags.subcommands` is `0` this build (empty bucket), not a flag removal — the flags themselves number 882.

---

## How to Look Up a Symbol

The most useful entry point is the per-decl view in `cli_unpack_pretty/decls/`:

```
$ cat /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_unpack_pretty/decls/vars/<id>.js
$ cat /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_unpack_pretty/decls/functions/<id>.js
$ cat /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_unpack_pretty/decls/classes/<id>.js
```

This gives you the **isolated** body of that decl, free of unrelated context. The same obfuscated id is used as the
filename across the whole tree, so once you know the obfuscated name you have the file. For "what kind / how big is this
decl" lookups, `_manifest.json` carries kind + bytes for every output file.

For "where in the bundle was this decl emitted", grep `cli_inner_pretty.js` for the decl name with a leading
`var `/`function `/`class `/`let `/`const ` — the lexical position is stable within this single build.

```
$ grep -n 'function yqd()' /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
293828:function yqd() {
```

> ⚠️ **Obfuscated names are re-mangled every build.** A 2.1.156 obf id does **not** carry over. Example:
> `isAgentTeamsEnabled` was `R7`@240766 in 2.1.156 → `Sl`@293832 in 2.1.183; `hasAgentTeamsFlag` was `Ru5` → `yqd`@293828.
> Always re-derive the 2.1.183 obf id from a stable string anchor (tool name, telemetry event, env var, prompt literal).

---

## Where the FIVE Focus Features Live in `cli_inner_pretty.js`

These are the load-bearing line regions for this tree's five features. Every anchor below was grep-verified against the
2.1.183 bundle. For exhaustive per-symbol tables, see the matching `symbol_additions_v2_1_183_<feature>.md`; for the
verification spot-checks, see `cross_validation_report_<feature>.md`. The narrative module docs live under the numbered
dirs (`30_agent_team/`, `42_workflow/`, `36_background_agents/`, `07_compact/`, `31_auto_memory/`).

### 1. Agent Team (implicit session team, 2.1.178) → `../30_agent_team/`

The v2.1.178 redesign: the explicit `TeamCreate`/`TeamDelete` lifecycle tools are gone; a session now gets an **implicit
team** initialized at startup, and teammates are spawned through the ordinary **Agent tool**. The code is spread across
four regions: the gate + session-team init, the Agent-tool spawn route, the mailbox/permission-bridge carryover, and the
teammate-prompt-addendum block.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:293813-293848` | master gate: `hasAgentTeamsFlag` (`yqd`@293828, env `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`), `isAgentTeamsEnabled` (`Sl`@293832, AND `tengu_amber_flint`); the bundler now exports this as `isAgentSwarmsEnabled` |
| `cli_inner_pretty.js:362512-362643` | teammate-comms prompt + holding-pen primitives: `LY = "main"`@362512 (default lane), the `# Agent Teammate Communication` prompt body, `Gke = "cat"`@362642 (the holding `cat` keep-pane-alive command) |
| `cli_inner_pretty.js:682752-693478` | implicit-team core: `xic`@682752 (team-name builder, `session-<id[:8]>`), `j3f`@682765 `initializeSessionTeam`, and the init gate `if (Sl() && !xr() && !a.agentId)` @693472 (enable only when teams on, not already a teammate, and not a sub-agent) |
| `cli_inner_pretty.js:420705-434611` | mailbox + Agent-tool spawn carryover: `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` (`Rdo`@420704, "you MUST use the SendMessage tool", exported @420703), permission-bridge `eDp`@420713, tmux respawn `a3n`@421874 (send-keys → respawn-pane fix), Agent-tool spawn route `cqa`@423053 → `HDp`@423041 with the `if (_ && s && !L)` team-route branch (`_ = Sl() ? teamContext`) |
| `cli_inner_pretty.js:365950` area | file-mailbox writer `$A`@365950 (carried over from 2.1.156's mailbox core) |
| `cli_inner_pretty.js:445827` | background-task survival `<note>` builder `G4e`@445827 (keepalive note so a teammate's bg task is not killed when its turn ends — the 2.1.183 changelog "background tasks started by a teammate" fix) |

**Removed surface:** `TeamCreate`/`TeamDelete` tools (grep=0), `team_name` parameter now documented "Deprecated; ignored".

### 2. Dynamic Workflows — `ultracode` keyword trigger (2.1.169–2.1.178) → `../42_workflow/`

The workflow **structure is unchanged** from 2.1.156; the delta is the `ultracode` keyword trigger surface, AST
determinism, per-agent context, the immediate `/workflows` view, and an error-code refinement. **Framing trap:** the
"`/effort ultracode` xhigh-only" rule already existed in 2.1.156, and the 2.1.178 "explicit phrase" change is
description-only (no new regex) — see `../42_workflow/ultracode_keyword_trigger_delta.md`.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:148777-148967` | keyword-trigger gate: `workflowKeywordTriggerEnabled` (`Jyn`@148797), consumed at the `Pw() && Jyn() ? yho(Tf) : []` useMemo site |
| `cli_inner_pretty.js:154110` | violet-shimmer color `autoAccept: "rgb(135,0,255)"` (the ultracode auto-accept shimmer) |
| `cli_inner_pretty.js:416439-419520` | AST determinism `rWa`@416439 (2.1.172) + per-agent `agentContext` `Dt`@417152 (2.1.174) + `errorCode7` `r5a`@419415 (workflow error-code table with `taskType`/`workflowName`) |
| `cli_inner_pretty.js:464214-464880` | keyword detection `hho`@464214 / `yho`@464261 (`workflow(s)` → `ultracode` routing) |
| `cli_inner_pretty.js:562632` | immediate `/workflows` view `jmf`@562632 (2.1.169 — opens the runs view without a round-trip) |
| `cli_inner_pretty.js:622226-622362` | workflow render integration (the `Jyn()`-gated `yho(Tf)` keyword chips rendered into the composer) |

### 3. Background Agents — nested-subagent depth limit (2.1.172/2.1.181) → `../36_background_agents/`

The headline is a **5-level nested-subagent depth limit** (`CLAUDE_CODE_FORK_SUBAGENT`), threaded through the tool-gate
and persisted into the background snapshot, plus a worker env-isolation hardening pass and surface refinements.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:103149-103172` | depth helper `Gz`@103152 (subagent depth accessor) |
| `cli_inner_pretty.js:221800` | depth limit constant `v1i = 5`@221800 (the 5-level cap) |
| `cli_inner_pretty.js:371188-371234` | tool-gate `cio`@371188 (`{tools, isBuiltIn, isAsync, isTeammate, permissionMode, ...}`), with the depth gate `if (Rc(i,vs)) return s < v1i` **hoisted above the async branch** so foreground + background share the limit via `bte`@371230 (`bte(e,t,n=!1,r=!1,o=!1,s=0)` — `s` is the depth counter) |
| `cli_inner_pretty.js:423505-446111` | depth threaded through the agent-spawn/dispatch region; persisted into the bg snapshot at `Xut`@446073 (2.1.172/2.1.181) |
| `cli_inner_pretty.js:566833-567283` | `/bg` command surface re-mangle `JMl = {}`@566833 (the `{sKn/iKn/lgf}` handler triplet) |
| `cli_inner_pretty.js:594705-595858` | worker env-isolation `_Fl`@594705 — 4-pass provider-auth scrub (2.1.181), the hardened successor to 2.1.156's single-pass `Eq9`/`Y7q` |
| `cli_inner_pretty.js:691275-695325` | `agents --json` surface `aGf`@691275 (2.1.169 — adds `id`/`state`/`waitingFor` + `--all`) |

> **Carryover correction.** The background module docs **corrected the scout dossier**: the `cliVersion`-equality and
> `cron`/`routine` retire/respawn guards were **carryover, not new** in this window (independently re-verified). See
> `../36_background_agents/bg_command_surface_and_retire_delta.md` and `cross_validation_report_background_agents.md`.

### 4. Compaction — fallback-model + 1M clamp + 6-source window resolver (2.1.172/2.1.178) → `../07_compact/`

Three independent deltas plus a massive line-shift from the 2.1.156 layout (the ladder moved ~423864 → ~226818, the
dispatcher ~423130 → ~460676). The **context-hint beta is unchanged**.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:134105-134192` | 1M-credits clamp-back `tH`@134105 — `if (ARr) return jQ = 200000` (clamps the 1M-context window back to 200K when on credits; telemetry `tengu_1m_credits_clamp_activated`) (2.1.172) |
| `cli_inner_pretty.js:226742-227081` | window resolver `z2`@226875 — grew **4 → 6 sources** (adds clientdata + model-default), with the arm table `bqr`@226920 (`tengu_amber_moleskin`) and the remote-reactive resolver `S7`@226751 |
| `cli_inner_pretty.js:229183-229606` | 429-handling + clamp wiring (`if (e instanceof es && e.status === 429)`@229183, `Fwn`@229606) |
| `cli_inner_pretty.js:460676-461690` | dispatcher + fallback-in-summarize: dispatcher `del`@460676, the summarize while-loop `ICn`@461078 / honor-`--fallback-model` at @461088 (telemetry `tengu_model_fallback_triggered query_source=compact`) (2.1.178), prefix-overflow `Yjp`@461484 |

### 5. Auto Memory — team/remote memory stores + recall (2.1.172/2.1.181) → `../31_auto_memory/`

The **runtime engine is unchanged**; the delta is the `CLAUDE_MEMORY_STORES` schema growth (`scope`/`promptIndex`/
`promptIndexMaxBytes`), the promptIndex network fetch+inject, scope-routed recall, the mounted-store team-recall enable,
and status-line/watcher refinements.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:147636-151948` | memory-stores core: schema `bQu`@150491 / `Zse`@150442 (+`scope`/`promptIndex`/`promptIndexMaxBytes`), promptIndex fetch+inject `agi`@150754 / `kQu`@150769, mounted-store team-recall enable `Nk`@151098 (the 2.1.172 `CLAUDE_CODE_REMOTE_MEMORY_DIR` remote fix; replaces 2.1.156's `nM$` herring-clock gate), scope/mode recall router `e0t`@151847 |
| `cli_inner_pretty.js:383399` | status-line file-list `Svp`@383399 (verbose-only memory-store file listing, 2.1.181) |
| `cli_inner_pretty.js:424663-424664` | memory-load wiring into the agent loop |
| `cli_inner_pretty.js:449197-449262` | watcher scope-split `uFp`@449203 (splits the store watcher by scope) |
| `cli_inner_pretty.js:455299-455522` | recall injection into the prompt-builder layer |
| `cli_inner_pretty.js:589751-590643` | remote/cowork-memory plumbing (`YGn`@589751; the `CLAUDE_CODE_REMOTE_MEMORY_DIR` / `CLAUDE_COWORK_MEMORY_*` surface) |

---

## Focus-Feature Anchors in the Asset Extracts

When a line region shifts, re-anchor from these stable asset strings (all from `assets/`, corroborated in
`../_asset_anchors.md`):

- **Tools** (`assets/tools/_index.json`): `TeamCreate`/`TeamDelete` ABSENT (Agent Team redesign), `WaitForMcpServers`
  PRESENT (new), `Agent`/`SendMessage`/`Workflow` present.
- **Feature gates** (`assets/feature_gates.json`, 1,402 keys): agent-team `tengu_amber_flint`,
  `tengu_coordinator_mode_switched`; workflow `tengu_workflow_keyword`, `tengu_workflows_enabled`; background
  `tengu_background_fork`, `tengu_bash_command_explicitly_backgrounded`; compact `tengu_amber_rokovoko`,
  `tengu_amber_moleskin`; auto-memory `tengu_onyx_plover`, `tengu_memory_store_resync_interval_minutes`,
  `tengu_auto_dream_*`.
- **Env vars** (`assets/env_vars.json`, 677 keys): agent-team `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`; workflow
  `CLAUDE_CODE_WORKFLOWS`; background `CLAUDE_CODE_FORK_SUBAGENT` (NEW), `CLAUDE_BG_*`; compact
  `FALLBACK_FOR_ALL_PRIMARY_MODELS` (NEW), `CLAUDE_CODE_AUTO_COMPACT_WINDOW`; auto-memory `CLAUDE_MEMORY_STORES`,
  `CLAUDE_CODE_REMOTE_MEMORY_DIR` (NEW), `CLAUDE_COWORK_MEMORY_*` (NEW).
- **CLI flags** (`assets/cli_flags.json`, 882 keys): `--agent-teams`, `--agent`/`--agents`, `--workflow`, `--bg`,
  `--fork-session`, `--fallback-model`, `--worktree`.

---

## Slash Commands (123 entries)

From `assets/slash_commands.json`. As in prior builds, many array entries (`/bin`, `/etc`, `/opt`, `/proc`, `/tmp`,
`/usr`, `/var`, `/sbin`, …) are filesystem paths the extractor's `/`-leading heuristic falsely classified as slash
commands. **Trust the handler / definition site, not the raw list**, when confirming a command exists. The focus-feature
surfaces here are `/workflows` (the immediate runs view, 2.1.169) and `/bg` (background command surface).

## Tools (`assets/tools/`, 49 tools)

The per-tool inventory (`tools/_index.json` + one `.md` per tool, each carrying `{name, userFacingName, searchHint,
descriptionLen, promptLen, schemaLen, isReadOnly, isConcurrencySafe, offset}`) is the authoritative tool surface for this
build. Focus-feature signal: **`TeamCreate.md` / `TeamDelete.md` are absent** and **`WaitForMcpServers.md` is new**;
`Agent.md`, `SendMessage.md`, `Workflow.md` are the agent-team/workflow tool surfaces. The `offset` field is a byte
offset into `cli_inner_pretty.js` for locating the tool's definition site.

## Prompts (`assets/prompts/`, 428 prompts)

`assets/prompts_index.json` is a list of `{file, len, offset, headline}` records — the `offset` is a byte offset into
`cli_inner_pretty.js`, useful for locating the emit site of a large prompt body (e.g. the teammate-communication prompt,
the workflow authoring prompt, the memory-store guidelines).

---

## Map: `analyze/` Module Dir → What It Documents

The tree carries **five focus-feature module dirs**, plus `00_overview/` (this index + symbol routing/additions +
cross-validation) and `by_version/` (one breadth-analysis file per published release — `2.1.157.md` … `2.1.183.md`,
22 files — indexed by `by_version/README.md` and verified by `by_version/cross_validation_report.md`).

| Dir | Scope (FOCUS feature, v2.1.156 → v2.1.183 delta) | Key docs |
|-----|--------------------------------------------------|----------|
| `00_overview/` | This index + four `symbol_index_*.md` routing tables + five `symbol_additions_v2_1_183_*.md` exhaustive tables + five `cross_validation_report_*.md` verification reports | see "00_overview contents" below |
| `30_agent_team/` | **Agent Team (2.1.178 implicit-team redesign)**: TeamCreate/TeamDelete removal, implicit `session-<id>` team init + gate, teammate spawn via the Agent tool, mailbox/addendum/permission-bridge carryover, tmux send-keys→respawn fix, coordinator + background-task survival keepalive | `README.md`, `implicit_team_and_agent_tool_spawn.md`, `spawn_backends_and_tmux_fix.md`, `mailbox_lifecycle_and_sendmessage_delta.md`, `coordinator_and_background_survival.md` |
| `42_workflow/` | **Dynamic Workflows (ultracode)**: `workflow(s)`→`ultracode` keyword trigger + `workflowKeywordTriggerEnabled` gate + violet shimmer, AST determinism + per-agent context + `/workflows` immediate view, error-code/tool-definition fixes (structure unchanged) | `README.md`, `ultracode_keyword_trigger_delta.md`, `tool_definition_fixes_delta.md`, `runtime_fixes_delta.md` |
| `36_background_agents/` | **Background Agents**: nested-subagent 5-level depth limit + hoisted gate + snapshot persistence, worker env-isolation 4-pass scrub (2.1.181), `agents --json` surface (2.1.169), `/bg` command surface + retire/respawn carryover correction | `README.md`, `nested_subagent_depth_limit.md`, `worker_env_isolation_2181.md`, `agents_json_surface_2169.md`, `bg_command_surface_and_retire_delta.md` |
| `07_compact/` | **Compaction**: `--fallback-model` honored in the summarize while-loop (2.1.178), 1M-credits clamp-back (2.1.172), 6-source window resolver (4→6), dispatcher delta + massive line-shift mapping | `README.md`, `fallback_model_in_compaction.md`, `one_million_credits_clamp.md`, `window_resolver_six_sources.md`, `dispatcher_delta.md` |
| `31_auto_memory/` | **Auto Memory**: team/remote memory stores schema growth + promptIndex fetch/inject + scope-routed recall + mounted-store team-recall enable (2.1.172 remote fix), status-line + watcher scope-split refinements (runtime engine unchanged) | `README.md`, `team_memory_stores_recall.md`, `status_line_and_misc_delta.md` |
| `by_version/` | One **breadth-analysis** file per published release (22 files, `2.1.157.md` … `2.1.183.md`) — a source-cross-validated pass over everything that release shipped across all subsystems; focus-feature bullets link to the depth modules, non-focus bullets get primary analysis. Indexed by `README.md`, verified by `cross_validation_report.md`. The per-bullet map lives in `00_overview/changelog_to_code_map.md`. | `README.md`, `2.1.157.md` … `2.1.183.md`, `cross_validation_report.md` |

### `00_overview/` contents

- `file_index.md` — this file.
- `symbol_index_core_execution.md` — Core execution routing (Agent Loop, Tools, LLM API, Agents, Subagent, State; the agent-team spawn + background depth symbols route here).
- `symbol_index_core_features.md` — Core feature routing (Workflows, Background, Compact, Auto-Memory symbols route here).
- `symbol_index_infra_platform.md` — Platform routing (MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry).
- `symbol_index_infra_integration.md` — Integration routing (LSP, Chrome, IDE, UI, Plugin, Shell Parser).
- `symbol_additions_v2_1_183_{agent_team,auto_memory,background_agents,compact,workflow}.md` — per-feature exhaustive
  new-symbol tables for this window, each noting which `symbol_index_*.md` it routes into.
- `cross_validation_report_{agent_team,auto_memory,background_agents,compact,workflow}.md` — per-feature adversarial
  verification reports (citation spot-checks, forbidden-table scans, broken-link sweeps, v2.1.156 before-picture
  corroboration). Outcome: agent_team 53P/1F, workflow 47P/2F, background 37P/7F, compact 90P/4F, auto_memory 45P/3F —
  all 17 fails were line-precision/transcription drift (the underlying claims were correct), all fixed.

---

## Lookup Workflow

**Goal: Find which decl implements one of the five focus features**

1. Pick a unique string for the feature (tool name, telemetry event, env var, prompt fragment) — see "Focus-Feature
   Anchors in the Asset Extracts" above.
2. `grep -n "<string>" /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
3. From the surrounding ~30 lines, identify the enclosing decl name (the obfuscated identifier just before `=` for vars,
   or after `function` for fn-decls).
4. Open `cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js` for the isolated decl.
5. If the decl references other obfuscated ids, recurse on those.

**Goal: Validate a v2.1.156 → v2.1.183 delta claim**

1. Find the corresponding v2.1.156 region (`../../../claude_code_v_2.1.156/analyze/00_overview/file_index.md`).
2. Grep the same stable string in v2.1.183 source.
3. Compare obfuscated names — they re-mangle every build (e.g. `R7`→`Sl`); the string literals are the stable anchor.
   Confirm the claim against the matching `symbol_additions_v2_1_183_<feature>.md` row.

---

## See Also

- `symbol_index_core_execution.md` / `symbol_index_core_features.md` / `symbol_index_infra_platform.md` /
  `symbol_index_infra_integration.md` — the four canonical symbol-routing tables.
- `symbol_additions_v2_1_183_<feature>.md` — exhaustive per-feature new-symbol tables.
- `cross_validation_report_<feature>.md` — per-feature verification reports.
- `../_scout_dossier_<feature>.md` — rich verified anchors + conventions per focus feature.
- `../_asset_anchors.md` — asset-extract corroboration (tools/gates/env/flags).
- `../CHANGELOG.md` — upstream changelog (bullet source of truth for the 2.1.157 → 2.1.183 window).
- `../../../claude_code_v_2.1.156/analyze/00_overview/file_index.md` — prior-window index (v2.1.143 → v2.1.156).
