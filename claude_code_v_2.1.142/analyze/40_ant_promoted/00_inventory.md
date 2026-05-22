# Ant-Gated Features Inventory (v2.1.88 source baseline)

This file inventories every ant-gated feature visible in the v2.1.88 TypeScript source at `/lyz/codespace/3rd/claude-code/src/`. Gates fall into three families:

- **A. `process.env.USER_TYPE === 'ant'`** — direct env-string check, evaluated at build time by Bun DCE. Sometimes wrapped in helpers (e.g. `isUndercover()`, `isAnt()`).
- **B. `feature('FLAG_NAME')`** — `bun:bundle` compile-time feature flag. Resolves to `true`/`false` depending on which build profile (`external`, `ant`, `kairos`, `bridge`, …) is compiled.
- **C. Statsig gate `tengu_*`** — runtime gate via `Z$("tengu_*", default)`. Survives DCE but typically gated *also* by `process.env.USER_TYPE === 'ant'` so external users never see it.

The v2.1.88 source contains **294** `USER_TYPE === 'ant'` references across the codebase. The categories below capture the user-visible features; pure helpers (`isUndercover()`, debug logging, etc.) are summarised at the end.

> **Note on counts.** Several entries below correspond to *multiple* gated branches (e.g. `agentsPlatform` is one feature backed by one ant gate in `commands.ts`, but the CLI subcommand also has supporting ant gates in `bridge/`, `bootstrap/state.ts`, `setup.ts`). Counts in [`01_status_table.md`](01_status_table.md) treat the feature as a single row.

---

## 1. Tools (`src/tools.ts`)

Ant-only tools added to the base tool list when `USER_TYPE === 'ant'`:

- **`REPLTool`** (`tools.ts:16-19`, `tools.ts:232`) — `process.env.USER_TYPE === 'ant' ? require('./tools/REPLTool/REPLTool.js').REPLTool : null`. The `REPL_TOOL_NAME` / `REPL_ONLY_TOOLS` constants are imported unconditionally but only added to the active toolset under the ant gate plus `isReplModeEnabled()`.
- **`SuggestBackgroundPRTool`** (`tools.ts:20-23`) — `process.env.USER_TYPE === 'ant' ? require('./tools/SuggestBackgroundPRTool/SuggestBackgroundPRTool.js').SuggestBackgroundPRTool : null`. Added to base tools at `tools.ts:216` when non-null.
- **`ConfigTool`** (`tools.ts:81`, `tools.ts:214`) — imported unconditionally but appended to base tools only via `...(process.env.USER_TYPE === 'ant' ? [ConfigTool] : [])`.
- **`TungstenTool`** (`tools.ts:60`, `tools.ts:215`) — same shape as `ConfigTool` — gated at the array spread, not at import.

Additional feature-flag-gated tools that *may* also be ant-only depending on build:

- `SleepTool` (`PROACTIVE || KAIROS`), `CronCreateTool` / `CronDeleteTool` / `CronListTool` (`AGENT_TRIGGERS`), `RemoteTriggerTool` (`AGENT_TRIGGERS_REMOTE`), `MonitorTool` (`MONITOR_TOOL`), `SendUserFileTool` (`KAIROS`), `PushNotificationTool` (`KAIROS || KAIROS_PUSH_NOTIFICATION`), `SubscribePRTool` (`KAIROS_GITHUB_WEBHOOKS`), `OverflowTestTool` (`OVERFLOW_TEST_TOOL`), `CtxInspectTool` (`CONTEXT_COLLAPSE`), `TerminalCaptureTool` (`TERMINAL_PANEL`), `WebBrowserTool` (`WEB_BROWSER_TOOL`), `SnipTool` (`HISTORY_SNIP`), `ListPeersTool` (`UDS_INBOX`), `WorkflowTool` (`WORKFLOW_SCRIPTS`).
  - These are not ant-gated per se but ship only under non-external build profiles.

