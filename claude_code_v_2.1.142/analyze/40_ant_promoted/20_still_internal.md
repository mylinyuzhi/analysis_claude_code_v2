# Still-Internal Features (v2.1.142)

> Survey of Anthropic-internal (USER_TYPE=ant or `feature()` build flag) features in 2.1.88 that are STILL gated out of the public 2.1.142 bundle.
>
> **Method**: grep `cli_inner_pretty.js` for the readable name, the obfuscated import path, and known guard tokens. A feature is classified "still-internal" if it (a) appears only as a stub `{ isEnabled: () => !1, isHidden: !0, name: "stub" }`, (b) appears only inside a string literal (error message, dead help text, prompt path), or (c) does not appear at all.

## Background: The Master Gate

In 2.1.88, the master "is this an internal Anthropic user" gate is `process.env.USER_TYPE === 'ant'`, used both at build time (eliminate imports) and at runtime (filter `INTERNAL_ONLY_COMMANDS`, hide ant-only tools). The public 2.1.142 bundle bakes this in at compile time:

```javascript
// ============================================
// getAgentGates - Default gates for query engine
// Location: cli_inner_pretty.js:391940-391950
// ============================================

// ORIGINAL (for source lookup):
function uo7() {
  return {
    sessionId: v$(),
    gates: {
      streamingToolExecution: Z$("tengu_streaming_tool_execution2", !1),
      emitToolUseSummaries: bH(process.env.CLAUDE_CODE_EMIT_TOOL_USE_SUMMARIES),
      isAnt: !1,
      fastModeEnabled: !bH(process.env.CLAUDE_CODE_DISABLE_FAST_MODE),
    },
  };
}

// READABLE (for understanding):
function getDefaultGates() {
  return {
    sessionId: getSessionId(),
    gates: {
      streamingToolExecution: getStatsigGate("tengu_streaming_tool_execution2", false),
      emitToolUseSummaries: parseBool(process.env.CLAUDE_CODE_EMIT_TOOL_USE_SUMMARIES),
      isAnt: false,  // HARDCODED FALSE in public build
      fastModeEnabled: !parseBool(process.env.CLAUDE_CODE_DISABLE_FAST_MODE),
    },
  };
}

// Mapping: uo7→getDefaultGates, v$→getSessionId, Z$→getStatsigGate, bH→parseBool
```

`isAnt: false` is hardcoded in the public bundle. Any feature that reads `gates.isAnt` at runtime in 2.1.88 is dead code in 2.1.142, and any module gated only by `USER_TYPE === 'ant'` at build time was tree-shaken out.

## INTERNAL_ONLY_COMMANDS (commands.ts:225-254)

The 2.1.88 list of commands that get eliminated from the external build, ordered by category:

### Dev/PR workflow (ant-only)

### backfillSessions

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[0]` at `commands.ts:226` (filtered by `USER_TYPE === 'ant' && !IS_DEMO` at line 343-344)
**2.1.142 gate**: ABSENT — no `backfill-sessions` or `backfillSessions` string in `cli_inner_pretty.js` (`grep -c` returns 0)
**Purpose**: Internal Anthropic command to backfill session metadata
**Status change**: Tree-shaken out (no public references)

### breakCache

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[1]` at `commands.ts:227`
**2.1.142 gate**: ABSENT — no `break-cache` string
**Purpose**: Force prompt-cache invalidation for debugging cache performance
**Status change**: Tree-shaken out

### bughunter

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[2]` at `commands.ts:228`; import at `commands.ts:54` (`./commands/bughunter/index.js`)
**2.1.142 gate**: PARTIALLY PRESENT — only the Statsig gate fetcher `tengu_review_bughunter_config` survives at `cli_inner_pretty.js:474743` (used to fetch cost/duration/model display strings for `/ultrareview`); the slash command itself is gone
**Purpose**: Internal Anthropic command running multi-agent bug-hunting reviews against PRs
**Status change**: Slash command tree-shaken; the shared config gate (cost/duration shown in `/ultrareview` UI) is kept because `/ultrareview` IS in the public build

```javascript
// ============================================
// getBughunterConfig - Returns server-side config for bughunter/ultrareview UI display
// Location: cli_inner_pretty.js:474742-474744
// ============================================

// ORIGINAL (for source lookup):
function JaH() {
  return Z$("tengu_review_bughunter_config", null);
}

// READABLE (for understanding):
function getBughunterConfig() {
  return getStatsigGate("tengu_review_bughunter_config", null);
}

