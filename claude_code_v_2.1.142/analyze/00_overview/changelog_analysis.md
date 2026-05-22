# Changelog Analysis — Claude Code v2.1.113 → v2.1.142

This document is the **long-form narrative** for the v2.1.113 → v2.1.142 window. It complements:

- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet code-traceability table
- The four `symbol_index_*.md` files — [core execution](symbol_index_core_execution.md), [core features](symbol_index_core_features.md), [platform infra](symbol_index_infra_platform.md), [integration infra](symbol_index_infra_integration.md)
- [`file_index.md`](file_index.md) — extracted-file inventory

The window spans 30 version numbers but **23 published releases** (v2.1.113, v2.1.114, v2.1.116–v2.1.123, v2.1.126, v2.1.128, v2.1.129, v2.1.131–v2.1.133, v2.1.136–v2.1.142). The seven skipped numbers (v2.1.115, .124, .125, .127, .130, .134, .135) were never published; v2.1.138 shipped as "internal fixes" only; v2.1.137 was VS Code-extension only.

---

## 1. Release Cadence

| Version | Items | Theme |
|---------|------:|-------|
| v2.1.113 | ~30 | Native binary cutover, sandbox denied-domains, wrapper-aware Bash deny, multi-line bash spoofing |
| v2.1.114 | 1 | Crash hotfix (permission dialog with teammate request) |
| v2.1.116 | ~28 | /resume perf on large sessions, thinking spinner inline-progressive, embedded bfs/ugrep prep |
| v2.1.117 | ~30 | Pro/Max default `high`, Glob/Grep → bfs/ugrep, Opus 4.7 1M context fix |
| v2.1.118 | ~30 | Vim visual mode, `/cost`+`/stats` → `/usage`, custom themes, MCP hook type, DISABLE_UPDATES |
| v2.1.119 | ~45 | `/config` persistence, OTel `tool_use_id`, PowerShell auto-approve, `prUrlTemplate` |
| v2.1.120 | ~25 | `claude ultrareview` CLI, `${CLAUDE_EFFORT}` in skills, `AI_AGENT` env, native bfs/ugrep |
| v2.1.121 | ~30 | `alwaysLoad` MCP, `claude plugin prune`, themes/dictation, X.509 WIF, multi-GB memory leaks |
| v2.1.122 | ~22 | Bedrock service tier, Vertex/Bedrock 400 cleanups, PR-URL `/resume`, OTel `@`-mention |
| v2.1.123 | 1 | Auth 401 retry-loop hotfix |
| v2.1.126 | ~25 | Gateway `/v1/models`, `claude project purge`, OAuth code paste, `invocation_trigger` OTel |
| v2.1.128 | ~30 | `/mcp` tool counts, OTEL_* not inherited, EnterWorktree HEAD branch, MCP reserved name |
| v2.1.129 | ~26 | `--plugin-url`, FORCE_SYNC_OUTPUT, PACKAGE_MANAGER_AUTO_UPDATE, plugin themes/monitors → experimental |
| v2.1.131 | 2 | VS Code Windows hotfix, Mantle `x-api-key` |
| v2.1.132 | ~25 | DISABLE_ALTERNATE_SCREEN, SESSION_ID, native graceful shutdown, MCP stdio non-protocol guard |
| v2.1.133 | ~14 | `worktree.baseRef`, `sandbox.bwrapPath/socatPath`, `parentSettingsBehavior`, `effort.level` hook field |
| v2.1.136 | ~30 | autoMode.hard_deny, CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL, plan-mode + Edit-allow fix |
| v2.1.137 | 1 | VS Code Windows activation |
| v2.1.138 | "Internal fixes" | (no public changelog items) |
| v2.1.139 | ~40 | **claude agents (Research Preview), /goal, /scroll-speed, hook args/continueOnBlock, agent-id headers** |
| v2.1.140 | ~12 | Agent subagent_type case-insensitive, /goal hooks-disabled error, agent palette |
| v2.1.141 | ~50 | terminalSequence hook field, ANTHROPIC_WORKSPACE_ID, `claude agents --cwd`, /feedback recent-sessions |
| v2.1.142 | ~22 | **`claude agents` dispatch flags, Fast Mode → Opus 4.7, /claude-api, /routines, clock-jump daemon** |