---

## 2. Slash Commands (`src/commands.ts`)

Defined in the `INTERNAL_ONLY_COMMANDS` array (`commands.ts:225-254`) — the array name itself signals their gate. The array is filtered before publishing to the user-visible command list; entries appear or not based on the ant-only / feature-flag predicates listed.

### 2.1 Hard ant-only (`USER_TYPE === 'ant'` or unconditional in `INTERNAL_ONLY_COMMANDS`)

- **`backfillSessions`** (`commands.ts:4`, `:226`) — runs internal session backfills.
- **`breakCache`** (`commands.ts:32`, `:227`) — internal prompt-cache invalidation tool.
- **`bughunter`** (`commands.ts:54`, `:228`) — launches the bughunter fleet.
- **`commit`** (`commands.ts:11`, `:229`) — Anthropic-specific commit-with-attribution flow (uses `isUndercover()` for author identity).
- **`commitPushPr`** (`commands.ts:14`, `:230`) — combined commit/push/PR flow.
- **`ctx_viz`** (`commands.ts:20`, `:231`) — context window visualiser.
- **`goodClaude`** (`commands.ts:6`, `:232`) — internal positive-feedback collector.
- **`issue`** (`commands.ts:7`, `:233`) — opens an issue in internal trackers.
- **`initVerifiers`** (`commands.ts:26`, `:234`) — bootstraps verifier skills for the Verify agent.
- **`mockLimits`** (`commands.ts:139`, `:236`) — fakes rate-limit responses for testing.
- **`bridgeKick`** (`commands.ts:140`, `:237`) — bridge-failure injection for manual recovery testing.
- **`version`** (`commands.ts:141`, `:238`) — prints session binary version (ant-only convenience).
- **`resetLimits` / `resetLimitsNonInteractive`** (`commands.ts:143-146`, `:241-242`) — reset usage counters.
- **`onboarding`** (`commands.ts:35`, `:243`) — internal onboarding flow.
- **`share`** (`commands.ts:42`, `:244`) — share a transcript externally.
- **`summary`** (`commands.ts:142`, `:245`) — internal transcript-summary tool.
- **`teleport`** (`commands.ts:46`, `:246`) — resume a Claude Code session on claude.ai (was ant-only at the time).
- **`antTrace`** (`commands.ts:147`, `:247`) — internal tracing collector.
- **`perfIssue`** (`commands.ts:148`, `:248`) — perf-bug reporter.
- **`env`** (`commands.ts:172`, `:249`) — print environment diagnostic.
- **`oauthRefresh`** (`commands.ts:203`, `:250`) — manual OAuth refresh.
- **`debugToolCall`** (`commands.ts:204`, `:251`) — debug a single tool call.
- **`agentsPlatform`** (`commands.ts:48-51`, `:252`) — `claude agents` CLI subcommand. `USER_TYPE === 'ant' ? require('./commands/agents-platform/index.js').default : null`.
- **`autofixPr`** (`commands.ts:3`, `:253`) — monitor and autofix PR issues.

### 2.2 Feature-flag-gated (built only under non-external profiles)

- `proactive` (`PROACTIVE || KAIROS`), `briefCommand` (`KAIROS || KAIROS_BRIEF`), `assistantCommand` (`KAIROS`), `bridge` (`BRIDGE_MODE`), `remoteControlServerCommand` (`DAEMON && BRIDGE_MODE`), `voiceCommand` (`VOICE_MODE`), `forceSnip` (`HISTORY_SNIP`), `workflowsCmd` (`WORKFLOW_SCRIPTS`), `webCmd` (`CCR_REMOTE_SETUP`), `clearSkillIndexCache` (`EXPERIMENTAL_SKILL_SEARCH`), `subscribePr` (`KAIROS_GITHUB_WEBHOOKS`), `ultraplan` (`ULTRAPLAN`), `torch` (`TORCH`), `peersCmd` (`UDS_INBOX`), `forkCmd` (`FORK_SUBAGENT`), `buddy` (`BUDDY`).
- `ultrareview` — imported from `./commands/review.js`, but its module is shipped to all users; the gate is at the `isEnabled` predicate.
- `fast` (`./commands/fast/index.js`) — imported unconditionally but `isEnabled` checks `_9()` (a public predicate).

