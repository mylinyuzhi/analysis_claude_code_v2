# Ant-Gated Features: v2.1.88 → v2.1.142 Status

This table tracks every feature from [`00_inventory.md`](00_inventory.md) and classifies its 2.1.142 status. **All file:line references in the "2.1.142 Entry Point" column point to `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`** unless otherwise noted.

**Status legend:**

- **PROMOTED** — feature is now publicly available in 2.1.142. Ant gate replaced with a public gate (statsig/setting/env) or removed entirely.
- **STILL-INTERNAL** — feature is present in the 2.1.142 binary but its enablement predicate evaluates to false for external builds (`isEnabled: () => !1`, `isAnt: !1`, hardcoded `getUserType() === "external"`). An "ant-build" binary would still enable it.
- **REMOVED** — feature was top-level-gated in v2.1.88 such that Bun DCE eliminated the entire module from the public 2.1.142 binary; no entry point present.
- **CHANGED** — feature exists in 2.1.142 with a meaningfully different shape (renamed, defaults flipped, scope changed).

---

## Tools

| Feature | 2.1.88 Gate | 2.1.142 Status | 2.1.142 Entry Point | Notes |
|---------|-------------|----------------|---------------------|-------|
| `REPLTool` | `USER_TYPE === 'ant'` at `require` (`tools.ts:16-19`) | REMOVED | _not present_ — only a `tool_name: "REPL"` literal at `:277255` survives as a string in an unrelated stream-event renderer | DCE dropped the entire module. The `REPL_TOOL_NAME` constant is referenced only in the surviving stream-event log. |
| `SuggestBackgroundPRTool` | `USER_TYPE === 'ant'` at `require` (`tools.ts:20-23`) | REMOVED | _not present_ | Top-level conditional `require` ⇒ DCE-eliminated. |
| `ConfigTool` | `USER_TYPE === 'ant'` at array spread (`tools.ts:81,214`) | REMOVED | _not present_ | Import was unconditional but Bun followed the spread guard and dropped the import too. |
| `TungstenTool` | `USER_TYPE === 'ant'` at array spread (`tools.ts:60,215`) | REMOVED | _not present_ | Same shape as `ConfigTool`. |

---

## Slash Commands (from `INTERNAL_ONLY_COMMANDS`)

