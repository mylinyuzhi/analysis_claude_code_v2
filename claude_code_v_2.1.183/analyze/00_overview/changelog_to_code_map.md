# Changelog to Code Map — v2.1.156 → v2.1.183 (FIVE-feature focused delta)

This is the per-changelog-bullet code-traceability index for the **v2.1.156 → v2.1.183** window. Unlike the prior tree's comprehensive map ([`../../../claude_code_v_2.1.156/analyze/00_overview/changelog_to_code_map.md`](../../../claude_code_v_2.1.156/analyze/00_overview/changelog_to_code_map.md), which mapped *every* bullet of v2.1.143 → v2.1.156), **this tree is a FOCUSED delta analysis scoped to FIVE features the user requested**:

| Feature | Module dir | Headline delta |
|---------|-----------|----------------|
| **Agent Team** | [`../30_agent_team/`](../30_agent_team/) | 2.1.178 implicit-team redesign (`TeamCreate`/`TeamDelete` removed) |
| **Dynamic Workflows (ultracode)** | [`../42_workflow/`](../42_workflow/) | 2.1.160 `workflow`→`ultracode` keyword + 172/174/169 fixes |
| **Background Agents** | [`../36_background_agents/`](../36_background_agents/) | 2.1.172/181 nested-subagent 5-level depth limit + lifecycle |
| **Compaction** | [`../07_compact/`](../07_compact/) | 2.1.178 `--fallback-model` + 172 1M-clamp + 6-source window resolver |
| **Auto Memory** | [`../31_auto_memory/`](../31_auto_memory/) | 2.1.172 team memory stores recall + 181 status-line |

**Every other subsystem (plan mode, hooks, skills, permissions, model picker, MCP, UI/renderer, telemetry, auth, IDE, Chrome, Remote Control, …) also changed in this window but is intentionally OUT OF SCOPE.** To keep this map honest about coverage, each version section ends with an **"Out of scope (not analyzed in this tree)"** line that enumerates the remaining bullets so nothing is silently dropped. Only the in-scope bullets get a `cli_inner_pretty.js:<line>` anchor + a module-doc link.

For each in-scope bullet this index records:

- **Feature** — one of the five above.
- **v2.1.183 decl** — `cli_inner_pretty.js:<line>` (verified in the bundle whose `VERSION:"2.1.183"` is at `cli_inner_pretty.js:848`), or `(inferred)` where the code site is not isolated.
- **Module doc** — relative link to the document that covers it in depth.

Companion documents:

- [`changelog_analysis.md`](changelog_analysis.md) — per-version narrative of the in-scope deltas
- [`symbol_additions_v2_1_183_*.md`](.) — per-feature exhaustive symbol tables for this window
- [`cross_validation_report_*.md`](.) — per-feature adversarial verification logs
- [`symbol_index_*.md`](.) — obfuscated → readable symbol mappings (routing layer)
- [`file_index.md`](file_index.md) — extracted-file inventory

> Source bundle under analysis: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
> (`VERSION:"2.1.183"`, `BUILD_TIME:"2026-06-18T23:04:10Z"`, `GIT_SHA:9d251abd…` — cli_inner_pretty.js:848; 699,346 lines).
> Because the bundle is the 2.1.183 *result*, earlier-version in-scope behaviors (e.g. the 2.1.160 keyword rename, the 2.1.172 depth limit) appear in their *cumulative post-2.1.183* form. Versions are listed **newest first**.
> Published window: 2.1.183, 181, 179, 178, 176, 175, 174, 173, 172, 170, 169, 168, 167, 166, 165, 163, 162, 161, 160, 159, 158, 157. (180, 177, 171, 164 skipped upstream; 168/167/165 are "bug fixes and reliability improvements" placeholders with no enumerated bullets.)

---

## v2.1.183

| Bullet excerpt | Feature | v2.1.183 decl | Module doc |
|----------------|---------|---------------|------------|
| Fixed tmux teammate panes failing to launch when the shell has slow rc-file initialization, and keystrokes typed during agent spawn leaking into the new tmux pane | **Agent Team** | `cli_inner_pretty.js:421874` (`a3n` `respawn-pane -k -- <cmd>`), `362642` (`Gke="cat"` holding process), `422036` (`createTeammatePaneWithLeader` split-window) | [spawn_backends_and_tmux_fix.md](../30_agent_team/spawn_backends_and_tmux_fix.md) |
| Fixed background tasks started by a teammate being killed when the teammate finishes a turn | **Agent Team** | `cli_inner_pretty.js:445827` (`G4e` `<note>` + owner-alive gate), `445753` (`YR` completed-but-kept-alive), `445750` (`Lye` keepaliveReasons) — exact one-line behavior fix `(inferred)` (keepalive infra pre-exists; see open question §1) | [coordinator_and_background_survival.md](../30_agent_team/coordinator_and_background_survival.md) |

> **Out of scope (not analyzed in this tree):** auto-mode destructive-git/`terraform destroy` blocks; deprecated-model stderr warning incl. agent frontmatter; `attribution.sessionUrl` setting; `/config --help` shorthand-key listing; `/config` toggle behavior (Enter/Space/Esc); removed startup "setup issues" line; `thinking.disabled.display` 400 on subagent spawns / session-title generation; WebSearch empty in subagents; vim native-cursor history fix; Windows-Terminal TUI corruption under nested-subagent load; re-prompt-once on thinking-only turns; user-skill autocomplete dedupe; MCP auth-stub tools hidden in headless/SDK; scheduled-task/webhook deliveries classified as task notifications (not keyboard input); focus-mode PostToolUse timing lines. *(Several of these — `thinking.disabled.display` on subagent spawns, nested-subagent TUI corruption, scheduled-delivery classification — touch subagent/teammate-adjacent code but are reliability/UI fixes, not part of the five focus deltas.)*

---

## v2.1.181