// Mapping: JaH→getBughunterConfig, Z$→getStatsigGate
```

### commit

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[3]` at `commands.ts:229`
**2.1.142 gate**: PROMOTED — `name: "commit"` at `cli_inner_pretty.js:430640` as type `"prompt"` with no `USER_TYPE`/`isAnt` gate
**Status change**: This entry was listed as internal-only in 2.1.88 but the 2.1.142 bundle exposes it publicly. NOTE: Belongs in C2's PROMOTED deep-dive, not here. Listed for completeness so it isn't misclassified.

### commitPushPr

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[4]` at `commands.ts:230`
**2.1.142 gate**: PROMOTED — `name: "commit-push-pr"` at `cli_inner_pretty.js:431716` with no gate
**Status change**: Same as `commit` — moved out of `INTERNAL_ONLY_COMMANDS`. Defer to C2's PROMOTED file.

### ctx_viz

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[5]` at `commands.ts:231`; import at `commands.ts:20`
**2.1.142 gate**: ABSENT — no `ctx_viz` or `ctx-viz` string
**Purpose**: Internal command to visualize the current context window contents
**Status change**: Tree-shaken out

### goodClaude

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[6]` at `commands.ts:232`; import at `commands.ts:6`
**2.1.142 gate**: ABSENT — no `good-claude` or `goodClaude` string
**Purpose**: Internal "rate this response as good" feedback command
**Status change**: Tree-shaken out

### issue

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[7]` at `commands.ts:233`; import at `commands.ts:7`
**2.1.142 gate**: ABSENT as a command — `/issue` appears only inside `/init-verifiers` prompt text at `cli_inner_pretty.js:588080` and as part of github-issues URLs
**Purpose**: Internal `/issue` slash command that filed GitHub issues against the `claude-cli-internal` repo
**Status change**: Tree-shaken out

### initVerifiers

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[8]` at `commands.ts:234`; import at `commands.ts:26`
**2.1.142 gate**: PROMOTED — `name: "init-verifiers"` at `cli_inner_pretty.js:447630` as a builtin `prompt` command, fully ungated
**Status change**: Moved out of `INTERNAL_ONLY_COMMANDS`. Defer to C2's PROMOTED file.

### forceSnip (HISTORY_SNIP feature flag)

**2.1.88 gate**: `feature('HISTORY_SNIP') ? require(...) : null` at `commands.ts:83-85`
**2.1.142 gate**: ABSENT — no `force-snip`, no `HISTORY_SNIP`, no `SnipTool` references in `cli_inner_pretty.js`
**Purpose**: Manual history-snipping command paired with the experimental SnipTool
**Status change**: Build-flag tree-shaken; feature not enabled in public build

### mockLimits

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[10]` at `commands.ts:236`; import at `commands.ts:139`
**2.1.142 gate**: ABSENT — no `mock-limits` or `mockLimits` string
**Purpose**: Test command to simulate hitting rate limits without actually exhausting quota
**Status change**: Tree-shaken out

### bridgeKick

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[11]` at `commands.ts:237`; import at `commands.ts:140`
**2.1.142 gate**: PRESENT — `name: "bridge-kick"` at `cli_inner_pretty.js:492236` (this is part of Remote Control bridge which has been publicly enabled)
**Status change**: PROMOTED. Defer to C2 if covered there.

### version

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[12]` at `commands.ts:238`; import at `commands.ts:141`
**2.1.142 gate**: STILL-INTERNAL via dual-stub pattern — defined at `cli_inner_pretty.js:492418-492437` as two variants (`local-jsx` and `local`) both with `isEnabled: () => !1`. The `local` variant additionally has `isHidden` gated on `T6()` — confirmed at `cli_inner_pretty.js:2677` as `isNonInteractive` (returns `!U$.isInteractive`), NOT an ant probe (see [02_gate_mechanism.md](02_gate_mechanism.md) for the corrected mapping). Both stubs are unreachable from `getCommands()` regardless. The handler functions `IN5`/`RN5` are present but unreachable.
**Purpose**: Print the exact version of the running session (distinct from the autoupdated version)
**Status change**: Command shell remains but is permanently disabled — likely retained to avoid breaking the symbol export graph

