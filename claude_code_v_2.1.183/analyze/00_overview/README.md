# Overview — v2.1.156 → v2.1.183 (five-feature delta + capability reconstructions)

This directory is the **navigation surface** for the v2.1.156 → v2.1.183 analysis tree. It is **not** the place where features get explained in depth (those live under `../XX_<module>/`); it is the routing layer — the changelog narrative, the per-bullet code-traceability index, the per-feature symbol-addition tables, the four canonical symbol indexes, and the eight adversarial cross-validation reports (five feature + three reconstructed-module) plus their roll-up. A second layer (added later) carries the **readable-source reconstructions** of the tools / system-prompt / system-reminder subsystems (see "Layer 2" below).

## What this tree IS (read this first)

This tree is a **FOCUSED delta analysis** of the **v2.1.156 → v2.1.183** window, scoped to **five features the user requested** — not a comprehensive every-module re-analysis. The five:

| # | Feature | Module dir | Headline delta |
|---|---------|-----------|----------------|
| 1 | **Agent Team** | [`../30_agent_team/`](../30_agent_team/) | the v2.1.178 implicit-team redesign — `TeamCreate`/`TeamDelete` removed, an implicit session-scoped team created at startup, the Agent tool becomes the teammate spawner, tmux `send-keys`→`respawn-pane` fix |
| 2 | **Dynamic Workflows** | [`../42_workflow/`](../42_workflow/) | the `workflow(s)`→`ultracode` keyword trigger (v2.1.160) + AST-determinism / per-agent context / `/workflows` runtime fixes (v2.1.169/172/174). Structure unchanged |
| 3 | **Background Agents** | [`../36_background_agents/`](../36_background_agents/) | the nested-subagent 5-level depth limit (v2.1.172/.181), worker provider-env isolation (v2.1.181), `agents --json` rework (v2.1.169), `/bg` surface + retire/respawn refinements |
| 4 | **Compaction** | [`../07_compact/`](../07_compact/) | `--fallback-model` honored in summarize (v2.1.178), the 1M-credits clamp-back (v2.1.172), the four-→six-source context-window resolver |
| 5 | **Auto Memory** | [`../31_auto_memory/`](../31_auto_memory/) | team memory stores (`CLAUDE_MEMORY_STORES`) recall + scope routing (v2.1.172), the status-line file-list render (v2.1.181) |

**Everything else is intentionally out of scope.** Many other subsystems changed in this same window — Fable 5 / the new flagship model, plan mode, permissions (`Tool(param:value)` rules, auto-mode git/IaC safety), MCP, model-allowlist enforcement, and a very large body of UI/Windows/terminal fixes — and they are **not** inventoried here. Each in-scope changelog bullet gets a `cli_inner_pretty.js:<line>` anchor; the out-of-scope bullets are named honestly (per-version "Out of scope" lines in [`changelog_to_code_map.md`](changelog_to_code_map.md), §8 of [`changelog_analysis.md`](changelog_analysis.md)) so nothing is silently dropped. (The three subsystems in Layer 2 below — tools, system prompt, system reminder — are covered separately, as *full reconstructions* rather than deltas.)

## Layer 2 — Reconstructed-source capability modules (tools · system prompt · system reminder · slash commands · agent team)

Beyond the five-feature delta, the tree carries a **readable-source restoration** of five core subsystems **at v2.1.183** — the *whole machine* rebuilt as clean TypeScript organized like the genuine v2.1.88 `src/` tree (same approach as [`../42_workflow/reconstructed_source/`](../42_workflow/reconstructed_source/)). These are **full reconstructions, not deltas**: carryover included, with 2.1.156→2.1.183 changes flagged inline.

