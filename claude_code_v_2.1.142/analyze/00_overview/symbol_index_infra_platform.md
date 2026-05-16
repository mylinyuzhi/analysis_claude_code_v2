# Symbol Index — Platform Infrastructure (v2.1.113 → v2.1.142)

> Symbol additions for v2.1.142 are tracked in 00_overview/symbol_additions_v2_1_142_*.md files. Consolidation into this index is a future pass.

This index catalogs obfuscated → readable mappings for the **platform infrastructure** symbols introduced or changed between v2.1.113 and v2.1.142. Scope: MCP Protocol, Permissions, Sandbox, Auth, Model Selection, Prompt Building, Telemetry.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Plan, Background Agents, /goal, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands

## File:Line Format

For v2.1.142, the canonical source citation is `cli_unpack_pretty/unknown/<obfuscated>.js` (per-decl isolated file). When surrounding context matters, cite `cli_inner_pretty.js:<line>` instead.

---

## Module: MCP Protocol

stdio/HTTP/SSE/WebSocket transports, OAuth flow, tool listing, resource templates, elicitation, server lifecycle.

Symbol mappings: see [`symbol_additions_v2_1_142_mcp.md`](./symbol_additions_v2_1_142_mcp.md) for the consolidated MCP symbol table (config schemas, per-request fetch timeout, transport byte caps, tools/list lifecycle, connection & reconnect, OAuth refresh defense, claude.ai proxy, stdio env injection, reserved names, `alwaysLoad`, server-detail menu, telemetry).

Known new themes for this window:

- `MCP_TOOL_TIMEOUT` raises per-request fetch timeout for remote HTTP/SSE servers (v2.1.142 fix — was capped at 60s)
- 16 MB SSE frame cap (v2.1.139 — prevents unbounded memory on streamed non-protocol data)
- Reserved `workspace` server name (v2.1.128)
- `alwaysLoad` server config option to skip tool-search deferral (v2.1.121)
- Reconnecting MCP servers don't flood with full tool-name lists (v2.1.128 — re-announce summarized by server prefix)
- `${var%pattern}` POSIX parameter expansion mis-flagged as missing env vars (v2.1.141 fix)
- HTTP/SSE servers returning 403 → "needs auth" not "failed" (v2.1.141 fix)
- Remote servers continue over POST when server-events stream fails (v2.1.141 fix)
- OAuth refresh tokens lost on concurrent refresh (v2.1.136 fix)
- macOS keychain race on concurrent refresh (v2.1.118 fix)
- OAuth multi-server refresh proceeding without cross-process lock (v2.1.118 fix)
- `expires_in`-less token requiring hourly re-auth (v2.1.118 fix)
- Step-up auth `insufficient_scope` re-consent (v2.1.118 fix)
- `redirectUri` for `mcp_authenticate` (v2.1.121)
- `headersHelper` config: OAuth Authenticate/Re-authenticate menu visibility (v2.1.118)
- stdio servers receive `CLAUDE_PROJECT_DIR` in env (v2.1.139)
- Plugin configs reference `${CLAUDE_PROJECT_DIR}` in commands (v2.1.139)
- stdio servers writing non-protocol to stdout causing 10GB+ RSS (v2.1.132 fix)
- `tools/list` failures retry once + show "tools fetch failed" (v2.1.132)
- claude.ai connectors: dedupe by upstream URL (v2.1.121)
- claude.ai connectors hidden by manually-added server (v2.1.122 messaging fix)
- claude.ai connectors silent disappearance on transient auth error (v2.1.121 fix)
- Remote MCP connectors: 401 on token rotation (v2.1.141 fix)
- Plugin MCP servers with unset config variables: clear "config issue" message (v2.1.141)
- `--from-pr` MCP scope fixes
- `mcp_authenticate` Microsoft 365 duplicate `prompt` parameter (v2.1.121 fix)

---

## Module: Permissions