```javascript
// ============================================
// versionCommand - Print the version this session is running
// Location: cli_inner_pretty.js:492418-492437
// ============================================

// ORIGINAL (for source lookup):
((SN5 = {
  type: "local-jsx",
  name: "version",
  description: "Print the version this session is running (not what autoupdate downloaded)",
  isEnabled: () => !1,
  immediate: !0,
  requires: { ink: !0 },
  load: () => Promise.resolve({ call: IN5 }),
}),
  (Fp6 = {
    type: "local",
    name: "version",
    description: "Print the version this session is running (not what autoupdate downloaded)",
    isEnabled: () => !1,
    get isHidden() {
      return !T6();
    },
    supportsNonInteractive: !0,
    load: () => Promise.resolve({ call: RN5 }),
  }),
  (gp6 = SN5));

// READABLE (for understanding):
const versionCommandJsx = {
  type: "local-jsx",
  name: "version",
  description: "Print the version this session is running (not what autoupdate downloaded)",
  isEnabled: () => false,
  immediate: true,
  requires: { ink: true },
  load: () => Promise.resolve({ call: renderVersionJsx }),
};

const versionCommandText = {
  type: "local",
  name: "version",
  description: "Print the version this session is running (not what autoupdate downloaded)",
  isEnabled: () => false,
  get isHidden() {
    return !isNonInteractive();  // T6 — returns !U$.isInteractive (cli_inner_pretty.js:2677), NOT an ant probe
  },
  supportsNonInteractive: true,
  load: () => Promise.resolve({ call: printVersionText }),
};

// Mapping: SN5→versionCommandJsx, Fp6→versionCommandText, IN5→renderVersionJsx, RN5→printVersionText, T6→isNonInteractive
```

### ultraplan (ULTRAPLAN feature)

**2.1.88 gate**: `feature('ULTRAPLAN') ? require(...) : null` at `commands.ts:104-106`
**2.1.142 gate**: STILL-INTERNAL — no `/ultraplan` command, but the literal `"ultraplan"` survives in (a) the daemon `set_permission_mode` request shape at `cli_inner_pretty.js:335084` and (b) the allowed-mode list `UU_ = ["remote-agent", "ultraplan", "ultrareview", "autofix-pr", "background-pr"]` at line 335940, plus `__ULTRAPLAN_TELEPORT_LOCAL__` sentinel strings inside `/ultrareview` and `ExitPlanMode` prompts
**Purpose**: Multi-step planning workflow that "teleports" plans between remote agent → local terminal
**Status change**: Build-flag tree-shaken. Protocol-level mode name is preserved for remote-control compatibility (mobile clients can still send `mode: "ultraplan"` over the bridge), but the local executor is gone

### subscribePr (KAIROS_GITHUB_WEBHOOKS feature)

**2.1.88 gate**: `feature('KAIROS_GITHUB_WEBHOOKS') ? require(...) : null` at `commands.ts:101-103`
**2.1.142 gate**: STILL-INTERNAL — only an error string survives at `cli_inner_pretty.js:427278`: `"Couldn't subscribe this session to PR webhooks — falling back to a 30-minute poll. Check the debug log for [bridge] subscribe-pr."`
**Purpose**: Subscribe a session to GitHub PR webhook events so the agent gets notified about review state changes
**Status change**: Build-flag tree-shaken. Error string is dead text inside the bridge poll fallback (the poll fallback IS public; the subscribe-pr command that would prevent the fallback is not)

### onboarding

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[18]` at `commands.ts:243`
**2.1.142 gate**: ABSENT as a slash command — no `name: "onboarding"` definition found
**Purpose**: Trigger the onboarding flow on demand
**Status change**: Tree-shaken out; the onboarding flow itself runs automatically on first-launch and does not need a manual trigger in the public build

### share

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[19]` at `commands.ts:244`
**2.1.142 gate**: ABSENT as a slash command — no `name: "share"` definition found
**Purpose**: Share the current session / transcript externally
**Status change**: Tree-shaken out

### summary

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[20]` at `commands.ts:245`
**2.1.142 gate**: ABSENT as a slash command — although `summary` appears in `BRIDGE_SAFE_COMMANDS` at `commands.ts:657`, the command itself isn't defined in the public bundle
**Purpose**: Generate a manual summary of the current conversation
**Status change**: Tree-shaken out (and dead-coded from `BRIDGE_SAFE_COMMANDS` filter)

### teleport

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[21]` at `commands.ts:246`
**2.1.142 gate**: PROMOTED — `name: "teleport"` at `cli_inner_pretty.js:480725` and visible in slash typeahead at `cli_inner_pretty.js:465448`
**Status change**: Moved out of `INTERNAL_ONLY_COMMANDS`. Defer to C2 if covered there.

### antTrace

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[22]` at `commands.ts:247`; import at `commands.ts:147`
**2.1.142 gate**: ABSENT — no `ant-trace`, `antTrace`, or `ant_trace` string
**Purpose**: Internal performance-tracing command (presumably tied to Perfetto)
**Status change**: Tree-shaken out

### perfIssue

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[23]` at `commands.ts:248`; import at `commands.ts:148`
**2.1.142 gate**: ABSENT — no `perf-issue` or `perfIssue` string
**Purpose**: File a performance-issue report to internal triage
**Status change**: Tree-shaken out

