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
| `cli_inner_pretty.js:367442-367585` | Workflow VM sandbox primitives: `uP8` determinism-shim injector @367442, `xK4` sandboxed timers @367445, `BP8` compile-to-VM @367468, `SZ_` `DETERMINISM_SHIM` program (declared @367488, assigned @367493), `UtH` intrinsic-hardening @367515, `uK4` await-bridge @367583, the `yZ_`/`hZ_` Date/Random error messages @367484/367486, `mP8 = 30000` sync timeout @367489 |
| `cli_inner_pretty.js:374939-376073` | Workflow execution runtime: `g74` VM-bridge factory (DSL globals; local executor `BiH(cG_,R)` @375001, remote `BiH(lG_,U)` @375002) @374939, subagent prompts `iG_`/`rG_`/`aG_`/`oG_` + defs `mp6`/`sG_` @375683-375775, `H44` VM-context builder @375973, `q44` runner @376007, `H0_ = 1000` log cap @376062 |
| `cli_inner_pretty.js:376074-376236` | `Fp6` `WORKFLOW_DESCRIPTION` authoring prompt: declared `Fp6;` @376074, assigned in the lazy `_44` thunk @376075-376236 — opt-in policy @376081-376088, hybrid rule @376090, single-phase shapes @376092-376099, ultracode @376101, `meta` contract @376105-376119, DSL signatures @376121-376135, pipeline-vs-parallel @376137-376179, pattern catalog @376197-376229, Resume @376233-376235; interpolation slots `q0_`=`'worktree'`/`bGH`=`▸`/`_0_`/`$0_`/`K0_` |
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

### Auto Memory + Auto Dreaming (memdir runtime) → `31_auto_memory/`

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:142100-145145` | **memdir core** (prompt-builder layer): `getAutoMemPath`/`ensureMemoryDirExists`/`logMemoryDirCounts` (`tengu_memdir_loaded`), `loadMemoryPrompt` entrypoint reader, `truncateEntrypointContent` (`q68` @144897) + the over-cap `WARNING:` text @144929, `MAX_ENTRYPOINT_LINES` (`B9H`=200 @143880), `MAX_ENTRYPOINT_BYTES` (`aM$`=25000 @145142), and the three-writer mutual-exclusion contract (`hasMemoryWritesSince` / `isExtractModeActive`) |
| `cli_inner_pretty.js:448027-448390` | **extraction runtime**: the per-turn `extract_memories` forked subagent (`runForkedAgent` fork, `maxTurns:5`, cursor-based skip when the main agent already wrote), shared `canUseTool` sandbox (`cT8`, memoryDir-scoped), and the `"Saved"` notification verb (`createMemorySavedMessage`) |
| `cli_inner_pretty.js:447997-448742` | **auto-dream runtime**: per-turn check + cross-session `auto_dream` forked subagent (`forkLabel:"auto_dream"`, `querySource:"auto_dream"`), hours + session-count gating (`minHours≥24`, `minSessions≥5`, gated on `tengu_onyx_plover`), `buildDreamPrompt` (`C04`), and `pendingMemoryUpdates {source:"dream"}` with the `"Improved"` notification verb |
| `cli_inner_pretty.js:399347-399453` | **consolidation lock + task registry**: the `.consolidate-lock` PID-file mutex (acquire/release/stale-detection) the dream writers coordinate through, plus the dream task registration entries |
| `cli_inner_pretty.js:532705-533045` | **`/dream` scheduled-task scaffold**: `As4` routine (name `"dream"` @532705) the cron/scheduling layer instantiates overnight — replaces the removed `tengu_kairos_dream` `/dream` slash-command skill (zero `tengu_kairos_dream` references remain in this build) |

### Background Agents — `--exec` / `! <command>` + retire/respawn fixes → `36_background_agents/`

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:540124` area | `EF()` daemon-ensure-running; emits `tengu_bg_daemon_service_stale_exec` — top of the bg daemon/dispatch region (~540124-542680) |
| `cli_inner_pretty.js:540335` | `claude --bg` window-label selector (`agents` → "claude agents"; `--bg` → "claude --bg") |
| `cli_inner_pretty.js:541956-541985` | `hwz(H)` `--exec` handler: parses `--exec` / `--exec=`, builds a shell-intent bg session, warns "--exec ignores …" for other flags |

### Agent Team / Swarm — in-process vs cross-process pane teammates → `30_agent_team/`