| Module dir | Subsystem | `reconstructed_source/` contents |
|---|---|---|
| [`../04_tools/`](../04_tools/) | **Tools** | `Tool.ts` framework · `tools.ts` registry · `toolSchema.ts` serialization · `deferredTools.ts` + `tools/ToolSearchTool.ts` · **~48 tools at contract level** (33 TS files) |
| [`../40_system_prompt/`](../40_system_prompt/) | **System Prompt** | `utils/systemPrompt.ts` assembler + lean/full gate · `constants/prompts.ts` (identity, 3 builders, env) · `constants/systemPromptSections.ts` (cacheable sections) · `constants/system.ts` + `prompts/subagents.ts` (6 TS files) |
| [`../41_system_reminder/`](../41_system_reminder/) | **System Reminder** | `utils/messages.ts` primitives · `utils/attachments.ts` generator pool + `PWn` dispatcher · `attachmentCatalogue.ts` (25-string catalogue) (3 TS files) |
| [`../43_slash_commands/`](../43_slash_commands/) | **Slash Commands** (`/loop` · `/goal` · `/batch` · `/simplify`) | `skills/bundledSkills.ts` registrar (`ap`) + `skills/bundled/{index,loop,batch,simplify}.ts` bundled skills · `commands/goal/{index,goal.tsx,goalNonInteractive}.ts` dual Command (13 TS files) — 3 of 4 are *port-forwards* of a direct v2.1.88 named-TS ancestor |
| [`../30_agent_team/`](../30_agent_team/) | **Agent Team** ("swarm") | `utils/swarm/{teammateInit,inProcessRunner,leaderPermissionBridge,permissionSync,spawnTeammate,teammatePromptAddendum,teamHelpers,constants}.ts` · `utils/swarm/backends/{registry,detection,TmuxBackend,ITermBackend,teammateModeSnapshot,types}.ts` · `utils/{mailbox,teammateMailbox,teammateControlMessages,agentId,agentContext,teammate,peerAddress,agentSwarmsEnabled}.ts` (note the v2.1.88-faithful split: `utils/teammate.ts` = identity accessors, `utils/swarm/teamHelpers.ts` = team-file I/O) · `tools/AgentTool/{AgentTool.tsx,prompt,constants}` + `tools/SendMessageTool/*` · `coordinator/coordinatorMode.ts` · `tasks/agentNotification.ts` (31 TS files) — **the v2.1.88 swarm is a *real* ancestor** (ported forward; v2.1.178 redesign deltas from the 183 bundle) |

Built by an **anchor-harvest → reconstruct → adversarial-verify → coherence + cross-validation** pipeline: **42 `.ts` files (~23,700 LOC)**, every symbol anchored to a verified `cli_inner_pretty.js:<line>`, **682 obfuscated→readable mappings**, **27/27 units PASS** under per-file adversarial verification + **129 anchors independently re-sampled (0 failing)**. The **Slash Commands** module (`43_slash_commands/`) was added by the same pipeline in a later pass: **13 `.ts`/`.tsx` files (~1,822 LOC)**, **5/5 units PASS** (the four commands + the shared registrar/dispatch), an exhaustive **136-row** symbol table, and **44 anchors re-sampled (0 failing)** in its own cross-validation report. The **Agent Team** module (`30_agent_team/`) was added in the latest pass: **31 `.ts`/`.tsx` files (~11,400 LOC)** organized like the v2.1.88 `swarm`/`AgentTool`/`SendMessageTool`/`coordinator` tree, **15/15 reconstruct units PASS**, an import-graph/SSOT coherence pass, and **two independent adversarial cross-validation passes (677 anchors re-read total; PASS after fixes)** — its symbol table is appended to [`symbol_additions_v2_1_183_agent_team.md`](symbol_additions_v2_1_183_agent_team.md) (routed to `symbol_index_core_features.md` "Module: Agent Team") and its cross-val report lives in-module at [`../30_agent_team/reconstructed_source/_cross_validation_report.md`](../30_agent_team/reconstructed_source/_cross_validation_report.md). Symbol tables and cross-validation reports are listed under "Layer 2" in the sections below.

