# Changelog Delta Scoping — Claude Code v2.1.183 → v2.1.193

> **Status: PREPARATION / PLANNING (changelog-derived, NOT yet source-verified).**
> This document is the entry point for the v2.1.193 analysis. It categorizes the
> published changelog delta from the last analyzed version (v2.1.183) and proposes
> which themes warrant deep source analysis. Every claim here is sourced from the
> **published GitHub CHANGELOG** only — none has been cross-checked against the
> bundle yet. The deep, source-cited narrative (the eventual `changelog_analysis.md`)
> and per-feature module trees come next, following the
> [[cc-version-analysis-workflow]] scout-then-write pipeline.

---

## Source bundle facts

| Field | v2.1.193 (target) | v2.1.183 (before-picture) |
|-------|-------------------|---------------------------|
| Bundle | `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` | `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` |
| Lines | 718,679 | 699,346 |
| build_sha | `a1938d2a07a2e4fecbef4eeac813221929e97d22` | `9d251abdbce0c0a6190d290add83634e0ab481f6` |
| build_time | 2026-06-25T18:18:11Z | 2026-06-18T23:04:10Z |
| bun_runtime | 1.4.0 (fe06227f0) | 1.4.0 |
| tools_extracted | 51 | — |
| decls_extracted | 40,494 | — |

Rich `assets/` extract is present for v2.1.193: `feature_gates.json`, `env_vars.json`,
`cli_flags.json`, `endpoints.json`, `slash_commands.json`, `tools_index.json` (51 tools),
plus `tools/`, `prompts/`, `system_prompts/`, `long_strings/` directories.

Reference v2.1.88 named-TS tree (for carryover names/shapes): `/lyz/codespace/3rd/claude-code/src`.

> **Obfuscated names are re-mangled between builds.** Every symbol must be re-derived
> in the v2.1.193 bundle; do not carry obfuscated names forward from the v2.1.183 tree
> by assumption.

---

## 1. The window shape

The delta spans **10 version numbers** (2.1.184 … 2.1.193) but **6 published releases**.
Four numbers were never published — **.184, .188, .189, .192** are absent from the
changelog. The bundle grew ~19,300 lines (699,346 → 718,679).

| Version | Items | Dominant theme |
|---------|------:|----------------|
| 2.1.185 | 1 | Stream-stall hint reword + 20s (was 10s) threshold |
| 2.1.186 | 33 | **The big release of the window** — `claude mcp login/logout` CLI, bg-agent UX hardening, `!`-bash auto-respond, skills frontmatter tolerance, `Agent()` permission enforcement, workflow `agent({schema})` 5-attempt abort, `/review`→`/code-review medium` |
| 2.1.187 | 21 | **Permissions + subagent depth** — `sandbox.credentials`, org model restrictions, subagent depth tracking (resumed/forked), MCP idle-timeout, worktree-registration cleanup |
| 2.1.190 | 1 | "Bug fixes and reliability improvements" (no detail) |
| 2.1.191 | 20 | **MCP reliability + perf** — `/rewind` before `/clear`, MCP discovery/OAuth retries, streaming CPU −37%, sandbox host-remember |
| 2.1.193 | 15 | **Auto-mode + telemetry** — `autoMode.classifyAllShell`, auto-mode denial reasons surfaced, `assistant_response` OTEL event, bg idle-shell memory reaping |

**The big inflection points, in order:**

- **2.1.186 — the reliability + MCP-CLI watershed.** The densest release (33 items).
  Adds `claude mcp login/logout` (auth MCP from the CLI without the interactive menu),
  makes `!` bash commands auto-trigger a model response (`respondToBashCommands`), and
  closes a long tail of background-agent UX bugs. Also tightens `Agent()` permission
  enforcement for named subagent spawns and caps workflow schema-retry loops.