Average cadence is roughly bi-weekly. The window's center of gravity is **v2.1.139** — the largest single release in the window, introducing both `claude agents` and `/goal` and adding the agent-id telemetry headers that wire subagents into OTel.

---

## 2. The Native Binary Transition (v2.1.113)

**What changed:** The CLI no longer ships as bundled JavaScript loaded via `node`. Instead, the npm package is a thin launcher that spawns a platform-specific native binary published as an optional dependency (`@anthropic/claude-code-linux-x64`, `-darwin-arm64`, etc.).

**How it works:**

1. `claude` (the npm entry) probes for the matching platform's optional dep.
2. The native binary is a Bun-compiled bundle — Bun's `--compile` mode emits a self-extracting executable with the bundled bytecode in a `__BUN` section.
3. claude-code-bomb's extraction process uses Bun's section parser to re-emit a pretty-printed bundle (`cli_inner_pretty.js`).

**Why this approach:**

- **Cold start latency** — node CLI startup with a huge bundle was slow; native binary avoids the JS engine cold-start.
- **Background daemon viability** — `claude agents` needs a long-running daemon process. node CLIs don't have a clean idiom for "spawn a daemon that survives the spawning shell" on every platform. Bun's binary owns its lifecycle.
- **Distribution efficiency** — single-file binary is easier to ship in environments without a node ecosystem (Homebrew, WinGet, direct downloads).
- **Memory** — Bun's runtime is ~10× more memory-efficient than node for this workload class, which matters for long-running sessions.

**Trade-offs:**

- Bun has its own quirks (NO_PROXY support v2.1.117 fix), and macOS keychain locking differs from node's path.
- npm-installed builds still work (Windows + non-native deps), so users on locked-down systems aren't blocked.
- The transition created a string of platform-edge-case bugs across v2.1.116, .117, .121, .131, .132, .137 — most of them are downstream of the cutover.

**Key insight:** The native binary is not a UX feature in itself; it is the **substrate** that makes `claude agents` and the long-running daemon possible. Every release after v2.1.113 is reading from that new substrate.

---

## 3. claude agents — Background Sessions, Daemon, Dashboard

**What it does:** `claude agents` is a single list of every Claude Code session you have running (locally backgrounded via `&`, blocked-on-you, completed, or stale). It launched in v2.1.139 as a Research Preview and was rapidly hardened.

The architecture is **daemon + dashboard + dispatcher**:

1. **Daemon** (`claude daemon` subcommands): a background process that owns the sessions. Implemented in the native binary (see §2). The daemon survives terminal close, holds session state across reboots when configured, and exposes a control surface via per-OS sockets/pipes.
2. **Dashboard**: the React component `EQ4` (in `cli_unpack_pretty/decls/functions/EQ4.js`) renders the agent list with filters (cwd, status), allows attaching with the right arrow key, dispatches new sessions inline.
3. **Dispatcher**: the code path that constructs the args for a new session. By v2.1.142 it accepts `--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--permission-mode`, `--model`, `--effort`, `--dangerously-skip-permissions` — basically every flag the user would normally pass to `claude` to scope the session.

### How v2.1.142 Hardened the Daemon

This is the deepest single area in the v2.1.142 changelog. Four daemon-level fixes:

```
- Fixed background sessions disappearing and daemon reconnect failing after
  macOS sleep/wake — the daemon now detects clock jumps instead of treating
  them as elapsed idle time
- Fixed daemon not exiting cleanly after the binary is upgraded (e.g.
  `brew upgrade`), causing dispatched agents to crash-loop on the deleted path
- Fixed background sessions not recognizing pre-existing git worktrees,
  blocking Edit while EnterWorktree refused to create a duplicate
- Fixed `claude --bg --dangerously-skip-permissions` not persisting across
  retire/wake
```

**Clock-jump detection** is the most architecturally interesting. The naive idle-timeout implementation reads `Date.now()` and compares to `lastActivity`. After macOS sleep/wake, that delta is huge (the sleep duration), but the actual elapsed user activity is zero. The fix is to use a **monotonic clock** (or a periodic heartbeat) for idle-time accounting, falling back to wall-clock only for actual timestamps.