The prior tree [`../../../claude_code_v_2.1.156/analyze/`](../../../claude_code_v_2.1.156/analyze/) was a broad eleven-module analysis of the v2.1.143 → v2.1.156 window; this one narrows to five features over v2.1.156 → v2.1.183. The source bundle under analysis is `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (`"2.1.183"`, `cli_inner_pretty.js:848`; **699,346 lines**; build SHA `9d251abd…`, build_time 2026-06-18, bun 1.4.0). Every factual claim is cited as `cli_inner_pretty.js:<line>`, verified by reading that line; citations tagged `(v2.1.156)` or `(v2.1.88)` are deliberate before-pictures read in the prior bundle.

## What's Here

### Narrative and traceability

| File | Purpose |
|------|---------|
| `README.md` | This file — overview navigation |
| [`changelog_analysis.md`](changelog_analysis.md) | Long-form architectural narrative — the 22-release cadence over 2.1.157…2.1.183, read through the lens of the five features; cross-cutting design patterns; the §8 honest out-of-scope inventory; settings/env/telemetry adds |
| [`changelog_to_code_map.md`](changelog_to_code_map.md) | Per-bullet code-traceability index — each in-scope changelog bullet (newest-first) → feature + `cli_inner_pretty.js:<line>` decl + module-doc link, with a per-version "Out of scope" line enumerating the un-analyzed bullets |
| [`file_index.md`](file_index.md) | Extracted-source inventory — maps the five focus features onto concrete `cli_inner_pretty.js:<line>` regions, plus the `assets/cli_unpack_pretty/` decl files; the entry point for "I want to read the code for one of the five features" |

### Symbol indexes — four-file routing layer

The canonical obfuscated → readable symbol mappings are split into four files by category, per [`/lyz/codespace/analysis_claude_code_v2/CLAUDE.md`](/lyz/codespace/analysis_claude_code_v2/CLAUDE.md). In this delta tree these four files are deliberately thin: they are a **routing layer** that records the shared execution/platform/integration anchors and points at the per-feature additions files, where the exhaustive line-by-line before/after tables actually live. Module docs use list-form `## Related Symbols` references, never tables; the mapping **tables** live only in these four files and the five `symbol_additions_v2_1_183_*.md` files.

| File | Scope (in this delta tree) |
|------|----------------------------|
| [`symbol_index_core_execution.md`](symbol_index_core_execution.md) | Agent Loop, Tools, LLM API, Agents, Subagent, State — chiefly the Agent-tool-as-teammate-spawner surface (`f3n` tool def, `CDp`/`IDp` schema, spawn-dispatch, task-notification, keepalive) that the v2.1.178 redesign reuses |
| [`symbol_index_core_features.md`](symbol_index_core_features.md) | The five in-scope features themselves — Agent Team / swarm, Dynamic Workflows / `ultracode`, Background Agents, Compact, Auto Memory. Carries the per-feature manifest links and the feature-local symbol anchors |
| [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) | MCP, Permissions, Sandbox, Auth, Model resolution, Prompt building, Telemetry, Remote Control — here, the agent-team backend-registry/permission-bridge (carried over from v2.1.156, only the tmux mechanic changed) and the compaction model/window platform helpers |
| [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) | LSP, Chrome, IDE, UI Components, Plugin, Code Indexing, Shell Parser, Slash Commands — the v2.1.178 *delta* layer introduced no new standalone integration symbols (the swarm UI/relay surface is catalogued with its feature in core-features), but the Layer-2 **Slash Commands** reconstruction (`43_slash_commands/`) populates a dedicated *Module: Slash Commands* section here (registrar/dispatch + the four commands), routed from [`symbol_additions_v2_1_183_slash_commands.md`](symbol_additions_v2_1_183_slash_commands.md) |

When adding a new symbol, choose the file from its category in the routing matrix below.

#### Four-file routing matrix

Use this to decide which `symbol_index_*.md` a new mapping belongs in:

