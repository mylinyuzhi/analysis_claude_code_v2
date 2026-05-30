# Scout Dossier — Claude Code v2.1.156 Deobfuscation Analysis

> Shared reference for all analysis agents. Covers the **v2.1.143 → v2.1.156** delta
> (the prior tree `../claude_code_v_2.1.142/analyze/` covered v2.1.113 → v2.1.142).

## Source layout (2.1.156 — the build under analysis)

- Primary bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
  (single ~650K-line pretty-printed bundle; **cite as `cli_inner_pretty.js:<line>`**).
- Per-decl files: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js`.
- Assets: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/assets/`
  (`slash_commands.json`, `feature_gates.json`, `env_vars.json`, `cli_flags.json`, `prompts/`, `tools/`).

## Cross-validation sources

1. **v2.1.88 readable source** (last pre-hardened build): `/lyz/codespace/3rd/claude-code/src/**/*.ts(x)`.
   Useful dirs: `tools/`, `utils/swarm/`, `utils/background/`, `tasks/`, `coordinator/`, `query/`,
   `components/`, `hooks/`, `commands/`. Many 2.1.156 symbols still trace back to readable 2.1.88 names.
   NOTE: Workflow tool / Opus 4.8 / lean prompt are NEW after 2.1.88 — expect only partial/scaffold matches
   (e.g. `components/WorkflowMultiselectDialog.tsx`, `utils/swarm/`, `coordinator/`). Say so honestly.
2. **2.1.156 self-cross-check**: grep the bundle for the same string from two angles (tool name constant +
   telemetry event + prompt fragment) to confirm a mapping.

## Conventions (MUST follow — from /lyz/codespace/analysis_claude_code_v2/CLAUDE.md)

- **English only.**
- **No symbol mapping tables in module docs.** Use list format: `` `readableName` (`OBF`) — desc (cli_inner_pretty.js:NNN) ``.
  Mapping TABLES live ONLY in `00_overview/symbol_index_*.md` and per-module `symbol_additions_*.md`.
- **Code snippets: dual-version format**, exactly:
  ```
  // ============================================
  // ReadableName - one-line description
  // Location: cli_inner_pretty.js:LINE-RANGE
  // ============================================

  // ORIGINAL (for source lookup):
  <obfuscated code>

  // READABLE (for understanding):
  <semantic code>

  // Mapping: obf→readable, param→readableParam, ...
  ```
- **Every factual claim must cite `cli_inner_pretty.js:<line>`** verified by actually reading that line.
- Follow the depth style of `../claude_code_v_2.1.142/analyze/` — TL;DR, "How it works", "Why this approach",
  "Key insight", ASCII diagrams, algorithm walkthroughs. Read a sibling 2.1.142 doc before writing.

## Confirmed anchors (verified by the orchestrator in 2.1.156 bundle)

### 42_workflow — Dynamic Workflows (FLAGSHIP, new in 2.1.154)
- `mx = "Workflow"` tool-name constant — `cli_inner_pretty.js:216291`; `WORKFLOW_TOOL_NAME` export `m57` at 216290.
- Workflow availability gate `SL5()` — `cli_inner_pretty.js:184781-184789`: keys off `process.env.CLAUDE_CODE_WORKFLOWS`
  (xH=explicit-true, k4=explicit-false) and `tengu_workflows_enabled` gate; `{available, defaultOn}`, defaultOn = (tier !== "pro").
- `NZ()` workflows-enabled predicate used in coordinator prompt (line 216510 area).
- Coordinator-mode system prompt builder `Dk5()` — `cli_inner_pretty.js:~216505-216700`: "You are Claude Code, an AI
  assistant that orchestrates software engineering tasks across multiple workers." References `mx` (Workflow), `sq`
  (SpawnAgent), `cf` (continue/SendMessage), `nT` (StopAgent), `n18`=`ListAgents`, scratchpad, `subscribe_pr_activity`.
- `orchestrationConfiguration` — `cli_inner_pretty.js:82209`.
- Workflow scriptPath UNC validation: `cli_inner_pretty.js:145295` ("UNC paths are not allowed for workflow scriptPath").
- `ultracode` setting (xhigh effort + standing dynamic-workflow orchestration) — `cli_inner_pretty.js:51700-51706`;
  effortLevel enum `["low","medium","high","xhigh"]` at 51690.