| Feature | 2.1.88 Gate | 2.1.142 Status | 2.1.142 Entry Point | Notes |
|---------|-------------|----------------|---------------------|-------|
| `backfillSessions` | Listed in `INTERNAL_ONLY_COMMANDS` (`commands.ts:226`) | REMOVED | _not present_ | Not in `slash_commands.json`; no `name: "backfill-sessions"` in binary. |
| `breakCache` | `INTERNAL_ONLY_COMMANDS:227` | REMOVED | _not present_ | |
| `bughunter` | `INTERNAL_ONLY_COMMANDS:228` | REMOVED | _not present_ | |
| `commit` | `INTERNAL_ONLY_COMMANDS:229` | PROMOTED | `name: "commit"` at `cli_inner_pretty.js:430640` | In public `slash_commands.json` as `/commit`. Internal `undercover` attribution still gated behind dead ant branch. |
| `commitPushPr` | `INTERNAL_ONLY_COMMANDS:230` | PROMOTED | `name: "commit-push-pr"` at `cli_inner_pretty.js:431716` | In `slash_commands.json` as `/commit-push-pr`. |
| `ctx_viz` | `INTERNAL_ONLY_COMMANDS:231` | REMOVED | _not present_ | Companion `analyzeContext.ts` ant gates (`:1354-1358`) folded out; the exposed surfaces (`deferredBuiltinDetails`, `systemToolDetails`, `systemPromptSections`) no longer ship to external users. |
| `goodClaude` | `INTERNAL_ONLY_COMMANDS:232` | REMOVED | _not present_ | |
| `issue` | `INTERNAL_ONLY_COMMANDS:233` | PROMOTED | `slash_commands.json` lists `/issue` | Public `/issue` is now a generic GitHub-issue helper, not the ant-only tracker. |
| `initVerifiers` | `INTERNAL_ONLY_COMMANDS:234` | STILL-INTERNAL | `name: "init-verifiers"` at `cli_inner_pretty.js:447630` (definition present, not in `slash_commands.json`) | Body shipped (long prompt at `:447635`+) but command isn't published to the public list — likely gated downstream. |
| `mockLimits` | `INTERNAL_ONLY_COMMANDS:236` | REMOVED | _not present_ | |
| `bridgeKick` | `INTERNAL_ONLY_COMMANDS:237` | STILL-INTERNAL | `name: "bridge-kick"` at `cli_inner_pretty.js:492236` with `isEnabled: () => !1` | Code preserved but always-disabled in the external profile. |
| `version` | `INTERNAL_ONLY_COMMANDS:238` | STILL-INTERNAL | `name: "version"` at `cli_inner_pretty.js:492420,:492429` with `isEnabled: () => !1` | Both interactive and non-interactive variants disabled in public build. |
| `resetLimits` / `resetLimitsNonInteractive` | `INTERNAL_ONLY_COMMANDS:241-242` | REMOVED | _not present_ | |
| `onboarding` | `INTERNAL_ONLY_COMMANDS:243` | REMOVED | _not present_ | |
| `share` | `INTERNAL_ONLY_COMMANDS:244` | REMOVED | _not present_ | |
| `summary` | `INTERNAL_ONLY_COMMANDS:245` | REMOVED | _not present_ | "summary" string survives many times in the bundle but never as a slash command definition. |
| `teleport` | `INTERNAL_ONLY_COMMANDS:246` | PROMOTED | `name: "teleport"` at `cli_inner_pretty.js:480725`, `isEnabled: () => qq() && S4("allow_remote_sessions")` | Listed in `slash_commands.json` as `/teleport`. Promoted with statsig gate `allow_remote_sessions`. |
| `antTrace` | `INTERNAL_ONLY_COMMANDS:247` | REMOVED | _not present_ | |
| `perfIssue` | `INTERNAL_ONLY_COMMANDS:248` | REMOVED | _not present_ | |
| `env` | `INTERNAL_ONLY_COMMANDS:249` | REMOVED | _not present_ | |
| `oauthRefresh` | `INTERNAL_ONLY_COMMANDS:250` | REMOVED | _not present_ | |
| `debugToolCall` | `INTERNAL_ONLY_COMMANDS:251` | REMOVED | _not present_ | |
| `agentsPlatform` | `USER_TYPE === 'ant'` at `require` (`commands.ts:48-51`) and `INTERNAL_ONLY_COMMANDS:252` | PROMOTED | `claude agents` CLI subcommand — entry points include `cli_inner_pretty.js:50527, 431077, 509152, 567194` and supporting infra in `30_agent_team/` | v2.1.139 changelog: "Added agent view (Research Preview): a single list of every Claude Code session — running, blocked on you, or done. Run `claude agents` to get started." Also exposed as `/agents` slash command in `slash_commands.json`. v2.1.140–v2.1.142 hardened with `--cwd`, `--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--permission-mode`, `--model`, `--effort`, `--dangerously-skip-permissions` flags. |
| `autofixPr` | `INTERNAL_ONLY_COMMANDS:253` | STILL-INTERNAL | `name: "autofix-pr"` at `cli_inner_pretty.js:427564` with `isEnabled: () => EK4() && !T6()`, where `EK4` requires `qq() && S4("allow_remote_sessions")` (`:427554`) | Code preserved; predicates require user to opt into remote-sessions statsig. Effectively still off for most users. |
| `feedback` | (was public in 2.1.88 but listed here as cross-check) | PROMOTED | `name: "feedback"` at `:429652`, `isEnabled: () => !0` | Always-enabled in 2.1.142. |
| `ultraplan` | `feature('ULTRAPLAN')` at `require` (`commands.ts:104-106`, `INTERNAL_ONLY_COMMANDS:239`) | PROMOTED | `name: "ultraplan"` at `cli_inner_pretty.js:475816`, `isEnabled: () => sQ()` (a public statsig+config check) | v2.1.101 release added `/ultraplan`. v2.1.113 changelog mentions `"Refine with Ultraplan"`. Statsig gate `tengu_ultraplan_*` controls rollout. Sessions defined at `:475264 o05 = "__ULTRAPLAN_TELEPORT_LOCAL__"`. |
| `ultrareview` | `feature('ULTRAPLAN')`-adjacent; imported from `./commands/review.js` (`commands.ts:40`) | PROMOTED | `name: "ultrareview"` at `cli_inner_pretty.js:476336`, `isEnabled: () => V1H()`. Also `claude ultrareview` CLI subcommand (v2.1.120 changelog) | v2.1.111 added `/ultrareview` (per changelog history); v2.1.113 improved with parallelized checks and diffstat; v2.1.120 added `claude ultrareview [target]` non-interactive CLI subcommand. |
| `subscribePr` | `feature('KAIROS_GITHUB_WEBHOOKS')` (`commands.ts:101-103`, `:240`) | REMOVED | _not present_ | KAIROS profile only. |
| `fast` (slash command) | Public in 2.1.88 (`commands.ts:128`) but `fastMode.ts` had ant branches | PROMOTED | `name: "fast"` at `cli_inner_pretty.js:484227` (local-jsx) and `:484244` (local non-interactive), gated on `_9()` | v2.1.111 era introduced `/fast`. v2.1.142 changelog: "Fast mode now uses Opus 4.7 by default (previously Opus 4.6). Set `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1` to pin fast mode to Opus 4.6". |
| `insights` | Lazy-loaded in `commands.ts:190-202`, body has 11 ant gates | CHANGED | `name: "insights"` at `cli_inner_pretty.js:513697,:514120` (both variants present) | Command itself ships to all users; ant-only report rows / OTel breakdowns inside the body dead-coded out. |