### env

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[24]` at `commands.ts:249`; import at `commands.ts:172`
**2.1.142 gate**: ABSENT as a slash command (the literal `"env"` appears 17 times but always in unrelated contexts — env-var management, JSON keys, etc.)
**Purpose**: Dump the current `process.env` snapshot for debugging
**Status change**: Tree-shaken out

### oauthRefresh

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[25]` at `commands.ts:250`; import at `commands.ts:203`
**2.1.142 gate**: ABSENT as a slash command — only `oauthRefreshLockOptions: () => q86` at `cli_inner_pretty.js:129051` (an unrelated lock-config export from the auth module)
**Purpose**: Manually force an OAuth token refresh for debugging stuck sessions
**Status change**: Tree-shaken out

### debugToolCall

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[26]` at `commands.ts:251`; import at `commands.ts:204`
**2.1.142 gate**: ABSENT — no `debug-tool-call` or `debugToolCall` string
**Purpose**: Replay/inspect a captured tool-call for debugging tool-execution issues
**Status change**: Tree-shaken out

### agentsPlatform

**2.1.88 gate**: `process.env.USER_TYPE === 'ant' ? require(...) : null` at `commands.ts:48-52`
**2.1.142 gate**: ABSENT — no `agentsPlatform` or `agents-platform` string
**Purpose**: Internal Anthropic "agents platform" management surface
**Status change**: Tree-shaken out

### autofixPr

**2.1.88 gate**: `INTERNAL_ONLY_COMMANDS[28]` at `commands.ts:253`; import at `commands.ts:3`
**2.1.142 gate**: PROMOTED-BUT-SCOPED — `name: "autofix-pr"` at `cli_inner_pretty.js:427564` with `isEnabled: () => EK4() && !T6()`. `EK4()` returns `qq() && S4("allow_remote_sessions")`, and `qq()` checks the OAuth token has the `"user:inference"` scope (`op` constant at line 40247)
**Status change**: Moved out of `INTERNAL_ONLY_COMMANDS` but still gated on user having the `user:inference` OAuth scope + remote-sessions config. This is no longer "ant-only" but it's also not universally enabled. Defer to C2 if covered there.

## Build-Time Feature Flags

### Feature flags that compile-eliminated entirely in 2.1.142

The following 2.1.88 features used `feature('FLAG_NAME')` to gate imports. They are tree-shaken in the public build (no references in `cli_inner_pretty.js` to either the feature name or the imported symbols):

### KAIROS / KAIROS_BRIEF / KAIROS_PUSH_NOTIFICATION

**2.1.88 gate**: `feature('KAIROS')`, `feature('KAIROS') || feature('KAIROS_BRIEF')`, `feature('KAIROS') || feature('KAIROS_PUSH_NOTIFICATION')` at `commands.ts:67-72`, `tools.ts:42-49`
**2.1.142 gate**: Only one passing reference to `KAIROS` — a `/dream` skill comment string at `cli_inner_pretty.js:588276` mentioning "kill-switch or KAIROS activation". No KAIROS-conditional code paths, no `proactive`, `brief`, `assistant`, `SendUserFileTool`, or `PushNotificationTool` references
**Purpose**: KAIROS was the umbrella for proactive notifications, scheduled prompts, push notifications, and a personal-assistant mode
**Status change**: Build-flag tree-shaken in public bundle. The string survives only as documentation inside an ant-authored skill

### KAIROS_GITHUB_WEBHOOKS (SubscribePRTool)

**2.1.88 gate**: `feature('KAIROS_GITHUB_WEBHOOKS')` at `tools.ts:50-52`
**2.1.142 gate**: ABSENT — no `SubscribePR` or `subscribePr` tool, only the fallback error string described above
**Status change**: Build-flag tree-shaken

### BRIDGE_MODE / DAEMON

**2.1.88 gate**: `feature('BRIDGE_MODE')` at `commands.ts:73-75`, `feature('DAEMON') && feature('BRIDGE_MODE')` at lines 76-79
**2.1.142 gate**: PARTIALLY PROMOTED — the Remote Control bridge code IS in the public bundle (search `tengu_bridge_*` returns 30+ telemetry events), but no `BRIDGE_MODE` feature-gate string survives. Bridge is now enabled at runtime via OAuth scope + config.
**Status change**: Feature flag eliminated; the bridge runtime is now publicly available behind OAuth scope. Defer to C2 for the deep-dive

### VOICE_MODE

**2.1.88 gate**: `feature('VOICE_MODE')` at `commands.ts:80-82`
**2.1.142 gate**: PARTIALLY PROMOTED — voice command + dictation IS available publicly (`description: "Toggle voice mode"` at line 507568, dictation help text at line 507363). Build-flag string `VOICE_MODE` not present
**Status change**: Promoted to public. Defer to C2

### HISTORY_SNIP

**2.1.88 gate**: `feature('HISTORY_SNIP')` at `commands.ts:83-85`, `tools.ts:123-125`
**2.1.142 gate**: ABSENT — no `HISTORY_SNIP`, no `forceSnip`, no `SnipTool`
**Purpose**: Experimental history compaction at the message-tail level (separate from `/compact`)
**Status change**: Build-flag tree-shaken

### WORKFLOW_SCRIPTS

**2.1.88 gate**: `feature('WORKFLOW_SCRIPTS')` at `commands.ts:86-90`, `tools.ts:129-134`, also imports `createWorkflowCommand.js` at lines 401-406
**2.1.142 gate**: ABSENT — no `WORKFLOW_SCRIPTS`, no `WorkflowTool`, no `createWorkflowCommand`
**Purpose**: Bundled workflow scripts (multi-step automation templates)
**Status change**: Build-flag tree-shaken

### EXPERIMENTAL_SKILL_SEARCH

**2.1.88 gate**: `feature('EXPERIMENTAL_SKILL_SEARCH')` at `commands.ts:96-100`
**2.1.142 gate**: ABSENT — no `EXPERIMENTAL_SKILL_SEARCH`, no `clearSkillIndexCache` related to local skill search
**Purpose**: Local index-based skill search (alternative to the LLM-driven SkillTool)
**Status change**: Build-flag tree-shaken

### TORCH

**2.1.88 gate**: `feature('TORCH')` at `commands.ts:107`
**2.1.142 gate**: ABSENT — no `TORCH`, no `torch` command
**Status change**: Build-flag tree-shaken

### UDS_INBOX (peers/ListPeers)

**2.1.88 gate**: `feature('UDS_INBOX')` at `commands.ts:108-112`, `tools.ts:126-128`
**2.1.142 gate**: ABSENT — no `UDS_INBOX`, no `peers` command, no `ListPeersTool`
**Purpose**: Unix-domain-socket inbox for cross-process agent peer messaging
**Status change**: Build-flag tree-shaken

### FORK_SUBAGENT

**2.1.88 gate**: `feature('FORK_SUBAGENT')` at `commands.ts:113-117`
**2.1.142 gate**: PARTIALLY PROMOTED — env-var `CLAUDE_CODE_FORK_SUBAGENT` at `cli_inner_pretty.js:211735` and `344848`, `FORK_SUBAGENT_TYPE` export at line 211730. The fork command itself is gated via env var, not feature flag
**Status change**: Feature flag eliminated; mechanism now env-var gated and publicly available

### BUDDY

**2.1.88 gate**: `feature('BUDDY')` at `commands.ts:118-122`
**2.1.142 gate**: ABSENT — no `BUDDY`, no `buddy` command
**Status change**: Build-flag tree-shaken

### ULTRAPLAN

Covered above under `INTERNAL_ONLY_COMMANDS` discussion.

### MCP_SKILLS

**2.1.88 gate**: `feature('MCP_SKILLS')` at `commands.ts:550-558` (filter inside `getMcpSkillCommands`)
**2.1.142 gate**: ABSENT — no `MCP_SKILLS` string
**Purpose**: Expose MCP server-provided commands as model-invocable skills
**Status change**: Build-flag tree-shaken (the wrapper function may still exist but the filter is unreachable)

### COMMIT_ATTRIBUTION

**2.1.88 gate**: `feature('COMMIT_ATTRIBUTION')` at `setup.ts:350-361`
**2.1.142 gate**: ABSENT — no `COMMIT_ATTRIBUTION`, no `attributionHooks`, no `registerAttributionHooks`
**Purpose**: Internal commit-attribution hook tracking (so Anthropic could measure how much of internal eng commits were AI-written)
**Status change**: Build-flag tree-shaken

### TEAMMEM

**2.1.88 gate**: `feature('TEAMMEM')` at `setup.ts:365-369`
**2.1.142 gate**: ABSENT — no `TEAMMEM`, no `teamMemorySync`, no `startTeamMemoryWatcher`
**Purpose**: Watch and synchronize team-shared CLAUDE.md memory updates from a central source
**Status change**: Build-flag tree-shaken

### COORDINATOR_MODE

**2.1.88 gate**: `feature('COORDINATOR_MODE')` at `tools.ts:120-122, 280-296`
**2.1.142 gate**: ABSENT — no `COORDINATOR_MODE`, no `coordinatorMode.js` references
**Purpose**: Hierarchical agent setup where a coordinator delegates to worker subagents (extension of Task)
**Status change**: Build-flag tree-shaken

### MONITOR_TOOL

**2.1.88 gate**: `feature('MONITOR_TOOL')` at `tools.ts:39-41`
**2.1.142 gate**: ABSENT — no `MonitorTool`, no `MONITOR_TOOL`
**Status change**: Build-flag tree-shaken (Note: a `Monitor` skill/tool name appears in PROMOTED inventory; this was a different feature gate)

### OVERFLOW_TEST_TOOL

**2.1.88 gate**: `feature('OVERFLOW_TEST_TOOL')` at `tools.ts:107-109`
**2.1.142 gate**: ABSENT — no `OverflowTestTool`, no `OVERFLOW_TEST_TOOL`
**Status change**: Build-flag tree-shaken (internal test tool)

### CONTEXT_COLLAPSE (CtxInspectTool)

**2.1.88 gate**: `feature('CONTEXT_COLLAPSE')` at `tools.ts:110-112`
**2.1.142 gate**: ABSENT — no `CtxInspectTool`, no `CONTEXT_COLLAPSE`
**Status change**: Build-flag tree-shaken

### TERMINAL_PANEL (TerminalCaptureTool)

**2.1.88 gate**: `feature('TERMINAL_PANEL')` at `tools.ts:113-116`
**2.1.142 gate**: ABSENT — no `TerminalCaptureTool`, no `TERMINAL_PANEL`
**Status change**: Build-flag tree-shaken

### WEB_BROWSER_TOOL

**2.1.88 gate**: `feature('WEB_BROWSER_TOOL')` at `tools.ts:117-119`
**2.1.142 gate**: ABSENT — no `WebBrowserTool`, no `WEB_BROWSER_TOOL`
**Status change**: Build-flag tree-shaken (separate from the Chrome MCP integration which IS public)

### CCR_REMOTE_SETUP

**2.1.88 gate**: `feature('CCR_REMOTE_SETUP')` at `commands.ts:91-95`
**2.1.142 gate**: ABSENT as a build-flag, but related `tengu_ccr_*` telemetry events (bundle, session_link, bridge) ARE present. The setup command UI is the part that was tree-shaken
**Status change**: Build-flag tree-shaken; runtime CCR connection machinery is still public

### USER_TYPE=ant-only tools

#### REPLTool

**2.1.88 gate**: `process.env.USER_TYPE === 'ant' ? require(...) : null` at `tools.ts:16-19`, double-gated in `getAllBaseTools` at line 232 with `process.env.USER_TYPE === 'ant' && REPLTool`
**2.1.142 gate**: PARTIALLY PRESENT but unreachable — `m3 = "REPL"` constant at `cli_inner_pretty.js:141589`, REPL gating function `WL()` at line 141581-141588 checks `CLAUDE_CODE_REPL` env var + Statsig gate `tengu_slate_harbor`. The tool registration as `name: "REPL"` is NOT in the public tool list (`assets/tools/_index.json` does list `"REPL"` but no full implementation is bundled)
**Purpose**: In-process JavaScript REPL for the model to run experimental code without spawning a shell
**Status change**: Build-flag eliminates the tool class import. The string `"REPL"` survives in:
  - The tools index assets (descriptive only)
  - The `WL()` gating function (which now controls whether REPL UI mode is shown, separate from the tool)
  - Telemetry event names

```javascript
// ============================================
// isReplModeEnabled - Slate Harbor REPL mode gate
// Location: cli_inner_pretty.js:141581-141588
// ============================================