**Brew-upgrade crash-loop**: Homebrew's upgrade-in-place replaces the binary file on disk while the daemon process still holds the open file descriptor. The daemon doesn't immediately die — but any restart attempt finds the binary at a different path (since the package manager moved it). The fix is to make the daemon detect this case (e.g. via inode/path stat) and exit cleanly before the next dispatch.

**Pre-existing worktree recognition**: Without this, `claude agents` dispatching into a worktree directory would get into a state where:
- The session is launched inside a git worktree.
- The implementation tried to "create" the worktree via `EnterWorktree` and got "already exists."
- Edit operations were rejected as "the cwd isn't a known worktree."

The fix teaches the dispatcher to recognize a pre-existing worktree (via `git rev-parse --show-toplevel` + worktree-list cross-reference) and skip the EnterWorktree step.

**Persisting `--dangerously-skip-permissions`**: When a `claude --bg --dangerously-skip-permissions` session is retired (auto-idle-exit) and then resumed, the permission mode was reset to default. The fix persists the mode in the per-session state file.

### Other Hardenings (v2.1.140–v2.1.142)

- **Empty placeholder cleanup** (v2.1.141): Pressing `←` from a fresh REPL was leaving stub session entries; now they're hidden.
- **5-min idle retire** (v2.1.141): Bare `←` background sessions auto-retire after 5 minutes idle.
- **`$EDITOR`/`$VISUAL` for "v to open in editor"** (v2.1.142): Was using daemon's default editor.
- **Network-drive Windows deadlock** (v2.1.142): startup-phase Ctrl+C now works.
- **Chrome shim disabled while attached** (v2.1.142): Background workers use a headless browser shim for `WebFetch` etc.; when the user attaches and clicks a link, the shim mode shouldn't apply.

### Disabling claude agents

`CLAUDE_CODE_DISABLE_AGENT_VIEW=1` (managed-settings tier) disables agent view, the daemon, `--bg`, `/background`. Useful for corporate deployments that don't want long-running sessions.

---

## 4. /goal — Stop Hook as Loop

**What it does:** `/goal <condition>` sets a session-scoped Stop hook that blocks Claude from finishing its turn until the condition is met. It auto-clears on success; you can clear it early with `/goal clear`.

**How it works** (inferred from `cli_inner_pretty.js:486759` prompt + `active_goal` event traces):

1. User types `/goal <condition>`.
2. The slash command (`T6A`) installs a synthetic session-scoped Stop hook that returns `{decision: "block", systemMessage: "Goal not yet met: <condition>"}` until the condition is satisfied.
3. Each turn after the model's response, the hook re-evaluates by inspecting the transcript. The "Briefly acknowledge the goal, then immediately start (or continue) working toward it — treat the condition itself as your directive" wording trains the model to make progress.
4. The UI overlay (`Xk4`, `cli_unpack_pretty/decls/functions/Xk4.js`) shows live elapsed time, turn count, and total tokens consumed. It uses an `active_goal` event type to push updates from the runtime to the UI.
5. When the condition is satisfied (auto-detected or `/goal clear`), the hook is removed and the overlay disappears.

**Why this approach:**

The naïve alternative would be a new "keep going" loop primitive in the agent loop. The implementation instead **composes existing pieces**:

- The Stop hook event was already wired (v2.1.88 baseline) — only the dispatch mechanism needed a new condition.
- The transcript-streaming UI was already wired (v2.1.88 baseline) — only a new overlay type needed to be added.
- Setting the condition via slash command and clearing it with `/goal clear` reuses the slash-command infrastructure.

This composition makes the feature available across all session modes (interactive, `-p`, Remote Control) for free.

**Key insight:** Treating the **condition itself** as the agent's directive (rather than a side-condition layered on top of another directive) is the prompt-engineering trick that makes the agent keep working. The hook prompt explicitly says: "treat the condition itself as your directive and do not pause to ask the user what to do."

**Edge cases hardened in v2.1.140:**

- `disableAllHooks` or `allowManagedHooksOnly` previously caused a silent hang (the Stop hook was never installed, so the agent kept stopping but no progress was visible). Now `/goal` shows a clear "use a command-type hook instead" error.

**Trusted-workspaces gate** (`ov5`): `/goal` only runs in trusted workspaces — restart and accept the trust dialog to enable.

---

## 5. /claude-api Skill (v2.1.142)