- **2.1.187 — permissions + subagent-depth correctness.** `sandbox.credentials` blocks
  reading credential files / secret env. Org-configured model restrictions reach the
  picker, `--model`, `/model`, and `ANTHROPIC_MODEL`. Subagent depth tracking is fixed
  so resumed subagents restore their original spawn depth and **forked** subagents count
  toward the depth cap — a direct continuation of the v2.1.172/181 nested-subagent depth
  work analyzed in the v2.1.183 tree.
- **2.1.191 — MCP reliability + streaming perf.** Capability discovery, OAuth, and token
  requests all gain retry/backoff; streaming CPU drops ~37% by coalescing text updates to
  100ms; `/rewind` learns to resume from before `/clear`.
- **2.1.193 — auto-mode safety surfacing + telemetry.** `autoMode.classifyAllShell` routes
  *all* Bash/PowerShell through the auto-mode classifier (not just arbitrary-code patterns);
  auto-mode denial reasons now reach the transcript, the toast, and `/permissions`. A new
  `claude_code.assistant_response` OTEL log event ships (**upgrade-behavior watch:** when
  `OTEL_LOG_ASSISTANT_RESPONSES` is unset it inherits `OTEL_LOG_USER_PROMPTS`, so
  prompt-logging deployments start receiving response content on upgrade).

The through-line is **hardening the autonomy surface**: auto-mode gets stricter and more
transparent, MCP gets more resilient, background/subagent lifecycle gets more correct, and
observability deepens. Unlike the v2.1.183 window (which introduced whole features —
agent-team redesign, ultracode), this window is mostly *maturation of features already
present*, plus two genuinely new surfaces (`autoMode.classifyAllShell`, `/rewind` before
`/clear`).

---

## 2. Delta grouped by subsystem

Each bullet is tagged with the release it shipped in. **[NEW]** marks a genuinely new
capability/setting; unmarked items are fixes or refinements.

### 2.1 Permissions & auto-mode  (→ likely deep-analysis target)
- **[NEW]** `autoMode.classifyAllShell` — route all Bash/PowerShell through the auto-mode classifier, not only arbitrary-code-execution patterns (2.1.193)
- Auto-mode denial reasons surfaced in the transcript, the denial toast, and `/permissions` recent denials (2.1.193)
- **[NEW]** `sandbox.credentials` — block sandboxed commands from reading credential files and secret env vars (2.1.187)
- Org-configured model restrictions in the model picker, `--model`, `/model`, `ANTHROPIC_MODEL` (+ "restricted by your organization's settings" message) (2.1.187)
- `Agent(type)` deny rules and `Agent(x,y)` allowed-types restrictions now enforced for named subagent spawns (2.1.186)
- Background subagents now surface permission prompts in the main session (vs auto-denying); dialog shows which agent is asking; Esc denies just that tool (2.1.186)
- `/permissions` Recently-denied: approving a denial now persists on close (2.1.191)
- Sandbox network permission dialog remembers "Yes" hosts for the rest of the session (2.1.191)

### 2.2 Background agents & subagent lifecycle  (module `36_background_agents/`, → deep-analysis target)
- **[NEW]** automatic memory-pressure reaping for idle background shell commands (disable: `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP=1`) (2.1.193)
- bg launch result no longer instructs Claude to "end your response" — it keeps working on other tasks while the agent runs (2.1.193)
- backgrounding (←←) spurious "N background tasks would be abandoned" cancel when all tasks carry over (2.1.193)
- pinned bg agents re-prompted to "Continue from where you left off" after every auto-update (2.1.193)
- backgrounding the main turn spawning a phantom "general-purpose (resumed)" subagent that re-ran the conversation (2.1.193)
- agent panel hiding sibling agents when viewing a subagent (2.1.193); agent panel jumping a row past the overflow cap (2.1.191)
- bg agents resurrecting after being stopped — stop from the tasks panel is now permanent (2.1.191)
- `claude agents`: builtin slash commands (`/usage`) no longer sent as prompt text; pasted-image placeholder shown instead of full paths (2.1.191)
- bg jobs stuck "working" indefinitely when the agent ended a turn without structured output (2.1.187)
- channel connections dropping after navigating to agents view and back, and after `/bg`, `/tui`, `/update` (2.1.187)
- **Subagent depth tracking:** resumed subagents restore their original spawn depth; **forked subagents count toward the depth cap** (2.1.187) — *continuation of the v2.1.172/181 nested-subagent depth limit work*
- leaked agent worktree registrations: locked `.git/worktrees/` entries from killed agents auto-cleaned (2.1.187)
- bg task previews flashing raw tool names; bg session recaps duplicated; opening bg session leaving previous screen painted; Esc/Ctrl+C unresponsive while bg agents run; bg job stale "needs input"; dark-theme flash; mouse-selected-text-after-delete (all 2.1.186)

