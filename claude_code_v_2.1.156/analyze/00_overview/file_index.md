# File Index — v2.1.156 Extracted Source

This index inventories the files produced by `claude-code-bomb` for Claude Code **v2.1.156**, and maps the
**v2.1.143 → v2.1.156** feature window onto concrete `cli_inner_pretty.js` line regions. It is the entry point for
"I want to read the code for feature X" — work backward from the asset listing or grep for a stable string.

The prior tree (`../../../claude_code_v_2.1.142/analyze/`) covered **v2.1.113 → v2.1.142**. This tree covers the
window published as **2.1.143, 144, 145, 147, 148, 149, 150, 152, 153, 154, 156** (146/151/155 skipped). **2.1.154** is
the flagship release (Opus 4.8 + dynamic workflows + lean system prompt); **2.1.156** is the thinking-block hotfix.

The canonical extraction layout is at `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/`.

> **Citation rule:** every line number below was verified against
> `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`. Cite as `cli_inner_pretty.js:<line>`.
> Line numbers are stable within this build only — they shift across versions; the string literals are the stable anchor.

---

## Top-Level Tree

```
extract/                                          (/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/)
├─ cli_inner_pretty.js                      (~21.5 MB / 649,979 lines, one pretty-printed bundle)
├─ cli_inner_pretty.js.PLACEHOLDER.md       (git-ignored note: regenerate from binary or reassemble from cli_unpack_pretty/)
├─ cli_unpack_pretty/                       (per-decl break-up of cli_inner_pretty.js)
│   ├─ _manifest.json                       (~3.6 MB file list + name + kind + bytes)
│   ├─ _summary.json                        ([] empty in this build)
│   └─ decls/
│       ├─ functions/<id>.js                (13,790 function decls)
│       ├─ vars/<id>.js                     (20,617 var decls)
│       ├─ classes/<id>.js                  (275 class decls)
│       ├─ ExpressionStatement/<id>.js      (431 top-level expression statements — registrations/IIFEs)
│       └─ IfStatement/<id>.js              (1 top-level if-statement — runtime guard)
└─ assets/
    ├─ _summary.json                        (asset counts — see table below)
    ├─ prompts/, prompts_index.json         (372 prompts, ~1.19 MB; index entries: {file,len,offset,headline})
    ├─ system_prompts/                      (12 per-prompt JSON files — top-level identity/steering/tool-section prompts)
    ├─ tools/                               (49 per-tool MD files + _index.json — NEW richer layout this build)
    ├─ tools_index.json                     (1 entry "explain_command" — legacy flat index, superseded by tools/_index.json)
    ├─ slash_commands.json                  (115 slash command names)
    ├─ env_vars.json                        ({all:690, claude_anthropic:336, bun:1, node:3} — now an object, not a flat array)
    ├─ cli_flags.json                       ({flags:846, subcommands:18} — now an object)
    ├─ feature_gates.json                   (1,227 `tengu_*` / experiment keys)
    ├─ endpoints.json                       ({total_urls:390, by_host:118 hosts} — now an object)
    └─ long_strings/                        (50 string-literal files over a size threshold)
```

### Asset summary (`assets/_summary.json`)

| Key | Value | Notes |
|-----|-------|-------|
| `prompts_total` | 372 | up from 343 in 2.1.142 |
| `prompts_chars` | 1,191,127 | ~1.19 MB of prompt text |
| `tools_unique` | 1 | legacy detector under-counts; real per-tool inventory is in `assets/tools/` (49 files) |
| `slash_commands` | 115 | |
| `env_vars` | 690 | |
| `urls` / `hosts` | 390 / 118 | |
| `cli_flags` | 846 | |
| `cli_subcommands` | 18 | `agents, attach, bridge, daemon, data, diff, kill, logs, number, object, rc, remote, remote-control, respawn, rm, stop, sync, xmlns` |
| `feature_gates` | 1,227 | up from 1,158; the `tengu_*` experiment set grew across the window |

### What changed in the extraction layout vs 2.1.142

