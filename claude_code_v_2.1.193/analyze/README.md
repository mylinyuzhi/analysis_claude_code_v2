# Claude Code v2.1.183 → v2.1.193 — Twelve-Theme Autonomy-Hardening Source Delta

This tree is a **focused source delta** of the **v2.1.183 → v2.1.193** window, scoped to **twelve themes** that changed across the six published sub-releases (**2.1.185, .186, .187, .190, .191, .193**; the numbers **.184, .188, .189, .192** were never shipped). It is **not** a comprehensive every-module re-analysis — and unlike the prior tree ([`../../claude_code_v_2.1.183/analyze/`](../../claude_code_v_2.1.183/analyze/), which carried a second "reconstructed readable-source" layer), this is a **pure delta tree**: there is no `reconstructed_source/` / Layer-2. Every module here documents *only what changed* between the 2.1.183 bundle and the 2.1.193 bundle, anchored line-by-line.

**The single through-line is: harden the autonomy surface already shipped.** Where the v2.1.156 → v2.1.183 window *introduced whole features* (the implicit agent-team redesign, the `ultracode` keyword, nested subagents), this window is overwhelmingly **maturation** — auto mode gets *stricter and more transparent* (route all shell through the classifier, surface every denial reason), MCP gets *more resilient* (idle-timeout, self-healing re-auth, discovery/OAuth retries), the background/subagent lifecycle gets *more correct* (memory-pressure reaping, fork-aware depth counting, permanent stop, attribution), and observability *deepens* (the `claude_code.assistant_response` OTEL event). Almost every change is a small, surgical edit on mature machinery. There are exactly **two genuinely new surfaces**: `autoMode.classifyAllShell` (`cli_inner_pretty.js:55814`) and `/rewind`-before-`/clear` (`cli_inner_pretty.js:705599`).

## The twelve themes at a glance

| # | Theme | Module dir | Headline delta (v2.1.183 → v2.1.193) |
|---|-------|------------|--------------------------------------|
| 1 | Permissions & Auto-mode | [`38_permissions/`](38_permissions/) | `autoMode.classifyAllShell` (route ALL shell through the classifier), denial-reason surfacing, `sandbox.credentials`, org model-entitlement restrictions, approve-persists, `Agent(type)` named-spawn enforcement |
| 2 | Background Agents | [`36_background_agents/`](36_background_agents/) | Memory-pressure idle bg-shell reaping, fork-aware subagent depth tracking, permanent agent stop, backgrounding/panel fixes |
| 3 | MCP | [`39_mcp/`](39_mcp/) | `claude mcp login/logout` CLI, headersHelper 401/403 self-healing re-auth, discovery/OAuth retries + 404 rewrite, get/remove name suggestions, tool-call idle timeout |
| 4 | Telemetry / OTEL | [`44_telemetry/`](44_telemetry/) | The `claude_code.assistant_response` OTEL log event + the `OTEL_LOG_USER_PROMPTS` inheritance gotcha |
| 5 | Workflow / StructuredOutput | [`42_workflow/`](42_workflow/) | StructuredOutput post-success lockout + inline enforcement (replaces the 183 Stop-hook), `agent({schema})` 5-attempt retry cap, `/workflows` `f` status filter |
| 6 | Agent Team | [`30_agent_team/`](30_agent_team/) | `teammateMode: "iterm2"` explicit pin, `--effort` inheritance into pane teammates, stop-notification attribution |
| 7 | Skills | [`45_skills/`](45_skills/) | Frontmatter multi-case key tolerance, malformed-YAML `parseError` surfacing, `/plugin` Installed-tab "Skills" section |
| 8 | Tools | [`04_tools/`](04_tools/) | `!` bash-command auto-respond, bash-mode live path autocomplete, `ReadMcpResourceDirTool` tool-surface delta |
| 9 | Slash Commands / Plugins / Hooks / CLI | [`43_slash_commands/`](43_slash_commands/) | `/rewind` before `/clear`, marketplace `renames` plugin auto-follow, hooks comma-separated matcher fix, `/add-dir` · `/btw` · `/review`→`/code-review medium` · retry cap |
| 10 | System Prompt | [`40_system_prompt/`](40_system_prompt/) | Env-block agent-proxy diagnostic line, model-switch Remote reminder branch, memory-prompt dedup (removed `## Recalled memories`) |
| 11 | Auto Memory & Dream | [`31_auto_memory/`](31_auto_memory/) | Removal of the `tengu_billiard_aviary` immutable-memory / `tiny_memory` experiment; `MEMORY.md` compact reminder + dream-throttle carryover |
| 12 | Compact | [`07_compact/`](07_compact/) | Behavior-preserving refactor of the auto-compact dispatcher (flat `{wasCompacted}` → discriminated `{kind}` union) + helper extractions + carryover ledger |

