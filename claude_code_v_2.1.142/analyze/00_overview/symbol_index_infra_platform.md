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

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

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

Detailed module-doc set: [`../18_sandbox/v2_1_142_README.md`](../18_sandbox/v2_1_142_README.md). Per-subsection mappings live in [`symbol_additions_v2_1_142_sandbox.md`](symbol_additions_v2_1_142_sandbox.md); the consolidated table below is the canonical lookup for the v2.1.113→v2.1.142 sandbox window.

Known new themes for this window:

- `sandbox.network.deniedDomains` (v2.1.113)
- `sandbox.bwrapPath`/`sandbox.socatPath` managed settings (v2.1.133)
- Dangerous-path check no longer bypassed by sandbox auto-allow for `rm`/`rmdir` (v2.1.116)
- `allowManagedDomainsOnly`/`allowManagedReadPathsOnly` ignored on higher-priority source lacking `sandbox` block (v2.1.126 security fix)
- `parentSettingsBehavior` admin key (`first-wins` / `merge`) for SDK `managedSettings` policy merge (v2.1.133)

### Schema

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Xh9 | SandboxNetworkConfigSchema | cli_inner_pretty.js:48255-48306 | function |
| Lh9 | SandboxFilesystemConfigSchema | cli_inner_pretty.js:48307-48340 | function |
| yMq | SandboxSettingsSchema | cli_inner_pretty.js:48341-48390 | function |
| hu8 | sandboxSchemaPathModule | cli_inner_pretty.js:48254 | variable |

### Managed-Settings Tier Merger

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| MDq | mergeManagedPolicy | cli_inner_pretty.js:52104-52131 | function |
| Tm8 | policyTierProjection | cli_inner_pretty.js:52046-52088 | function |
| Gm8 | shouldMergeParentChain | cli_inner_pretty.js:52043-52045 | function |
| uI9 | collectPolicyTierList | cli_inner_pretty.js:52132-52137 | function |
| wDq | resolvePolicySettings | cli_inner_pretty.js:52138-52148 | function |
| WPH | getAllPolicyTierSettings | cli_inner_pretty.js:52338-52340 | function |
| aR$ | pickKeys | cli_inner_pretty.js:(used by Tm8) | function |

### Bwrap / Socat Path Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tz$ | getBwrapPath | cli_inner_pretty.js:197238-197242 | function |
| MgK | getSocatPath | cli_inner_pretty.js:197243-197247 | function |
| Qt$ | resolveBubblewrap | cli_inner_pretty.js:197248-197252 | function |
| Fx | whichExecutable | cli_inner_pretty.js:(executable-aware which) | function |
| q7H | whichBinary | cli_inner_pretty.js:(plain which) | function |
| ZFK | isExecutable | cli_inner_pretty.js:195520-195526 | function |
| Uq$ | isWSL | cli_inner_pretty.js:48235-48243 | function |
| TFK | checkSandboxDependencies | cli_inner_pretty.js:195527-195539 | function |

### Dangerous-Path Safety (rm/rmdir)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| v64 | autoAllowAstChecker | cli_inner_pretty.js:420551-420579 | function |
| WA5 | autoAllowSingleCmdChecker | cli_inner_pretty.js:420580-420632 | function |
| VA5 | staticRuleCheck | cli_inner_pretty.js:420644-420673 | function |
| IX6 | checkRmTargets | cli_inner_pretty.js:274835-274851 | function |
| nUH | isCriticalPath | cli_inner_pretty.js:207091-207105 | function |
| hX6 | askForApproval | cli_inner_pretty.js:274827-274834 | function |
| Gk | expandTilde | cli_inner_pretty.js:207030-207033 | function |
| LMH | stripWrapperPrefixes | cli_inner_pretty.js:(used at 420569) | function |
| LdK | isDangerousCommand | cli_inner_pretty.js:205223-205225 | function |
| ce1 | CRITICAL_WIN_DRIVE_ROOT_REGEX | cli_inner_pretty.js:207183 | constant |
| le1 | CRITICAL_WIN_TOP_LEVEL_REGEX | cli_inner_pretty.js:207183 | constant |
| bV | shouldSandboxThisCommand | cli_inner_pretty.js:421425-421432 | function |
| RA5 | isCommandExcludedFromSandbox | cli_inner_pretty.js:421383-421424 | function |
| vdH | COMMAND_ARG_EXTRACTORS | cli_inner_pretty.js:275266-275533 | object |

