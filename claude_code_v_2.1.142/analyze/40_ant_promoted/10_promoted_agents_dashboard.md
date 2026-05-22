# `claude agents` Dashboard — From Ant-Only `agentsPlatform` to GA Agent View (v2.1.88 → v2.1.142)

## Status snapshot

| | v2.1.88 (TypeScript source) | v2.1.142 (deobfuscated) |
|---|---|---|
| Slash command name | `/agents` (managed agent configs) | `/agents` (same role — agent config manager, NOT the dashboard) |
| CLI subcommand | `claude agents-platform` (ant-only, dynamic require) | `claude agents` (general availability) |
| Implementation location | `src/commands.ts:48-51` (require gated on USER_TYPE) — source file NOT in copy | `cli_inner_pretty.js:509150-509154` (route detection), `cli_inner_pretty.js:567180+` (UI), daemon orchestration spread across multiple regions |
| Enablement gate | `process.env.USER_TYPE === 'ant'` (runtime check on import) — source dir `commands/agents-platform/` referenced but not shipped externally | `disableAgentView` setting + `CLAUDE_CODE_DISABLE_AGENT_VIEW=1` env var — opt-OUT only |
| In `slash_commands.json` catalog | `/agents` (config manager) | `/agents` (same — the dashboard is the CLI subcommand, not a slash command) |
| Daemon dependency | Required only when running `claude agents-platform` | Required for `claude agents`, `--bg`, `/background`, persistent bg sessions |
| User scope | Anthropic employees | All Claude Code users |
| Marketed as | (no public docs) | "Research Preview" — https://code.claude.com/docs/en/agent-view |

### What is `claude agents`?

A persistent multi-session "all your Claude sessions" dashboard. Lists every Claude Code session — *running*, *blocked on you*, or *done*. From the dashboard, you can:
- Dispatch new sessions
- Attach to a running one
- See completed sessions and their results

In 2.1.88, this dashboard existed inside Anthropic only as `agentsPlatform` (gated `USER_TYPE === 'ant'`, source not in external builds). v2.1.139 promoted it to all users as `claude agents` (and 2.1.142 extends polish + plugin support).

---

## 1. v2.1.88 implementation (TypeScript source)

### The ant-only require

```typescript
// ============================================
// agentsPlatformRequire - v2.1.88 ant-only dynamic require
// Location: src/commands.ts:48-52
// ============================================

// ORIGINAL (for source lookup):
const agentsPlatform =
  process.env.USER_TYPE === 'ant'
    ? require('./commands/agents-platform/index.js').default
    : null

// READABLE (for understanding):
const agentsPlatform = isAnthropicEmployeeBuild()
  ? requireAgentsPlatformModule()
  : null;
// Mapping: USER_TYPE→build identity, agentsPlatform→agentsPlatform
```

Note this differs from `feature('ULTRAPLAN')`:
- `feature('X')` is a build-time define, constant-folded by the bundler — DCE eliminates the require entirely from external builds.
- `process.env.USER_TYPE === 'ant'` is a runtime check — the require *expression* survives in the bundled JS, but the file `./commands/agents-platform/index.js` *itself* is only present in ant builds (the bundler excludes it from external Bundle).

When an external user installed the build and ran `claude agents-platform`, the registry wouldn't find it (the command was filtered out by `INTERNAL_ONLY_COMMANDS`).

### The INTERNAL_ONLY_COMMANDS filter

```typescript
// ============================================
// INTERNAL_ONLY_COMMANDS - v2.1.88 filter list
// Location: src/commands.ts:225-254
// ============================================

// ORIGINAL (for source lookup):
export const INTERNAL_ONLY_COMMANDS = [
  backfillSessions, breakCache, bughunter, commit, commitPushPr,
  ctx_viz, goodClaude, issue, initVerifiers,
  ...(forceSnip ? [forceSnip] : []),
  mockLimits, bridgeKick, version,
  ...(ultraplan ? [ultraplan] : []),
  ...(subscribePr ? [subscribePr] : []),
  resetLimits, resetLimitsNonInteractive, onboarding, share, summary, teleport,
  antTrace, perfIssue, env, oauthRefresh, debugToolCall,
  agentsPlatform,      // ← appended; null in external builds
  autofixPr,
].filter(Boolean)
```

`.filter(Boolean)` removes the `null`s that come from non-ant builds. So `INTERNAL_ONLY_COMMANDS` is the set of commands that an external user shouldn't see, and `agentsPlatform` (when null) doesn't appear there at all.

### What the ant `agentsPlatform` did

The source for `commands/agents-platform/` is **not in our 2.1.88 copy** (consistent with it being ant-only and stripped from external builds). From references in surrounding code:

- `src/utils/cron.ts:186` — comment notes "agents-platform.tsx ... run on servers and always use UTC cron strings". This hints the ant-only platform was a server-side feature with scheduled jobs.
- The lack of a local agents-platform file suggests it was a separate web/server experience that Anthropic employees used for managing fleets of agents.

The 2.1.142 `claude agents` dashboard is *not* a direct port of the ant-only `agents-platform`. It is a new design that takes the same idea ("see all your agents") and renders it as a terminal UI instead of a server-side experience.

### 2.1.88 baseline — what external users had

External v2.1.88 users had:
- `--bg` flag to launch a session detached (fire-and-forget)
- `claude attach <id>`, `claude logs <id>`, `claude stop <id>` for individual sessions
- NO single dashboard listing all sessions

The pain: a user with 5 background sessions had to remember 5 IDs (or grep stdout for the detach message). The UX gap is what `claude agents` fills.

---

## 2. v2.1.142 implementation (deobfuscated)

### CLI route detection

```javascript
// ============================================
// detectClaudeAgentsRoute - argv[0] dispatch
// Location: cli_inner_pretty.js:509150-509154
// ============================================

// ORIGINAL (for source lookup):
function RC5() {
  let H = process.argv.slice(2);
  if (H[0] === "agents") return "claude agents";
  if (H.includes("--bg")) return "claude --bg";
  return "claude";
}

// READABLE (for understanding):
function detectInvocationKind() {
  const argv = process.argv.slice(2);
  if (argv[0] === "agents") return "claude agents";
  if (argv.includes("--bg")) return "claude --bg";
  return "claude";
}
// Mapping: RC5→detectInvocationKind
```

This is the early-startup dispatch — runs *before* the React/Ink mount. If the user typed `claude agents`, the rest of bootstrap forks down the agent-view path (daemon attach + dashboard render). For `--bg`, the daemon is started/connected then the session is launched detached. Otherwise, normal REPL.

### Disable gate

```javascript
// ============================================
// isAgentViewDisabled - opt-out check
// Location: cli_inner_pretty.js:139859-139861
// ============================================

// ORIGINAL (for source lookup):
function rmH() {
  return bH(process.env.CLAUDE_CODE_DISABLE_AGENT_VIEW) || dS()?.settings.disableAgentView === !0;
}

// READABLE (for understanding):
function isAgentViewDisabled() {
  if (parseEnvBoolean(process.env.CLAUDE_CODE_DISABLE_AGENT_VIEW)) return true;
  if (getManagedSettings()?.settings.disableAgentView === true) return true;
  return false;
}
// Mapping: rmH→isAgentViewDisabled, bH→parseEnvBoolean, dS→getManagedSettings
```

Note the inversion from 2.1.88: instead of "opt IN if ant", this is "opt OUT if disabled." Defaults are reversed because the feature is now GA — silence means yes.

The check inputs:
1. `CLAUDE_CODE_DISABLE_AGENT_VIEW=1` — per-process env override (useful for CI not wanting daemon spawned)
2. `settings.disableAgentView === true` — typically set in managed settings (enterprise admin)

### Settings declaration

```javascript
// ============================================
// disableAgentViewSetting - schema entry
// Location: cli_inner_pretty.js:50523-50528
// ============================================

// ORIGINAL (for source lookup):
disableAgentView: y
  .boolean()
  .optional()
  .describe(
    "Disable agent view (`claude agents`, `--bg`, /background, the on-demand daemon). Typically set in managed settings. Equivalent to CLAUDE_CODE_DISABLE_AGENT_VIEW=1.",
  ),
```

The description explicitly enumerates what this setting touches:
- `claude agents` (the CLI subcommand)
- `--bg` flag
- `/background` slash command (in-session background dispatch)
- the on-demand daemon (the background process that holds open sessions)

One toggle disables all four surfaces. The reasoning: they're a stack — without the daemon, the other three can't function. So the setting nukes the whole stack to one knob.

### Daemon cold-start prompt

```javascript
// ============================================
// daemonColdStartPrompt - first-time daemon install offer
// Location: cli_inner_pretty.js:509189-509215
// ============================================

// ORIGINAL (for source lookup):
async function KG$() {
  let H = await iB({ onStarting: VP8 });
  if (H.ok || !H.askInstall) return H;
  if (!process.stdin.isTTY || !process.stderr.isTTY || E6.isCI) return H;
  process.stderr.write(`No background daemon is running.