### 2.3 MCP  (platform, → deep-analysis target)
- **[NEW]** `claude mcp login <name>` / `claude mcp logout <name>` — authenticate MCP servers from the CLI without the interactive `/mcp` menu (`--no-browser` stdin redirect for SSH) (2.1.186)
- startup notice when MCP servers need authentication, pointing at `/mcp` (2.1.193)
- `headersHelper` auth re-runs and reconnects automatically on a tool-call 401/403 (2.1.193)
- capability discovery (`tools/list`, `prompts/list`, `resources/list`) retries transient errors with backoff (2.1.191)
- OAuth discovery + token requests retry once after transient errors; headless skips the browser popup → paste-the-URL prompt (2.1.191)
- HTTP 404 error messages now show the URL and point to MCP config (2.1.191)
- **[NEW]** remote MCP tool-call idle timeout — hangs abort with an error instead of blocking 5 min (override `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`) (2.1.187)
- misleading "MCP server disconnected" notice for intentionally-retired tools on resume (2.1.186)
- `claude mcp get`/`remove` suggest closest configured name on typo; truncate long lists (2.1.186)
- MCP servers requiring auth no longer expose auth-stub tools to the model in headless/SDK mode (carried in from 2.1.183; verify state)

### 2.4 Telemetry / OTEL  (platform, → deep-analysis target)
- **[NEW]** `claude_code.assistant_response` OpenTelemetry log event with the model's response text — redacted unless `OTEL_LOG_ASSISTANT_RESPONSES=1`; when unset it follows `OTEL_LOG_USER_PROMPTS` (2.1.193). **Upgrade-behavior watch.**

### 2.5 Workflow / structured output  (module `42_workflow/`)
- `--json-schema` and workflow `agent({schema})`: the model can no longer re-call `StructuredOutput` indefinitely after a successful call; follow-up turns reliably return structured output (2.1.187)
- workflow `agent({schema})` subagents looping forever on repeated schema-validation failures now abort after 5 attempts (2.1.186)
- status filtering (press `f`) in the `/workflows` agent detail view (2.1.186)
- bg jobs in the agents view stuck "working" when ending a turn without structured output (2.1.187, overlaps §2.2)