| Bullet excerpt | Feature | v2.1.183 decl | Module doc |
|----------------|---------|---------------|------------|
| Fixed foreground subagents spawning unbounded nested chains; they now respect the same 5-level depth limit as background subagents | **Background Agents** | `cli_inner_pretty.js:221800` (`v1i=5`), `103152` (`Gz` depth reader), `371188`/`371194` (`cio` gate `if (Rc(i,vs)) return s < v1i`, hoisted above the async block so fg+bg share it), `371230` (`bte` threads depth), `387154` (`bte(…, Gz(parent))`) | [nested_subagent_depth_limit.md](../36_background_agents/nested_subagent_depth_limit.md) |
| Changed the `Improved N memories` line to no longer list individual files outside verbose mode | **Auto Memory** | `cli_inner_pretty.js:383399` (`Svp` `y = o && s.map(Evp)` — file list verbose-only), `382871` (`SNa` dispatch `p = o || !!s`) | [status_line_and_misc_delta.md](../31_auto_memory/status_line_and_misc_delta.md) |
| Fixed background agents inheriting another session's `ANTHROPIC_*` provider env (gateway URL, custom headers, `/model` aliases) — *(landed earlier; the 2.1.181 worker-env scrub is the same machinery)* | **Background Agents** | `cli_inner_pretty.js:594705` (`_Fl` builder; scrub body 595802-595858), `595849` (`GLo` provider-auth scrub), `191672` (`XLt` host-auth token set), `191730` (`JLt` `VERTEX_REGION_CLAUDE_` prefix) | [worker_env_isolation_2181.md](../36_background_agents/worker_env_isolation_2181.md) |

> Note: the 2.1.181 changelog does not have a dedicated "ANTHROPIC_* env leak" bullet — the leak fix is the 2.1.174 bullet "Fixed background sessions inheriting another session's `ANTHROPIC_*` provider env"; the v2.1.183 `_Fl` 4-pass scrub is the cumulative end state. It is mapped under 2.1.174 below and cross-referenced here because the dossier dates the multi-pass scrub at 2.1.181.

> **Out of scope (not analyzed in this tree):** `/config key=value` syntax; `sandbox.allowAppleEvents`; `CLAUDE_CLIENT_PRESENCE_FILE`; Bun 1.4 upgrade; line-by-line paragraph streaming; auto-retry on mid-thinking connection drop; subagent-panel idle auto-hide/5-row cap/footer hints; MCP OAuth browser-page restyle; fullscreen Cmd/Ctrl+click URL opening; prompt-cache attestation-token fix (custom base URL / Foundry); Write/Edit 0-byte/truncated on network drives; macOS `open`/`osascript` -600 Apple Events entitlement; ~120ms startup managed-settings-fetch regression; 15s blank-terminal account-fetch fix; null-project-entry startup crash; Spotlight-reindex TUI freeze; 30-day transcript-cleanup history loss; `/recap` + forks using previous model after switch; subagent "Thinking" duration showing parent's elapsed; subagent-blocked-on-nested-agent "waiting" panel state; stale API-retry indicator; AWS `awsCredentialExport` short-lifetime refresh; `claude mcp get/list` tools-fetch-failed status; `/remote-control` stale "connecting…"; `ExitWorktree` clean-worktree removal on Windows; settings ENOENT on relative-symlink `~/.claude`; IDE selection line-number off-by-one; Ctrl+C clipboard-overwrite after native selection; Ctrl+V text paste; agent-dir EEXIST (Windows/OneDrive); AskUserQuestion preview wrap + multi-select "Other" drop; `/stats` UTC-negative dates; Linux `/copy` clipboard-util detection; tab-indented Write preview; queued-prompt highlight; Ghostty spinner glyph.
> *(Several subagent-panel/duration/waiting items above are subagent-execution-adjacent but are UI/render fixes, out of the five deltas. The `/recap`+fork model-switch fix is model-resolution, out of scope.)*

---

## v2.1.179

| Bullet excerpt | Feature | v2.1.183 decl | Module doc |
|----------------|---------|---------------|------------|
| Fixed remote session background tasks appearing stuck as "still running" between turns | **Background Agents** | `(inferred)` — bg-session classifier / `agents --json` state surfacing; closest sites `lGf` state mapper `cli_inner_pretty.js:691342`, retire/respawn inflight guards `594895`-`595013`. Not isolated to one patch line. | [bg_command_surface_and_retire_delta.md](../36_background_agents/bg_command_surface_and_retire_delta.md) |

> **Out of scope (not analyzed in this tree):** mid-stream connection-drop partial-response preservation + stuck "running tool" spinner; WSL2 mouse-wheel scroll; sandbox `denyRead`/`allowRead` glob making Bash description enormous; feedback-survey single-digit rating capture; welcome-screen promo-banner stacking; Ctrl+O subagent-transcript view *(subagent-UI, not execution)*; prompt-input focus from subagent/footer panel; plugin-loading perf in remote sessions.

---

## v2.1.178

| Bullet excerpt | Feature | v2.1.183 decl | Module doc |
|----------------|---------|---------------|------------|
| Agent teams: removed `TeamCreate`/`TeamDelete`; every session now has one implicit team — spawn teammates directly with the Agent tool's `name` parameter; `team_name` still accepted but ignored | **Agent Team** | `cli_inner_pretty.js:682765` (`j3f` `initializeSessionTeam`), `682752` (`xic` `session-<id[:8]>` name), `693472` (bootstrap gate `Sl()&&!xr()&&!a.agentId`), `423053`→`423041` (`cqa`→`HDp` spawn route), `423547`-`423591` (Agent `call` `if (_ && s && !L)`, `_ = Sl()?teamContext`), `423446` (`IDp` schema: `name`/`mode`/deprecated `team_name`); `grep TeamCreate`/`TeamDelete`=0 | [implicit_team_and_agent_tool_spawn.md](../30_agent_team/implicit_team_and_agent_tool_spawn.md) |
| Changed the workflow prompt keyword to use a purple shimmer highlight and trigger only on explicit phrases like "run a workflow" or "workflow:", not on any mention of the word | **Dynamic Workflows** | `cli_inner_pretty.js:464261` (`yho`=`hho(e,"ultracode")` single-word runtime matcher), `154110`/`154111` (`autoAccept`/`autoAcceptShimmer` violet), `622226` (`ji` highlight memo), `418177`/`418194` (the "run a workflow"/"use a workflow" phrases live ONLY in the tool description `gdo` — there is **no** phrase regex; framing trap) | [ultracode_keyword_trigger_delta.md](../42_workflow/ultracode_keyword_trigger_delta.md) |
| Fixed compaction not honoring `--fallback-model`: compaction now falls back to the configured fallback model chain on overload or model-availability errors | **Compaction** | `cli_inner_pretty.js:461088` (`del` summarize), `461189`-`461285` (`while(!0)` fallback loop, `fallbackModel:y[_+1]`), `461078` (`ICn` chain builder), `461266` (`tengu_model_fallback_triggered{query_source:"compact"}`), `461118` (cache-prefix fork fallback-aware); `vF` model-fallback error class | [fallback_model_in_compaction.md](../07_compact/fallback_model_in_compaction.md) |
| Fixed background sessions created with `/bg` or `←←` after a turn finished showing "Working" forever in the agents list | **Background Agents** | `(inferred)` — most likely `lGf` state mapper `cli_inner_pretty.js:691342` (terminal `done`/`failed`/`stopped` from state+status) and/or empty-idle-grace retire `594961`-`594982`. Not pinned to a single patch line (dossier open question §1) | [bg_command_surface_and_retire_delta.md](../36_background_agents/bg_command_surface_and_retire_delta.md) |