---

## KAIROS / Background Agents (feature-flag commands)

| Feature | 2.1.88 Gate | 2.1.142 Status | 2.1.142 Entry Point | Notes |
|---------|-------------|----------------|---------------------|-------|
| `proactive` | `feature('PROACTIVE') || feature('KAIROS')` | PROMOTED (partial) | KAIROS bundle is shipped — `/dream`, `/loop`, `/schedule`, `/morning-checkin`, `/catch-up` are in `slash_commands.json` | Proactive/loop/dream commands rolled out as the "Assistant" / scheduled-agent surface. |
| `briefCommand` | `feature('KAIROS') || feature('KAIROS_BRIEF')` | PROMOTED | `/brief` likely renamed → `/btw` (in `slash_commands.json`) and `BriefTool` is unconditionally imported in `tools.ts:13` | `BriefTool` ships to all users in v2.1.142. |
| `assistantCommand` | `feature('KAIROS')` | PROMOTED | Assistant flow shipped through `dV4` (`cli_inner_pretty.js:502413`) which creates `catch-up`, `morning-checkin`, `pre-meeting-checkin`, `dream` skill scaffolding under `.claude/skills/` | Tagged in `eh9 = [..., "voice", "assistant", ...]` (`:49976`). |
| `bridge` | `feature('BRIDGE_MODE')` | REMOVED | _not present_ in external build (USER_TYPE-related bridge-debug message survives at `:492133`) | Bridge profile is separate build. |
| `remoteControlServerCommand` | `feature('DAEMON') && feature('BRIDGE_MODE')` | REMOVED | _not present_ | Same as `bridge`. |
| `voiceCommand` | `feature('VOICE_MODE')` | PROMOTED | `name: "voice"` at `:507567` (also in `slash_commands.json` ecosystem via voice subcommands) | VS Code voice dictation is in the public build. |
| `forceSnip` | `feature('HISTORY_SNIP')` | REMOVED | _not present_ | |
| `workflowsCmd` | `feature('WORKFLOW_SCRIPTS')` | REMOVED | _not present_ | |
| `webCmd` | `feature('CCR_REMOTE_SETUP')` | PROMOTED | `name: "web-setup"` at `cli_inner_pretty.js:508124`, gated on `Z$("tengu_cobalt_lantern", !1) && S4("allow_remote_sessions") && S4("allow_quick_web_setup")` | Statsig `tengu_cobalt_lantern` controls rollout. v2.1.142 changelog: `/web-setup` warns before replacing an existing GitHub App connection. |
| `clearSkillIndexCache` | `feature('EXPERIMENTAL_SKILL_SEARCH')` | REMOVED | _not present_ | |
| `torch` | `feature('TORCH')` | REMOVED | _not present_ | |
| `peersCmd` | `feature('UDS_INBOX')` | REMOVED | _not present_ | |
| `forkCmd` | `feature('FORK_SUBAGENT')` | PROMOTED (env-gated) | Fork-subagent enabled via `CLAUDE_CODE_FORK_SUBAGENT=1` env. Source code present at `cli_inner_pretty.js:211737` (`if (bH(process.env.CLAUDE_CODE_FORK_SUBAGENT)) return "env"`); `ilK = "FORK_SUBAGENT_TYPE"` | v2.1.117 changelog: "Forked subagents can now be enabled on external builds by setting `CLAUDE_CODE_FORK_SUBAGENT=1`". v2.1.121: also works in non-interactive sessions. |
| `buddy` | `feature('BUDDY')` | REMOVED | _not present_ | |