---

## The build under analysis

The TARGET is the obfuscated **2.1.193** bundle extracted with `claude-code-bomb`:

```
/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/
  ├─ cli_inner_pretty.js          (one pretty-printed bundle, 718,679 lines / ~24.1 MB / 24,097,667 bytes;
  │                                VERSION 2.1.193, BUILD_TIME 2026-06-25T18:18:11Z,
  │                                BUILD_SHA a1938d2a07a2e4fecbef4eeac813221929e97d22 (short a1938d2a),
  │                                Bun 1.4.0 (fe06227f0))
  ├─ cli_inner_pretty.js.PLACEHOLDER.md   (git-ignored note: regenerate from the binary or reassemble
  │                                from cli_unpack_pretty/ per the deobfuscate-bun-binary skill)
  ├─ cli_unpack_pretty/
  │   ├─ _manifest.json            (~4.25 MB — 40,494 per-decl entries: name + kind + bytes)
  │   ├─ _summary.json             ([] empty in this build — use _manifest.json for counts)
  │   └─ decls/
  │       ├─ functions/<id>.js     (16,285 function decls)
  │       ├─ vars/<id>.js          (23,434 files; 11,547 var-decl + 11,892 var-decl-empty entries in _manifest.json)
  │       ├─ classes/<id>.js       (282 class decls)
  │       ├─ ExpressionStatement/<id>.js   (487 top-level expression statements — registrations/IIFEs)
  │       └─ IfStatement/<id>.js   (1 top-level if-statement — runtime guard)
  └─ assets/
      ├─ prompts/, prompts_index.json     (419 prompts, ~1.98 MB; index entries: {file,len,offset,headline})
      ├─ system_prompts/                  (12 per-prompt JSON files)
      ├─ tools/                           (52 entries = 51 .md + _index.json; _index.json carries 50 tools)
      ├─ slash_commands.json              (126 names — many are filesystem-path false positives)
      ├─ env_vars.json                    ({all:683, claude_anthropic:328, bun:1, node:3} — object, INCOMPLETE)
      ├─ cli_flags.json                   ({flags:885, subcommands:0})
      ├─ feature_gates.json               (1,447 tengu_* / experiment keys)
      ├─ endpoints.json                   ({total_urls:416, by_host:127 hosts})
      └─ long_strings/                    (50 string-literal files over a size threshold)
```

The bundle grew **+19,333 lines** across the window (699,346 → 718,679), and the prompt corpus *shrank* slightly (428 → 419 prompts, ~1.98 MB ~flat) as some prompt bodies were consolidated/inlined. The full asset-count diff against v2.1.183 is in [`00_overview/file_index.md`](00_overview/file_index.md).

**Asset-extractor caveats — trust the code, not the raw list.** Several real 2.1.193 env vars are **absent** from `assets/env_vars.json.all` because the extractor's heuristic misses programmatic / lazily-bound reads — e.g. `OTEL_LOG_ASSISTANT_RESPONSES` (live at `cli_inner_pretty.js:36363`), `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` (`cli_inner_pretty.js:43175`/`43538`), `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` (`cli_inner_pretty.js:43147`/`43611`). Likewise `--teammate-mode` is **constructed at runtime** (`pil`, `cli_inner_pretty.js:428485`) and so is missing from the 885-flag list. The authoritative tool surface is `assets/tools/_index.json` (50 tools), not the 51 `.md` files (two are detector noise). **Always confirm an env var, flag, or tool by grepping the bundle, not by membership in an asset list.**

**Re-mangle caveat — every symbol was re-derived.** Bun's `--compile` mode preserves obfuscated names *within a build*, so this bundle is a stable grep + decl-read target. But the obfuscated names are **re-mangled between builds**, and worse, an old id is often *reused for a different decl*. The canonical trap this window: **`$Cr` was `isSubagent` in v2.1.183 but is `isClassifyAllShellEnabled` in v2.1.193** (`cli_inner_pretty.js:58758`) — same token, opposite meaning. Within the *same* 193 build, `wt` is `onPermissionsOverlayClose` at `cli_inner_pretty.js:547334` **and** `workflowAgentRunner` at `cli_inner_pretty.js:423705`. **No v2.1.193 name in this tree was carried over by assumption from v2.1.183** — every symbol was re-derived in the 2.1.193 bundle from a stable string / telemetry / env-var anchor and verified at its cited line.

**Citation rule.** Every factual claim cites `cli_inner_pretty.js:<line>`, verified by reading that line in the **v2.1.193** bundle. Line numbers are stable *within this build only* — they shift across versions, so the **string literals / tool names / telemetry events / env-var names are the stable anchor**. Any line tagged `(183)` or `(156)` is a deliberate **before-picture** read in the prior bundle (699,346 lines, build `9d251abd…`) / the deeper baseline (`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`, 649,979 lines), never the target.