// ORIGINAL (for source lookup):
function WL() {
  if (!sU()) return !1;
  if (E4(process.env.CLAUDE_CODE_REPL)) return !1;
  if (bH(process.env.CLAUDE_CODE_REPL)) return !0;
  let H = process.env.CLAUDE_CODE_ENTRYPOINT;
  if (H === "cli" || H === "remote") return Z$("tengu_slate_harbor", !1);
  return !1;
}

// READABLE (for understanding):
function isReplModeEnabled() {
  if (!isInteractiveSession()) return false;
  if (isExplicitlyFalsy(process.env.CLAUDE_CODE_REPL)) return false;
  if (parseBool(process.env.CLAUDE_CODE_REPL)) return true;
  const entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
  if (entrypoint === "cli" || entrypoint === "remote") {
    return getStatsigGate("tengu_slate_harbor", false);
  }
  return false;
}

// Mapping: WL→isReplModeEnabled, sU→isInteractiveSession, E4→isExplicitlyFalsy, bH→parseBool, Z$→getStatsigGate
```

#### SuggestBackgroundPRTool

**2.1.88 gate**: `process.env.USER_TYPE === 'ant' ? require(...) : null` at `tools.ts:20-24`
**2.1.142 gate**: ABSENT — no `SuggestBackgroundPR` or `suggestBackgroundPr` string
**Purpose**: Tool that the model could call to suggest the user open a background PR for a finished task
**Status change**: Build-flag tree-shaken

#### ConfigTool

**2.1.88 gate**: `process.env.USER_TYPE === 'ant'` filter in `getAllBaseTools` at `tools.ts:214`
**2.1.142 gate**: ABSENT — no `"ConfigTool"` string anywhere (search-engine-style strings like `"config"` exist but no tool registration)
**Purpose**: Model-invocable tool to read/write the Claude Code config
**Status change**: Build-flag tree-shaken — the model cannot directly mutate user config in the public build

#### TungstenTool

**2.1.88 gate**: `process.env.USER_TYPE === 'ant'` filter in `getAllBaseTools` at `tools.ts:215`; import at `tools.ts:60`
**2.1.142 gate**: ABSENT — no `TungstenTool`, no `tungsten` string
**Purpose**: Anthropic-internal "Tungsten" research/eval integration (probably tied to internal model experiments)
**Status change**: Build-flag tree-shaken

## ANT_ONLY_SAFE_ENV_VARS (bashPermissions.ts:447-475)

**2.1.88 gate**: `process.env.USER_TYPE === 'ant' && ANT_ONLY_SAFE_ENV_VARS.has(varName)` — used at `bashPermissions.ts:174, 250, 329, 591`
**2.1.142 gate**: ABSENT — neither the `ANT_ONLY_SAFE_ENV_VARS` set nor its contents (`KUBECONFIG`, `DOCKER_HOST`, `AWS_PROFILE`, `CLOUDSDK_CORE_PROJECT`, `COO_CLUSTER`, `COO_NAMESPACE`, `COO_LAUNCH_YAML_DRY_RUN`, etc.) appear anywhere in `cli_inner_pretty.js`
**Purpose**: Extra env-var allowlist that permits the BashTool to STRIP leading `KEY=value` assignments before applying permission rules — necessary for ant power users running `KUBECONFIG=... kubectl ...` or `DOCKER_HOST=... docker ...` without each variant needing a new permission rule
**Status change**: Tree-shaken entirely. The public `SAFE_ENV_VARS` set at `cli_inner_pretty.js:421198-421238` (defined right next to the elevation-blocking commands list) HAS been EXPANDED with three vars that used to be ant-only — `CI`, `COLUMNS`, `LINES` — plus added `CLICOLOR`, `CLICOLOR_FORCE`, `DEBIAN_FRONTEND`, `GIT_TERMINAL_PROMPT`. The remaining ANT_ONLY_SAFE_ENV_VARS entries (cluster/cloud identifiers) remain ant-only and are dead-code-eliminated for external users

## dumpPrompts (query.ts:588)

**2.1.88 gate**: `config.gates.isAnt ? createDumpPromptsFetch(...) : undefined` at `query.ts:588`. Used in multiple places (`AgentTool.tsx:13`, `processSlashCommand.tsx:13`, `runAgent.ts:17`, etc.)
**2.1.142 gate**: ABSENT — no `createDumpPromptsFetch`, `getDumpPromptsPath`, `clearDumpState`, or `DumpPrompts` symbol. Since `gates.isAnt` is hardcoded `false` (see top of document), the `dumpPromptsFetch` would have been `undefined` anyway, allowing the tree-shaker to remove the module
**Purpose**: Intercept the Anthropic API `fetch` call and dump the full request body (system prompt + messages + tool definitions) to disk for offline analysis. Held up to 5 full request bodies in memory (~700KB each)
**Status change**: Tree-shaken out. The 5-body memory ceiling note in `log.ts:349` is also dead code

## Internal Build Flags / Env Vars

The following appear as env-var probes in 2.1.142 but NOT as feature-gated build flags:

### CLAUDE_CODE_PERFETTO_TRACE (was: PERFETTO_TRACING feature flag)

**2.1.88 form**: Likely `feature('PERFETTO_TRACING')` — not directly visible in inspected files but `antTrace` command implies a tracing toolchain
**2.1.142 form**: Env var `process.env.CLAUDE_CODE_PERFETTO_TRACE` at `cli_inner_pretty.js:239968`
**Status change**: Promoted from build-flag to env-var gate. Tracing infrastructure is now runtime-toggleable in the public build

### CLAUDE_CODE_ENHANCED_TELEMETRY_BETA (was: ENHANCED_TELEMETRY_BETA)

**2.1.88 form**: Likely `feature('ENHANCED_TELEMETRY_BETA')`
**2.1.142 form**: Env var `process.env.CLAUDE_CODE_ENHANCED_TELEMETRY_BETA ?? process.env.ENABLE_ENHANCED_TELEMETRY_BETA` at `cli_inner_pretty.js:241671`
**Status change**: Promoted to env-var gate; feature is publicly opt-in

### BYOC_ENVIRONMENT_RUNNER

**2.1.88 form**: Build-flag inferred from filename pattern
**2.1.142 form**: PARTIALLY PRESENT (2 references found via grep) — likely now an env-var or product mode, not a feature flag
**Status change**: Partial promotion. Defer to C2 if covered

## Removed: AGENT_MEMORY_SNAPSHOT, AGENT_TRIGGERS, ASYNC_TOOL_USE, ABLATION_BASELINE, ANTI_DISTILLATION_CC, DUMP_SYSTEM_PROMPT, SHOT_STATS

**2.1.88 form**: Build-flag references from task hints (not directly visible in inspected files)
**2.1.142 form**: ABSENT — `grep -c` returns 0 for every one of these flag names in `cli_inner_pretty.js`
**Status change**: All tree-shaken out of the public build. AGENT_TRIGGERS was the umbrella for cron scheduling tools — `cronTools` at `tools.ts:29-35` — those tools (`CronCreate`, `CronDelete`, `CronList`, `ScheduleWakeup`) ARE in the public 2.1.142 tool catalog, so AGENT_TRIGGERS itself was promoted to default-on (defer to C2). The other flags (memory snapshots, async tool use, ablation baselines, anti-distillation, system prompt dump, shot stats) remain Anthropic-internal research/experiment knobs

## Summary Counts

- **Slash commands tree-shaken to oblivion**: 17 (backfillSessions, breakCache, ctx_viz, goodClaude, issue, mockLimits, antTrace, perfIssue, env, oauthRefresh, debugToolCall, agentsPlatform, onboarding, share, summary, force-snip, subscribePr proper)
- **Slash commands present-but-disabled (stub or `isEnabled: () => false`)**: 1 (version, in two variants)
- **Slash commands moved to PROMOTED**: 5 (commit, commit-push-pr, init-verifiers, teleport, bridge-kick)
- **Slash commands moved to OAuth-scope gated**: 1 (autofix-pr)
- **Tools tree-shaken**: 4 (SuggestBackgroundPRTool, ConfigTool, TungstenTool, SnipTool/MonitorTool/CtxInspectTool/TerminalCaptureTool/WebBrowserTool/OverflowTestTool/SubscribePRTool/SendUserFileTool/PushNotificationTool)
- **Tools present-but-unreachable**: 1 (REPLTool — string + gating function remain, registration absent from public tool list)
- **Env-var sets tree-shaken**: 1 (`ANT_ONLY_SAFE_ENV_VARS`; some entries promoted to public `SAFE_ENV_VARS`)
- **Build flags tree-shaken**: KAIROS, KAIROS_BRIEF, KAIROS_PUSH_NOTIFICATION, KAIROS_GITHUB_WEBHOOKS, HISTORY_SNIP, WORKFLOW_SCRIPTS, EXPERIMENTAL_SKILL_SEARCH, TORCH, UDS_INBOX, BUDDY, ULTRAPLAN, MCP_SKILLS, COMMIT_ATTRIBUTION, TEAMMEM, COORDINATOR_MODE, MONITOR_TOOL, OVERFLOW_TEST_TOOL, CONTEXT_COLLAPSE, TERMINAL_PANEL, WEB_BROWSER_TOOL, CCR_REMOTE_SETUP, AGENT_MEMORY_SNAPSHOT, AGENT_TRIGGERS (the flag name itself; the tools are public), ASYNC_TOOL_USE, ABLATION_BASELINE, ANTI_DISTILLATION_CC, DUMP_SYSTEM_PROMPT, SHOT_STATS
- **Build flags promoted to env-var**: PERFETTO_TRACING → `CLAUDE_CODE_PERFETTO_TRACE`, ENHANCED_TELEMETRY_BETA → `CLAUDE_CODE_ENHANCED_TELEMETRY_BETA`, FORK_SUBAGENT → `CLAUDE_CODE_FORK_SUBAGENT`
- **Build flags promoted to runtime (no env var, just enabled)**: BRIDGE_MODE+DAEMON (remote control), VOICE_MODE, AGENT_TRIGGERS_REMOTE (RemoteTriggerTool)

## Cross-References

- See `30_removed.md` for features that EXISTED in some 2.1.88-era ant build but have no trace in 2.1.142 (and so are genuinely "removed" rather than "still-internal")
- See `10_promoted.md` (C2) for the deep-dives on features that moved from ant-only to public
- See `00_overview/changelog_analysis.md` and `by_version/v2.1.142.md` for cross-version timing of these removals