---

## Feature-flag-only Tools

| Feature | 2.1.88 Gate | 2.1.142 Status | 2.1.142 Entry Point | Notes |
|---------|-------------|----------------|---------------------|-------|
| `SleepTool` | `feature('PROACTIVE') || feature('KAIROS')` | REMOVED | _not present_ | |
| `CronCreate/Delete/ListTool` | `feature('AGENT_TRIGGERS')` | REMOVED | _not present_ (only `CronList output missing qualifiers` changelog string survives) | v2.1.136 changelog mentions `CronList output missing qualifiers` fix — implies KAIROS rollout had separate cycle. |
| `RemoteTriggerTool` | `feature('AGENT_TRIGGERS_REMOTE')` | REMOVED | _not present_ | |
| `MonitorTool` | `feature('MONITOR_TOOL')` | PROMOTED | `Monitor` deferred tool — `ToolSearch` exposes it in this transcript's deferred-tools list | Used by `/loop` companion infra; promoted to ToolSearch deferred tools. |
| `SendUserFileTool` | `feature('KAIROS')` | REMOVED | _not present_ (only the `"SendUserFile"` string at `:211424` survives) | Module gone; constant referenced by a dead import path. |
| `PushNotificationTool` | `feature('KAIROS') || feature('KAIROS_PUSH_NOTIFICATION')` | REMOVED | _not present_ | |
| `SubscribePRTool` | `feature('KAIROS_GITHUB_WEBHOOKS')` | REMOVED | _not present_ | |
| `OverflowTestTool` | `feature('OVERFLOW_TEST_TOOL')` | REMOVED | _not present_ | |
| `CtxInspectTool` | `feature('CONTEXT_COLLAPSE')` | REMOVED | _not present_ | |
| `TerminalCaptureTool` | `feature('TERMINAL_PANEL')` | REMOVED | _not present_ | |
| `WebBrowserTool` | `feature('WEB_BROWSER_TOOL')` | REMOVED | _not present_ | Distinct from `WebFetchTool`/`WebSearchTool` which ship publicly. |
| `SnipTool` | `feature('HISTORY_SNIP')` | REMOVED | _not present_ | |
| `ListPeersTool` | `feature('UDS_INBOX')` | REMOVED | _not present_ | |
| `WorkflowTool` | `feature('WORKFLOW_SCRIPTS')` | REMOVED | _not present_ | |

---

## Runtime / Mode Helpers