The leader-owned teammate subsystem (internally "swarm"). The bulk of the executor/backend code lives in one
contiguous ~379419-381618 block; the gate, mailbox, and lifecycle tools are elsewhere in the bundle.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:379419-379429` | teammate-prompt-addendum module (`H94`) — `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` (`jU6`, "you MUST use the SendMessage tool") |
| `cli_inner_pretty.js:379430-379573` | `OT_` permission bridge `createTeammateCanUseTool` — Path A (worker-badge dialog) + Path B (mailbox request + 500ms self-poll) |
| `cli_inner_pretty.js:379576-379636` | mailbox-XML envelope (`wU6`), idle notifier (`MT_`/`$94`), task-list auto-claim (`q94`/`jT_`/`wT_`) |
| `cli_inner_pretty.js:379637-379713` | `DT_` `waitForNextPromptOrShutdown` — the 6-priority poll loop (500ms) |
| `cli_inner_pretty.js:379714-380015` | `JT_` `runInProcessTeammate` — the persistent agent loop (system-prompt assembly, in-teammate compaction, dual-ALS scopes, completion/kill tails) |
| `cli_inner_pretty.js:380016-380022` | `qeH` fire-and-forget launcher + `fT_` `POLL_INTERVAL_MS`=500 |
| `cli_inner_pretty.js:380062-380173` | `K94` `InProcessBackend` (`TeammateExecutor` for in-process) + `_94` factory |
| `cli_inner_pretty.js:380183-380263` | it2 setup subsystem: `detectPythonPkgMgr`/`installIt2`/`verifyIt2Setup`/`pythonApiInstructions`/`markIt2SetupComplete`/`getPreferTmuxOverIterm2` |
| `cli_inner_pretty.js:380272-380299` | teammate-mode snapshot module (`PU6`) — `captureTeammateModeSnapshot` (`D94`), `getTeammateModeFromSnapshot` (`JSH`), CLI-override slots |
| `cli_inner_pretty.js:380305-380386` | teammate CLI/env builders: `resolveTeammateExecPath` (`J94`), `buildTeammateCliFlags` (`X94`), `buildTeammateEnvString` (`WT$`), `TEAMMATE_ENV_PASSTHROUGH` (`PT_`, ~35 entries) |
| `cli_inner_pretty.js:380388-380500` | `L94` `PaneBackendExecutor` (pane `TeammateExecutor`: two-phase spawn → `cd && env claude --agent-id …` typed into a pane; sendMessage/terminate/kill/isActive) + `P94` factory |
| `cli_inner_pretty.js:380512-380819` | `ZU6` `TmuxBackend` (`V94` module): two routers `kS`/`BE`, pane-creation mutex (`ZT_`/`Z94`), color map (`T94`), `send-keys … Enter`, hide/show |
| `cli_inner_pretty.js:380820-380910` | `TU6` `ITermBackend` (`N94` module): `it2 session split` dead-session pruning loop, `it2 session run`/`close`, cosmetic no-ops |
| `cli_inner_pretty.js:380912-381117` | `R94` BackendRegistry: `createBackendRegistry` (`y94`), `ensureBackendsRegistered` (`AeH`), `detectAndGetBackend` (`jLH`), `isInProcessEnabled` (`ma`), `getTeammateExecutor` (`NT_`), `getInProcessBackend` (`S94`), `getPaneBackendExecutor` (`ET_`), `markInProcessFallback` (`kU6`) |
| `cli_inner_pretty.js:381118` (`NS = y94()` @381129) | `globalBackendRegistry` singleton declaration + init |
| `cli_inner_pretty.js:381453-381555` | `uU6` permission-mode resolver, `CW8` `spawnInProcessTeammate`, `bW8` `killInProcessTeammate` |
| `cli_inner_pretty.js:381573-381618` | `x94` `InProcessTeammateTask` helper module: shutdown flag, message append, user-message injection, lookups, sorted-running list, `GT$` Task object |
| `cli_inner_pretty.js:338272-338560` | file-mailbox core: `getInboxPath` (`jhH`), `readMailbox` (`h_H`), `writeToMailbox` (`aA`), `markMessageAsReadByIndex` (`JG$`), message builders/parsers (idle/permission/shutdown), `isControlMessage` |
| `cli_inner_pretty.js:336140` area | `TEAM_LEAD_NAME` (`tY`="team-lead"), `TEAMMATE_COMMAND_ENV_VAR` (`WsH`), tmux/iTerm2 detection probes + socket/label resolvers (`ob6`/`PsH`) |
| `cli_inner_pretty.js:240763-240770` | master gate: `hasAgentTeamsFlag` (`Ru5`), `isAgentTeamsEnabled` (`R7`, env/flag AND `tengu_amber_flint`) |
| `cli_inner_pretty.js:216435-216439` | swarm tool set + tool-name constants: `SWARM_TOOL_SET` (`U57`), `TeamCreate` (`rd`), `TeamDelete` (`Oo`) (`SendMessage`=`cf` @216283) |
| `cli_inner_pretty.js:406631 / 406775 / 407447` | tool defs: `TeamCreateTool` (`Th_`), `TeamDeleteTool` (`vh_`), `SendMessageTool` (`Bh_`) |
| `cli_inner_pretty.js:216440-216506` | coordinator-mode gate (distinct feature, LIVE in 2.1.156): `coordinatorModeRaw` (`cI`), `isCoordinatorMode` (`Bp`), `isCcrCoordinator` (`Mk5`, hard-false), `getCoordinatorSystemPrompt` (`Dk5`) |

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

The tree carries **11 feature module dirs** (delta-focused, numbered to align with the long-running 2.1.142 tree),
plus `00_overview/` and `by_version/`.

| Dir | Scope (v2.1.143 → v2.1.156 delta) | Key docs |
|-----|-----------------------------------|----------|
| `00_overview/` | This index + four `symbol_index_*.md` mapping tables + twelve per-module `symbol_additions_v2_1_156_*.md` tables + twelve `cross_validation_report_*.md` verification reports + `changelog_analysis.md` | see "00_overview contents" below |
| `04_tools/` | Tools-subsystem delta: Workflow tool registration, `AskUserQuestion` reservation, `disallowed-tools` frontmatter, Read PARTIAL view + always-on streaming exec | `workflow_tool_registration.md`, `ask_user_question_reservation.md`, `disallowed_tools_frontmatter.md`, `read_partial_view_and_streaming_exec.md` |
| `10_skill_system/` | Skills delta: `/reload-skills` mid-session, `disallowed-tools` frontmatter, `effort:` frontmatter, context:fork recursion guard, bundled skill bodies (`/simplify`, `/code-review`, `/claude-api`) | `skill_reload_midsession.md`, `skill_disallowed_tools.md`, `skill_effort_frontmatter.md`, `skill_fork_recursion_guard.md`, `bundled_skill_bodies.md` |
| `11_hooks/` | Hooks delta: `MessageDisplay` event + streaming engine, SessionStart `sessionTitle`/`reloadSkills`, Stop-hook `background_tasks` input + block cap | `message_display_event.md`, `message_display_streaming_engine.md`, `session_start_title_and_reload_skills.md`, `stop_hook_background_tasks_and_block_cap.md` |
| `30_agent_team/` | **Agent team / swarm (CONTINUATION of the 2.1.142 module)**: the two teammate execution modes (in-process async task vs cross-process tmux/iTerm2 pane), the `BackendRegistry` executor split + `isInProcessEnabled` switch, the file-mailbox IPC, `TeamCreate`/`TeamDelete`/`SendMessage` lifecycle tools, the leader↔teammate permission bridge, and the v2.1.88/v2.1.142 cross-validation (incl. the coordinator-mode re-introduction: absent in v2.1.142, revived/live in v2.1.156) | `execution_modes_and_backend_registry.md`, `in_process_mode.md`, `cross_process_mode.md`, `mailbox_and_lifecycle_tools.md`, `cross_validation.md` |
| `31_auto_memory/` | **Auto memory + auto dreaming (memdir runtime)**: memdir prompt-builder layer (entrypoint 200L/25KB cap + truncation warning, three-writer mutual-exclusion contract), per-turn extraction subagent + shared tool sandbox, per-turn auto-dream scheduler (hours/session-count + `.consolidate-lock` mutex gating), `/dream` scheduled-task scaffold replacing the removed `tengu_kairos_dream` skill | `memdir_core.md`, `extract_memories_runtime.md`, `auto_dream_runtime.md`, `cross_validation.md` |
| `36_background_agents/` | Background-agents delta: `--exec` / `! <command>` shell sessions, unified dispatcher `ol`, daemon binary-takeover + bg handoff, worker retire/respawn fixes, worktree-isolation + PTY-orphan fixes, bg-session classifier | `shell_exec_sessions.md`, `unified_dispatcher_ol.md`, `daemon_binary_takeover_and_bg_handoff.md`, `worker_retire_respawn_2156.md`, `worktree_isolation_and_pty_orphan.md`, `bg_session_classifier.md` |
| `37_permission_policy/` | Permissions delta: auto-mode consent removed, data-exfiltration classifier, dangerous-path `$HOME`/`$TMPDIR` fixes, PowerShell `cd` + bare-assignment bypass fixes, MCP-server policy partial-validation fix, classifier token-budget "could not evaluate" | `auto_mode_consent_removed.md`, `data_exfiltration_classifier.md`, `dangerous_path_home_tmpdir.md`, `powershell_cd_and_bare_assignment_bypass.md`, `mcp_server_policy_partial_validation.md`, `classifier_token_budget_could_not_evaluate.md` |
| `42_workflow/` | **Dynamic Workflows (FLAGSHIP)**: tool definition, availability gate, agent/budget caps + lifecycle relations, VM execution runtime + DSL semantics + subagent prompts, and the `Fp6` authoring-prompt content walk (opt-in policy, pipeline-vs-parallel, orchestration pattern catalog) | `workflow_tool_definition.md`, `gate_caps_lifecycle_relations.md`, `workflow_runtime_and_subagents.md`, `workflow_authoring_and_orchestration.md` |
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
- `symbol_additions_v2_1_156_{agent_team,auto_memory,background_agents,code_review,hooks,lean_prompt,model_opus48,permission_policy,skill_system,tool_search,tools,workflow}.md`
  — per-module new-symbol tables for this window, each noting which `symbol_index_*.md` it routes into.
- `cross_validation_report_{agent_team,auto_memory,background_agents,code_review,hooks,lean_prompt,model_opus48,permission_policy,skill_system,tool_search,tools,workflow}.md`
  — per-module verification reports (citation spot-checks, forbidden-table scans, broken-link sweeps, v2.1.88 corroboration).
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