### Network Filter

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pFK | networkPermissionFilter | cli_inner_pretty.js:196344-196358 | function |
| ia1 | getNetworkPermissionConfig | cli_inner_pretty.js:196505-196510 | function |
| hA6 | matchesHostPattern | cli_inner_pretty.js:196333-196343 | function |
| NUK | canonicalizeHost | cli_inner_pretty.js:(host normalizer) | function |
| nz$ | isValidHost | cli_inner_pretty.js:(host validator) | function |
| KY$ | buildSandboxConfig | cli_unpack_pretty/decls/functions/KY$.js | function |
| vUH | parsePermissionRule | cli_inner_pretty.js:(rule parser) | function |
| FD | WEB_FETCH_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |
| e9 | sandboxConfig | cli_inner_pretty.js:(module-level cache) | variable |
| da1 | initializeSandboxNetwork | cli_inner_pretty.js:196407-196483 | function |

### Linux bwrap Wrapper

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vFK | linuxBwrapWrapper | cli_inner_pretty.js:195744-195831 | function |
| VFK | spawnNetworkBridges | cli_inner_pretty.js:195540-195602 | function |
| Ca1 | buildBridgedShellCommand | cli_inner_pretty.js:195612-195630 | function |
| Ra1 | buildSeccompArgvPrefix | cli_inner_pretty.js:195604-195611 | function |
| ba1 | buildBwrapMountArgs | cli_inner_pretty.js:195631-195743 | function |
| Sa1 | enumerateDangerousFiles | cli_inner_pretty.js:195448-195519 | function |

### Apply-Seccomp Helper

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vA6 | findSeccompBinary | cli_inner_pretty.js:195367-195372 | function |
| Ea1 | findSeccompBinaryImpl | cli_inner_pretty.js:195373-195388 | function |
| XFK | detectArchitecture | cli_inner_pretty.js:195335-195355 | function |
| Na1 | listBundleSearchPaths | cli_inner_pretty.js:195356-195366 | function |
| TA6 | seccompBinaryCache | cli_inner_pretty.js:195394 | variable |
| bgK | getSeccompConfig | cli_inner_pretty.js:(builds {applyPath, argv0}) | function |
| RgK | isBundledSeccompAvailable | cli_inner_pretty.js:(bundled seccomp gate) | function |

### Subprocess Env Scrub (Renames vs v2.1.112)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| aW | isSubprocessEnvScrubEnabled | cli_inner_pretty.js:197361-197364 | function |
| Ws1 | shouldUseMcpAllowlistEnv | cli_inner_pretty.js:197365-197369 | function |
| A7H | isScrubSandboxAvailable | cli_inner_pretty.js:197370-197373 | function |
| mA6 | assertScrubSandboxAvailable | cli_inner_pretty.js:197374-197439 | function |
| Z3H | SUBPROCESS_SCRUB_LIST | cli_inner_pretty.js:(25-var scrub list) | constant |
| ou | sandboxContext | cli_inner_pretty.js:(module-level cache) | variable |
| ct$ | cachedBwrapAvail | cli_inner_pretty.js:(module-level cache) | variable |
| JgK | SAFE_PATH_PREFIXES | cli_inner_pretty.js:(path-filter prefixes) | constant |

### macOS Sandbox Profile

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pa1 | buildMacOSSandboxProfile | cli_inner_pretty.js:195952-196183 | function |
| SFK | applyMacOSSandbox | cli_inner_pretty.js:(macOS sandbox-exec) | function |
| dFK | getAllowMachLookup | cli_inner_pretty.js:196520-196522 | function |
| gFK | getAllowUnixSockets | cli_inner_pretty.js:196511-196513 | function |
| xFK | getAllowAllUnixSockets | cli_inner_pretty.js:196514-196516 | function |
| QFK | getAllowLocalBinding | cli_inner_pretty.js:196517-196519 | function |
| ra1 | getEnableWeakerNetworkIsolation | cli_inner_pretty.js:196529-196531 | function |
| uFK | getAllowGitConfig | cli_inner_pretty.js:196538-196540 | function |

### `n6` Sandbox State Namespace

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `n6` | sandboxStateNamespace | cli_inner_pretty.js:198457-198475 | object |
| `n6.isSandboxingEnabled` (→ `st$`) | isSandboxingEnabled | cli_inner_pretty.js:198273-198279 | function |
| `n6.isAutoAllowBashIfSandboxedEnabled` (→ `bs1`) | isAutoAllowBashIfSandboxedEnabled | cli_inner_pretty.js:198251-198254 | function |
| `n6.areUnsandboxedCommandsAllowed` (→ `xs1`) | areUnsandboxedCommandsAllowed | cli_inner_pretty.js:198255-198257 | function |
| `n6.isPlatformInEnabledList` (→ `at$`) | isPlatformInEnabledList | cli_inner_pretty.js:198262-198272 | function |

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