**What it does:** `/claude-api` is a model-invocable skill that walks the agent (and indirectly the user) through building LLM-powered apps using the Anthropic SDK. It's Claude-only — explicitly refuses to mix with OpenAI/etc.

**How it works:**

The skill body is at `cli_inner_pretty.js:593195` (identifier `ks4`) and is one of the largest skill prompts in the build. Key sections:

1. **Before you start**: scan target file for non-Anthropic provider markers (`import openai`, `gpt-4`, etc.) — if found, refuse and ask which direction to take.
2. **Output requirement**: use the official Anthropic SDK; raw HTTP only when explicitly requested.
3. **Never mix**: don't reach for `requests`/`fetch` in Python/TS just because it's lighter.
4. **Function/class names must come from explicit documentation** — either the `{lang}/` files in this skill or official SDK docs. Don't guess.

The skill body has language-specific subfolders (`python/`, `typescript/`, `java/`, etc.) and a `shared/live` directory with live documentation pointers.

**Why this approach:** The skill is a **prompt-engineering wedge against drift**. Without it, the model on a Python codebase might write OpenAI-shaped code even when the user wants Claude (since training data has more openai-pattern examples). The skill body's first paragraph aggressively redirects to Anthropic patterns.

**Trade-off:** The skill is huge. Loading it consumes context budget. The skill registry surfaces it conditionally — only when the model self-classifies the task as "build Claude-API code."

---

## 6. /routines Slash Command (v2.1.142)

**What it does:** `/routines` is the user-facing surface for managing **scheduled remote Claude Code agents** (cloud-side recurring routines, e.g. "every weekday at 9 AM, run this prompt"). It complements the local-only `CronCreate`/`CronDelete`/`CronList` tools.

**Architecture:**

- **Local**: `CronCreate` writes to `.claude/scheduled_tasks.json` or fires prompts within the current session.
- **Remote**: `/routines` calls the `claude.ai/code/routines` CCR API. Auth is in-process (`KK().CLAUDE_AI_ORIGIN`).

**Reference strings** (in `cli_inner_pretty.js`):

- Line 385268: "Manage scheduled remote Claude Code agents (routines) via the claude.ai CCR API. Auth is handled in-process — the token never reaches the shell."
- Line 385324: `${KK().CLAUDE_AI_ORIGIN}/code/routines/${H.id}` (manage-URL builder)
- Line 385377: `searchHint: "manage scheduled remote agent routines"`

**Why split local vs remote:** Local scheduled tasks are fast, cheap, and offline. Remote routines need cloud infrastructure (always-on scheduler, retry, alerting). Users want both — local for "every commit, lint this" and remote for "every day at 9 AM, summarize PR queue."

---

## 7. Fast Mode Default: Opus 4.6 → 4.7 (v2.1.142)

```
Fast mode now uses Opus 4.7 by default (previously Opus 4.6). Set
CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1 to pin fast mode to Opus 4.6
```

**What it does:** Fast Mode is a UI mode that biases the agent toward shorter, less-thinking responses. Previously it pinned Opus 4.6 (the older flagship); now it pins 4.7.

**Why this matters:**

- Opus 4.7 is more expensive per token. Fast mode users implicitly opt into higher cost.
- 4.7 is also "smarter" — fast-mode tasks complete in fewer turns, partially offsetting the per-token cost.
- The override env var (`CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1`) is targeted at users who specifically liked 4.6's pacing.

**Pattern observed across the window:** every few releases, default-model decisions shift in favor of newer/more capable models. The v2.1.117 change (Pro/Max default effort to `high` on Opus 4.6 and Sonnet 4.6) is a parallel example. The team treats default settings as a policy lever — they shift when telemetry shows the newer choice is dominating user-chosen behavior anyway.

---

## 8. Permissions Hardening — A Continuing Arc

Each release in this window closes a specific class of permission bypass or smooths the auto-mode/permission UX. Notable passes:

### v2.1.113 — Bash classifier and dangerous-path
- Bash deny rules now match commands wrapped in `env`/`sudo`/`watch`/`ionice`/`setsid` and similar exec wrappers.
- `Bash(find:*)` allow rules no longer auto-approve `find -exec`/`-delete`.
- macOS `/private/{etc,var,tmp,home}` paths treated as dangerous removal targets under `Bash(rm:*)`.
- Multi-line bash commands whose first line is a comment now show the full command in the transcript (closing a UI-spoofing vector — previously you could hide `rm -rf /` behind a fake "Hello world" comment).
- Bash `dangerouslyDisableSandbox` no longer runs without a permission prompt.