### 2.3 Extra ant branch inside otherwise-public commands

- `commands.ts:343` — `...(process.env.USER_TYPE === 'ant' && !process.env.IS_DEMO ? [...] : [])` — additional ant-only command slot inside the public command list.

---

## 3. Runtime / Mode Helpers

### 3.1 Fast Mode (`src/utils/fastMode.ts`)

- `fastMode.ts:399` — `const isAnt = process.env.USER_TYPE === 'ant'` — branches inside fast-mode logic.
- `fastMode.ts:431` — same pattern in a sibling helper.
- `fastMode.ts:514` — third occurrence — ant users see additional fast-mode UI affordances.
- `utils/worktree.ts:1396` — `const isAnt = process.env.USER_TYPE === 'ant'` — worktree-side fast-mode tweak.

### 3.2 Penguin Mode (org-level fast-mode opt-out)

- Wired through `t$((H) => ({ ...H, penguinModeOrgEnabled: ... }))` and `userSettings.fastMode`. Not directly behind `USER_TYPE === 'ant'` in the v2.1.88 TS but the `tengu_org_penguin_mode_*` Statsig gates and `claude_code_penguin_mode` API are Anthropic-internal until rolled out broadly.

### 3.3 Dev panes / fullscreen variants

- `utils/worktree.ts:1398` — ant-only dev-pane region toggle inside worktree mode helpers.
- `utils/fullscreen.ts:128` — `return process.env.USER_TYPE === 'ant'` — ant-only fullscreen affordance.

### 3.4 Undercover (commit attribution)

- `utils/undercover.ts:18-29,40,81` — all four exports gated on `USER_TYPE === 'ant'`. `isUndercover()` returns whether the current ant user has opted to identify as Claude in commits.
- `utils/attribution.ts:53` — `if (process.env.USER_TYPE === 'ant' && isUndercover()) ...` — switches commit `Co-Authored-By` line.
- `utils/attribution.ts:300` — second ant gate in commit-attribution-cleanup helper.
- `commands/commit.ts:16` — ant branch for commit-message generation.

### 3.5 System Prompt / Tool Description Visibility

- `utils/analyzeContext.ts:1354-1358` — exposes `deferredBuiltinDetails`, `systemToolDetails`, `systemPromptSections` to ant users only (powers `/ctx_viz`).
- `utils/analyzeContext.ts:415, 1025` — ant-specific branches inside the context-analyser.
- `constants/prompts.ts:205, 225, 238, 243, 404, 433` — six ant gates injecting extra system-prompt sections under `USER_TYPE === 'ant'`.

### 3.6 Debug / Logging

- `utils/debug.ts:65` — `const wasActive = isDebugMode() || process.env.USER_TYPE === 'ant'` — ant users always get debug logging.
- `utils/log.ts:351` — `setLastAPIRequestMessages(process.env.USER_TYPE === 'ant' ? messages : null)` — preserve last request body for diagnostics, ant-only.
- `utils/slowOperations.ts:40`, `utils/backgroundHousekeeping.ts:85`, `utils/cleanup.ts:599` — extra ant diagnostics.
- `utils/startupProfiler.ts:33`, `utils/headlessProfiler.ts:34` — ant users always profile startup; others sample at `STATSIG_SAMPLE_RATE`.

### 3.7 Repository Classification & Onboarding

- `setup.ts:337-348` — `if (process.env.USER_TYPE === 'ant') {...}` classifies the current repo against Anthropic's known repos.
- `setup.ts:417` — ant gate inside the trust-prompt logic.