> Sub-deltas of the Agent-Team bullet also covered in [mailbox_lifecycle_and_sendmessage_delta.md](../30_agent_team/mailbox_lifecycle_and_sendmessage_delta.md) (SendMessage prompt rewrite `rza@434286`, `bridge:`/`uds:` cross-session addressing `434611`, `"main"` recipient + reserved name `LY@362512`) and [coordinator_and_background_survival.md](../30_agent_team/coordinator_and_background_survival.md) (coordinator expansion `bvd@221940`, worker-stop tool `uP`).

> **Out of scope (not analyzed in this tree):** `Tool(param:value)` permission-rule syntax (e.g. `Agent(model:opus)`); nested `.claude/skills` `<dir>:<name>` loading; nearest-`.claude/` agent/workflow/output-style precedence *(workflow-save path touches workflow files but the change is the directory-resolution rule, not the Workflow tool — out of the ultracode delta)*; auto-mode classifier pre-evaluating subagent spawns; `/doctor` flat-tree layout; skill-truncation warning count; Remote Control error messages; `/bug` description requirement; stale websocket/OAuth fd OOM crash; Chrome OAuth account-mismatch; nested-skills permission-prompt block in non-interactive; subagent-transcript tool-results / dropped-messages / ctrl+b restart *(subagent UI/lifecycle, not the depth/team deltas)*; `claude agents` worker 401 with custom gateway; stale-cached-request auth-after-refresh; Linux sandbox symlink `.claude/skills`/`hooks`; `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE`; MCP server-level disallowedTools specs; vim undo stepping; statusline custom-URI-scheme links; [VSCode] CJK IME Esc.

---

## v2.1.176

| Bullet excerpt | Feature | v2.1.183 decl | Module doc |
|----------------|---------|---------------|------------|
| Fixed backgrounded sessions showing "Working" forever when `/bg` mid-turn had nothing left to continue | **Background Agents** | `(inferred)` — same "Working forever" cluster as 2.1.178; `/bg` fork seed `iKn` `cli_inner_pretty.js:566927` produces empty-seed guard in `lgf@567100`, terminal-state surfacing via `lGf@691342`. Exact site not isolated (dossier open question §1) | [bg_command_surface_and_retire_delta.md](../36_background_agents/bg_command_surface_and_retire_delta.md) |
| Fixed `claude --bg -cn <name>` not seeding the session name | **Background Agents** | `(inferred)` — session name seeded via `CLAUDE_CODE_SESSION_NAME` in `_Fl@595817`; the `-cn`/`--session-name` arg-parse fix likely in the `--bg` argparser region (`566568`/`566792`), not isolated (dossier open question §2) | [bg_command_surface_and_retire_delta.md](../36_background_agents/bg_command_surface_and_retire_delta.md) |
| Fixed background-session respawn to neutralize Windows network paths / rejecting malformed resume IDs / `~/.claude/daemon` ReadOnly | **Background Agents** | `(inferred)` — retire/respawn lifecycle `594895`-`595013`; UNC-neutralize/`ReadOnly`-attribute specific sites not isolated (dossier open question §4) | [bg_command_surface_and_retire_delta.md](../36_background_agents/bg_command_surface_and_retire_delta.md) |

> **Out of scope (not analyzed in this tree):** conversation-language session titles + `language` setting; `footerLinksRegexes`; Bedrock `awsCredentialExport` `Expiration`-based caching; `availableModels` alias-redirect / `/fast` allowlist enforcement; auto-mode Fable 5 fallback to best Opus; hook `if` Read/Edit/Write path patterns; Linux sandbox `.claude/settings.json` symlink; `/copy` tmux-over-SSH + old tmux paste-buffer; Remote Control model-switch on web/mobile connect; RC disconnect human-readable reason + duplicate transcript line; RC disconnect on account switch; `/cd` + worktree-move stale git-branch; `claude agents` back-detach decoupling; bg PR-URL search during scheduled wakeups; agents-view Windows text-cursor; cloud-session idle "Could not resolve authentication"; quiet model-auto-update notices.

---

## v2.1.175

> **Out of scope (not analyzed in this tree):** `enforceAvailableModels` managed setting (the `availableModels` allowlist also constrains the Default model; user/project settings cannot widen a managed list). Model-allowlist enforcement — not one of the five focus features.

---

## v2.1.174