| Feature | 2.1.88 Gate | 2.1.142 Status | 2.1.142 Entry Point | Notes |
|---------|-------------|----------------|---------------------|-------|
| `fastMode` ant branches | `USER_TYPE === 'ant'` (3 sites in `fastMode.ts`; 1 in `worktree.ts`) | STILL-INTERNAL | `fastModeEnabled` literal at `cli_inner_pretty.js:391947` (env-driven via `CLAUDE_CODE_DISABLE_FAST_MODE`). `/fast` slash command itself is PROMOTED (see above). | Ant-only fast-mode UI affordances dead-coded out; the public fast-mode feature is the surviving promoted shape. |
| `penguin` (org-level fast-mode opt-out) | Wired via `userSettings.fastMode` and `tengu_*` Statsig gates | PROMOTED | `penguinModeOrgEnabled` flag in `cli_inner_pretty.js:96886-97076` controls `/api/claude_code_penguin_mode` poll | Org-level opt-out for orgs that don't want fast-mode rolled out to their users. |
| Dev panes (worktree) | `worktree.ts:1398` ant gate | REMOVED | _not present_ as ant-gated branch — corresponding dev-pane UI was reworked into the public worktree mode | v2.1.116 fixed worktree exit dialog; v2.1.128 changed `EnterWorktree` default base. Dev-pane region tweak appears folded into the main worktree UI. |
| Fullscreen ant tweak | `fullscreen.ts:128 return USER_TYPE === 'ant'` | REMOVED | _not present_ | Predicate dead-coded to `false`. |
| `undercover` (commit attribution) | `USER_TYPE === 'ant'` in 4 sites (`undercover.ts`, `attribution.ts:53,300`, `commit.ts:16`) | REMOVED | _not present_ — only public attribution path (`Co-Authored-By: <model> <noreply@anthropic.com>`) survives | DCE removed all four branches. |
| System prompt section visibility | `analyzeContext.ts:1354-1358` ant gate | REMOVED | _not present_ — `deferredBuiltinDetails`/`systemToolDetails`/`systemPromptSections` exposure is now unconditionally suppressed | Companion to `/ctx_viz` removal. |
| Debug logging always-on for ant | `debug.ts:65` `isDebugMode() \|\| USER_TYPE === 'ant'` | STILL-INTERNAL | Public debug mode driven by `--debug` / `CLAUDE_CODE_DEBUG` only; ant always-on disjunct removed | |
| Last API request capture | `log.ts:351` `USER_TYPE === 'ant' ? messages : null` | REMOVED | _not present_ as ant-gated | |
| Repo classification | `setup.ts:337-348` ant gate | REMOVED | _not present_ | Classifier compared against Anthropic's repo list — fully removed. |
| Startup/headless profilers always-on for ant | `startupProfiler.ts:33`, `headlessProfiler.ts:34` | STILL-INTERNAL | Profilers still sample at `STATSIG_SAMPLE_RATE` but the always-on ant disjunct removed | |
| Trust prompt ant branch | `setup.ts:417` | REMOVED | _not present_ | |
| Bridge ant gates (12 sites) | Multiple `USER_TYPE === 'ant'` in `bridge/` | REMOVED | _not present_ — bridge profile is a separate build | Only one diagnostic string survives at `:492133`. |
| IDE ant tweaks | `ide.ts:848,884` | REMOVED | _not present_ as ant gates | |
| Chrome native host ant | `chromeNativeHost.ts:30` | REMOVED | _not present_ as ant gate | `/chrome` slash command itself is public. |
| Permission setup ant gates | `permissionSetup.ts:276,954,1062,1114` | REMOVED | _not present_ as ant gates | |
| Dangerous patterns ant addition | `dangerousPatterns.ts:58` | REMOVED | _not present_ — only the public dangerous-patterns set survives | |
| Beta header `cli-internal-2026-02-09` | `constants/betas.ts:30` (ant-only) | REMOVED | _not present_ in any beta-header construction | |
| `AGENT_TOOL_NAME` disallow tweak | `constants/tools.ts:41` (omits for ant) | REMOVED | _not present_ as ant gate | |
| Bootstrap state ant gate | `bootstrap/state.ts:391` | REMOVED | _not present_ | |
| `Shell.ts:323` ant branch | inline ant gate | REMOVED | _not present_ | |
| `effort.ts` 5 ant branches | `max` effort, ant models | STILL-INTERNAL (max-effort) / PROMOTED (effort levels) | `/effort` slash command at `:497219, :497231` is PROMOTED with `max` level publicly exposed in v2.1.113 changelog ("`/effort auto` confirmation now says 'Effort level set to max'") | `max` effort no longer ant-only. |
| `thinking.ts:95` ant branch | extra thinking budget | REMOVED | _not present_ | |
| `betas.ts` 6 ant branches | beta-header injection | REMOVED | _not present_ | |
| `releaseNotes.ts:292,340` ant | different splash | REMOVED | _not present_ | |
| `autoUpdater.ts:110,122` ant | disable auto-update | REMOVED | Auto-update controls are now `DISABLE_AUTOUPDATER`/`DISABLE_UPDATES` env vars (v2.1.118 changelog) | Promoted to public env vars. |
| `advisor.ts:94,104` ant | advisor tweaks | REMOVED | _not present_ as ant gates; `advisor` itself is a public command (`commands.ts:152`) | |
| `agentSwarmsEnabled.ts:26` ant | enable agent swarms | REMOVED | _not present_ as ant gate; `isAgentSwarmsEnabled()` survives as a public predicate | |
| `planModeV2.ts:52` ant | force-on plan mode v2 | STILL-INTERNAL | Plan mode v2 is the only plan mode in 2.1.142 (12_plan_mode module); the ant force-on is moot | |
| `toolSearch.ts:631` ant | force-on tool search | STILL-INTERNAL | Tool search is gated by `isToolSearchEnabledOptimistic()` and `ENABLE_TOOL_SEARCH` env (v2.1.119 changelog: "Tool search is now disabled by default on Vertex AI") | |
| `logoV2Utils.ts:314` ant | different logo | REMOVED | _not present_ | |
| `bashProvider.ts:222` ant | extra bash env | REMOVED | _not present_ | |
| `shellToolUtils.ts:19` ant | PowerShell detection | REMOVED | `isPowerShellToolEnabled` now public (Windows: PowerShell as primary shell — v2.1.126) | |
| `telemetry/instrumentation.ts:88` ant | ant OTel endpoint | REMOVED | _not present_ | |
| `immediateCommand.ts:12` ant | immediate-execution branch | REMOVED | _not present_ | |
| `createMovedToPluginCommand.ts:44` ant | extra advice | REMOVED | _not present_ | |
| `cli/print.ts:495` ant | extra `--print` output | REMOVED | _not present_ | |
| Insights ant rows (11 sites) | `commands/insights.ts:61,84,103,191,1450,2192,2196,2808,3051,3075,3117` | REMOVED | _not present_ in the public `insights` body (which itself is CHANGED — see Slash Commands table) | |
| `envUtils.ts:120,139` ant | env-var visibility | REMOVED | _not present_ | |
| `mcpInstructionsDelta.ts:41` ant | different MCP delta | REMOVED | _not present_ | |
| `messages.ts:2687` ant | message rendering | REMOVED | _not present_ | |
| `attachments.ts:3384` ant | attachment preview | REMOVED | _not present_ | |
| `context.ts:60,91,156` ant | context tweaks | REMOVED | _not present_ | |
| `tasks.ts:320` ant | task rendering | REMOVED | _not present_ | |
| `warningHandler.ts:102` ant | warning handler | REMOVED | _not present_ | |
| `slowOperations.ts:40` ant | slow-op diagnostics | REMOVED | _not present_ | |
| `backgroundHousekeeping.ts:85` ant | extra housekeeping | REMOVED | _not present_ | |
| `cleanup.ts:599` ant | extra cleanup | REMOVED | _not present_ | |