```
Core Execution  (symbol_index_core_execution.md):
  Agent Loop · LLM API · System Prompts · State
  Tools (factory/registration/dispatch/Read/streaming) · Agents · Subagent
  → in this tree: the Agent tool as teammate spawner + task-notification/keepalive

Core Features   (symbol_index_core_features.md):
  Agent Team / swarm · Dynamic Workflows / ultracode · Background Agents
  Compact · Auto Memory
  (also: Todo · Hooks · Skills · Thinking/Effort · Plan · Steering · CLI — baseline only)

Platform Infra  (symbol_index_infra_platform.md):
  MCP Protocol · Permissions · Sandbox · Auth · Remote Control
  Model resolution (provider map/normalize/resolve/pricing/1M-context) · Prompt-platform · Telemetry
  → in this tree: agent-team backend registry + permission bridge; compaction model/window helpers

Integration Infra (symbol_index_infra_integration.md):
  LSP · Chrome/Browser · IDE · UI Components · Plugin System
  Code Indexing · Shell Parser · Slash Commands
  → in this tree: nothing new from the agent-team redesign; swarm UI/relay lives with its feature
```

Routing edge cases this window forced (recorded in each additions file's home-routing note):
- The Agent **tool object** (`f3n`), **schema** (`CDp`/`IDp`), and **task-notification/keepalive** are core-execution; the **implicit-team gate / spawn routing / coordinator clause** are core-features.
- The **backend registry** (`rWe` `isInProcessEnabled`, `eLe` `detectBackend`, `Wdo` `markInProcessFallback`) and the **leader↔teammate permission bridge** are platform-infra and **carried over unchanged** from v2.1.156 — only the tmux **spawn mechanic** (`a3n` `send-keys`→`respawn-pane`) is a feature-level delta.
- The **swarm UI pane / `<agent-message>` relay envelope / `<cross-session-message>` coordinator envelope** are catalogued with the Agent Team feature (core-features) rather than as standalone integration symbols, because they are tightly coupled to the feature.

### Per-feature symbol additions (the exhaustive tables)

One file per in-scope feature. Each gives the v2.1.183 obfuscated identifier, readable name, `cli_inner_pretty.js:<line>`, and type for every symbol the feature touches, with the **before/after** picture (the v2.1.156 obfuscated name or a 0-count grep proving the symbol is new) and a **home-index routing note** stating which `symbol_index_*.md` each row belongs to. These are the canonical mapping-table home for this tree.

| File | Feature | One-line scope |
|------|---------|----------------|
| [`symbol_additions_v2_1_183_agent_team.md`](symbol_additions_v2_1_183_agent_team.md) | Agent Team | implicit-session-team init (`j3f` / `xic` name builder / `Sl()&&!xr()&&!agentId` gate), Agent-tool-as-spawner routing (`f3n`/`CDp`/`IDp`, `cqa`→`HDp`), `TeamCreate`/`TeamDelete` removal, `send-keys`→`respawn-pane` tmux fix (`a3n`, holding `cat` `Gke`), mailbox/addendum/permission-bridge carryover, coordinator-mode prompt deltas, background-task survival keepalive + `<note>` |
| [`symbol_additions_v2_1_183_workflow.md`](symbol_additions_v2_1_183_workflow.md) | Dynamic Workflows | `workflow(s)`→`ultracode` keyword (`hho`/`yho`), violet-shimmer auto-accept, NEW `workflowKeywordTriggerEnabled` (`Jyn`), AST-determinism (`rWa`, 2.1.172), per-agent `agentContext` (`Dt`, 2.1.174), `/workflows` immediate render (2.1.169), errorCode 7 + `taskType`/`workflowName` + agent-effort — structure unchanged |
| [`symbol_additions_v2_1_183_background_agents.md`](symbol_additions_v2_1_183_background_agents.md) | Background Agents | nested-subagent 5-level depth limit (`v1i=5`, `Gz`, gate `cio` hoisted above async via `bte` so fg+bg share it), depth threaded everywhere + persisted (`Xut`, 2.1.172/.181), worker env-isolation 4-pass provider-auth scrub (`_Fl`, 2.1.181), `agents --json` (`aGf`, +id/state/waitingFor/--all, 2.1.169), `/bg` re-mangle, retire/respawn refinements (cliVersion-equality + cron/routine guards corrected as **carryover**, not delta) |
| [`symbol_additions_v2_1_183_compact.md`](symbol_additions_v2_1_183_compact.md) | Compaction | `--fallback-model` honored in `summarize` while-loop (`del`/`ICn`/`vF`, `query_source=compact`, 2.1.178), 1M-credits clamp-back (`tH` `if(ARr)return 200000`, 2.1.172), window resolver 4→6 sources (`z2`, +clientdata, +model-default), arm table + remote-reactive + prefix-overflow; large line-shift of the ladder/dispatcher |
| [`symbol_additions_v2_1_183_auto_memory.md`](symbol_additions_v2_1_183_auto_memory.md) | Auto Memory | `CLAUDE_MEMORY_STORES` schema +scope/promptIndex/promptIndexMaxBytes (`bQu`/`Zse`), promptIndex network fetch+inject (`agi`/`kQu`), recall (`e0t`) routes by scope+mode, mounted-store-enables-team-recall (`Nk`) + `CLAUDE_CODE_REMOTE_MEMORY_DIR` (2.1.172 remote fix), watcher scope-split (`uFp`), status-line file-list verbose-only (`Svp`, 2.1.181). Runtime engine unchanged |

**Layer 2 — reconstructed-source capability modules** (full reconstructions, not deltas; no before/after column — they reconstruct the whole subsystem at v2.1.183):

| File | Module | One-line scope |
|------|--------|----------------|
| [`symbol_additions_v2_1_183_tools.md`](symbol_additions_v2_1_183_tools.md) | Tools | **441 symbols** — `Tool`/`buildTool` framework, `getAllBaseTools`/`getTools`/`assembleToolPool` registry, `buildToolSchema` + `eager_input_streaming`, deferral/ToolSearch, all ~48 tools (name/schema/description/validate/permissions/call) |
| [`symbol_additions_v2_1_183_system_prompt.md`](symbol_additions_v2_1_183_system_prompt.md) | System Prompt | **77 symbols** — `buildEffectiveSystemPrompt` assembler + lean gate `Dg`, identity, builders `$vp`/`w_f`/`y_f`, env block, cacheable sections (`Jx`; no `DANGEROUS_uncached` factory), 5 sub-agent variants |
| [`symbol_additions_v2_1_183_system_reminder.md`](symbol_additions_v2_1_183_system_reminder.md) | System Reminder | **164 symbols** — wrap/strip/extract primitives, `collectAttachments` pool, `PWn` dispatcher + renderer map, the 25-string catalogue, the `uWn` ambient trailer |
| [`symbol_additions_v2_1_183_slash_commands.md`](symbol_additions_v2_1_183_slash_commands.md) | Slash Commands | **136 symbols** — the `ap`/`registerBundledSkill` registrar + `FJn` registry, `/loop` (`_1f` + the loop-default `_9e` machinery + sentinels), `/goal` (`Cmf`/`Imf` dual Command + `Qdt`/`UGn` Stop-hook machinery), `/batch` (`pzl`/`h$f`/`g$f`), `/simplify` (`OKl`/`ZOf` + the 4 review angles), shared tool-name constants + gates. Routes to `symbol_index_infra_integration.md` |

### Cross-validation reports (one per feature + roll-up)

Each in-scope feature received an independent **default-to-FAIL adversarial pass**: every sampled `cli_inner_pretty.js:<line>` was re-opened at the exact line in the cited bundle and matched against the claim, before-pictures were re-read in the v2.1.156 bundle, and each doc was format-audited (forbidden mapping tables, `## Related Symbols` presence, dual-version snippet template, relative-link depth, English-only).

| File | Feature module | Pass / Fail | Verdict |
|------|----------------|------------|---------|
| [`cross_validation_summary.md`](cross_validation_summary.md) | roll-up | **272 / 289** (94.1%) | Cross-feature aggregate + the tree-wide invariant re-check (forbidden-table scan, `## Related Symbols` presence, full relative-link resolution sweep against the now-present routing layer). **All 17 failures were line-precision / transcription drift — never a wrong symbol, a fabricated line, or an incorrect delta claim; all 17 fixed in place** |
| [`cross_validation_report_agent_team.md`](cross_validation_report_agent_team.md) | `30_agent_team` | 53 P / 1 F | implicit-team init / Agent-spawn / tmux-fix / SendMessage / coordinator / background-survival verification (+v2.1.156 before-pictures) |
| [`cross_validation_report_workflow.md`](cross_validation_report_workflow.md) | `42_workflow` | 47 P / 2 F | `ultracode` keyword / caps / subagent-prompt / `Jyn` gate verification; structure-unchanged re-confirmation |
| [`cross_validation_report_background_agents.md`](cross_validation_report_background_agents.md) | `36_background_agents` | 37 P / 7 F | depth-limit / `bte` hoist / `_Fl` env-scrub / `agents --json` / `/bg` re-mangle verification; **corrects the scout dossier** (cliVersion-equality + cron/routine guards = carryover) |
| [`cross_validation_report_compact.md`](cross_validation_report_compact.md) | `07_compact` | 90 P / 4 F | fallback-model / 1M-clamp / six-source resolver / dispatcher-delta verification + 14 zero-count before-greps |
| [`cross_validation_report_auto_memory.md`](cross_validation_report_auto_memory.md) | `31_auto_memory` | 45 P / 3 F | `CLAUDE_MEMORY_STORES` schema / promptIndex / `e0t` recall routing / `Nk` team-recall enable / status-line verification |

**Layer 2 — reconstructed-source cross-validation** (independent default-to-FAIL re-sampling against the live v2.1.183 bundle, on top of the 27/27 per-file adversarial verify that produced the reconstructions):

| File | Module | Sampled / Passed | Verdict |
|------|--------|------------------|---------|
| [`cross_validation_report_tools.md`](cross_validation_report_tools.md) | `04_tools` | 40 / 40 (0 fixed) | **PASS** — framework + registry + serialization + deferral + per-tool contracts re-verified byte-exact |
| [`cross_validation_report_system_prompt.md`](cross_validation_report_system_prompt.md) | `40_system_prompt` | 35 / 34 (1 fixed in place) | **PASS** — assembler, lean gate, identity, builders, env, cacheable sections, sub-agents |
| [`cross_validation_report_system_reminder.md`](cross_validation_report_system_reminder.md) | `41_system_reminder` | 54 / 53 (1 fixed in place) | **PASS** — primitives, generator pool, dispatcher, 25-string catalogue |
| [`cross_validation_report_slash_commands.md`](cross_validation_report_slash_commands.md) | `43_slash_commands` | 44 / 44 (defects fixed in place) | **PASS** — registrar/dispatch + the four commands' deep-analysis docs re-sampled; verbatim prompt strings + 2.1.156→2.1.183 delta claims confirmed against the bundle |

## Where to Start

- **Trying to understand one in-scope changelog bullet?** → [`changelog_to_code_map.md`](changelog_to_code_map.md) (and the per-version "Out of scope" lines if your bullet isn't there — it may be deliberately un-analyzed).
- **Trying to understand a feature theme (the implicit-team redesign, `ultracode`, the depth limit, fallback-compaction, team memory)?** → [`changelog_analysis.md`](changelog_analysis.md) + the matching module folder under `../`.
- **Reading release-by-release what shipped (all subsystems)?** → [`../by_version/README.md`](../by_version/README.md) — the index to the **per-release breadth files** (one `2.1.NN.md` per published release, `2.1.157.md` … `2.1.183.md`), each a source-cross-validated pass over everything that release shipped.
- **Looking up an obfuscated symbol?** → Pick the matching `symbol_index_*.md` by category (routing matrix above), then jump from there to the per-feature `symbol_additions_v2_1_183_*.md` for the exhaustive before/after row.
- **Gauging how trustworthy a mapping is?** → [`cross_validation_summary.md`](cross_validation_summary.md) for the aggregate; the per-feature `cross_validation_report_*.md` for the line-by-line PASS/FAIL log. Each additions file also opens with its before-picture / 0-count-grep evidence.

## Narrative Summary

The window spans **27 version numbers** (2.1.157 … 2.1.183) but **22 published releases** (.164, .171, .177, .180, .182 never shipped). Where the prior v2.1.143→156 window was bimodal ("stabilize the runway, then land the plane at .154"), this window is a **sequence of mid-sized inflection points punctuated by long reliability tails** — each big change ships, then two or three patch releases harden it (`cli_inner_pretty.js` build SHA `9d251abd…`).

The five features this tree tracks are the load-bearing structural changes inside that sequence:

- **Agent Team (v2.1.178) is a redesign, not an add.** The explicit `TeamCreate`/`TeamDelete` lifecycle tools were **removed**; instead an implicit session-scoped team is created at CLI startup (name `session-<id[:8]>`, gated by `Sl()&&!xr()&&!agentId`), and teammates are now spawned through the **Agent tool** rather than a dedicated team API — `team_name` is documented as "Deprecated; ignored". The most surgical fix in the redesign is the tmux spawn mechanic moving from `send-keys` to `respawn-pane` (with a holding `cat`), eliminating a race where keystrokes landed in a not-yet-ready pane.
- **Dynamic Workflows (v2.1.160+) is a UX/correctness delta on an unchanged structure.** The trigger keyword changed from `workflow(s)` to `ultracode`, gated by a NEW `workflowKeywordTriggerEnabled` (`Jyn`); later releases added AST-determinism (v2.1.172), per-agent workflow context (v2.1.174), and an immediate `/workflows` render (v2.1.169). The VM/runtime architecture itself is carried over. (Two framing traps are flagged in the docs: "`/effort ultracode` xhigh-only" already existed in v2.1.156, and the v2.1.178 "explicit phrase" change is description-only — there is no new regex.)
- **Background Agents (v2.1.172/.181) gains a real recursion guard.** A nested-subagent **5-level depth limit** (`v1i=5`) is threaded everywhere and persisted; the gate (`cio`) is **hoisted above the async boundary** so foreground and background subagents share one ceiling. v2.1.181 adds a **4-pass provider-auth scrub** to worker env isolation, and v2.1.169 reworks `agents --json` (+id/state/waitingFor/--all). The docs **corrected the scout dossier** here: the cliVersion-equality and cron/routine retire guards were **carryover**, not new.
- **Compaction (v2.1.178/.172) becomes failure-aware.** The `summarize` path now honors `--fallback-model` inside its while-loop (re-issuing under the fallback when the primary fails, emitting `tengu_model_fallback_triggered` with `query_source=compact`); a separate v2.1.172 change clamps the context window back to 200000 when the 1M-credits path isn't actually entitled; and the window resolver grows from four to **six** sources (adding client-data and a model default).
- **Auto Memory (v2.1.172/.181) learns teams and remotes.** `CLAUDE_MEMORY_STORES` gains `scope`/`promptIndex`/`promptIndexMaxBytes`; a mounted store now enables **team recall** (`Nk`), and `CLAUDE_CODE_REMOTE_MEMORY_DIR` is the v2.1.172 remote fix. The runtime memory engine is otherwise unchanged; v2.1.181 only makes the status-line list files in verbose mode.

See [`changelog_analysis.md`](changelog_analysis.md) for the depth on each theme and the honest §8 out-of-scope inventory; see [`changelog_to_code_map.md`](changelog_to_code_map.md) for the per-bullet pointers.

## Differences from the v2.1.156 Overview Directory

This tree mirrors the v2.1.156 overview's file classes, with the adaptations a focused-delta scope forces:

- **Five `symbol_additions_v2_1_183_*.md`, not eleven.** Only the five in-scope features get additions tables. They carry the **before-picture** (v2.1.156 obfuscated name or a 0-count grep) inline, because the whole point of a delta tree is the change, not the static snapshot.
- **Thin four-file symbol indexes acting as a routing layer.** Because the exhaustive tables live in the per-feature additions files, the four `symbol_index_*.md` files here are deliberately compact — they record the shared anchors (Agent-tool spawn surface, backend registry, compaction model/window helpers) and route the reader to the additions file. For the five-feature *delta* layer, `symbol_index_infra_integration.md` was near-empty (the v2.1.178 redesign added no standalone integration symbols); the Layer-2 **Slash Commands** reconstruction later gave it a substantive *Module: Slash Commands* section (the `ap`/`registerBundledSkill` registrar + the four commands).
- **Five `cross_validation_report_*.md` + one `cross_validation_summary.md`.** One adversarial report per in-scope feature (53/1, 47/2, 37/7, 90/4, 45/3) plus the cross-feature roll-up (272/289, 94.1%). All 17 failures were line-precision / transcription drift; the background report additionally **corrected the scout dossier**.
- **Full per-version `by_version/` set, like the prior window.** [`../by_version/`](../by_version/) carries one breadth-analysis file per published release (22 files, `2.1.157.md` … `2.1.183.md`), indexed by [`../by_version/README.md`](../by_version/README.md) and verified by [`../by_version/cross_validation_report.md`](../by_version/cross_validation_report.md). Each file analyzes **all** subsystems that release touched; focus-feature bullets link to the depth modules, non-focus bullets get their primary analysis there.
- **Single-bundle build.** Like v2.1.156, the v2.1.183 build ships as one pretty-printed bundle (`cli_inner_pretty.js`, 699,346 lines) rather than a multi-`chunks.NN.mjs` split, so `file_index.md` maps the feature window onto `cli_inner_pretty.js:<line>` regions plus the `assets/cli_unpack_pretty/` decl files.

## Conventions Note

This tree adheres to the project-wide [`CLAUDE.md`](/lyz/codespace/analysis_claude_code_v2/CLAUDE.md) conventions. In particular:

- **No mapping tables in module docs.** Obfuscated → readable mapping **tables** live only in the four `symbol_index_*.md` files and the five `symbol_additions_v2_1_183_*.md` files. Module docs use list-form `## Related Symbols` references: `` `readableName` (`OBF`) — desc (cli_inner_pretty.js:NNN) ``. The one allowed exception is a cross-version *re-mangle* table (`Role | v2.1.156 obf | v2.1.183 obf | line`), explicitly labelled as **not** an obfuscated→readable mapping table.
- **Single source citation.** Every factual claim cites `cli_inner_pretty.js:<line>` in the **v2.1.183** bundle, verified by reading that line; `(v2.1.156)` / `(v2.1.88)` tags mark deliberate before-pictures read in the prior bundles. Obfuscated names are re-mangled between builds — every v2.1.183 name here was re-derived in the 2.1.183 bundle, never carried over by assumption.
- **Code snippets follow the dual-version format**: header (`====` + ReadableName + Location) → ORIGINAL → READABLE → Mapping.

## See Also

- [`changelog_analysis.md`](changelog_analysis.md) — long-form five-feature narrative + §8 honest out-of-scope inventory
- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet code-traceability index (newest-first), with per-version out-of-scope lines
- [`file_index.md`](file_index.md) — extracted-source inventory mapping the five features onto `cli_inner_pretty.js` regions
- [`../by_version/README.md`](../by_version/README.md) — index to the per-release breadth files (`2.1.157.md` … `2.1.183.md`)
- [`../../../claude_code_v_2.1.156/analyze/00_overview/README.md`](../../../claude_code_v_2.1.156/analyze/00_overview/README.md) — the prior window's overview README (style reference; broad v2.1.143 → v2.1.156 tree)