| Bullet excerpt | Feature | v2.1.183 decl | Module doc |
|----------------|---------|---------------|------------|
| Fixed background sessions inheriting another session's `ANTHROPIC_*` provider env (gateway URL, custom headers, `/model` aliases) from the shell that started the background daemon | **Background Agents** | `cli_inner_pretty.js:594705` (`_Fl` worker-env builder; scrub body 595802-595858), `595849` (`GLo` provider-auth scrub incl. `ANTHROPIC_CUSTOM_HEADERS`/`ANTHROPIC_UNIX_SOCKET`), `191672` (`XLt` host-auth token deletes), `191730` (`JLt` `VERTEX_REGION_CLAUDE_` prefix); vs v2.1.156 single-pass `Eq9`/`Y7q` (no provider auth) | [worker_env_isolation_2181.md](../36_background_agents/worker_env_isolation_2181.md) |
| Fixed Workflow tool `agent()` subagents missing per-agent attribution headers | **Dynamic Workflows** | `cli_inner_pretty.js:417152`-`417160` (`Dt` agentContext `{agentId,parentAgentId,depth,parentSessionId,agentType,subagentName,isBuiltIn}`), `417250` (`override:{agentId, agentContext:Dt}` on spawn); vs v2.1.156 `override:{agentId}` only. Header *render* site `(inferred)` (streaming/transcript layer; dossier open question §2) | [runtime_fixes_delta.md](../42_workflow/runtime_fixes_delta.md) |
| Fixed pre-warmed background workers failing with "Could not resolve authentication method" when claimed after sitting idle | **Background Agents** | `(inferred)` — plausibly subsumed by the §3.2 env-isolation rework (prewarm respawn re-runs `_Fl`); no dedicated prewarm auth-scrub line isolated (dossier open question §3) | [worker_env_isolation_2181.md](../36_background_agents/worker_env_isolation_2181.md) |

> **Out of scope (not analyzed in this tree):** `wheelScrollAccelerationEnabled`; `/model` picker Default-family row (Opus/Sonnet rows); `/model` hardcoded-Sonnet-label fix; Fable 5 usage-credits banner for enterprise; Bedrock GovCloud inference-profile prefix; macOS/Linux exit-pause after killed shell command; git co-author model-name attribution; `/advisor` blocked-model pre-select; skill hot-reload only-changed re-announce; [VSCode] `/usage` attribution dialog.

---

## v2.1.173

> **Out of scope (not analyzed in this tree):** Fable 5 `[1m]`-suffix normalization (1M context by default); spurious "sandbox dependencies missing" Windows startup warning. Model-id normalization + sandbox warning — not focus features.

---

## v2.1.172

| Bullet excerpt | Feature | v2.1.183 decl | Module doc |
|----------------|---------|---------------|------------|
| Sub-agents can now spawn their own sub-agents (up to 5 levels deep) | **Background Agents** | `cli_inner_pretty.js:221800` (`v1i=5`), `103152` (`Gz` depth reader, `main`→0), `371194` (`cio` gate `s < v1i`, above the async block), `371230` (`bte` threads depth), `446073` (`Xut` persists `spawnDepth`), `423722` (Agent-call `z = Gz(parent)+1`), `434085` (resume-path depth), `417155` (workflow-agent depth); vs v2.1.156 team-only `uE6@278956` with no depth concept (`grep agentDepth`=0) | [nested_subagent_depth_limit.md](../36_background_agents/nested_subagent_depth_limit.md) |
| Fixed sessions using 1M context without usage credits getting permanently stuck — the session now automatically compacts back under the standard context limit | **Compaction** | `cli_inner_pretty.js:134105` (`tH` hard cap, `if (ARr) return jQ`), `134118` (`ARr` 1M-clamp predicate), `134192` (`jQ=200000`), `229606` (`Fwn` 1M-credits 429 detector), `2968`/`2965` (`Wtr`/`N8e` `longContext1mCreditsBlocked` flag), `229192` (`tengu_1m_credits_clamp_activated`), `226891` (`z2` `source:"model-default"`) | [one_million_credits_clamp.md](../07_compact/one_million_credits_clamp.md) |
| Fixed memory recall not finding mounted team memory stores (`CLAUDE_MEMORY_STORES`) in remote sessions | **Auto Memory** | `cli_inner_pretty.js:151098` (`Nk` mounted-store-enables-team-recall: `if (env.CLAUDE_MEMORY_STORES?.trim()) return !0`), `147636`/`147666` (`Iu`/`Wse` `CLAUDE_CODE_REMOTE_MEMORY_DIR` honoring), `151103` (`uH` `hm()/team/`); vs v2.1.156 `nM$@144715` (herring_clock-only gate) | [team_memory_stores_recall.md](../31_auto_memory/team_memory_stores_recall.md) |
| Fixed background agents potentially reading another directory's project settings (`.mcp.json` approvals, trust) when dispatched onto a pre-warmed worker | **Background Agents** | `(inferred)` — plausibly subsumed by the `_Fl` env-isolation rework; no dedicated prewarm-settings-scrub line isolated (dossier open question §3) | [worker_env_isolation_2181.md](../36_background_agents/worker_env_isolation_2181.md) |
| Fixed a background sub-agent staying stuck as "active" in the agent panel after a nested agent it spawned was stopped | **Background Agents** | `(inferred)` — nested-subagent lifecycle (panel state after nested stop); ties to the depth-threaded agentContext, exact panel-render fix not isolated | [nested_subagent_depth_limit.md](../36_background_agents/nested_subagent_depth_limit.md) |
| Fixed `availableModels` restrictions not being applied to subagent model overrides, the agent dispatch model picker, and the advisor model | **Background Agents** *(partial — subagent-adjacent)* | `(inferred)` — model-allowlist enforcement is out-of-scope (model subsystem); listed here only because it names subagent model overrides | (out of scope — no module) |
| Fixed workflow validation rejecting scripts whose prompt strings or comments merely mention `Date.now()`/`Math.random()` | **Dynamic Workflows** | `cli_inner_pretty.js:416439` (`rWa` AST-walk determinism check, `acorn-walk` over MemberExpression/NewExpression), `419461` (called `e.script && rWa(...)`); vs v2.1.156 raw regex `@378256` that matched inside strings/comments | [tool_definition_fixes_delta.md](../42_workflow/tool_definition_fixes_delta.md) |