---

## Bash & Query

| Feature | 2.1.88 Gate | 2.1.142 Status | 2.1.142 Entry Point | Notes |
|---------|-------------|----------------|---------------------|-------|
| `ANT_ONLY_SAFE_ENV_VARS` | `USER_TYPE === 'ant' && ANT_ONLY_SAFE_ENV_VARS.has(...)` at `bashPermissions.ts:447-475, 174, 250, 329, 591` | REMOVED | _not present_ — `grep KUBECONFIG\|COO_CLUSTER\|JAX_PLATFORMS\|EXPECTTEST_ACCEPT` in `cli_inner_pretty.js` returns zero matches | The 25-entry allowlist was top-level-eliminated. External users always see the smaller `SAFE_ENV_VARS` set. |
| `dumpPromptsFetch` | `config.gates.isAnt ? createDumpPromptsFetch(...) : undefined` (`query.ts:588`) | STILL-INTERNAL | `T17` (`createDumpPromptsFetch`) at `cli_inner_pretty.js:247073`. Called from `cli_inner_pretty.js:392327` `let GH = L.gates.isAnt && ... ? T17(...) : void 0`. `L.gates.isAnt` is **hardcoded false** in `buildQueryConfig` at `:391946 isAnt: !1`. The actual dump-body function `$M_` (`:247065-247072`) returns immediately (`try { return; }`). | The infrastructure survives but is double-disabled: (1) `gates.isAnt` is `false`, (2) even if reached, the dump-body is a no-op stub. |
| `gates.isAnt` | `query/config.ts:24,39` | STILL-INTERNAL | `buildQueryConfig` (`uo7`) at `:391940-391950`, `isAnt: !1` literal | Struct field preserved for source-shape compatibility but constant false. |