---

## Twelve themes

Each headline below is source-proven in the v2.1.193 bundle (and 0-count grep-confirmed in v2.1.183 — and usually v2.1.156 — where the change is a removal or introduction). Follow the module link for the full deobfuscated deep-dive.

### 1. Permissions & Auto-mode — the largest net-new surface → [`38_permissions/`](38_permissions/)

The densest theme. The headline `autoMode.classifyAllShell` (zod field at `cli_inner_pretty.js:55814`, gate `isClassifyAllShellEnabled` `$Cr` at `cli_inner_pretty.js:58758`) collapses auto mode's trust in matching Bash/PowerShell `allow` rules to a single prepended short-circuit line in the suspend oracle `isShellAllowRuleSuspended` (`cli_inner_pretty.js:416264`) — placed *before* the per-rule cache so the global mode flag never poisons the stable per-rule memo. Alongside it: denial reasons now reach the transcript/toast/`/permissions` (the auto-mode-denied toast line at `cli_inner_pretty.js:640271`, `null` in 183), a `sandbox.credentials` deny-read/unset-env sub-object (`IEu` at `cli_inner_pretty.js:54069`), org entitlement model restrictions reaching the picker + `/model` + `ANTHROPIC_MODEL`, the Recently-denied approve-persists close handler (`cli_inner_pretty.js:547334`), and the `Agent(type)` upfront-deny hoist for named spawns (`cli_inner_pretty.js:430515`). **A 5-way denial taxonomy `classifyToolDenialKind` (`XKa`, `cli_inner_pretty.js:382614`) exists but is dark-launched** (its gate is hard-wired `return !1` at `cli_inner_pretty.js:382624`), and the background-worker permission forwarding the changelog lists is **fully carryover** — documented as such to avoid false-delta inflation.

### 2. Background Agents — lifecycle correctness → [`36_background_agents/`](36_background_agents/)

Memory-pressure **idle bg-shell reaping** is net-new: `registerBgShellPressureReaper` (`Mgl`, `cli_inner_pretty.js:454354`) reaps shells idle past `BG_SHELL_IDLE_REAP_MS` (`eof` = 1,800,000 ms, `cli_inner_pretty.js:454610`) under memory pressure unless `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` is set, guarded by `hasActiveAgentTasks` (`cli_inner_pretty.js:587048`). **Subagent depth tracking is corrected** (2.1.187): the carryover `SUBAGENT_DEPTH_LIMIT` = 5 (`FBt`, `cli_inner_pretty.js:229871`) now sees resumed subagents restore their original spawn depth and **forked** subagents count toward the cap, with a dedicated `SubagentLaunchError` depth-cap throw (`cli_inner_pretty.js:430480`). Stopping an agent becomes **permanent** (2.1.191): `markAgentStoppedByUser` (`Mde`, `cli_inner_pretty.js:431808`) writes a `<id>.meta.json` stop marker (`cli_inner_pretty.js:581864`) and resuming a stopped agent throws `AgentStoppedError` (`cli_inner_pretty.js:441779`). Plus a cluster of backgrounding/panel carry-over-map and phantom-subagent adopt fixes.

### 3. MCP — reliability and self-healing → [`39_mcp/`](39_mcp/)

The MCP machinery is structurally unchanged; the deltas are reliability/UX hardening. **`claude mcp login/logout`** lands as a non-interactive CLI (`mcpLoginHandler` `L9f` at `cli_inner_pretty.js:613318`, `mcpLogoutHandler` `D9f` at `cli_inner_pretty.js:613467`). The tool-call wrapper `callToolWithWatchdog` (`bao`, `cli_inner_pretty.js:293017`) hosts the two heaviest deltas: an **idle watchdog** (abort after `DEFAULT_MCP_TOOL_IDLE_TIMEOUT_MS` = 300,000 ms of silence, `cli_inner_pretty.js:293311`, network transports only) in its `try`, and **headersHelper 401/403 self-healing re-auth** (`Ct("mcp_headers_helper","reauth_retry")` at `cli_inner_pretty.js:293143`, retry once) in its `catch`. Capability discovery, OAuth, and token requests gain retry/backoff (`createRetryingOAuthFetch` `AOn`, `cli_inner_pretty.js:281573`), get/remove get closest-name suggestions (`cli_inner_pretty.js:610416`), and an HTTP 404 is rewritten to a clean `ENDPOINT_NOT_FOUND` (`cli_inner_pretty.js:293997`).

### 4. Telemetry / OTEL — the `assistant_response` event → [`44_telemetry/`](44_telemetry/)