> **Out of scope (not analyzed in this tree):** Bedrock `~/.aws` region precedence + `/status` source; `/plugin` marketplace search bar; `model` attr on `lines_of_code.count` OTEL; multi-image "could not be processed" loop; agents-view 30s busy-spinner after reply; bg-session-attach EAUTH after daemon auto-update; `/model` agents-dispatch slash-prefix + org-disabled models; `availableModels` 1M-row hiding / version-specific IDs; `/model` Bedrock unsupported-model offering; doubled `[1M][1m]` suffix; `opusplan` 1M in plan mode; `WebFetch(domain:*.example.com)` wildcard + mid-pattern file rules; up-arrow history showing main agent's prompts with subagent tab open; perf (message-normalization removal); idle-CPU `/goal` chip / fewer subagent re-renders; Chrome batched tool loading; non-interactive Usage Policy refusal message; `/code-review` `ultra` when signed out; RC footer "/rc active"; `/loop` remote suppression; [VSCode] PowerShell raw-JSON + ANSI strip.
> *(The `availableModels`-vs-subagent-override and the up-arrow-history-with-subagent-tab bullets are subagent-adjacent but belong to the model and UI subsystems respectively, out of the five deltas.)*

---

## v2.1.170

> **Out of scope (not analyzed in this tree):** Claude Fable 5 launch (Mythos-class model); fixed transcripts not saving when launched from VS Code integrated terminal / a shell inheriting Claude Code env vars. Model launch + transcript-save — not focus features.

---

## v2.1.169

| Bullet excerpt | Feature | v2.1.183 decl | Module doc |
|----------------|---------|---------------|------------|
| Fixed `claude agents --json` omitting blocked and just-dispatched background sessions; added `--all` to include completed sessions, plus new `id` and `state` fields | **Background Agents** | `cli_inner_pretty.js:691275` (`aGf` `printAgentsJson`, 3-source merge live+disk+shorts), `691342` (`lGf` state mapper `working`/`blocked`/`done`/`failed`/`stopped`), `691294` (`--all` gate), `695321` (`.option("--all", …)`); vs v2.1.156 `bBz@642728` live-only `{pid,cwd,kind,startedAt,sessionId,name,status}` | [agents_json_surface_2169.md](../36_background_agents/agents_json_surface_2169.md) |
| `/workflows` now opens immediately even while a turn is in progress | **Dynamic Workflows** | `cli_inner_pretty.js:562632` (`jmf` slash command + `immediate:!0@562638`, desc "Browse running and completed workflows"); vs v2.1.156 `Pjz@538934` with no `immediate` flag | [runtime_fixes_delta.md](../42_workflow/runtime_fixes_delta.md) |
| Fixed background agents ignoring project-level settings `env` values (e.g. `ANTHROPIC_MODEL`) when dispatched onto a pre-warmed worker | **Background Agents** | `cli_inner_pretty.js:594705` (`_Fl` re-pass `...e.env` overrides scrub) — same worker-env machinery; exact project-`env` merge point `(inferred)` | [worker_env_isolation_2181.md](../36_background_agents/worker_env_isolation_2181.md) |
| Background sessions are now told that shared-checkout edits are blocked until they enter a worktree | **Background Agents** | `(inferred)` — worktree-isolation guard messaging; carryover region from v2.1.156 `esH@346660`, not re-isolated here | [bg_command_surface_and_retire_delta.md](../36_background_agents/bg_command_surface_and_retire_delta.md) |
| Background sessions now preserve `--ide`, `--chrome`, `--bare`, `--remote-control`, and other flags across retire→wake; respawn state validation hardened | **Background Agents** | `(inferred)` — respawn-flag whitelist carryover (`hqq`/`pwz`-family region); not re-derived (dossier §3.5 carryover) | [bg_command_surface_and_retire_delta.md](../36_background_agents/bg_command_surface_and_retire_delta.md) |
| The "CLAUDE.md is too long" warning threshold now scales with the model's context window | **Compaction** *(adjacent — context-window read)* | `(inferred)` — reads the resolved window (`oee`/`z2` family `cli_inner_pretty.js:226875`); the CLAUDE.md-warning consumer is a prompt-assembly site, out of the compaction-strategy delta | (out of scope — no module) |

> **Out of scope (not analyzed in this tree):** self-hosted `post-session` hook + SIGTERM→SIGKILL window; `--safe-mode`/`CLAUDE_CODE_SAFE_MODE`; `/cd` command; `disableBundledSkills`/`CLAUDE_CODE_DISABLE_BUNDLED_SKILLS`; Up/Down wrapped-row history nav; enterprise managed-MCP enforcement on reconnect/IDE/`--mcp-config`; macOS claude.ai 30-50ms turn stall; `claude -p` Windows slash/skill-scan hang; RC reconnect stuck after OAuth refresh; Windows GCM popup; footer hints with custom statusline; stale permission prompts on remote reattach; agents-view WSL stale frame; MCPB plugin cache invalidation; plugin `.in_use` PID lock sweep; OTEL client-cert path trust; api-key-auth-disabled message; Vertex/Foundry 5-min idle timeout; remote-managed-settings partial-apply; Windows auto-updater claude.exe-held; skill-tag color contrast; promo-credit Apple/Google; `claude agents` multi-session tip.

---

## v2.1.168 / v2.1.167 / v2.1.165

> **Out of scope (not analyzed in this tree):** all three are "Bug fixes and reliability improvements" placeholders with no enumerated bullets; nothing maps to the five focus features.

---

## v2.1.166