Installing it as a service keeps the background daemon running across reboot so 'claude agents' stays available.
`);
  let $ = await xC5("Install as a service now? [y/N/never, or 'once' just for now] ");
  // ... 'yes' → install service, 'once' → transient, 'never' → save setting
}

// READABLE (for understanding):
async function ensureDaemonRunningWithInstallOffer() {
  const result = await ensureDaemonStarted({ onStarting: showStartingSpinner });
  if (result.ok || !result.askInstall) return result;
  // Skip prompt in non-interactive contexts
  if (!isInteractive()) return result;
  process.stderr.write("No background daemon is running.\n" +
    "Installing it as a service keeps the background daemon running across reboot so 'claude agents' stays available.\n");
  const answer = await readlineWithChoices("Install as a service now? [y/N/never, or 'once' just for now] ");
  // ... handle answer
}
// Mapping: KG$→ensureDaemonRunningWithInstallOffer, iB→ensureDaemonStarted, xC5→readlineWithChoices
```

The "Install as a service" prompt is the educational moment for `claude agents`. The dashboard's value proposition (sessions survive reboot) requires a service-level daemon. v2.1.139+ prompts the user once.

### `claude agents` listed in other commands' help

```javascript
// ============================================
// backgroundedJobHelpFooter - "what next" hint
// Location: cli_inner_pretty.js:510749-510758
// ============================================

return [
  `backgrounded · ${color.cyan(id)}${title ? color.dim(" " + title) : ""}`,
  hint("claude agents", "list sessions"),
  hint(`claude attach ${id}`, "open in this terminal"),
  hint(`claude logs ${id}`, "show recent output"),
  hint(`claude stop ${id}`, "stop this session"),
].join("\n");
```

When a session is backgrounded, the user immediately sees `claude agents` listed as an option. This is the discoverability mechanism — every detach event teaches the user about the dashboard.

---

## 3. Diff during promotion (88 → 142)

### What changed

| Aspect | v2.1.88 | v2.1.142 |
|---|---|---|
| Gate model | Opt-IN by build identity (`USER_TYPE === 'ant'`) | Opt-OUT by setting (`disableAgentView`) |
| Source presence | `agents-platform/index.js` NOT in external builds | Fully present in external binary |
| Subcommand name | `agents-platform` (internal name) | `agents` (clean external name) |
| Daemon dependency | Server-side (ant infra) | Local daemon (on-demand or service-installed) |
| Dashboard UI | Web/Slack interface (inferred — not in src copy) | Ink-rendered terminal UI |
| `INTERNAL_ONLY_COMMANDS` | Included | NOT included |
| Polish over time | n/a | "Research Preview" label, daemon-install pitch (v2.1.139), `--plugin-dir` (v2.1.142), more |
| `--plugin-dir` for `claude agents` | n/a | Added v2.1.142 |
| `disableAgentView` setting | n/a | Added v2.1.139 (with v2.1.142 still using same key) |

### Why the rebrand `agents-platform` → `agents`

**The renaming is more than cosmetic.** Internal "platform" implied a multi-tenant server. External "agents" implies a local list. The user-mental-model is different — the rename ensures the docs and CLI match what the user expects.

**Trade-off:** the slash command `/agents` already existed (for managing agent configs). Naming the CLI subcommand `agents` creates a potential confusion: `/agents` (slash) and `claude agents` (CLI) are different things. The disambiguation is in the surface:
- `/agents` from inside a session — manages **agent configs** (the .md definitions for subagents)
- `claude agents` from a shell — opens the **multi-session dashboard**

Anthropic considered this acceptable because:
- Different launch surface (in-session vs shell)
- Same broad concept (agents — distinct vs. fleet view)
- Docs explicitly disambiguate

### Why opt-OUT instead of opt-IN

**Decision context:** the feature ships GA, but enterprise admins may have reasons to disable it (compliance, daemon-policy, etc.).

**Trade-off:**
- Default ON: everyone gets value; small percentage of admins write a managed-settings entry to disable
- Default OFF: most users miss the feature; nobody complains but the feature doesn't lift the product

Anthropic chose ON-by-default because the feature is genuinely useful for the common case (multi-session multitasking). Edge-case admin disable is one setting away.

**Defensive design:** `disableAgentView` disables FOUR things (claude agents, --bg, /background, daemon) atomically. An admin who wants "no background daemon" doesn't have to enumerate four settings.

### Why the daemon-install prompt

**Without persistent daemon:** sessions die when the user's terminal closes (transient daemon goes with the parent shell). User comes back tomorrow, agents are gone.

**With service-installed daemon:** sessions survive the user's logout, reboot, ssh disconnect. User comes back tomorrow, can `claude attach <id>` and pick up where the agent left off.

The prompt asks once. If user says `never`, the setting persists. If `once`, this session only. If `yes`, install service. Clean choice.

### What did NOT change

- The `--bg` flag (existed in v2.1.88, still works)
- The `claude attach`, `claude logs`, `claude stop` subcommands
- The background-session storage on disk
- The on-demand daemon's basic life cycle
- The agent config files location (`.claude/agents/`)

---

## 4. Implementation analysis