---

## Constants / System Prompts

| Feature | 2.1.88 Gate | 2.1.142 Status | 2.1.142 Entry Point | Notes |
|---------|-------------|----------------|---------------------|-------|
| `prompts.ts:205, 225, 238, 243` ant sections | 4 ant-only system-prompt sections | REMOVED | _not present_ in the bundled system prompts (see `prompts_index.json`) | |
| `prompts.ts:404, 433` ant sections | 2 more ant-only sections | REMOVED | _not present_ | |
| `constants/keys.ts:6` ant key | ant-specific key path | REMOVED | _not present_ | |
| `betas.ts:30 cli-internal-2026-02-09` | ant-only beta header | REMOVED | _not present_ | |
| `tools.ts:41` (omit AGENT_TOOL_NAME) | ant tweak in disallow list | REMOVED | _not present_ | |
| `COO_CREATOR` env var | `utils/user.ts:155,175` constructs `@anthropic.com` author | REMOVED | _not present_ in `env_vars.json` | The `coo_*` env constants are absent from the public env catalog. |

---

## Counts Summary (cross-check against `00_inventory.md`)

| Category | Total Features | PROMOTED | STILL-INTERNAL | REMOVED | CHANGED |
|----------|---------------:|---------:|---------------:|--------:|--------:|
| Tools (§1) | 4 | 0 | 0 | 4 | 0 |
| Slash Commands — hard ant-only (§2.1) | 24 | 6 | 3 | 15 | 0 |
| Slash Commands — feature-flag (§2.2) | 8 | 4 | 0 | 4 | 1 (insights) |
| KAIROS / Background Agents | 14 | 4 | 0 | 10 | 0 |
| Feature-flag tools (§1 secondary) | 14 | 1 (Monitor) | 0 | 13 | 0 |
| Runtime helpers (§3) | 30+ | 4 (autoUpdater→env vars, agentSwarms, shellTool, advisor) | 5 (fastMode, debug, profilers, planModeV2, toolSearch, effort-max) | 21+ | 0 |
| Bash & Query (§4–5) | 3 | 0 | 2 (dumpPromptsFetch + gates.isAnt) | 1 (ANT_ONLY_SAFE_ENV_VARS) | 0 |
| Constants / Prompts (§6) | 6+ | 0 | 0 | 6+ | 0 |
| **Total rows** | **103+** | **19** | **10** | **74+** | **1** |