1. **`assets/tools/` is now populated** (49 per-tool Markdown files + `tools/_index.json` with `{name, userFacingName,
   searchHint, descriptionLen, promptLen, schemaLen, isReadOnly, isConcurrencySafe, offset}`). In 2.1.142 the
   tool index was empty because the tool-factory rename defeated the detector; this build's extractor recovers the
   per-tool surface. The legacy top-level `tools_index.json` still exists but only carries one stray entry
   (`explain_command`).
2. **`env_vars.json` / `cli_flags.json` / `endpoints.json` are now JSON objects** (categorized) rather than flat arrays.
   `env_vars.json` splits into `all` (690), `claude_anthropic` (336), `bun`, `node`. `cli_flags.json` splits into
   `flags` (846) and `subcommands` (18). `endpoints.json` carries `total_urls` and a `by_host` map.
3. **`cli_unpack_pretty/` lost the `unknown/`, `fingerprint/`, and `node-builtin/` trees** present in 2.1.142; this
   build emits only the `decls/{functions,vars,classes,ExpressionStatement,IfStatement}` break-up plus `_manifest.json`.

---

## How to Look Up a Symbol

The most useful entry point is the per-decl view in `cli_unpack_pretty/decls/`:

```
$ cat /lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_unpack_pretty/decls/vars/<id>.js
$ cat /lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_unpack_pretty/decls/functions/<id>.js
$ cat /lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_unpack_pretty/decls/classes/<id>.js
```

This gives you the **isolated** body of that decl, free of unrelated context. The same obfuscated id is used as the
filename across the whole tree, so once you know the obfuscated name you have the file. For "what kind / how big is this
decl" lookups, `_manifest.json` carries kind + bytes for every output file.

For "where in the bundle was this decl emitted", grep `cli_inner_pretty.js` for the decl name with a leading
`var `/`function `/`class `/`let `/`const ` — the lexical position is stable within this single build.

```
$ grep -n 'var mx = "Workflow"' /lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js
216291:var mx = "Workflow";
```

---

## Key Line-Range Regions — v2.1.143 → v2.1.156 Window

These are the load-bearing regions for this window's features. Each was read and verified.

### Dynamic Workflows (FLAGSHIP, new in 2.1.154) → `42_workflow/`

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:145290-145308` | `Hj$(H)` workflow scriptPath loader: UNC-path rejection at **145295** (`UNC paths are not allowed for workflow scriptPath`), `jI`-byte size cap, resolves against cwd |
| `cli_inner_pretty.js:184781-184789` | `SL5()` workflow availability gate: keys off `process.env.CLAUDE_CODE_WORKFLOWS` (`xH`=explicit-true / `k4`=explicit-false) and the `tengu_workflows_enabled` gate; returns `{available, defaultOn}`, `defaultOn = _4() !== "pro"` |
| `cli_inner_pretty.js:216290-216291` | `m57` export namespace `X$(m57, { WORKFLOW_TOOL_NAME: () => mx })` at 216290; `var mx = "Workflow"` at 216291; `var n18 = "ListAgents"` immediately after |
| `cli_inner_pretty.js:371748` area | `FZ(H)` workflow-script validator: re-checks `jI` size cap, then `acorn` parse (`ecmaVersion:"latest"`) of the workflow JS — entry into the ~371746-378500 workflow-runtime region (agent/pipeline/parallel/phase/log/budget/runId primitives) |
| `cli_inner_pretty.js:82209` | `orchestrationConfiguration` schema field |
| `cli_inner_pretty.js:441902` | re-export of `WORKFLOW_TOOL_NAME` via `Z6(m57)` |

### Opus 4.8 + Effort Levels (2.1.154 / 2.1.156) → `43_model_opus48/`

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:91816-91822` | `claude-opus-4-7` provider id map (firstParty/bedrock/vertex/foundry/anthropicAws/mantle/gateway) |
| `cli_inner_pretty.js:91825-91832` | `Xi$` = `claude-opus-4-8` provider id map (same 7 providers) |
| `cli_inner_pretty.js:98244` | label selector `return ki() ? "Opus 4.6" : "Opus 4.8"` |
| `cli_inner_pretty.js:98246-98248` | `mUH()` model-string builder, appends `[1m]` 1M-context suffix via `VP()` |
| `cli_inner_pretty.js:98250-98262` | fast-mode predicate `m76(H)` + opus-4-x membership test `Wj(H)` (`opus-4-6` / `opus-4-7` / `opus-4-8`) at 98262 |
| `cli_inner_pretty.js:51690-51693` | `effortLevel` zod enum `["low","medium","high","xhigh"]` |
| `cli_inner_pretty.js:51697-51706` | `ultracode` setting: "xhigh effort plus standing dynamic-workflow orchestration … Requires workflows to be enabled and an xhigh-capable model" |
| `cli_inner_pretty.js:184865-184987` | effort parsing/normalization helpers (`_kH`, `vx`, `pjH`; alias table `s$7`, validator `KkH`, numeric range `o$7`) |