- Telemetry events (assets/feature_gates.json): `tengu_workflows_enabled`, `tengu_workflow_launched`,
  `tengu_workflow_completed`, `tengu_workflow_phase_completed`, `tengu_workflow_saved`,
  `tengu_workflow_agent_cap_exceeded`, `tengu_workflow_budget_cap_exceeded`,
  `tengu_workflow_journal_started_hit_respawn`, `tengu_workflow_keyword`, `tengu_workflow_keyword_dismissed`,
  `tengu_workflow_keyword_restored`, `tengu_workflow_usage_warning_accepted`. grep each to find emit sites.
- `/workflows` slash command — grep `"workflows"` in assets/slash_commands.json + handler.
- Things to find by grep: the workflow runtime primitives — `agent()`, `pipeline`, `parallel`, `phase`, `log`,
  `budget`, `args`, `runId`, `resumeFromRunId`, `scriptPath`, journal/respawn, agent cap (1000), concurrency cap
  (min(16, cores-2)), StructuredOutput tool, worktree isolation per agent.
- Changelog (2.1.154): "Introducing dynamic workflows: ask Claude to create a workflow and it orchestrates work
  across tens to hundreds of agents in the background … Run `/workflows` to view your runs". 2.1.152: "Simplified the
  Workflow tool's inline progress display". 2.1.156: "task panel … stray unselectable 'main' row when only a workflow is running".

### 36_background_agents — bg `--exec` / `! <command>` + fixes (existing module, big delta)
- `--exec` handler `hwz(H)` — `cli_inner_pretty.js:541956-541985`: parses `--exec`/`--exec=`, builds shell-intent
  bg session via `ol([], …, "shell", …, {intent, exec, name})`; warns "--exec ignores …" for other flags.
- `claude --bg` label — `cli_inner_pretty.js:540335`; `--bg` ignores `--session-id` warning at 541820.
- `! <command>` in `claude agents` dispatch — grep `"shell"` intent / `nameSource` / `intent:`.
- bg telemetry: `tengu_background*`, `tengu_auto_background_agents`, `tengu_exit_background_work_prompt`,
  `tengu_bash_command_explicitly_backgrounded`, `tengu_bg_daemon_service_stale_exec` (143252).
- Changelog fixes (2.1.156): premature "out of context" on 1M models from bg completion notifications; bg classifier
  losing goal when scheduled `/command` fires; pinned bg sessions respawning every minute after update; bg sessions
  stuck at blocked/running/working not retiring after idle grace; subagents in bg bypassing worktree-isolation guard;
  orphaned `claude --bg-pty-host` at 100% CPU after daemon exits (macOS). 2.1.153/154: `! command`, `/logout` signs
  out instead of bg, `←←` agents view on Bedrock/Vertex/Foundry + telemetry disabled.
- Reference: `../claude_code_v_2.1.142/analyze/36_background_agents/` (daemon_lifecycle, worker_state_machine, etc.).
- xval 2.1.88: `src/utils/background/`, `src/hooks/useSessionBackgrounding.ts`, `src/tasks/`.

### 43_model_opus48 — Opus 4.8 + effort (new module, 2.1.154/156)
- Model id map (firstParty/bedrock/vertex/foundry/anthropicAws/mantle/gateway) `claude-opus-4-8` —
  `cli_inner_pretty.js:91826-91832`; 4.7 block at 91816-91822; vertex region const at 3623.
- `ki() ? "Opus 4.6" : "Opus 4.8"` label — `cli_inner_pretty.js:98244`; opus-4-x membership test 98262.
- effortLevel enum + `ultracode` — 51690-51706. Default effort high for Opus 4.8 / `/effort xhigh` — grep
  `"xhigh"`, `defaultEffort`, effort default selection.
- Fast mode Opus 4.8 pricing (2x rate / 2.5x speed); `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` deprecation (06/01);
  `CLAUDE_CODE_ALWAYS_ENABLE_EFFORT`. `/effort` slider relabel "Faster"/"Smarter" (was Speed/Intelligence).
- 2.1.156 fix: Opus 4.8 thinking blocks modified → API errors (grep "thinking" signature stripping / redacted).
- xval 2.1.88: `src/constants/models*`, `src/utils/model*`.