The total is approximate because several "runtime helper" rows in §3 correspond to families of single-line gates that collapse to one row each in `00_inventory.md` §3.8/§3.9.

---

## Verification Notes

### Verified PROMOTED entry points (smoke-grep against `cli_inner_pretty.js`)

```
grep -nE 'name: ?"ultraplan"|name: ?"ultrareview"|name: ?"agents"' cli_inner_pretty.js
  475816:    name: "ultraplan",
  476336:      name: "ultrareview",
  491386:    name: "agents",

grep -nE 'name: ?"fast"|name: ?"commit"|name: ?"teleport"' cli_inner_pretty.js
  484227:    name: "fast",
  484244:      name: "fast",
  430640:    name: "commit",
  480725:    name: "teleport",

grep -nE 'claude agents' cli_inner_pretty.js | head -3
  50527: "Disable agent view (`claude agents`, ...)
  431077: "Run `claude agents` to see your background sessions"
  509152: if (H[0] === "agents") return "claude agents";
```

All listed PROMOTED entries above have at least one verifiable grep hit in the 2.1.142 binary.

### Verified STILL-INTERNAL entry points

```
grep -A 1 'name: "version"\|name: "bridge-kick"\|name: "init-verifiers"' cli_inner_pretty.js
  492420:    name: "version",
  492421:    description: "Print the version this session is running ..."
  --
  492236:    name: "bridge-kick",
  492237:    description: "Inject bridge failure states for manual recovery testing",
  --
  447630:    name: "init-verifiers",
  447631:    description: "Create verifier skill(s) ..."
```

`/version` and `/bridge-kick` both have `isEnabled: () => !1`. `/init-verifiers` is `type: "prompt"` without isEnabled but does not appear in `slash_commands.json`'s public list of 117 commands.

### Verified REMOVED entry points

`grep -cE 'TungstenTool|ConfigTool\b|SuggestBackgroundPRTool' cli_inner_pretty.js → 0` — no references remain.

`grep -E 'KUBECONFIG|COO_CLUSTER|JAX_PLATFORMS|EXPECTTEST_ACCEPT' cli_inner_pretty.js → 0` — `ANT_ONLY_SAFE_ENV_VARS` entries fully eliminated.

### Cross-reference with `by_version/` (changelog support)

- `/ultraplan` — v2.1.101 (before this analyse window's start at v2.1.113); v2.1.113 changelog mentions it.
- `/ultrareview` — v2.1.111 added; v2.1.113 improved with parallelized checks; v2.1.120 added `claude ultrareview` CLI subcommand.
- `/fast` — v2.1.111 era promoted; v2.1.142 default changed to Opus 4.7.
- `claude agents` — v2.1.139 added agent view as Research Preview; v2.1.140–v2.1.142 hardening commits.

All PROMOTED entries above have at least one supporting changelog bullet in `claude_code_v_2.1.142/CHANGELOG.md`.

---

## Open Questions for Unit C2 / C3

1. **Why does `init-verifiers` still ship as a prompt-type command but not appear in `slash_commands.json`?** Likely a downstream filter (verifier-skills gated on Verify agent rollout). Worth tracing in unit C3.
2. **Why does the `T17 createDumpPromptsFetch` infrastructure survive when `isAnt` is always false?** Bun's DCE doesn't always trace through obfuscated indirection — the `gates.isAnt` field-read crosses a struct boundary. The cost of leaving it in is one no-op `T17` function plus the `OK8` Map (likely <1 KB of dead bundle). Future builds could collapse this.
3. **What ant-only Statsig gates (`tengu_*`) does v2.1.142 still consult?** `tengu_ultraplan_config`, `tengu_kairos_*` series, `tengu_amber_*` series, `tengu_cobalt_lantern` (web-setup) — all visible in `feature_gates.json` and reachable from the binary. Catalog them in unit C3.