Permission rule schema, allow/deny rule matching, `auto`/`bypass`/`acceptEdits` modes, dangerous-path checker, `permissions.deny`-vs-hook precedence, `disableBypassPermissionsMode`, classifier denial messages.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- `Skill(name *)` wildcard prefix match (v2.1.139)
- `Edit`/`Write` allow rules scoped to drive root (C:\) or POSIX / no longer always prompt (v2.1.133 fix)
- Mapped network drives via `--add-dir`/`additionalDirectories` (v2.1.133 fix)
- Plan mode honors `Edit(...)` allow rules instead of bypassing block (v2.1.136 fix)
- Permission mode autodismiss on tool-permission prompt when new setting permits (v2.1.141 fix)
- `--dangerously-skip-permissions` no longer prompts for `.claude/skills/`, `.claude/agents/`, `.claude/commands/` (v2.1.121)
- `--dangerously-skip-permissions` bypass for `.claude/`, `.git/`, `.vscode/`, shell config (v2.1.126 — catastrophic removal still prompts)
- Bash `dangerouslyDisableSandbox` permission prompt fix (v2.1.113)
- Auto mode classifier explains `permissions.ask` rule trigger (v2.1.141)
- Auto mode opt-in "Don't ask again" (v2.1.118)
- Auto mode `$defaults` aliases for allow/soft_deny/environment (v2.1.118)
- Auto mode classifier error includes hint (v2.1.128)
- Auto mode `hard_deny` for unconditional blocks (v2.1.136)
- Auto mode permission dialog explains `permissions.ask` (v2.1.141)
- `permission-mode` flag respect during plan-mode resume (v2.1.132)
- "Always allow" rules for built-in tools in remote sessions surviving worker restarts (v2.1.121 fix)
- `denied-mcp-servers` patterns with `*://` scheme wildcard matching mixed-case hostnames (v2.1.129 fix)
- "Allowed by PermissionRequest hook" repeating once per tool call (v2.1.141 fix)
- Switching permission mode while permission prompt is open auto-dismisses (v2.1.141)
- `cd <current-directory> && git ...` no longer prompts (v2.1.113)
- macOS `/private/{etc,var,tmp,home}` treated as dangerous removal targets (v2.1.113)
- Bash deny rules match `env`/`sudo`/`watch`/`ionice`/`setsid` wrappers (v2.1.113)
- `Bash(find:*)` no longer auto-approves `find -exec`/`-delete` (v2.1.113)
- `autoAllowBashIfSandboxed` honors shell expansions ($VAR, $(cmd)) (v2.1.139 fix)

---

## Module: Sandbox

Bubblewrap/socat (Linux/WSL), darwin app-sandbox, PID-namespace isolation, allowed/denied domains, dangerous-path safety net.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- `sandbox.network.deniedDomains` (v2.1.113)
- `sandbox.bwrapPath`/`sandbox.socatPath` managed settings (v2.1.133)
- Dangerous-path check no longer bypassed by sandbox auto-allow for `rm`/`rmdir` (v2.1.116)
- `allowManagedDomainsOnly`/`allowManagedReadPathsOnly` ignored on higher-priority source lacking `sandbox` block (v2.1.126 security fix)
- `parentSettingsBehavior` admin key (`first-wins` / `merge`) for SDK `managedSettings` policy merge (v2.1.133)

---

## Module: Auth