### Decision: rename `agents-platform` → `agents`

**What it does:** the CLI subcommand is renamed when promoted to external visibility.

**How it works:**
1. The route detection (`H[0] === "agents"`) matches the new name
2. The `INTERNAL_ONLY_COMMANDS` filter no longer includes it (was `agentsPlatform`)
3. The slash command `/agents` (config manager) remains untouched

**Why this approach:**
- The internal "platform" name carries Anthropic-specific connotation (multi-tenant infra)
- "agents" is the natural external term — already used in `--bg`, `/background`, and agent config files
- One-word commands feel more polished

**Trade-off:** ambiguity with `/agents` (config manager). Mitigation: launch surface clearly differentiates.

**Key insight:** This is the "drop the internal-name when going public" pattern — same as Anthropic's removal of "Tengu" from user-visible strings (still in telemetry events as legacy).

### Decision: opt-OUT model

**What it does:** the feature is on by default; admins disable via setting.

**Why this matters:**
- The feature has high baseline value
- Admins are a tiny minority compared to general users
- Default ON aligns with "good defaults" philosophy

**Trade-off:** users in environments where daemon isn't tolerated (locked-down CI, sandboxes) get unexpected behavior. The env var `CLAUDE_CODE_DISABLE_AGENT_VIEW=1` is the per-process escape hatch.

**Key insight:** The opt-out has two layers (env + setting). Env wins (process-level override); managed-setting overrides user-setting. Standard precedence stack.

### Decision: "Research Preview" label

The dashboard is marketed as "Research Preview" via docs. This is **not** a technical gate — `claude agents` works fully. The label signals to enterprise users that internals can change.

**Reasoning:**
- Stabilizing the daemon protocol and dashboard schema before pinning the API takes time
- "Research Preview" lets Anthropic iterate without breaking-change compaints
- Users self-select: "preview" users tolerate churn, others wait for GA

This is the same approach Anthropic took with thinking-mode (research preview) — release early, polish, then declare GA.

### Decision: daemon cold-start prompt as one-time event

**What it does:** prompts only when:
1. Daemon isn't running
2. The cold-start function reports `askInstall === true`
3. The user is on an interactive TTY
4. Not CI (`E6.isCI` check)

The prompt offers four answers: yes/no/never/once.

**Why this matters:**
- A `never` answer is sticky — saved to config, prompt won't appear again
- A `once` answer is transient — current session only, prompt may re-ask later
- A `yes` answer installs the service via the platform's service manager (systemd on Linux, launchd on macOS, scheduled task on Windows)

This is good UX: the user sees the prompt at the moment they care (they just typed `claude agents`), gets a clear choice, and the answer affects future runs.

---

## 5. Public entry points

### CLI surface
- `claude agents` — open the dashboard
- `claude --bg <prompt>` — fire-and-forget bg session
- `claude attach <id-or-prefix>` — attach to a bg session
- `claude logs <id-or-prefix>` — print recent output
- `claude stop <id-or-prefix>` — stop a bg session
- `claude kill`, `claude respawn`, `claude rm` — additional bg-session ops
- `claude agents --plugin-dir <dir>` — load plugin commands into the dashboard (v2.1.142)

### Slash command surface
- `/background <prompt>` — in-session dispatch of a bg session (different from `--bg` because the parent session continues)

### Settings
- `disableAgentView: boolean` — top-level kill switch
- `defaultToAgentsView: boolean` — when true, plain `claude` opens dashboard instead of REPL by default (config UI added in v2.1.142)

### Environment variables
- `CLAUDE_CODE_DISABLE_AGENT_VIEW=1` — per-process disable
- `CLAUDE_CONFIG_DIR` — when set, daemon may skip auto-start (lines 509147)

### From other surfaces
- Detach messages mention `claude agents` (line 431077)
- Welcome banner shows it (line 510753, 568510)
- `/doctor` mentions daemon status (line 586549-586552)

---

## 6. Cross-references

- See `by_version/v2.1.139.md` for the v2.1.139 introduction
- See `by_version/v2.1.142.md` for `--plugin-dir` addition
- See `36_background_agents/` for background session internals

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `detectInvocationKind` (`RC5`) — argv-based dispatch (cli_inner_pretty.js:509150)
- `isAgentViewDisabled` (`rmH`) — opt-out check (cli_inner_pretty.js:139859)
- `ensureDaemonRunningWithInstallOffer` (`KG$`) — cold-start install pitch (cli_inner_pretty.js:509189)
- `backgroundedJobHelpFooter` (`bP8`) — detach message that promotes the dashboard (cli_inner_pretty.js:510749)
- `disableAgentView` setting (schema at cli_inner_pretty.js:50523)
- `defaultToAgentsView` setting (cli_inner_pretty.js:140657)