### 3.8 Bridge / Remote Control / IDE / MCP / Permissions

- `bridge/bridgeMain.ts:343,1135,2201,2854` — four ant gates in the bridge main loop.
- `bridge/bridgeConfig.ts:20,29` — picks ant-specific bridge base URL.
- `bridge/bridgeUI.ts:224` — ant-only bridge debug surface.
- `bridge/bridgeDebug.ts:82` — module-level "called only when USER_TYPE === 'ant'" guarantee.
- `bridge/initReplBridge.ts:468` — ant-gated REPL bridge initialisation.
- `bridge/replBridge.ts:330,972,987,1575` — four ant gates in REPL bridge wiring.
- `bridge/sessionRunner.ts:264` — verbose log under ant.
- `utils/ide.ts:848,884` — ant-specific IDE behaviour.
- `utils/claudeInChrome/chromeNativeHost.ts:30` — ant-only Chrome native host code path.
- `utils/permissions/permissions.ts:706` — ant branch in permission resolution.
- `utils/permissions/permissionSetup.ts:276,954,1062,1114` — four ant gates in permission setup flow.
- `utils/permissions/dangerousPatterns.ts:58` — ant-only entries in dangerous patterns set.

### 3.9 Misc Internal Surfaces

- `utils/envUtils.ts:120,139` — env-var visibility gates.
- `utils/mcpInstructionsDelta.ts:41` — ant users get a different MCP delta.
- `utils/Shell.ts:323` — ant branch in shell wrapper.
- `utils/effort.ts:61,101,209,244,282` — five ant gates around effort-level handling (e.g. `max` effort, ant-only models).
- `utils/thinking.ts:95` — ant branch in thinking-token allocator.
- `utils/messages.ts:2687` — ant branch in message rendering.
- `utils/attachments.ts:3384`, `utils/context.ts:60,91,156`, `utils/tasks.ts:320`, `utils/warningHandler.ts:102` — diagnostic / preview branches.
- `utils/releaseNotes.ts:292,340` — ant users see a different release-notes splash.
- `utils/betas.ts:184,243,291,303,338,411` — six ant gates for beta-header injection.
- `utils/autoUpdater.ts:110,122` — ant disables auto-update.
- `utils/immediateCommand.ts:12`, `utils/advisor.ts:94,104`, `utils/agentSwarmsEnabled.ts:26`, `utils/planModeV2.ts:52`, `utils/toolSearch.ts:631`, `utils/logoV2Utils.ts:314`, `utils/shell/bashProvider.ts:222`, `utils/shell/shellToolUtils.ts:19` — single-branch behavioural tweaks.
- `utils/telemetry/instrumentation.ts:88` — ant telemetry endpoint.
- `commands/insights.ts:61,84,103,191,1450,2192,2196,2808,3051,3075,3117` — eleven ant gates in `/insights` (extra report columns for Anthropic).
- `commands/createMovedToPluginCommand.ts:44` — ant version of "moved to plugin" advice.
- `cli/print.ts:495` — extra output in `--print` mode under ant.
- `constants/betas.ts:30` — `cli-internal-2026-02-09` beta header for ant users.
- `constants/keys.ts:6` — ant-only key path.
- `constants/tools.ts:41` — omits `AGENT_TOOL_NAME` from a disallowed list for ant users.
- `bootstrap/state.ts:391` — extra ant gate in bootstrap.

---

## 4. Bash Tool — Safe Env Var Allowlist