### v2.1.116 — Sandbox dangerous-path
- Sandbox auto-allow no longer bypasses the dangerous-path safety check for `rm`/`rmdir` targeting `/`, `$HOME`, or other critical paths.

### v2.1.118 — Auto-mode UX
- `$defaults` allow/soft_deny/environment merge instead of replacing built-in lists.
- "Don't ask again" on auto-mode opt-in.

### v2.1.126 — Catastrophic-removal safety net
- `--dangerously-skip-permissions` now bypasses prompts for writes to `.claude/`, `.git/`, `.vscode/`, shell config — but catastrophic removal commands (e.g. `rm -rf $HOME`) still prompt.
- Security fix: `allowManagedDomainsOnly` / `allowManagedReadPathsOnly` no longer ignored when a higher-priority managed-settings source lacked a `sandbox` block.

### v2.1.133 — Edit/Write allow rules and managed-settings merge
- `Edit`/`Write` allow rules scoped to drive root (`C:\`) or POSIX `/` no longer match incorrectly.
- `parentSettingsBehavior` admin key (`'first-wins' | 'merge'`) to let admins opt SDK `managedSettings` into the policy merge.

### v2.1.136 — Plan-mode + Edit-allow
- Plan mode now blocks file writes even when a matching `Edit(...)` allow rule exists (was a regression).
- Auto-mode `hard_deny` for unconditional blocks regardless of user intent or allow exceptions.

### v2.1.139 — Skill wildcard, autoAllowBashIfSandboxed
- `Skill(name *)` permission rules now work as a prefix match (matching `Bash(ls *)` behavior).
- `autoAllowBashIfSandboxed` honors shell expansions (`$VAR`, `$(cmd)`).

### v2.1.141 — Auto-dismiss and "Allowed by ..." dedup
- Switching permission mode while a tool-permission prompt is open auto-dismisses the prompt when the new setting permits.
- "Allowed by PermissionRequest hook" no longer repeats once per tool call under a collapsed read/search group.

**Pattern:** Each release closes ~3–8 specific bypass classes or polishes a specific UX corner. The cumulative effect across the window is a much-hardened permission system. The team appears to use **internal red-team testing + user reports** to identify new classes; once one is identified, several adjacent ones are usually closed in the same release.

---

## 9. MCP — Token Refresh, SSE Frame Caps, and Memory Bounds

MCP is the area with the most fixes across this window. Themes:

### Token-refresh races

A long arc of OAuth refresh fixes:

- v2.1.118: Concurrent refresh keychain race, `expires_in`-less token (hourly re-auth), step-up scope, `redirectUri` support, `mcp_authenticate` Microsoft 365 duplicate `prompt`.
- v2.1.121: Bash tool became permanently unusable when starting cwd was deleted (the native process holds the cwd handle).
- v2.1.136: OAuth refresh tokens lost on concurrent multi-server refresh.
- v2.1.141: Remote Control 401 on token rotation.

The recurring root cause is **cross-process and cross-server locking**: multiple sessions refreshing the same token concurrently, multiple MCP servers refreshing in parallel during startup. By v2.1.136 the team had a working cross-process lock.

### Frame caps and memory bounds

- v2.1.132: stdio MCP servers writing non-protocol data to stdout (10GB+ RSS).
- v2.1.139: HTTP/SSE MCP servers streaming non-protocol data — response bodies capped at 16 MB per SSE frame.
- v2.1.142: `MCP_TOOL_TIMEOUT` now actually raises per-request fetch timeout (was capped at 60s regardless of config).

These are all "third-party server misbehavior shouldn't crash Claude" fixes. The 16 MB cap is a generous-but-bounded number.

### Reserved names and config

- v2.1.128: `workspace` is reserved (existing servers with that name are skipped with a warning).
- v2.1.121: `alwaysLoad: true` — all tools from that server skip tool-search deferral.

---

## 10. Compaction Improvements

The compaction subsystem matured further in this window after its v2.1.105 PreCompact-blocking landing:

- v2.1.119: Skills invoked before auto-compaction were being re-executed against the next user message (fix: invoked-skills carryover deduplication).
- v2.1.128: 1M-context-window models with smaller autocompact window falsely "Prompt is too long" (fix: don't trigger autocompact-block on this case).
- v2.1.129: Cache-miss warning appearing spuriously after `/clear` or compaction when changing `/effort` or `/model` (fix: suppress the warning when the cache was deliberately reset).
- v2.1.139: Compaction prompt now asks the model to preserve sensitive user instructions.
- v2.1.141: "Summarize up to here" option in Rewind menu (compress earlier context while keeping recent turns).
- v2.1.142: Reactive compaction first-summarize attempt seeds from the original request's overflow size (avoiding a wasted near-full-context retry).

The v2.1.142 change is subtle but important. Previously: if a request overflows the context, the compaction kicks in *after* the API returns "too long," does a full summarize, then retries. The summarize was started fresh — it didn't know **how much** to remove. So the retry could still be near-full and overflow again. The fix gives the summarize the original overflow size as a budget input, so the first summarize is aggressive enough to fit on the retry.

---

## 10b. Prompt Cache — TTL Ordering, 1-Hour Cache, and Subagent Coverage

The prompt cache subsystem (introduced earlier with `ENABLE_PROMPT_CACHING_1H` in v2.1.108) kept stabilizing in this window:

- v2.1.116: An intermittent API 400 error related to cache control TTL ordering when a parallel request completed during request setup. The cache-control entries on the message blocks have to be in a specific order; the race fix is deterministic ordering.
- v2.1.117: Opus 4.7 sessions falsely autocompacting too early — the implementation was computing the context window against 200K (Opus 4.6 default) instead of Opus 4.7's native 1M. This also affected cache-block sizing.
- v2.1.128: Sub-agent progress summaries were missing the prompt cache, causing ~3× `cache_creation` token cost. Fix: cache the summary prompt prefix.
- v2.1.129: 1-hour prompt cache TTL was being silently downgraded to 5 minutes. The downgrade was triggered by a mistakenly-broad gate in the cache-TTL resolver.
- v2.1.129: Spurious cache-miss warning after `/clear` or compaction when changing `/effort` or `/model`. Cache was deliberately reset; warning should be suppressed.
- v2.1.132: Bedrock and Vertex 400 errors when `ENABLE_PROMPT_CACHING_1H` is set. The 1-hour beta header isn't supported by all providers; the fix gates the header per-provider.

The recurring theme: the prompt cache pays for itself across long sessions but is fragile to small inconsistencies in request shape. Each fix in this window closes a class of "cache silently doesn't work" bug — which is much worse than visible cache failures because token cost balloons without user-visible signal.

---

## 11. Thinking — Spinner, Indicator, Bedrock Quirks

The thinking subsystem changes are mostly UX:

- v2.1.116: Thinking spinner inline-progressive ("still thinking", "thinking more", "almost done thinking"), replacing the separate hint row.
- v2.1.117: Opus 4.7 sessions falsely computing against 200K instead of 1M context; thinking.type.enabled 400 on Bedrock IP ARN with Opus 4.7 + thinking disabled.
- v2.1.136: Redacted thinking block after tool call: API 400 fix (model emits a redacted thinking block; previously the request layer included it in the next turn's request body, which the API rejected).
- v2.1.141: 10-sec amber spinner warmup ("the spinner now warms to amber after 10 seconds to signal Claude is still working").

---

## 12. UI / TUI / Renderer

Across this window, the UI churn is enormous. The dominant themes:

### Fullscreen / alt-screen renderer stability

- v2.1.116: Scrollback duplication in inline mode on resize/dialog-dismiss.
- v2.1.121: Scrolling up no longer snaps back to bottom every time a tool finishes; dialogs that overflow are scrollable.
- v2.1.132: `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` to keep the conversation in native scrollback; mouse-wheel scrolling fixed in Cursor and VS Code 1.92–1.104; JetBrains 2025.2 scroll-wheel fixes.

### Custom themes (v2.1.118)

- `/theme` now supports creating and switching between named custom themes.
- JSON files in `~/.claude/themes/` can be hand-edited.
- Plugins ship themes via a `themes/` directory (later moved to `experimental:` in v2.1.129).

### Spinner verbs and tips

- v2.1.120: spinner tips hidden when the relevant feature already exists (don't recommend "install the desktop app" if it's installed).
- v2.1.122: `spinnerTipsOverride.excludeDefault` for time-based tips.
- v2.1.141: 10-sec amber warmup; spinner verbs honored in turn-completion.

### Internationalization

- v2.1.116: Devanagari and other Indic scripts.
- v2.1.121: Multiple unicode/grapheme fixes across Cmd+Left/Right, Ctrl+E/A/K/U/arrow.
- v2.1.139: Border-embedded text overflow on CJK/emoji; fuzzy-match emoji splitting.

---

## 13. Hooks — Platform Expansion

The hook system kept expanding:

- v2.1.118: `type: "mcp_tool"` (hooks can invoke MCP tools directly).
- v2.1.119: `duration_ms` in PostToolUse/PostToolUseFailure (tool execution time minus permission prompts and PreToolUse hooks).
- v2.1.119: Status-line stdin includes `effort.level` and `thinking.enabled`.
- v2.1.121: `hookSpecificOutput.updatedToolOutput` for **all tools** (was MCP-only).
- v2.1.133: `effort.level` JSON input field + `$CLAUDE_EFFORT` env var; Bash tool commands can read `$CLAUDE_EFFORT`.
- v2.1.139: `args: string[]` exec form (spawns command directly without shell, so path placeholders don't need quoting); `continueOnBlock` config for PostToolUse (set true to feed the hook's rejection reason back to Claude and continue).
- v2.1.139: Hooks now run **without terminal access** (prevents corruption of on-screen interactive prompts).
- v2.1.141: `terminalSequence` field (hooks emit desktop notifications, window titles, bells without a controlling terminal).
- v2.1.142: Hook configuration error for prompt/agent hooks misconfigured on SessionStart/Setup/SubagentStart — now shows clear "use a command-type hook instead" error.

Pattern: each hook event widens its return-value surface; each input gets a new field; each constraint that bites users gets a clear error message instead of silent failure.

---

## 14. Telemetry / OTel — Subagent IDs, Subprocess Isolation

The OTel surface kept expanding:

- v2.1.117: `cost.usage`, `token.usage`, `api_request`, `api_error` include `effort` attribute. `user_prompt` events include `command_name` and `command_source`. Custom/MCP command names redacted unless `OTEL_LOG_TOOL_DETAILS=1`.
- v2.1.119: `tool_result` and `tool_decision` include `tool_use_id`; `tool_result` includes `tool_input_size_bytes`.
- v2.1.121: `stop_reason`, `gen_ai.response.finish_reasons`, `user_system_prompt` (gated behind `OTEL_LOG_USER_PROMPTS`) to LLM request spans.
- v2.1.122: Numeric attributes on `api_request`/`api_error` emitted as numbers, not strings; `claude_code.at_mention` log event.
- v2.1.126: `invocation_trigger` attribute (`"user-slash"`, `"claude-proactive"`, `"nested-skill"`) on `claude_code.skill_activated`.
- v2.1.128: Subprocesses (Bash, hooks, MCP, LSP) no longer inherit `OTEL_*` environment variables — OTEL-instrumented apps run via Bash no longer pick up CLI's OTLP endpoint.
- v2.1.129: `claude_code.pull_request.count` counts MCP-tool-created PRs/MRs.
- v2.1.136: `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` for enterprises capturing responses through OTel.
- v2.1.139: `x-claude-code-agent-id`/`parent-agent-id` headers on subagent API requests; `agent_id`/`parent_agent_id` OTel span attributes.
- v2.1.141: Early OTel spans dropped in SDK/headless with beta tracing — fixed.

The subagent-id headers in v2.1.139 are the most architecturally significant — they enable **distributed tracing across subagent spawn**, so a parent's trace context includes the children's spans.

---

## 15. Settings Schema Evolution

New settings added in this window:

| Setting | Version | Purpose |
|---------|---------|---------|
| `sandbox.network.deniedDomains` | v2.1.113 | Block specific domains even when broader allowedDomains wildcard would permit |
| `prUrlTemplate` | v2.1.119 | Custom code-review URL for footer PR badge |
| `worktree.baseRef` | v2.1.133 | `fresh` | `head` — branch from origin/<default> or local HEAD |
| `sandbox.bwrapPath`, `sandbox.socatPath` | v2.1.133 | Custom bubblewrap/socat binaries (Linux/WSL) |
| `parentSettingsBehavior` | v2.1.133 | `first-wins` | `merge` for SDK managedSettings tier |
| `autoMode.hard_deny` | v2.1.136 | Auto-mode classifier unconditional blocks |
| `tui` (preserved) | (v2.1.110) | Renderer mode |
| `effort.level` (in hook input) | v2.1.133 | Active effort level |
| `wslInheritsWindowsSettings` | v2.1.118 | WSL inherits Windows-side managed settings |

---

## 16. Environment Variables Added

| Env Var | Version | Purpose |
|---------|---------|---------|
| `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` | v2.1.142 | Pin Fast Mode to Opus 4.6 |
| `ANTHROPIC_WORKSPACE_ID` | v2.1.141 | Workload Identity Federation scoping |
| `CLAUDE_CODE_PLUGIN_PREFER_HTTPS` | v2.1.141 | Clone GitHub plugin sources over HTTPS |
| `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` | v2.1.136 | Re-enable feedback survey for OTel-capturing enterprises |
| `CLAUDE_CODE_SESSION_ID` | v2.1.132 | Available in Bash tool subprocess env |
| `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` | v2.1.132 | Keep conversation in native scrollback |
| `CLAUDE_CODE_FORCE_SYNC_OUTPUT` | v2.1.129 | Force-enable synchronized output |
| `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE` | v2.1.129 | Homebrew/WinGet background upgrade |
| `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY` | v2.1.129 | Opt in to gateway `/v1/models` |
| `ANTHROPIC_BEDROCK_SERVICE_TIER` | v2.1.122 | `default`/`flex`/`priority` |
| `DISABLE_UPDATES` | v2.1.118 | Stricter than `DISABLE_AUTOUPDATER` — blocks `claude update` too |
| `CLAUDE_CODE_HIDE_CWD` | v2.1.119 | Hide working directory in startup logo |
| `CLAUDE_CODE_FORK_SUBAGENT` (existing) | v2.1.117 | Now works in non-interactive |

---

## 17. The "Big Three" Architectural Changes

If you only remember three things about v2.1.113 → v2.1.142:

### A. Native Binary Cutover (v2.1.113)
The CLI now ships as a per-platform Bun-compiled binary instead of bundled JavaScript. This is the substrate for everything else (daemon, agents view, faster cold start).

### B. claude agents (v2.1.139–.142)
Background sessions, the daemon, the dashboard, and dispatcher flags. A new product surface on top of the native binary.

### C. /goal Stop Hook (v2.1.139)
A composition of existing Stop hook + UI overlay primitives that lets users say "keep going until X" and have the agent treat that condition as its directive. Composes cleanly with `-p`, Remote Control, and `claude agents` dispatch.

---

## 18. Cross-Validation Notes

Items that needed verification against source:

| Claim | Verification | Finding |
|-------|--------------|---------|
| Tool factory rename `Y9` → `XK` | extraction notes + cli_inner_pretty.js grep | Confirmed — affects tools_index extraction |
| SendUserFile tool added | `decls/vars/NH8.js` = `"SendUserFile"` | Confirmed — wired via `wi7` module namespace |
| Fast mode default Opus 4.7 | `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` at line 96906 | Confirmed |
| /goal command exists with name "goal" | line 507852–7860: `name: "goal"` slash-command def | Confirmed — see also `T6A` |
| /claude-api skill body in source | `cli_inner_pretty.js:593195` ks4 string | Confirmed |
| /routines manages claude.ai/code/routines | `cli_inner_pretty.js:385324` URL builder | Confirmed |

---

## 19. Where to Look for Specifics

- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet → decl mapping
- [`file_index.md`](file_index.md) — extracted-file inventory
- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, LLM API, Tools, Agents, Subagent, State
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Plan, Background Agents, /goal, Compact, Hooks, Skills, Thinking, Steering, CLI
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands
- Per-unit symbol additions (transitional) — `symbol_additions_v2_1_142_*.md`
- Per-unit cross-validation reports — `cross_validation_report_*.md`
- `../../claude_code_v_2.1.112/analyze/` — the prior window (v2.1.88 → v2.1.112)