### Lean System Prompt (default for all models except Haiku / Sonnet / Opus 4.7-and-earlier, 2.1.154) → `44_lean_prompt/`

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:555461-555607` | `dXz()` lean-prompt body builder: the trimmed-down instruction set (no-over-engineering, comment policy, UI-verify-in-browser guidance) that becomes the default system prompt; the eligibility predicate reuses the opus membership test at 98262 |

### Background Agents — `--exec` / `! <command>` + retire/respawn fixes → `36_background_agents/`

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:540124` area | `EF()` daemon-ensure-running; emits `tengu_bg_daemon_service_stale_exec` — top of the bg daemon/dispatch region (~540124-542680) |
| `cli_inner_pretty.js:540335` | `claude --bg` window-label selector (`agents` → "claude agents"; `--bg` → "claude --bg") |
| `cli_inner_pretty.js:541956-541985` | `hwz(H)` `--exec` handler: parses `--exec` / `--exec=`, builds a shell-intent bg session, warns "--exec ignores …" for other flags |

### `/code-review` + `/simplify` (2.1.147 rename / 2.1.152 `--fix` / 2.1.154 simplify-cleanup-only) → `45_code_review/`

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:211646` | `Y18 = "code-review"` command-name constant (plus `T97="verify"`, `e26="commit"` siblings) |
| `cli_inner_pretty.js:502739-502747` | review-config helpers `Vs()` (duration note "~10–20 min") / `LU4()` (model) — head of the ~502739-601400 review-prompt/skill-body region |

### Hooks — `MessageDisplay` event + SessionStart `sessionTitle`/`reloadSkills` → `11_hooks/`

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:49289` | `MessageDisplay` appended to the hook-event enum (alongside `CwdChanged`, `FileChanged`) |
| `cli_inner_pretty.js:270506` | `MessageDisplay: []` slot in the runtime hook-registry initializer |
| `cli_inner_pretty.js:270637-270669` | `$U(...)` SessionStart loader: collects `sessionTitle` (`O`) and `reloadSkills` (`M`) from hook outputs, plus plugin-hook load error handling |
| `cli_inner_pretty.js:336638` | second `MessageDisplay` enum site feeding the zod schema (`Fo7`) |
| `cli_inner_pretty.js:336851` area | Stop/SubagentStop hook input fields (`background_tasks`, `session_crons`) |

### Tools subsystem delta → `04_tools/`

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:143388` | `ez = "AskUserQuestion"` tool-name constant (2.1.154 reservation behavior) |
| `cli_inner_pretty.js:184492-184497` | `disallowed-tools` frontmatter handling (skills / slash commands removing tools) |
| `cli_inner_pretty.js:216291` | `Workflow` tool registration (see Workflows region) |

### Permission policy delta → `37_permission_policy/`

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:242356` area | `--exec` / `-delete` find-command blocking |
| (grep targets) | data-exfiltration classifier (bulk repo transfers), `rm -rf $HOME` trailing-slash dangerous-path fix, `$TMPDIR` sandbox resolution, `allowedMcpServers`/`deniedMcpServers` partial-validation fix |

---

## Slash Commands (115 entries)