`recordApiRequestTelemetry` (`cSl`, `cli_inner_pretty.js:468542`) now emits the net-new `claude_code.assistant_response` OTEL log event after `api_request`. Its enable gate is the **inheritance gotcha**: `isAssistantResponseLoggingEnabled` (`dGi`, `cli_inner_pretty.js:195211`) reads `OTEL_LOG_ASSISTANT_RESPONSES ?? OTEL_LOG_USER_PROMPTS` — so a deployment that opted into prompt logging silently opts into response logging too unless it explicitly sets the new var. The env var `OTEL_LOG_ASSISTANT_RESPONSES` is live at `cli_inner_pretty.js:36363` (and **absent** from `assets/env_vars.json`), and response bodies are truncated to `TELEMETRY_CONTENT_LIMIT_BYTES` = 61,440 (`cli_inner_pretty.js:286044`).

### 5. Workflow / StructuredOutput — call-control hardening → [`42_workflow/`](42_workflow/)

The 183 StructuredOutput Stop-hook (`registerStructuredOutputStopHook` `zKn`, `cli_inner_pretty.js:575795` (183)) is **removed** and replaced by **inline enforcement**: `subagentQueryGenerator` gains `requiresStructuredOutput` (`cli_inner_pretty.js:398601`, grep 0→8 vs 183), and a message-prep generator injects an `ENFORCE_SENTINEL` (`"[structured-output-enforce]"`, `cli_inner_pretty.js:465901`) until `structuredOutputSucceeded` (`Ibl`, `cli_inner_pretty.js:601998`) sees a non-error `tool_use` result, after which the tool is locked out. The `agent({schema})` retry loop gains a **5-attempt cap** (`DEFAULT_SO_RETRIES` `NYp` = 5, `cli_inner_pretty.js:424307`, hosted by `workflowAgentRunner` `wt` at `cli_inner_pretty.js:423705`), and `/workflows` detail gains an `f` status filter (`cli_inner_pretty.js:541975`).

### 6. Agent Team — spawn-backend + attribution polish → [`30_agent_team/`](30_agent_team/)

`EXEC_MODE_ENUM` (`uhs`, `cli_inner_pretty.js:54136`) gains `"iterm2"` (183 had `["auto","tmux","in-process"]`), letting `teammateMode` pin the iTerm2 backend explicitly; `--effort` now **inherits** into pane teammates via `buildInheritedCliFlags` (`pil`, `cli_inner_pretty.js:428485`, which also pushes the runtime-constructed `--teammate-mode`). Stop notifications gain **attribution**: `stopTask` (`kht`, `cli_inner_pretty.js:431759`) records `killedBy`, and `enqueueAgentNotification` (`Eqe`, `cli_inner_pretty.js:453792`) words it "finished" vs "was stopped by …". The implicit-team redesign (`TeamCreate`/`TeamDelete` removed, `team_name` Agent param "Deprecated; ignored") is **byte-identical carryover** from the 2.1.178 work analyzed in the 183 tree.

### 7. Skills — frontmatter tolerance → [`45_skills/`](45_skills/)

The frontmatter pipeline learns **multi-case key tolerance** (`normalizeFrontmatterKey` `KEd`, `cli_inner_pretty.js:149400`, with canonical key set at `cli_inner_pretty.js:149406`) and **malformed-YAML surfacing**: `parseSkillFrontmatterFields` (`UCo`, `cli_inner_pretty.js:451524`) now carries a `parseError` that `loadSkillsFromDir` turns into a `skill_load_yaml_failed` event instead of silently dropping the skill. `/plugin`'s Installed tab gains a "Skills" section (`pluginScopeSectionLabel` `OAf`, `case "skills": return "Skills"` at `cli_inner_pretty.js:519226`). (A `cross_validation` note records the honest gotcha that the normalizer is partly *vestigial* — `Gm`/`CA` use an identity transform.)

### 8. Tools — input UX + tool-surface delta → [`04_tools/`](04_tools/)

`!` bash commands now **auto-trigger a model response** (`respondToBashCommands` schema field default-on at `cli_inner_pretty.js:56492`, processed by `y6f` at `cli_inner_pretty.js:617562`) — an upgrade-behavior change. Bash-input mode gains **live path autocomplete** (the `"bash-path"` completion kind at `cli_inner_pretty.js:629396`, reusing the carryover path-completion machinery at `cli_inner_pretty.js:188582`). The tool surface gains the deferred **`ReadMcpResourceDirTool`** (`_ne`, `shouldDefer:!0`, `cli_inner_pretty.js:283585`), bumping the `getAvailableTools` exclusion set 3→4 (`cli_inner_pretty.js:444225`); `TeamCreate`/`TeamDelete` remain absent (carryover removal).