### 2.6 Agent team  (module `30_agent_team/`)
- **[NEW]** `teammateMode: "iterm2"` setting (warning when auto mode can't find the `it2` CLI) (2.1.186)
- agent teams: teammates spawned via tmux/pane backends inherit the leader's `--effort` level (2.1.186)
- agent stop notifications now correctly attribute who stopped the agent; "finished"/"stopped" wording (2.1.187)

### 2.7 Auto memory  (module `31_auto_memory/`)
- memory: the agent is reminded to compact its `MEMORY.md` index when nearing the size limit (2.1.186)

### 2.8 Skills  (feature)
- a "Skills" section added to the `/plugin` Installed tab (2.1.186)
- skill frontmatter `display-name`, `default-enabled`, `fallback`, `metadata.*` now accept kebab-case, snake_case, and camelCase (2.1.186)
- malformed `SKILL.md` YAML frontmatter loads the body with empty metadata instead of failing silently (2.1.186)

### 2.9 Rewind / checkpoint  (NEW surface)
- **[NEW]** `/rewind` support for resuming a conversation from before `/clear` was run (2.1.191)

### 2.10 Plugins
- plugin auto-rename: marketplace `renames` maps are followed automatically, updating settings to the new name (2.1.193)
- `/plugin` surfaces plugins you haven't used recently so you can clean them up (2.1.187)
- `/plugin` Installed "more above" indicator when already at the top (2.1.186)

### 2.11 Model selection
- `/model` and other client-data-gated UI showing stale/empty state immediately after `/login` (2.1.193)
- org-configured model restrictions (2.1.187 — see §2.1)
- deprecated/auto-updated model warning on stderr in print mode, covering agent frontmatter (carried in from 2.1.183; verify)

### 2.12 Streaming / performance
- streaming CPU usage reduced ~37% by coalescing text updates to 100ms; long-session memory growth from terminal output cache reduced (2.1.191)
- streaming "Content block not found" / JSON parse errors after the machine wakes from sleep (2.1.186)
- stream-stall hint reworded to "Waiting for API response · will retry in …", triggers after 20s (was 10s) (2.1.185)

### 2.13 CLI / bash mode / input
- **[NEW]** live file-path autocomplete in bash mode (`!`) (2.1.193)
- `!` bash commands now auto-trigger a Claude response to the output (`respondToBashCommands: false` to keep context-only) (2.1.186)
- `/add-dir` message when the directory is already a working directory (2.1.193)
- `claude --help` now lists the `--bg`/`--background` flag (2.1.187)
- `/btw` ←/→ arrow navigation through earlier answers (2.1.187)
- pasted Korean/CJK mojibake in terminals delivering paste as per-byte extended-key events (2.1.187)
- `--tools` allowing feature-gated tools to slip through before flags loaded on cold first launch (2.1.186)

### 2.14 Sandbox
- `sandbox.credentials` (2.1.187 — see §2.1); sandbox network host-remember (2.1.191 — see §2.1)

### 2.15 Hooks
- hooks with comma-separated matchers (e.g. `"Bash,PowerShell"`) silently never firing (2.1.191)

### 2.16 Remote control / update / share
- Remote sessions ~2.7s slower start after agent-proxy CA system-trust install (2.1.187)
- `/update` over Remote Control hanging when a startup trust dialog would have shown (2.1.187)
- Esc/Ctrl-C/Ctrl-D not working while `/share` is uploading (2.1.187)
- `forceRemoteSettingsRefresh` now takes effect via MDM/file policy; fetch sends `Cache-Control: no-cache` (2.1.191)

### 2.17 Code review
- `/review <pr>` now uses the same review engine as `/code-review medium` (2.1.186)

### 2.18 Retry
- `CLAUDE_CODE_MAX_RETRIES` capped at 15; for unattended sessions use `CLAUDE_CODE_RETRY_WATCHDOG` (2.1.186)

### 2.19 Auth
- "Claude Platform on AWS - refresh credentials" option in `/login` when `awsAuthRefresh` is configured (2.1.186)

### 2.20 UI / terminal reliability tail (mostly out of deep-scope)
- focus mode "Ran N PostToolUse hooks" timing lines (carried from 2.1.183); welcome splash overflow on 80×24 (2.1.191); misaligned permission-prompt option numbers (2.1.186); `~~strikethrough~~` literal tildes (2.1.186); mouse click in select menus fullscreen (2.1.187); Cmd+click Ghostty ssh/tmux + macOS (2.1.191/187); `/login` URL truncation in Windows Terminal (2.1.191); `/voice` org-policy message (2.1.191); scroll-position jump during streaming (2.1.191); session cost not showing for usage-based Enterprise/Team (2.1.186); vim-mode prompt-history search hint (2.1.191); subagent transcript scroll bleed (2.1.186); Chrome tab-group isolation (2.1.186); `/install-github-app` optional workflow (2.1.187); `[VSCode]` resume large session (2.1.187)

---

## 3. Proposed deep-analysis scope (priority order)

Following the focused-delta precedent of the v2.1.183 tree (which scoped to 5 features),
the highest-signal candidates for source-level analysis in this window are:

| # | Theme | Module dir | Why |
|---|-------|-----------|-----|
| 1 | **Permissions & auto-mode** | NEW (e.g. `38_permissions/`) or `symbol_index_infra_platform.md` | Most net-new surface: `autoMode.classifyAllShell`, denial-reason surfacing, `sandbox.credentials`, org model restrictions, `Agent()` enforcement |
| 2 | **Background agents & subagent depth** | `36_background_agents/` (extend) | Heaviest churn; memory-pressure reaping is new; forked-subagent depth-cap extends the v2.1.183 depth analysis |
| 3 | **MCP** | NEW (e.g. `39_mcp/`) or platform | `claude mcp login/logout`, retry/backoff, OAuth headless, 401/403 re-auth, idle timeout |
| 4 | **Telemetry / OTEL** | platform | `assistant_response` event + the `OTEL_LOG_USER_PROMPTS` inheritance gotcha |
| 5 | **Workflow** | `42_workflow/` (extend) | `StructuredOutput` 5-attempt abort + follow-up structured-output fix; `/workflows` status filter |
| 6 | **Agent team** | `30_agent_team/` (extend) | `teammateMode: iterm2`, `--effort` inheritance, stop attribution |
| 7 | **Skills** | NEW or feature | Frontmatter case-tolerance, malformed-YAML handling, `/plugin` skills section |
| 8 | **/rewind before /clear** | slash-commands / checkpoint | Genuinely new resume surface |
| 9 | **Auto memory** | `31_auto_memory/` (extend) | `MEMORY.md` compact-reminder near size limit |

**Likely out of deep-scope** (name honestly in the eventual `changelog_analysis.md` §"Out of scope"):
the large UI/terminal/Windows reliability tail (§2.20), streaming-perf internals (§2.12),
remote-control/update plumbing (§2.16), retry-cap tuning (§2.18), and the `/review`→
`/code-review medium` re-wiring (§2.17, already covered by the v2.1.183 `45_code_review`
lineage — verify).

---

## 4. Next steps (analysis pipeline)

1. **Inline scout** each priority theme: confirm anchors in the v2.1.193 bundle
   (tool/setting constants, `feature_gates.json` events, gate fns) and write
   `_scout_dossier_<theme>.md` next to this tree with verified `cli_inner_pretty.js:<line>`
   anchors + the conventions reminder.
2. **Workflow 1 — modules:** `pipeline(THEMES, scout→outline, write-each-doc, finalize)`;
   finalize writes each module README + a per-theme `symbol_additions_v2_1_193_<theme>.md`.
   Plus a parallel phase for `by_version/<ver>.md` files (2.1.185/186/187/190/191/193).
3. **Workflow 2 — overview:** build/merge the four `symbol_index_*.md`, write the deep
   `changelog_analysis.md` / `changelog_to_code_map.md` / `file_index.md` / READMEs, then
   per-module cross-validation reports, then a completeness critic.
4. **Second independent default-to-FAIL cross-validation** re-reading every load-bearing
   anchor in the live v2.1.193 bundle (the lesson reaffirmed across the v2.1.183 tree:
   a second bundle-re-reading pass catches false-deltas and version-misattribution the
   first verify misses — and a false-delta hunt must diff **both** v2.1.183 and the
   relevant earlier baseline, since "new vs the old tree" is often carryover, not a
   v2.1.193 change).

> **Concurrency note (from prior runs):** if this machine has 4 cores, the workflow
> concurrency cap is `min(16, cores−2)=2`, so each workflow runs in waves and can take
> hours. Scope finder/verifier fan-out accordingly.

---

## Related

- Previous window: [`../../../claude_code_v_2.1.183/analyze/00_overview/changelog_analysis.md`](../../../claude_code_v_2.1.183/analyze/00_overview/changelog_analysis.md) (v2.1.156 → v2.1.183)
- This window's raw delta: [`../../CHANGELOG.md`](../../CHANGELOG.md) (v2.1.185 → v2.1.193)
- Reference format tree: `../../../claude_code_v_2.1.183/analyze/`