| Bullet excerpt | Feature | v2.1.183 decl | Module doc |
|----------------|---------|---------------|------------|
| Added `fallbackModel` setting to configure up to three fallback models tried in order when the primary model is overloaded or unavailable; `--fallback-model` now also applies to interactive sessions | **Compaction** *(provides the chain compaction consumes)* | `cli_inner_pretty.js:149266` (`fallbackModel` resolve: `cli.fallbackModel?.split(",") ?? settings.fallbackModel`), `461078` (`ICn` normalizes it into the dedup'd chain `del` walks) — the setting itself is model-layer, but the chain is the input to the 2.1.178 compaction fallback (DELTA 1) | [fallback_model_in_compaction.md](../07_compact/fallback_model_in_compaction.md) |
| Hardened cross-session messaging: messages relayed via `SendMessage` from other Claude sessions no longer carry user authority — receivers refuse relayed permission requests, and auto mode blocks them | **Agent Team** *(SendMessage relay authority)* | `(inferred)` — SendMessage validate/permission path (`p$p@434568`, `validateInput@434611`); the relayed-authority refinement is auto-mode-adjacent and not isolated as a focus delta | [mailbox_lifecycle_and_sendmessage_delta.md](../30_agent_team/mailbox_lifecycle_and_sendmessage_delta.md) |

> **Out of scope (not analyzed in this tree):** glob in deny-rule tool-name position; `MAX_THINKING_TOKENS=0`/`--thinking disabled`/per-model toggle disabling default-think models; retry-once on fallback for unexpected non-retryable error; `claude update` announces target version; `claude agents` URL-filter; recurring "image could not be processed"; remote-session worker-registration stuck; JetBrains terminal flicker (synchronized output); Shift+non-ASCII Kitty protocol; PowerShell validation hang; orphaned `--bg-pty-host` 100% CPU *(daemon pty-watchdog — carryover region, not a focus delta)*; voice mode `/login` stale auth; managed-settings invalid-entry enforcement; `${VAR}` managed-MCP predicates; bg worktree "No conversation found" crash-loop; Ctrl+O duplicate thinking; `/doctor` remote-session check; agents-dispatch multiline cursor; non-Unicode bg-row blank lines.
> Note: the "retry-once on fallback model" bullet (2.1.166) is the *general-turn* fallback retry, distinct from the *compaction-summarize* fallback loop (DELTA 1, 2.1.178); both consume the same `fallbackModel` chain but live in different code paths.

---

## v2.1.163

> **Out of scope (not analyzed in this tree):** `requiredMinimumVersion`/`requiredMaximumVersion` managed settings; `/plugin list` + `--enabled`/`--disabled`; `/btw` "c to copy"; Stop/SubagentStop `hookSpecificOutput.additionalContext`; skill `\$` escape; stdio MCP `CLAUDE_CODE_SESSION_ID` on `--resume`; `claude -p` background-shell hang; `claude -p` Bedrock/Vertex/Foundry `ANTHROPIC_API_KEY` + `CI=true`; bazel/EDR `$TMPDIR` override regression; Windows bash-env EEXIST; org-managed permission-rule mid-session apply; bg-session running-task loss on reattach after update *(bg-lifecycle, but a reattach-state fix not isolated as a focus delta)*; agent-view Esc misalignment; bg-task-chip Stop; paste-end-marker input freeze; hook `if:Bash(...)` subshell/backtick match; `Read(~/Desktop/**)` deny on `$HOME`; "(no content)" transcript line; bg-session background-update; clearer / menu descriptions; subscription-switch announcement slot; agents state-grouped dispatch cwd.

---

## v2.1.162

| Bullet excerpt | Feature | v2.1.183 decl | Module doc |
|----------------|---------|---------------|------------|
| `claude agents --json` now includes `waitingFor` showing what a waiting session is blocked on (e.g. permission prompt) | **Background Agents** | `cli_inner_pretty.js:691275` (`aGf`), `691305` (`...(p?.status === "waiting" && p.waitingFor && { waitingFor: p.waitingFor })`) — part of the same `agents --json` rework as 2.1.169 | [agents_json_surface_2169.md](../36_background_agents/agents_json_surface_2169.md) |
| Fixed cross-session messaging (`SendMessage`) silently breaking when `CLAUDE_CODE_TMPDIR` or `$TMPDIR` points at a deep directory | **Agent Team** *(mailbox path)* | `(inferred)` — mailbox path build `v4e@365920` / `EADDRINUSE`-class socket-path handling; the deep-`$TMPDIR` fix is carryover-adjacent, not isolated as a focus delta | [mailbox_lifecycle_and_sendmessage_delta.md](../30_agent_team/mailbox_lifecycle_and_sendmessage_delta.md) |

> **Out of scope (not analyzed in this tree):** `--tools` Grep/Glob on native builds; `/effort` persist-confirmation; click-slash-command-fills-not-runs; RC footer pill; Windsurf→Devin Desktop rename; read-only config-dir in-memory startup; WebFetch preapproved-domain rule precedence; Windows backslash/case permission rules + Read-deny hiding from Glob/Grep; Esc-at-turn-start drop in stream-json; API 400 surrogate/emoji truncation; MCP sub-1000ms timeout floor; LSP `workspaceSymbol` `query`; `claude agents` status-text width (60-120 col); session-name 40-col truncation; agents-attach list-bounce; agents Ctrl+V image paste; ←-background failed-row; agents-view reply requeue; agents open 5s stall; quieter startup grouping; shorter startup warnings; pinned launch-prompt warnings; compact failed-turn line; bg-service-startup endpoint-security wait; bg-dispatch spawn-failure error-class; removed Chrome/marketplace startup messages.

---

## v2.1.161

| Bullet excerpt | Feature | v2.1.183 decl | Module doc |
|----------------|---------|---------------|------------|
| Fixed the `/effort` dialog, workflow animations, and prompt keyword shimmer not honoring the "Reduce motion" setting | **Dynamic Workflows** *(shimmer reduce-motion)* | `cli_inner_pretty.js:622310`-`622313` (keyword highlight `if (Pw() && !WA)` — `WA` = reduce-motion guard on the violet shimmer push) | [ultracode_keyword_trigger_delta.md](../42_workflow/ultracode_keyword_trigger_delta.md) |
| Fixed Workflow agents spawned with `isolation: "worktree"` in background sessions being blocked from editing files inside their own worktree | **Dynamic Workflows** | `(inferred)` — worktree plumbing `cli_inner_pretty.js:417133`-`417143` (worktree system-prompt suffix), `417253` (`worktreePath:Ce` into `wj`), `389687` (isolation-redirect message); the exact bg write-permission-root fix not isolated (dossier open question §1) | [runtime_fixes_delta.md](../42_workflow/runtime_fixes_delta.md) |
| Fixed background subagent output corrupting `claude -p` stdout when using `--output-format text` or `json` | **Background Agents** *(adjacent)* | `(inferred)` — stdout-routing for bg subagent output; print-mode output path, not isolated as a focus delta | [bg_command_surface_and_retire_delta.md](../36_background_agents/bg_command_surface_and_retire_delta.md) |
| Fixed background sessions dispatched from `claude agents` booting on a stale model from the daemon's environment instead of the model in `settings.json` | **Background Agents** | `(inferred)` — same worker-env/model-resolution cluster as the `_Fl@594705` env-isolation rework; exact stale-model fix not isolated | [worker_env_isolation_2181.md](../36_background_agents/worker_env_isolation_2181.md) |

> **Out of scope (not analyzed in this tree):** `OTEL_RESOURCE_ATTRIBUTES` metric labels; agents `done/total` peek; `/mcp` unused-connector collapse; parallel-tool-call independent results; Linux fullscreen `wl-copy`/`xclip`/`xsel` + PRIMARY; `forceLoginOrgUUID`/`forceLoginMethod` third-party-provider regression; `/usage-credits` Team/Enterprise admin re-login; `/autofix-pr` worktree/other-repo; `--resume` picker non-git-worktree; Windows hooks explicit-bash; OTEL log-events pre-init drop; `claude mcp` secret redaction; potential Write-result crash on resume; completed-subagent stuck-running on finalize error *(subagent UI/finalize, not the depth/team deltas)*; `EADDRINUSE` `$TMPDIR` deep-path; layout-engine JIT perf; large-write render perf; [VSCode] GPU-accel tip.

---

## v2.1.160

| Bullet excerpt | Feature | v2.1.183 decl | Module doc |
|----------------|---------|---------------|------------|
| Renamed the dynamic-workflow trigger keyword from `workflow` to `ultracode`. The word "workflow" no longer triggers a run; asking for one in your own words still works. The trigger keyword is highlighted in violet in the prompt input | **Dynamic Workflows** | `cli_inner_pretty.js:464214` (`hho` matcher), `464261` (`yho`=`hho(e,"ultracode")`), `590606`-`590612` (reminder text "ultracode"), `418175` (tool-desc opt-in form), `154110`/`154111` (`autoAccept`/`autoAcceptShimmer` violet); vs v2.1.156 `pg6`=`Bg6(H,"workflows?")` + rainbow `fI` | [ultracode_keyword_trigger_delta.md](../42_workflow/ultracode_keyword_trigger_delta.md) |
| Fixed `/effort ultracode` incorrectly blaming the dynamic workflows setting when the model cannot run xhigh; ultracode is no longer offered on models that do not support it | **Dynamic Workflows** *(framing trap — already shipped in 2.1.156)* | `cli_inner_pretty.js:148898` (`T4`=`Pw() && (e===void 0 || hTe(e))`), `148967` (`ZQ` xhigh→high downgrade); this xhigh gating **already existed in v2.1.156** (`Vx`=`NZ() && (m===void 0 || ycH(m))@184853`) — NOT a 156→183 delta | [ultracode_keyword_trigger_delta.md](../42_workflow/ultracode_keyword_trigger_delta.md) |
| Removed `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE`; the environment variable is now a no-op | model / fast-mode *(out of scope)* | — | (out of scope — no module) |

> **Out of scope (not analyzed in this tree):** prompt before writing shell startup files / `~/.config/git/`; `acceptEdits` build-tool-config prompts; Edit-after-grep read-before-edit; WSL copy-on-select PowerShell interop; restore-completed-session history-drop; bg overnight-retire history-drop + re-run; `claude --bg` "socket missing" cold-start; Windows bg-session cwd-delete-after-`claude rm`; resumed-work shown under Completed; agents-view exit auto-updater re-check; Windows attach input unresponsive under CPU load; sync-output markers on Apple-Terminal/tmux; mouse-wheel prompt-history; CJK IME placement; `file:///C:/...` rewrite; voice non-ASCII path; auto-mode 3P-provider message; model-not-found `--model` via SDK; brief-mode scrollback; vim `p` paste; bg-session reopen perf; auto-mode classifier latency; bg teardown SIGTERM-before-SIGKILL; removed JetBrains startup suggestion.

---

## v2.1.159

> **Out of scope (not analyzed in this tree):** "Internal infrastructure improvements (no user-facing changes)" — behavior-neutral checkpoint; nothing maps to the five focus features. (As with v2.1.150 in the prior tree, the build embeds only its own version string `"2.1.183"`.)

---

## v2.1.158

> **Out of scope (not analyzed in this tree):** Auto mode now available on Bedrock/Vertex/Foundry for Opus 4.7/4.8 via `CLAUDE_CODE_ENABLE_AUTO_MODE=1`. Auto-mode availability — permissions subsystem, not a focus feature.

---

## v2.1.157

| Bullet excerpt | Feature | v2.1.183 decl | Module doc |
|----------------|---------|---------------|------------|
| Added a "Workflow keyword trigger" setting in /config to stop the word "workflow" in a prompt from triggering a dynamic workflow | **Dynamic Workflows** | `cli_inner_pretty.js:148797` (`Jyn` `workflowKeywordTriggerEnabled ?? !0`), `56011` (schema describe), `479214`-`479225` (/config toggle, label later renamed "Ultracode keyword trigger" in 2.1.160), `464668`/`622226` (gates reminder + highlight); vs v2.1.156 `grep`=0 | [ultracode_keyword_trigger_delta.md](../42_workflow/ultracode_keyword_trigger_delta.md) |
| Pressing backspace right after a workflow trigger keyword now dismisses the workflow request (same as alt+w) instead of deleting a character | **Dynamic Workflows** | `cli_inner_pretty.js:622362` (`el` `toggleKeywordIgnored`, `tengu_workflow_keyword_dismissed`/`_restored`) — backspace-dismiss wired to the same toggle | [ultracode_keyword_trigger_delta.md](../42_workflow/ultracode_keyword_trigger_delta.md) |
| Fixed `claude agents` completed sessions not retiring when an idle subagent was still parked or had leaked a backgrounded shell | **Background Agents** | `cli_inner_pretty.js:594936` (`retireIfSettled` broadened settled predicate), `445754` (`YR` completed-but-parked keepalive) — settled gate now accounts for parked subagents/leaked shells | [bg_command_surface_and_retire_delta.md](../36_background_agents/bg_command_surface_and_retire_delta.md) |
| Fixed background agent worktrees under `.claude/worktrees/` being orphaned after the 30-day job retention sweep | **Background Agents** *(adjacent)* | `(inferred)` — worktree-cleanup in the retention sweep; carryover region, not isolated as a focus delta | [bg_command_surface_and_retire_delta.md](../36_background_agents/bg_command_surface_and_retire_delta.md) |
| Fixed background sessions re-attached after a sleep/wake not telling the model the correct date | **Background Agents** *(adjacent)* | `(inferred)` — date-injection on bg reattach; not isolated as a focus delta | [bg_command_surface_and_retire_delta.md](../36_background_agents/bg_command_surface_and_retire_delta.md) |
| Fixed `--resume` not reporting background subagents that were running when the previous Claude Code process exited | **Background Agents** *(adjacent)* | `(inferred)` — resume bg-subagent reporting; ties to the `agents --json`/state surfacing cluster, exact site not isolated | [agents_json_surface_2169.md](../36_background_agents/agents_json_surface_2169.md) |
| [IDE] Fixed clicking Stop while a background subagent is running not actually stopping it | **Background Agents** *(adjacent)* | `(inferred)` — IDE Stop→bg-subagent kill wiring; not isolated as a focus delta | [bg_command_surface_and_retire_delta.md](../36_background_agents/bg_command_surface_and_retire_delta.md) |

> **Out of scope (not analyzed in this tree):** plugins in `.claude/skills` auto-load; `claude plugin init <name>`; `/plugin` arg autocomplete; `agent` settings.json field + `--agent`; `EnterWorktree` switch between Claude-managed worktrees; `tool_decision` `tool_parameters` (`OTEL_LOG_TOOL_DETAILS=1`); Claude-managed worktree unlock on finish; unprocessable-image text-placeholder; sandbox network-prompt in auto/bypass via desktop/IDE/SDK; agents idle-subagent/leaked-shell retire *(covered above)*; agents Esc-cancel slow "opening…"; copy-on-select tmux `set-clipboard on`; `--resume` picker fullscreen-leftover; `--worktree`/`--tmux` canonical-root; `/model` "Newer version available" hint; literal markdown markers fullscreen; managed-settings dialog terminal-freeze; rare duplicate scrollback line; right-click paste dup (VSCode/Cursor/Windsurf); WSL image paste/screenshot/drag; long/resumed-conversation perf; `/terminal-setup` GPU-accel; Feature-of-the-Week status notification; agents substring autocomplete; removed sandbox/`/ide` startup banners; [VSCode] fast-mode indicator on Opus 4.8.

---

## Coverage notes

- **Scope honesty.** This is a *five-feature delta* map, not a comprehensive one. The "Out of scope" lines under each version enumerate every non-focus bullet so the reader can see exactly what was *not* traced to code here. Out-of-scope subsystems that changed heavily in this window — plan mode (`opusplan`/`/ultraplan`), the model picker / `availableModels` allowlist (2.1.174/175/176), hooks (`post-session`, `additionalContext`), skills (nested `.claude/skills`, `disableBundledSkills`), permissions (`Tool(param:value)`, auto-mode git-destructive blocks), MCP, and the large Remote-Control / `claude agents` UI cluster — are deliberately left unmapped. The prior-tree map (v2.1.143→156) was comprehensive; this one is intentionally not.

- **`(inferred)` honesty.** Rows marked `(inferred)` are bullets whose behavior is real but whose exact patch line was not isolated in the obfuscated bundle — either because the fix is a small change inside a large carried-over region, or because it has no distinctive grep anchor. Where a *region* is verified but the exact line is not, the verified region is cited and the unmapped part is called out. The dossier open-questions carried here:
  - **"Working forever" (2.1.178 / 2.1.176):** the `/bg`/`←←`-after-turn session showing "Working" forever — two plausible loci (`lGf` state mapper `cli_inner_pretty.js:691342`, or the empty-idle-grace retire `594961`-`594982`); not pinned to one line.
  - **`--bg -cn <name>` name-seed (2.1.176):** session name seeded via `CLAUDE_CODE_SESSION_NAME` in `_Fl@595817`; the `-cn` arg-parse fix likely in the `--bg` argparser region (`566568`/`566792`), not isolated.
  - **Workflow bg-worktree edit (2.1.161):** worktree plumbing verified (`417133`-`417143`, `417253`, `389687`); the exact bg write-permission-root fix not isolated.
  - **Pre-warmed worker auth / project-settings (2.1.172/174):** plausibly subsumed by the `_Fl@594705` env-isolation rework (prewarm respawn re-runs `_Fl`); no dedicated prewarm-scrub line isolated.

- **Framing traps (verified NON-deltas).** Two changelog bullets describe behavior that **already shipped in v2.1.156** and are therefore not 156→183 deltas, flagged inline: (1) the 2.1.160 "ultracode not offered on models that can't run xhigh" — the xhigh gate `T4`/`ZQ` is functionally identical to v2.1.156 `Vx`/`or`; (2) the 2.1.178 "triggers only on explicit phrases" — there is **no** runtime phrase regex; the only single-word runtime keyword is `ultracode` (`hho`/`yho`), and the "run a workflow"/"use a workflow" strings live solely inside the tool description `gdo@418177`.

- **Carryover NOT re-documented.** Large parts of all five subsystems are byte-identical-modulo-rename carryover from v2.1.156 and are intentionally absent from the decl column (the unchanged file mailbox `$A@365950`, the BackendRegistry two-mode split, the Workflow VM runtime + caps, the compaction five-strategy ladder + `context-hint-2026-04-09` beta, the auto-memory runtime engine + `.consolidate-lock`). Each module README points back to the corresponding v2.1.156 doc for the unchanged spine.

- **Skipped/placeholder versions.** 180, 177, 171, 164 are absent from the upstream changelog (no public release notes). 168, 167, 165 are "Bug fixes and reliability improvements" with no enumerated bullets. 159 is "Internal infrastructure improvements". None contribute a mappable focus-feature bullet.