From `assets/slash_commands.json`. The real user-facing surface relevant to this window includes:
`/workflows` (new — dynamic workflows runs view), `/effort` (slider relabeled "Faster"/"Smarter"), `/code-review`,
`/simplify`, `/claude-api`, `/reload-skills`, `/model`, `/agents`, `/compact`, `/skills`, `/resume`, `/rewind`,
`/routines`, `/schedule`, `/hooks`, `/loop`.

> As in 2.1.142, many array entries (`/bin`, `/etc`, `/opt`, `/proc`, `/tmp`, `/usr`, `/var`, `/sbin`, `/fish`, `/zsh`,
> `/ld-linux-`, …) are filesystem paths the extractor's `/`-leading heuristic falsely classified as slash commands.
> Trust the handler / definition site, not the raw list, when confirming a command exists.

## Tools (`assets/tools/`, 49 files)

The per-tool inventory (`tools/_index.json` + one `.md` per tool) is the authoritative tool surface for this build.
Notable entries for this window: **`Workflow.md`** (the dynamic-workflow tool), `AskUserQuestion.md`,
`StructuredOutput.md`, `Skill.md`, `ToolSearch.md`, `SendMessage.md`, `Agent.md`, plus the `Task*`/`Team*`/`Cron*`
families. A couple of stray entries (`eval_registered________.md`, `explain_command.md`) are detector noise.

## Prompts (`assets/prompts/`, 372 prompts)

`assets/prompts_index.json` is a list of `{file, len, offset, headline}` records — the `offset` is a byte offset into
`cli_inner_pretty.js`, useful for locating the emit site of a large prompt body (e.g. the model-migration guide, the
`/code-review` skill body, the `/claude-api` skill body, the lean-prompt fragments).

---

## Map: `analyze/` Module Dir → What It Documents

The tree carries **9 feature module dirs** (delta-focused, numbered to align with the long-running 2.1.142 tree),
plus `00_overview/` and `by_version/`.

| Dir | Scope (v2.1.143 → v2.1.156 delta) | Key docs |
|-----|-----------------------------------|----------|
| `00_overview/` | This index + four `symbol_index_*.md` mapping tables + nine per-module `symbol_additions_v2_1_156_*.md` tables + `changelog_analysis.md` | see "00_overview contents" below |
| `04_tools/` | Tools-subsystem delta: Workflow tool registration, `AskUserQuestion` reservation, `disallowed-tools` frontmatter, Read PARTIAL view + always-on streaming exec | `workflow_tool_registration.md`, `ask_user_question_reservation.md`, `disallowed_tools_frontmatter.md`, `read_partial_view_and_streaming_exec.md` |
| `10_skill_system/` | Skills delta: `/reload-skills` mid-session, `disallowed-tools` frontmatter, `effort:` frontmatter, context:fork recursion guard, bundled skill bodies (`/simplify`, `/code-review`, `/claude-api`) | `skill_reload_midsession.md`, `skill_disallowed_tools.md`, `skill_effort_frontmatter.md`, `skill_fork_recursion_guard.md`, `bundled_skill_bodies.md` |
| `11_hooks/` | Hooks delta: `MessageDisplay` event + streaming engine, SessionStart `sessionTitle`/`reloadSkills`, Stop-hook `background_tasks` input + block cap | `message_display_event.md`, `message_display_streaming_engine.md`, `session_start_title_and_reload_skills.md`, `stop_hook_background_tasks_and_block_cap.md` |
| `36_background_agents/` | Background-agents delta: `--exec` / `! <command>` shell sessions, unified dispatcher `ol`, daemon binary-takeover + bg handoff, worker retire/respawn fixes, worktree-isolation + PTY-orphan fixes, bg-session classifier | `shell_exec_sessions.md`, `unified_dispatcher_ol.md`, `daemon_binary_takeover_and_bg_handoff.md`, `worker_retire_respawn_2156.md`, `worktree_isolation_and_pty_orphan.md`, `bg_session_classifier.md` |
| `37_permission_policy/` | Permissions delta: auto-mode consent removed, data-exfiltration classifier, dangerous-path `$HOME`/`$TMPDIR` fixes, PowerShell `cd` + bare-assignment bypass fixes, MCP-server policy partial-validation fix, classifier token-budget "could not evaluate" | `auto_mode_consent_removed.md`, `data_exfiltration_classifier.md`, `dangerous_path_home_tmpdir.md`, `powershell_cd_and_bare_assignment_bypass.md`, `mcp_server_policy_partial_validation.md`, `classifier_token_budget_could_not_evaluate.md` |
| `42_workflow/` | **Dynamic Workflows (FLAGSHIP)**: tool definition, availability gate, agent/budget caps + lifecycle relations | `workflow_tool_definition.md`, `gate_caps_lifecycle_relations.md` |
| `43_model_opus48/` | **Opus 4.8 + effort**: model id mapping, effort levels + defaults, effort-slider relabel UI, fast-mode pricing, thinking-signature hotfix (2.1.156) | `opus48_model_mapping.md`, `effort_levels_and_defaults.md`, `effort_slider_relabel_ui.md`, `opus48_fast_mode_pricing.md`, `thinking_signature_hotfix.md` |
| `44_lean_prompt/` | **Lean system prompt default**: eligibility gate, lean-vs-full prompt diff, rationale + rollout | `lean_prompt_eligibility_gate.md`, `lean_vs_full_prompt_diff.md`, `lean_prompt_rationale_and_rollout.md` |
| `45_code_review/` | **`/code-review` + `/simplify`**: command surface, review-prompt algorithm, simplify + cloud (`ultra`) review | `code_review_command.md`, `review_prompt_algorithm.md`, `simplify_and_cloud_review.md` |
| `by_version/` | Per-release changelog→code maps, one file per published version | `2.1.143.md` … `2.1.156.md` (11 files) |