- **`ANT_ONLY_SAFE_ENV_VARS`** (`tools/BashTool/bashPermissions.ts:447-475`) — `Set` of env vars that ant users may leave unstripped from Bash commands (`KUBECONFIG`, `DOCKER_HOST`, `AWS_PROFILE`, `CLOUDSDK_CORE_PROJECT`, `CLUSTER`, `COO_CLUSTER`, `COO_CLUSTER_NAME`, `COO_NAMESPACE`, `COO_LAUNCH_YAML_DRY_RUN`, `SKIP_NODE_VERSION_CHECK`, `EXPECTTEST_ACCEPT`, `CI`, `GIT_LFS_SKIP_SMUDGE`, `CUDA_VISIBLE_DEVICES`, `JAX_PLATFORMS`, `COLUMNS`, `TMUX`, `POSTGRESQL_VERSION`, `FIRESTORE_EMULATOR_HOST`, …).
- Used at `bashPermissions.ts:174, 250, 329, 591` with the pattern `process.env.USER_TYPE === 'ant' && ANT_ONLY_SAFE_ENV_VARS.has(varName)`.

---

## 5. Query Engine

- **`dumpPromptsFetch`** (`query.ts:588`) — `config.gates.isAnt ? createDumpPromptsFetch(...) : undefined`. Records every request body for Anthropic-internal prompt auditing. `config.gates.isAnt` is set from `process.env.USER_TYPE === 'ant'` in `query/config.ts:39`.
- **`buildQueryConfig`** (`query/config.ts:29-46`) — exposes `gates.isAnt` and `gates.fastModeEnabled` to the rest of the query engine.
- `query.ts:927` — extra ant branch inside the query loop.

---

## 6. Constants / System Prompt Fragments

- `constants/prompts.ts` — six ant-gated system-prompt sections (lines 205, 225, 238, 243, 404, 433).
- `constants/betas.ts:30` — ant-only beta header.
- `constants/keys.ts:6`, `constants/tools.ts:41` — single-branch ant tweaks.

---

## 7. Helpers (Pure Predicates)

- `isUndercover()` (`utils/undercover.ts:29-81`)
- `config.gates.isAnt` (`query/config.ts:24,39`)
- `process.env.USER_TYPE === 'ant'` inlined 294× across the source tree.
- `process.env.COO_CREATOR` (`utils/user.ts:155,175`) — ant-only env var for "the human running this build". Used to construct synthetic `@anthropic.com` author emails.

---

## Summary Counts (v2.1.88)

| Category | Count | Notes |
|----------|------:|-------|
| Ant-only tools | 4 | `REPLTool`, `SuggestBackgroundPRTool`, `ConfigTool`, `TungstenTool` |
| Feature-flag tools | 15+ | Sleep, Cron×3, RemoteTrigger, Monitor, SendUserFile, PushNotification, SubscribePR, OverflowTest, CtxInspect, TerminalCapture, WebBrowser, Snip, ListPeers, Workflow |
| Hard ant-only commands (`INTERNAL_ONLY_COMMANDS`) | 24 | See §2.1 — full list including `agentsPlatform`, `ultraplan` (feature-gate), `subscribePr` (feature-gate) |
| Feature-flag commands | 16+ | proactive, brief, assistant, bridge, remoteControlServer, voice, forceSnip, workflows, web, clearSkillIndexCache, subscribePr, ultraplan, torch, peers, fork, buddy |
| Runtime helper branches | 100+ | undercover, debug, profilers, bridge, IDE, MCP, permissions, betas, effort, prompts, … |
| Bash env-var allowlist | 1 | `ANT_ONLY_SAFE_ENV_VARS` (~25 entries) |
| Query gates | 2 | `dumpPromptsFetch`, `gates.isAnt` |
| System-prompt sections | 6+ | `constants/prompts.ts` |
| **Total `USER_TYPE === 'ant'` occurrences in 2.1.88** | **294** | grep `process.env.USER_TYPE === 'ant'` |

These counts cover the rows that appear in [`01_status_table.md`](01_status_table.md). The status table consolidates each feature into a single row even when the v2.1.88 source has multiple supporting gates (e.g. `agentsPlatform` = 1 row, but is implemented through 4+ ant gates across `commands.ts`, `bridge/`, `bootstrap/state.ts`, `setup.ts`).