### 9. Slash Commands / Plugins / Hooks / CLI → [`43_slash_commands/`](43_slash_commands/)

`/rewind` learns to resume from **before `/clear`** (`resolveRewindAnchors` `XRc`, `cli_inner_pretty.js:705599`; the `/clear` session-reset `resetSessionForClear` `Jdr` at `cli_inner_pretty.js:2575`). Plugin marketplace **`renames` auto-follow** (`resolvePluginRename` `s_t`, `cli_inner_pretty.js:478428`, with `MAX_RENAME_CHAIN` at `cli_inner_pretty.js:478477`). The **hooks comma matcher** finally fires (`hookMatcherMatches` `s3f` gains a 4th `allowComma` param, `cli_inner_pretty.js:589634`, so `"Bash,PowerShell"` matches). Plus a cluster: `/add-dir` already-a-working-dir branch (`cli_inner_pretty.js:177994`), `/btw` ←/→ nav (`cli_inner_pretty.js:482757`), `/review`→`/code-review` with `effort:"medium"` (`oRf`, `cli_inner_pretty.js:538534`), and `MAX_RETRIES_CAP` = 15 (`Ujo`, `cli_inner_pretty.js:603244`).

### 10. System Prompt — env block + reminders → [`40_system_prompt/`](40_system_prompt/)

The env-block builder `computeEnvInfo` (`W3f`, `cli_inner_pretty.js:592845`) gains an **agent-proxy diagnostic line** slot (`cli_inner_pretty.js:592873-592878`) fed by `setAgentProxyEnvLine`/`getAgentProxyEnvLine` (`cli_inner_pretty.js:151173`). The model-switch replay (`handleModelSwitchReplay` `le`, `cli_inner_pretty.js:705779`) gains a `CLAUDE_CODE_REMOTE` branch that pushes a net-new "now running as" reminder. The memory prompt is **de-duplicated** — the 183-only `## Recalled memories` subsection (`_gi`, `cli_inner_pretty.js:151568` (183)) is removed, leaving the staleness/when-to-access guidance (`cli_inner_pretty.js:152092`).

### 11. Auto Memory & Dream — an experiment removal → [`31_auto_memory/`](31_auto_memory/)

Largely carryover; the headline is a **removal**. The `tengu_billiard_aviary` immutable-memory / `tiny_memory` experiment is gone: `executeAutoDream` (`j_l`, `cli_inner_pretty.js:463839`) no longer has the `aH()` immutable branch, the 183 gate `isImmutableMemoryEnabled` (`aH`, `cli_inner_pretty.js:147673` (183)) greps to **0** in 193, and `tengu_billiard_aviary` is **absent** from the 1,447-key `feature_gates.json`. The `MEMORY.md` compact reminder + dream throttle are present but **carryover** (the cross-validation pass corrected a "2.1.186 MEMORY.md compact reminder" claim to FALSE DELTA / carryover).

### 12. Compact — a behavior-preserving refactor → [`07_compact/`](07_compact/)

No behavioral delta — a **refactor**. The auto-compact dispatcher moves from a flat `{wasCompacted}` return (183 `Ego`, `cli_inner_pretty.js:461531` (183)) to a discriminated `{kind}` union (193 `Rxo`, `cli_inner_pretty.js:470250`, e.g. `{kind:"not_needed"}` on disable), with helpers extracted (`resolveThresholdSource` 6-source `WDn` at `cli_inner_pretty.js:235039`, rapid-refill breaker, `makeCompactedState`) and the circuit-breaker emit consolidated (`FAILURE_BREAKER_MAX` = 3, `cli_inner_pretty.js:470357`). The diagnostic proof is `wasCompacted` 10→0 and the new union tags `failure_breaker_open`/`hook_blocked` 0→present; the `--fallback-model`-honoring summarize and the context-hint beta are carryover.

---

## Layout