### `00_overview/` contents

- `file_index.md` — this file.
- `symbol_index_core_execution.md` — Core execution mappings (Agent Loop, Tools, LLM API, Agents, Subagent, State).
- `symbol_index_core_features.md` — Core feature mappings (Plan, Background, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI; Workflows + effort live here).
- `symbol_index_infra_platform.md` — Platform mappings (MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry).
- `symbol_index_infra_integration.md` — Integration mappings (LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser).
- `symbol_additions_v2_1_156_{background_agents,code_review,hooks,lean_prompt,model_opus48,permission_policy,skill_system,tools,workflow}.md`
  — per-module new-symbol tables for this window, each noting which `symbol_index_*.md` it routes into.
- `changelog_analysis.md` — long-form narrative of the v2.1.143 → v2.1.156 window.

---

## Lookup Workflow

**Goal: Find which decl implements feature X**

1. Pick a unique string (changelog quote, env var, slash-command name, tool-name constant, telemetry event).
2. `grep -n "<string>" /lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
3. From the surrounding ~30 lines, identify the enclosing decl name (the obfuscated identifier just before `=` for
   vars, or after `function` for fn-decls).
4. Open `cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js` for the isolated decl.
5. If the decl references other obfuscated ids, recurse on those.

**Goal: Map a known feature theme to all related decls**

1. Identify several distinct strings related to the theme (tool name + telemetry event + prompt fragment).
2. `grep -ln "<string>" cli_unpack_pretty/decls/functions/*.js` for each.
3. Union the file lists — those are your candidate decls. Confirm by grepping the bundle from two angles.

**Goal: Validate a v2.1.142 → v2.1.156 delta claim**

1. Find the corresponding v2.1.142 region (see `../../../claude_code_v_2.1.142/analyze/00_overview/file_index.md`).
2. Grep the same string in v2.1.156 source.
3. Compare obfuscated names — they shift across builds; the string literals are the stable anchor.

---

## See Also

- `changelog_analysis.md` — long-form narrative of the v2.1.143 → v2.1.156 window.
- `symbol_index_core_execution.md` / `symbol_index_core_features.md` / `symbol_index_infra_platform.md` /
  `symbol_index_infra_integration.md` — the four canonical symbol mapping tables.
- `../_scout_dossier.md` — confirmed anchors + conventions for all analysis agents.
- `../CHANGELOG.md` — upstream changelog (bullet source of truth for `by_version/`).
- `../../../claude_code_v_2.1.142/analyze/00_overview/file_index.md` — prior-window index (v2.1.113 → v2.1.142).