### 44_lean_prompt — Lean system prompt default (new module, 2.1.154)
- HIDDEN: grep for the changelog phrasing fragments and model-conditional prompt selection. Try: `"lean"` (filter out
  "boolean"), `getSystemPrompt`, system-prompt builder, model-gate that excludes Haiku/Sonnet/Opus 4.7-and-earlier.
  Opus membership test at 98262. The lean prompt is default for all models EXCEPT Haiku, Sonnet, and Opus 4.7-and-earlier.
- Compare full vs lean prompt bodies; find the branch and the eligibility predicate.
- xval 2.1.88: `src/constants/*prompt*`, `src/services/*prompt*`, the main system-prompt assembler.

### 45_code_review — /code-review + /simplify (new module)
- `Y18 = "code-review"` — `cli_inner_pretty.js:211646`. code-reviewer agent prompt region ~240548-240620.
- 2.1.152: `/code-review --fix` applies findings (reuse/simplification/efficiency); 2.1.154: `/simplify` is now
  cleanup-only (was `/code-review --fix`). 2.1.147 renamed `/simplify`→`/code-review` (bug-hunting, effort levels,
  `--comment` inline PR comments). `/code-review ultra` = cloud multi-agent (ultrareview deprecated alias).
- grep `"--fix"`, `"--comment"`, `"simplify"`, `simplifyRange` (117204, 152455), effort-level review.
- xval 2.1.88: `src/commands/` review/simplify, `src/tools/` code-review.

### 04_tools — tool subsystem delta
- Workflow tool registration (see 42). AskUserQuestion `ez = "AskUserQuestion"` — `cli_inner_pretty.js:143388`;
  2.1.154 reservation behavior ("reserves the multiple-choice question prompt for decisions it genuinely cannot make").
- `disallowed-tools` frontmatter — `cli_inner_pretty.js:184492-184497` (skills/slash commands remove tools).
- Read PARTIAL-view truncation (2.1.145); streaming tool execution always-on (2.1.156).
- Reference: `../claude_code_v_2.1.142/analyze/04_tools/`.

### 10_skill_system — skills delta
- `/reload-skills` (2.1.152) + SessionStart `reloadSkills` — `cli_inner_pretty.js:270669`; `sessionTitle` 270637/270667.
- `disallowed-tools` frontmatter 184492. context:fork self-reinvoke loop fix (2.1.145). `/simplify`,`/code-review`,
  `/claude-api` (Opus 4.8 + 4.7→4.8 migration) skill bodies. skill/agent `effort:` frontmatter.
- Reference: `../claude_code_v_2.1.142/analyze/10_skill_system/`.

### 11_hooks — hooks delta
- `MessageDisplay` hook event — `cli_inner_pretty.js:49289, 270506, 270611, 336638` (transform/hide assistant text).
- SessionStart `sessionTitle`/`reloadSkills` — `cli_inner_pretty.js:270637-270669`.
- Stop/SubagentStop input `background_tasks` + `session_crons` — `cli_inner_pretty.js:336851` area (2.1.145).
- Stop-hook block cap (`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`, 8 blocks) 2.1.143.
- Reference: `../claude_code_v_2.1.142/analyze/11_hooks/`.

### 37_permission_policy — permissions delta
- auto-mode classifier data-exfiltration detection (bulk repo transfers) 2.1.156; auto mode no longer requires opt-in
  consent (2.1.152). `rm -rf $HOME` trailing-slash dangerous-path fix (2.1.156). `$TMPDIR` sandbox vs unsandboxed
  resolution fix. PowerShell `cd` bypass (2.1.149). bare var-assignment auto-approve bypass (2.1.145).
  Single invalid `allowedMcpServers`/`deniedMcpServers` entry dropping all policy (2.1.156) + `claude doctor` warning.
- grep `--exec`/`-delete` find-block (242356), exfiltration classifier, dangerous-path, `$TMPDIR`.
- Reference: `../claude_code_v_2.1.142/analyze/37_permission_policy/`.

## Version window for by_version/

Published in window: **2.1.143, 144, 145, 147, 148, 149, 150 (internal/infra), 152, 153, 154, 156**.
(146, 151, 155 skipped.) 2.1.154 is the flagship (Opus 4.8 + workflows + lean prompt). 2.1.156 is the thinking-block hotfix.
Use the upstream changelog already saved at `../CHANGELOG.md` (i.e. `claude_code_v_2.1.156/CHANGELOG.md`) as the bullet source of truth.