```
analyze/
├─ README.md                  ← you are here (front door)
├─ 00_overview/               Navigation + symbol routing + per-theme symbol tables + cross-validation
│
│  ─── The twelve theme deltas (v2.1.183 → v2.1.193) ───
├─ 38_permissions/            Permissions & Auto-mode — classifyAllShell, denial reasons, sandbox.credentials,
│                             org model restrictions, approve-persists, Agent named-spawn (6 docs + README)
├─ 36_background_agents/      Background Agents — bg-shell reaping, subagent depth, agent stop, panel fixes (4 docs + README)
├─ 39_mcp/                    MCP — login/logout CLI, headersHelper reauth, retries, name suggestions, idle timeout (5 docs + README)
├─ 44_telemetry/             Telemetry / OTEL — assistant_response event + inheritance gotcha (1 doc + README)
├─ 42_workflow/              Workflow / StructuredOutput — call control + status filter (2 docs + README)
├─ 30_agent_team/            Agent Team — iterm2 pin, effort inheritance, stop attribution (3 docs + README)
├─ 45_skills/                Skills — frontmatter tolerance, malformed YAML, /plugin Skills section (3 docs + README)
├─ 04_tools/                 Tools — ! auto-respond, bash-path autocomplete, tool-surface delta (3 docs + README)
├─ 43_slash_commands/        Slash Commands / Plugins / Hooks / CLI — rewind, renames, comma matcher, misc (4 docs + README)
├─ 40_system_prompt/         System Prompt — env-block agent-proxy line, reminder-catalogue delta (2 docs + README)
├─ 31_auto_memory/           Auto Memory & Dream — billiard_aviary removal, MEMORY.md/dream carryover (2 docs + README)
├─ 07_compact/               Compact — Ego→Rxo discriminated-union dispatcher refactor (README)
│
└─ by_version/               Per-release breadth analysis — one file per published release (.185/.186/.187/.190/.191/.193) + index
```

`_scout_dossier_<theme>.md` (twelve files at the `analyze/` root) are the verified-anchor working notes each module + cross-validation pass was derived from.

### Navigation surface (`00_overview/`)

| Path | Content |
|------|---------|
| [`00_overview/changelog_analysis.md`](00_overview/changelog_analysis.md) | Long-form architectural narrative — the window shape (10 numbers / 6 releases), the four inflection points, and each of the twelve themes in depth with deobfuscated pseudocode |
| [`00_overview/changelog_delta_scoping.md`](00_overview/changelog_delta_scoping.md) | The changelog-derived scoping plan — build facts + per-version theme map |
| [`00_overview/changelog_to_code_map.md`](00_overview/changelog_to_code_map.md) | Per-changelog-bullet traceability — each in-scope bullet → `cli_inner_pretty.js:<line>` + module doc, with explicit "Out of scope" rows |
| [`00_overview/file_index.md`](00_overview/file_index.md) | Inventory of the `cli_unpack_pretty/` decls + the `assets/` payload, with the twelve themes mapped onto line regions + the asset-extractor caveats |
| [`00_overview/symbol_index_core_execution.md`](00_overview/symbol_index_core_execution.md) | Symbol index — core execution (Agent Loop, Tools, Subagent spawn, depth, State; Agent named-spawn + tool-surface) |
| [`00_overview/symbol_index_core_features.md`](00_overview/symbol_index_core_features.md) | Symbol index — core features (Background Agents, Workflow, Agent Team, Skills, Auto-mode, Auto-Memory, Compact) |
| [`00_overview/symbol_index_infra_platform.md`](00_overview/symbol_index_infra_platform.md) | Symbol index — platform infra (MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry) |
| [`00_overview/symbol_index_infra_integration.md`](00_overview/symbol_index_infra_integration.md) | Symbol index — integration infra (Plugin, Shell Parser, Slash Commands, UI) |
| [`00_overview/symbol_additions_v2_1_193_*.md`](00_overview/) | Twelve per-theme exhaustive new-symbol tables, each opening with a ROUTING NOTE naming its `symbol_index_*.md` |
| [`00_overview/cross_validation_report_*.md`](00_overview/) | Twelve per-theme adversarial verification reports (anchor spot-checks, false-delta hunts, before-picture corroboration) |

### Per-release breadth analysis (`by_version/`)

`by_version/` holds **one breadth file per published release** (`2.1.185.md`, `2.1.186.md`, `2.1.187.md`, `2.1.190.md`, `2.1.191.md`, `2.1.193.md`) — a source-cross-validated pass over *everything that release shipped* across **all** subsystems it touched, with each item resolved to a `cli_inner_pretty.js:<line>` anchor in the 2.1.193 bundle. When a by_version item touches one of the twelve depth themes it gives a short summary + the verified anchor + a link to the depth module; non-theme items get their primary analysis here. The directory is indexed by [`by_version/README.md`](by_version/README.md) (newest-first table with per-release theme tags + the window facts and the four inflection points). The four substantive multi-bullet releases are .186/.187/.191/.193; .185 is a one-line reliability patch (stream-stall hint reworded, re-timed 10s → 20s) and .190 is a boilerplate "bug fixes and reliability improvements" placeholder.

(Never published, absent from the upstream changelog: **.184, .188, .189, .192**.)

---

## Scope & what's NOT covered

This is a **twelve-theme delta**, not a module-complete tree. The following subsystems **also changed** in the v2.1.183 → v2.1.193 window and are **intentionally out of scope** — named here so the omission is explicit, not silent:

- **UI / terminal / Windows reliability** — a large body of TUI, WSL, VS Code, and startup-reliability fixes across the window (the bulk of the unenumerated .190 "bug fixes and reliability improvements" line, plus many .186/.187/.191 items).
- **Streaming-performance internals** — the 2.1.191 "streaming CPU −37%" change (coalescing text updates to a ~100 ms cadence) is acknowledged as a window inflection but its render-loop internals are not deobfuscated here.
- **Remote-control plumbing** — the `CLAUDE_CODE_REMOTE` / agent-proxy machinery is touched only where it intersects the system-prompt env-block line (theme 10); the broader remote-session transport is out of scope.
- **Retry-cap surface beyond the slash-commands edge** — `MAX_RETRIES_CAP` = 15 is documented as a CLI-edge constant (theme 9); the full request-retry/backoff state machine outside MCP is not re-analyzed.
- **Model-picker stale-after-login** — the model-selector "stale after login" UX fix is out of scope; only the org-entitlement *restriction* gate (theme 1) is analyzed.

For the full per-version enumeration of out-of-scope bullets, see the "Out of scope" rows in [`00_overview/changelog_to_code_map.md`](00_overview/changelog_to_code_map.md) and the per-release [`by_version/2.1.NN.md`](by_version/) files.

---

## Cross-validation methodology

Every obfuscated → readable mapping and every NET-NEW / CARRYOVER / REFINEMENT label in this tree was audited by an adversarial per-theme pass that defaulted to FAIL and re-opened every sampled anchor at its exact cited line.

1. **Dual-bundle (183 + 156) grep discipline.** The core check for any delta claim is a grep-count diff re-run in **both** the v2.1.183 before-picture bundle *and* the v2.1.156 baseline. A "NET-NEW" symbol must reproduce as `0 in 183 AND 0 in 156`; a "CARRYOVER" symbol must match the 183 count. This is what catches false deltas — a string that *looks* new but pre-dates the window.
2. **193 anchor re-read.** Every load-bearing decl, string, schema body, switch-case, and constant cited in the twelve modules + their additions tables was re-read directly from the 2.1.193 bundle via `sed -n`.
3. **Before-picture re-read.** Every `(183)` / `(156)` before-picture (removed Stop-hook, flat `{wasCompacted}` dispatcher, the `## Recalled memories` subsection, predecessor decls) was re-opened in the prior bundles.

**Outcome: 12/12 themes PASS (confidence HIGH).** Across the twelve passes, **~591 distinct 193 anchors were re-read** plus ~150 before-pictures and ~280 grep-count diffs re-run in both 183 and 156. **Two genuine false deltas were caught and corrected:**

- **MCP** — the `mcp_headers_helper` telemetry was claimed NET-NEW (`1|0`), but it is a *pre-existing* `tengu_feature_sad` `feature_name` (193=7 / 183=6); only the `reauth_retry` `error_code` is new. Relabeled, and the obf→readable mislabel `Ct→logMcpEvent` corrected to `logFeatureSadEvent`.
- **Agent Team** — `user_kill_async` telemetry was labeled NET-NEW, but it pre-dates the window (present at 183 `cli_inner_pretty.js:371804` and 156 `cli_inner_pretty.js:279437`). The row was split: `parent_kill_async`/`system_kill_async` are genuinely NET-NEW (0→1), `user_kill_async` is CARRYOVER (1→1).

The remaining **~41 defects were all line-precision / transcription / labeling drift** — `±1–2` citation drifts pointing at the right declaration region, a handful of obf→readable mislabels (`Ct→logFeatureSadEvent`; `Re` as the `tengu_feature_bad` logger; the 183 env builder `L_f@580976` vs the sibling `D_f@581006`), a `"iterm2"` grep count corrected 16→20, an `aH()` call-site count corrected 11→16, and a `getAvailableTools` exclusion-set cite snapped `444239→444237`. **Never a wrong symbol, a fabricated line, or an incorrect delta classification**, and all were fixed in place. Full logs: the twelve [`00_overview/cross_validation_report_*.md`](00_overview/).

---

## How to find a feature in v2.1.193 source

**Workflow:**