OAuth login/logout/refresh, `apiKeyHelper`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_API_KEY`, Bedrock SigV4, Vertex Workload Identity Federation, credentials.json layout.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- `ANTHROPIC_WORKSPACE_ID` for Workload Identity Federation (v2.1.141)
- Vertex AI X.509-based WIF (mTLS ADC) (v2.1.121)
- Bedrock `awsCredentialExport` always runs (v2.1.141)
- Bedrock `ANTHROPIC_BEDROCK_SERVICE_TIER` env var (v2.1.122 — sent as `X-Amzn-Bedrock-Service-Tier`)
- Bedrock 400 on `output_config.effort` for non-effort models (v2.1.122 fix)
- Bedrock IP ARN + Opus 4.7 + thinking disabled 400 (v2.1.117 fix)
- Bedrock IP ARN doesn't surface `output_config.effort` (v2.1.122 fix)
- Vertex AI count_tokens 400 with proxy gateways (v2.1.122 fix)
- Vertex/Bedrock `output_config: Extra inputs are not permitted` 400 (v2.1.122 fix)
- Remote MCP/OAuth refresh wiping shared credentials (v2.1.133 fix)
- Token refresh race on wake-from-sleep (v2.1.129)
- Credential save crash on Linux/Windows corrupting `~/.claude/.credentials.json` (v2.1.118 fix)
- `claude auth login` OAuth code paste fallback (v2.1.126)
- `CLAUDE_CODE_OAUTH_TOKEN` env var clears on `/login` (v2.1.118 fix)
- Token rotation race in Remote Control (v2.1.141 fix)
- 401 retry loop on `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` (v2.1.123 fix)
- Remote managed settings 401 retry with force-refreshed token (v2.1.140 fix)
- "OAuth not allowed for organization" → guidance vs login screen (v2.1.126)
- 401 mid-session reactive refresh on plain CLI OAuth (v2.1.117 fix)
- "Please run /login" race with concurrent credential write (v2.1.126/136 fixes)
- `forceRemoteSettingsRefresh` + expired creds deadlock on `claude auth` (v2.1.139 fix)
- Desktop/3P provider sessions inheriting `apiKeyHelper`/`ANTHROPIC_AUTH_TOKEN` from host managed-settings (v2.1.141 fix)
- Mantle endpoint `x-api-key` header (v2.1.131 fix)

---

## Module: Model Selection

Model alias resolution, `/model` picker, default-model resolution (`opus` alias, `getDefaultEffortForModel`), 3P-provider model overrides, gateway `/v1/models` discovery.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- Fast Mode default Opus 4.6 → 4.7 (v2.1.142, override env: `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1`)
- Default effort for Pro/Max on Opus 4.6 & Sonnet 4.6 is `high` (was `medium`) (v2.1.117)
- `/model` picker collapses duplicate Opus 4.7 entries (v2.1.128)
- `/model` picker shows source pin in startup header (v2.1.117)
- `/model` picker lists gateway models from `/v1/models` (v2.1.126) — later opt-in (v2.1.129) via `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1`
- `ANTHROPIC_DEFAULT_OPUS_MODEL`/`SONNET_MODEL` overrides reflected in "Default" row (v2.1.139 fix)
- `ANTHROPIC_DEFAULT_*_MODEL_NAME`/`_DESCRIPTION` honored with custom `ANTHROPIC_BASE_URL` (v2.1.118)
- `--model` flag for `claude agents` dispatch (v2.1.142)
- Background side-queries Haiku fallback on Bedrock/Vertex/Foundry when no `ANTHROPIC_SMALL_FAST_MODEL` override (v2.1.141 fix)
- Custom base URL gateway not auto-naming background jobs (v2.1.141 fix)
- `set_model` redundant requests injecting duplicate `/model` breadcrumbs (v2.1.142 fix)
- `/model` in one session changing autocompact threshold in others (v2.1.141 fix)
- Subagents running different model from main agent flagging file reads with malware warning (v2.1.117 fix)
- Stale `/model claude-sonnet-4-20250514` suggestion in Usage Policy refusal removed (v2.1.142)

---

## Module: Prompt Building

System-prompt composition, tool-section ordering, environment description block, CLAUDE.md injection, output-style overlay.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- Plugin SKILL.md at root surfaces as skill (v2.1.142)
- Prompt suggestions disabled with output style (v2.1.141 fix)
- Compaction prompt asks to preserve sensitive user instructions (v2.1.139)
- `/context` "providing plugin" name for plugin-sourced skills (v2.1.139)
- `/context` dumping rendered ASCII grid into conversation (v2.1.129 fix — was wasting 1.6k tokens/call)
- `/context all` per-skill token estimates account for tokenizer (v2.1.139)

---

## Module: Telemetry

OpenTelemetry spans, metrics, log events, attribute taxonomy, sampling rules, OTLP endpoint configuration.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- Subprocesses no longer inherit `OTEL_*` env vars (v2.1.128)
- `stop_reason`, `gen_ai.response.finish_reasons`, `user_system_prompt` (gated by `OTEL_LOG_USER_PROMPTS`) (v2.1.121)
- `invocation_trigger` attribute on `claude_code.skill_activated` (v2.1.126)
- `claude_code.skill_activated` fires for user-typed slash commands (v2.1.126)
- `claude_code.at_mention` log event (v2.1.122)
- `claude_code.pull_request.count` counts MCP-tool-created PRs/MRs (v2.1.129)
- `claude_code.active_time.total` not emitted in `--print` mode (v2.1.139 fix)
- `tool_result` / `tool_decision` include `tool_use_id`; `tool_result` includes `tool_input_size_bytes` (v2.1.119)
- `user_prompt` event includes `command_name` / `command_source` (v2.1.117)
- `cost.usage`, `token.usage`, `api_request`, `api_error` include `effort` attribute (v2.1.117)
- Custom/MCP command names redacted unless `OTEL_LOG_TOOL_DETAILS=1` (v2.1.117)
- Numeric attributes on `api_request`/`api_error` emitted as numbers, not strings (v2.1.122)
- Subagent API headers `x-claude-code-agent-id`/`parent-agent-id` + OTel span attributes (v2.1.139)
- Early OTel spans dropped in SDK/headless with beta tracing (v2.1.141 fix)
- `DISABLE_TELEMETRY`/`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` suppression (v2.1.120 fix)
- `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` (v2.1.136)
- Host-managed deployments no longer auto-disable analytics on Bedrock/Vertex/Foundry (v2.1.126)
- Early analytics events dropped before logger initialization (v2.1.141 fix)
- `forceRemoteSettingsRefresh` policy interactions (v2.1.140 fixes)

---

## See Also

- [`changelog_analysis.md`](changelog_analysis.md) — long-form narrative
- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet pointers
- [`file_index.md`](file_index.md) — extracted-file inventory
- The v2.1.112 baseline lives at `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index.md`