1. Identify a unique stable string for the feature — a tool name, a telemetry event (`tengu_*`), a settings/`autoMode` field, an env var, or an error/prompt fragment. Examples: `"classifyAllShell"`, `"OTEL_LOG_ASSISTANT_RESPONSES"`, `"assistant_response"`, `"ReadMcpResourceDirTool"`, `"reauth_retry"`, `"respondToBashCommands"`, `"iterm2"`, `"requiresStructuredOutput"`, `"tengu_billiard_aviary"`.
2. `grep -n "<string>" /lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
3. From the surrounding code, read off the enclosing obfuscated decl id. **Do not assume it matches v2.1.183** — names are re-mangled per build, and an old id may be reused for a different decl.
4. Read `cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js` for the isolated decl body when you want just one symbol; `_manifest.json` carries kind + bytes for every output file.
5. Confirm with the dual-bundle rule — diff the grep count against the 183 and 156 bundles before trusting a NET-NEW / CARRYOVER claim.

**Example (the headline auto-mode change):**

```
$ grep -n "classifyAllShell" cli_inner_pretty.js
55814:    classifyAllShell: ...                 # the autoMode zod field (NET-NEW)
58758:function $Cr() { ... }                    # isClassifyAllShellEnabled — the gate

# → confirm it is genuinely new this window:
$ grep -c "classifyAllShell" <183 bundle>   # → 0  (and 0 in 156)

# → confirm an experiment removal the same way:
$ grep -c "tengu_billiard_aviary" cli_inner_pretty.js   # → 0  (was non-zero in 183)
```

For names that never appear in changelog text (most internal helpers), work backward from string literals — `assets/prompts_index.json` (419 entries) is the fastest route from a prompt fragment to its emit-site, and `assets/feature_gates.json` (1,447 keys) maps gate names to emit sites. **Remember the extractor caveats** (env vars and constructed flags are undercounted) — confirm against the bundle, not the asset list.

---

## Entry points for readers

| Goal | Start here |
|------|------------|
| Understand the window as one story | [`00_overview/changelog_analysis.md`](00_overview/changelog_analysis.md) — the 10-number / 6-release shape and the four inflection points |
| Understand one of the twelve themes in depth | The matching module dir — see the table at the top, e.g. [`38_permissions/`](38_permissions/), [`39_mcp/`](39_mcp/), [`42_workflow/`](42_workflow/) |
| Understand release-by-release what shipped (all subsystems) | [`by_version/README.md`](by_version/README.md) — the per-release index, then the matching [`by_version/2.1.NN.md`](by_version/) file |
| Trace a single changelog bullet to code | [`00_overview/changelog_to_code_map.md`](00_overview/changelog_to_code_map.md) — find the bullet, follow the decl pointer (or read its "Out of scope" row) |
| Look up an obfuscated identifier | Pick the right `00_overview/symbol_index_*.md` by category, or grep the twelve [`00_overview/symbol_additions_v2_1_193_*.md`](00_overview/) tables |
| Find which extracted asset/decl contains a feature | [`00_overview/file_index.md`](00_overview/file_index.md), or grep `cli_inner_pretty.js` for a stable string |
| Verify a mapping's confidence | The "ROUTING NOTE" + count blocks in the relevant `00_overview/symbol_additions_v2_1_193_*.md`, or the matching [`00_overview/cross_validation_report_*.md`](00_overview/) |
| Read the deobfuscated source directly | `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` + `cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js` |

---

## Symbol mapping conventions

This tree follows the project-wide [`../../CLAUDE.md`](../../CLAUDE.md) conventions:

- **No symbol mapping tables in module docs.** The four `00_overview/symbol_index_*.md` files are the canonical mapping tables; the twelve `00_overview/symbol_additions_v2_1_193_*.md` files hold the per-theme exhaustive tables. Module docs reference symbols as a list (`` `readableName` (`OBF`) — desc (cli_inner_pretty.js:NNN) ``), never duplicating a mapping table. (Before/after comparison tables and summary tables ARE allowed.)
- **Single source citation.** Every factual claim cites `cli_inner_pretty.js:<line>`, verified by reading that line in the v2.1.193 bundle (or tagged `(183)` / `(156)` for before-pictures).
- **Dual-version code snippets.** Where code is shown: header (`====` + ReadableName + Location) → ORIGINAL → READABLE → Mapping.

---

## See Also

- [`../../claude_code_v_2.1.183/analyze/`](../../claude_code_v_2.1.183/analyze/) — the prior **v2.1.156 → v2.1.183** tree this window continues from (and the README this one is modeled on; that tree carries a reconstructed-source layer this pure-delta tree intentionally omits)
- [`../../claude_code_v_2.1.156/analyze/`](../../claude_code_v_2.1.156/analyze/) — the v2.1.143 → v2.1.156 baseline tree
- [`../../CLAUDE.md`](../../CLAUDE.md) — project conventions: the symbol-index routing matrix, the no-mapping-tables-in-module-docs rule, and the dual-version code-snippet template
- [`../CHANGELOG.md`](../CHANGELOG.md) — the upstream changelog this analysis tracks (the bullet source of truth for the 2.1.185 → 2.1.193 releases)
- The twelve `analyze/_scout_dossier_<theme>.md` dossiers — the verified-anchor working notes each module + cross-validation pass was derived from
</content>
</invoke>
