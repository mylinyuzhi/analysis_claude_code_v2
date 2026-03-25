# Symbol Index - Platform Infrastructure (Claude Code 2.1.76)

> Symbol mapping table Part 3: Platform, protocols, and infrastructure
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.
>
> **Cross-validated**: All symbols verified against source code on 2026-03-26.
> **Joint Analysis**: See [cli_ui_llm_joint_complete_v8.md](./cli_ui_llm_joint_complete_v8.md) for the latest comprehensive joint analysis with source-level restoration.

---

## Quick Navigation

- [Remote Sessions](#module-remote-sessions) - **NEW in 2.1.27**
- [MCP Protocol](#module-mcp-protocol)
- [Permissions](#module-permissions)
- [Sandbox](#module-sandbox)
- [Auth](#module-auth)
- [Model Selection](#module-model-selection)
- [Telemetry](#module-telemetry)
- [Helper/Utility Functions](#module-helperutility-functions) - **Core utilities**

---

## Module: Remote Sessions

> Full analysis: [33_remote_sessions/](../33_remote_sessions/)
> **NEW in 2.1.27** - CLI synchronization with Web/Remote UI

### Synchronization Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| JM6 | sendEventToRemoteSession | chunks.126.mjs:2724 | function |
| omA | hydrateRemoteSession | cli.chunks.mjs:5821 | function |
| RemoteSessionManager | RemoteSessionManager | chunks.176.mjs:2990 | class |
| useRemoteSession | useRemoteSession | chunks.185.mjs:1450 | hook |
| CLAUDE_CODE_REMOTE_SESSION_ID | REMOTE_SESSION_ID_ENV | chunks.80.mjs:2666 | environment variable |

---

## Module: Prompt Building

> Full analysis: [23_prompt_cache/](../23_prompt_cache/)

### Core Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ml | createCacheControl | chunks.170.mjs:1849 | function (builds cache_control with TTL/scope) |
| IGq | isPromptCachingEnabled | chunks.170.mjs:1832 | function (per-model caching gate) |
| o3z | shouldUse1HourTTL | chunks.170.mjs:1864 | function (OAuth + allowlist TTL check) |
| z9z | applyCacheBreakpointsToMessages | chunks.171.mjs:721 | function (adds cache markers to messages) |
| _9z | buildSystemPromptWithCache | chunks.171.mjs:799 | function (converts prompt to cache-annotated blocks) |
| Jn8 | splitSystemPromptForCache | chunks.170.mjs:1483 | function (three-mode prompt splitting) |
| s3z | formatUserMessageForCache | chunks.170.mjs:1928 | function (user message with cache_control) |
| t3z | formatAssistantMessageForCache | chunks.170.mjs:1959 | function (assistant message with cache_control) |
| Mn8 | injectCacheEditsBlock | chunks.170.mjs:1789 | function (injects cache_edits for compaction) |
| Y9z | isToolResultBlock | chunks.171.mjs:717 | function (type guard for tool_result blocks) |
| S_6 | SYSTEM_PROMPT_DYNAMIC_BOUNDARY | chunks.168.mjs:2277 | constant ("__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__") |

### Cache Configuration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| C_6 | isFirstPartyProvider | chunks.176.mjs:1638 | function (checks first-party API with beta support) |
| eu1 | get1HourTTLAllowlist | chunks.1.mjs:3147 | function (returns cached 1-hour TTL allowlist) |
| Am1 | set1HourTTLAllowlist | chunks.1.mjs:3151 | function (caches 1-hour TTL allowlist) |

### Billing & Attribution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| m21 | getAttributionHeader | chunks.56.mjs:1520 | function (builds x-anthropic-billing-header) |
| zO8 | calculatePromptHash | chunks.56.mjs:1562 | function (SHA-256 hash for billing) |
| pu3 | getFirstUserMessageText | chunks.56.mjs:1550 | function (extracts text from first user message) |
| Bu3 | isAttributionHeaderEnabled | chunks.56.mjs:1515 | function |

### Token Usage & Cost

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Tm3 | aggregateTokenUsage | chunks.57.mjs:3 | function (accumulates token usage from API responses) |
| s21 | recordTokenUsage | chunks.57.mjs:17 | function (records usage with telemetry) |
| wT9 | calculateApiCost | chunks.82.mjs:1419 | function (calculates cost including cache tokens) |
| OT9 | getModelPricing | chunks.82.mjs:1423 | function (returns pricing for model) |
| PD1 | calculateCostFromUsage | chunks.82.mjs:1446 | function (calculates cost from session usage) |
| Gm3 | formatUsageByModel | chunks.56.mjs:3037 | function (formats per-model usage for display) |
| a21 | formatSessionStats | chunks.56.mjs:3065 | function (formats complete session statistics) |
| gx6 | formatCost | chunks.56.mjs:3033 | function (formats USD cost with precision) |

### System Reminder Attachments

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qmY | getTokenUsageAttachment | chunks.147.mjs:1108 | function (creates token usage attachment) |
| YmY | getBudgetUsdAttachment | chunks.147.mjs:1124 | function (creates budget attachment) |

### Compaction Cache Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Gqq | generateCompactSummary | chunks.147.mjs:1752 | async function (compaction summary with cache prefix sharing) |
| Fb | getCacheSafeParams | chunks.146.mjs:1572 | function (builds cache-safe parameters for API calls) |
| av | forkAgentQuery | chunks.148.mjs:2086 | async function (fork agent for cache preservation) |
| bX | extractAssistantMessage | chunks.147.mjs | function (extracts assistant message from response) |
| BE1 | hasValidTextContent | chunks.147.mjs | function (checks for valid text in message) |

### Cold Cache Detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| YBY | isCacheCold | chunks.148.mjs:2253 | function (detects cold cache for speculative op suppression) |
| KBY | CACHE_COLD_THRESHOLD | chunks.148.mjs:2367 | constant (0.5 - 50% cache creation = cold) |

### Token Display Formatting

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fm3 | roundToPrecision | chunks.56.mjs:3075 | function (rounds number to specified precision) |
| fq | formatNumber | chunks.56.mjs | function (formats large numbers with K/M suffixes) |
| $S | getModelUsage | chunks.56.mjs | function (returns per-model token usage) |
| LD | getTotalSessionCost | chunks.56.mjs | function (returns total session cost in USD) |
| Ju1 | getSessionTokenTracker | chunks.57.mjs | function (returns session token tracker for model) |
| ax1 | updateCostTracker | chunks.57.mjs | function (updates cost tracker for budget) |
| Zu1 | getSessionCostCollector | chunks.57.mjs | function (returns session cost metric collector) |
| Bw6 | getTokenCollector | chunks.57.mjs | function (returns token metric collector) |

### System Prompt Building

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| dZ | buildSystemPrompt | chunks.169.mjs:236 | function (main entry, selects full vs simplified) |
| hOq | buildSimplifiedSystemPrompt | chunks.169.mjs:225 | function (proactive/simplified variant) |
| G9z | buildBasePersonaSection | chunks.169.mjs:436267 | function ("You are an interactive CLI tool...") |
| nBA | buildFullEnvInfo | chunks.169.mjs:378 | function (XML-format env for standard prompt) |
| IOq | buildSimplifiedEnvInfo | chunks.169.mjs:402 | function (compact env for simplified prompt) |
| ot | buildFinalSystemPrompt | chunks.188.mjs:537 | function (combines custom + default prompts) |
| cq6 | getSystemPrompt | chunks.47.mjs:2470 | function |

> **Note:** `FOq` was incorrectly documented as buildMcpCliInstructions. Actual `FOq` in chunks.159.mjs:294 is QR code numeric mode encoder. MCP CLI instructions are generated inline during system prompt construction.

### Configuration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| - | modelOverrides | settings | config key (per-model configuration overrides map) |
| - | includeGitInstructions | settings | config key (include git-specific instructions in system prompt) |
| CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS | DISABLE_GIT_INSTRUCTIONS_ENV | process.env | environment variable |
| kR6 | PROMPT_CACHING_SCOPE_BETA | chunks.18.mjs:1845 | constant ("prompt-caching-scope-2026-01-05") |

### Prompt Caching Environment Variables

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DISABLE_PROMPT_CACHING | - | process.env | env var (disable all prompt caching) |
| DISABLE_PROMPT_CACHING_HAIKU | - | process.env | env var (disable caching for Haiku) |
| DISABLE_PROMPT_CACHING_SONNET | - | process.env | env var (disable caching for Sonnet) |
| DISABLE_PROMPT_CACHING_OPUS | - | process.env | env var (disable caching for Opus) |
| ENABLE_PROMPT_CACHING_1H_BEDROCK | - | process.env | env var (enable 1-hour TTL for Bedrock) |
| CLAUDE_CODE_FORCE_GLOBAL_CACHE | - | process.env | env var (force global cache scope) |

### Prompt Caching Feature Flags

| Flag Name | Description | Default |
|-----------|-------------|---------|
| tengu_prompt_cache_1h_config | 1-hour TTL allowlist configuration | `{allowlist: []}` |
| tengu_system_prompt_global_cache | Enable global scope for system prompt | `false` |
| tengu_compact_cache_prefix | Enable cache prefix sharing during compaction | `false` |

### Pricing Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| OB | SONNET_PRICING | chunks.82.mjs:1487 | object (Sonnet pricing constants) |
| I64 | OPUS_PRICING | chunks.82.mjs:1493 | object (Opus pricing constants) |
| DD1 | SONNET_4_PRICING | chunks.82.mjs:1499 | object (Sonnet 4 pricing constants) |
| zT9 | OPUS_FAST_PRICING | chunks.82.mjs:1505 | object (Opus fast mode pricing) |
| Wf8 | HAIKU_PRICING_1 | chunks.82.mjs:1511 | object (Haiku pricing variant 1) |
| Zf8 | HAIKU_PRICING_2 | chunks.82.mjs:1517 | object (Haiku pricing variant 2) |
| XD1 | MODEL_FAMILY_PRICING | chunks.82.mjs:1524 | object (model family → pricing map) |

> **Note:** Previous versions incorrectly mapped `s91`, `pOq`, `m9z`, `F9z`, `nSA`, `b9z`, `u9z`, `A67`, `Zf5` to prompt cache functions. These mappings have been corrected above.

---

## Module: MCP Protocol

> **⚠️ Symbol Validation Note:** The following symbols have been cross-validated against source code (v2.1.76). Several previously documented mappings were incorrect.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| JE | fetchMcpTools | chunks.170.mjs:533 | function (discovers tools from connected MCP server via tools/list) |
| CYz | MCP_TIMEOUT_MS | chunks.172.mjs:2860 | constant (1800000 = 30 min) |
| pC | callMcpTool | chunks.169.mjs:1910 | function (calls MCP tool via client, used by DiagnosticsManager) |
| F3z | executeMcpToolCall | chunks.170.mjs:607 | function (low-level MCP tool execution with retry) |
| yT6 | getMcpClientConnection | chunks.170.mjs:606 | function (gets connected MCP client for tool execution) |
| hc | getMcpCliCacheDir | chunks.174.mjs:282 | function |
| ST6 | getMcpSessionFilePath | chunks.174.mjs:311 | function |
| ln4 | McpMetaTool | chunks.144.mjs:309 | object |
| A11 | mcpCliProgram | chunks.175.mjs:452442 | object (Commander) |
| yHz | executeMcpTool | chunks.175.mjs:452355 | function |
| rH6 | McpClient | chunks.79.mjs:214313 | class |
| zY1 | callRemoteMcpEndpoint | chunks.175.mjs:452318 | function |
| mFA | parseToolIdentifier | chunks.175.mjs:452309 | function |
| SHz | runMcpCliCommand | chunks.175.mjs:452397 | function |
| qn8 | McpSessionLostError | chunks.170.mjs (in tool call) | class (session disconnection error, triggers retry) |
| EV | McpToolExecutionError | chunks.170.mjs (in tool call) | class (wrapped error for UI display) |

### MCP Transport Layer

> **Validated:** Transport classes are in chunks.57.mjs, not chunks.79/80.mjs as previously documented.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Dy6 | LineBuffer | chunks.5.mjs:2668 | class |
| SO8 | StdioClientTransport | chunks.57.mjs:1098 | class |
| SSEClientTransport | SSEClientTransport | chunks.57.mjs:2492 (start method) | class |
| sH6 | createEventSourceParser | chunks.79.mjs:2028 | function |
| D$6 | SSEClientTransport (legacy ref) | chunks.80.mjs:458 | class |
| j$6 | StreamableHTTPClientTransport | chunks.80.mjs:650 | class |

### MCP Hub & Context

> **Corrected:** `JVq` is the actual McpHub class, not `nXq`. The previously documented `ZQA` as MCPContext is incorrect - `ZQA` is serializerMiddlewareOption.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| JVq | McpHub | chunks.178.mjs:235 | class |
| Jf1 | findMcpClientByServerName | chunks.175.mjs:1211 | function |

> **Note:** `CJq` was incorrectly documented as `updateMcpSessionState`. The actual `CJq` in chunks.162.mjs:3 is a React component for "Remote session details" display.
> **Note:** `nXq` in chunks.165.mjs:864 is an object literal `{}`, not a class. The actual McpHub class is `JVq` in chunks.178.mjs:235.
> **Note:** `K11` was incorrectly documented as `onChangeAppStateHandler`. The actual `K11` is in chunks.10.mjs and is unrelated to MCP.
> **Note:** `FOq` was incorrectly documented as buildMcpCliInstructions. Actual `FOq` in chunks.159.mjs:294 is QR code numeric mode encoder.
> **Note:** `CYz` is a constant (1800000 = 30 min timeout), not a function. The actual processMcpCliResult location needs verification.

### MCP CLI Subcommands

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pT6 | listMcpServers | chunks.175.mjs:962 | function |
| dT6 | filterMcpTools | chunks.175.mjs:975 | function |
| cT6 | getToolInfo | chunks.175.mjs:994 | function |
| lT6 | grepTools | chunks.175.mjs:1020 | function |
| iT6 | filterMcpResources | chunks.175.mjs:1051 | function |
| VD | parseToolName | chunks.175.mjs:? | function |

### MCP UI & State Sync

> **⚠️ Symbol Validation Note:** Multiple MCP UI symbols were incorrectly documented. The following table contains validated locations from source code analysis.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WT7 | setupElicitationRequestHandler | chunks.58.mjs:3 | function (MCP elicitation handler; handles server elicitation requests) |
| KK6 | isElicitationEnabled | chunks.57.mjs:2911 | function (checks tengu_mcp_elicitation feature flag) |
| jB3 | detectElicitationMode | chunks.57.mjs:2919 | function (determines "url" or "form" mode) |
| ZIq | ElicitationDialog | chunks.190.mjs:1242 | function (main elicitation dialog component) |
| BWz | FormElicitationDialog | chunks.190.mjs:1268 | function (form-mode elicitation renderer) |
| gWz | UrlElicitationDialog | chunks.190.mjs (referenced) | function (URL-mode elicitation renderer) |
| JB3 | findElicitationQueueIndex | chunks.57.mjs:2923 | function (find elicitation by server/ID) |
| sx6 | runElicitationHook | chunks.58.mjs:86 | function (Elicitation hook execution) |
| tx6 | runElicitationResultHook | chunks.58.mjs (referenced) | function (ElicitationResult hook execution) |
| XVq | mergeMcpClients | chunks.178.mjs:446 | function (dedup merge of MCP client lists) |
| yp | ElicitationCreateSchema | chunks.5.mjs:2595 | schema (MCP elicitation request) |
| Cn | ElicitationResultSchema | chunks.5.mjs:2605 | schema (MCP elicitation response) |
| My6 | ElicitationCompleteNotification | chunks.5.mjs:2600 | schema (URL mode completion notification) |
| Htq | ElicitationParamsSchema | chunks.5.mjs:2595 | schema (union of form and URL mode params) |
| - | oauth.authServerMetadataUrl | settings | config key (OAuth metadata URL for MCP servers) |

> **Previous Incorrect Mappings:**
> - `RV6` was incorrectly mapped to setupElicitationRequestHandler. Actual `RV6` is in chunks.191.mjs and is unrelated.
> - `xq1` was incorrectly mapped to isElicitationEnabled. Actual `xq1` is in chunks.29.mjs and is unrelated.
> - `iaY` was incorrectly mapped to detectElicitationMode. Actual `iaY` is in chunks.159.mjs and is unrelated.
> - `WWq` was incorrectly mapped to ElicitationDialog. Actual `WWq` in chunks.166.mjs:3188 is a StatsDialog component.

---

## Module: Telemetry

### Event Tracking

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| d | trackEvent | chunks.2.mjs:275 | function (main telemetry event tracker) |
| oAA | setTelemetryBackend | chunks.2.mjs:263 | function (initialize telemetry backend) |
| c | logEvent | chunks.1.mjs:4278 | function |
| ml | logEventAsync | chunks.1.mjs:4290 | function |
| ziA | attachAnalyticsSink | chunks.1.mjs:4266 | function |
| tp | getUserMetadata | chunks.174.mjs:2022 | function |
| z_q | getSanitizedCommandType | chunks.170.mjs:260 | function |
| WvA | logToSegment | chunks.176.mjs:338 (referenced) | function |
| _GA | logToDatadog | chunks.176.mjs:339 (referenced) | function |
| FX6 | logToInternalCollector | chunks.109.mjs:2513 | function |
| _6Y | initInternalTelemetry | chunks.109.mjs:2550 | function |
| EK | recordPerformanceMark | chunks.1.mjs:4317 | function |
| HiA | getProfilingReport | chunks.1.mjs:4330 | function |
| - | feedbackSurveyRate | settings | config key (session quality survey trigger rate 0-1) |
| - | speed | telemetry | OTel attribute (marks fast mode events) |
| - | tool_decision | telemetry | OTel event (tool permission decision in headless mode) |

### Debug Logging

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| k | debugLog | chunks.2.mjs:165 | function (debug logging with level filtering) |
| PT | isDebugEnabled | chunks.2.mjs:225-231 | function (check if debug mode enabled) |
| Krq | getDebugFilter | chunks.2.mjs:232-237 | function (get debug category filter from --debug=) |
| Sx | isDebugToStderr | chunks.2.mjs:237-239 | function (check --debug-to-stderr flag) |
| iAA | getDebugFilePath | chunks.2.mjs:239-246 | function (get --debug-file path) |
| Jm1 | LOG_LEVELS | chunks.2.mjs:219-225 | object (verbose:0, debug:1, info:2, warn:3, error:4) |
| qrq | getCurrentLogLevel | chunks.2.mjs:225-229 | function (get CLAUDE_CODE_DEBUG_LOG_LEVEL env) |
| t6 | parseBoolean | chunks.2.mjs:4 (referenced) | function (parse boolean string/env) |
| e1 | memoize | chunks.2.mjs:4 (referenced) | function (memoization helper) |

### Query Profiling

> Full analysis: [17_telemetry/query_profiling.md](../17_telemetry/query_profiling.md)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BU1 | profilingEnabled | chunks.149.mjs:1343 | variable |
| c1q | queryCounter | chunks.149.mjs:1347 | variable |
| d1q | formatMB | chunks.149.mjs:1233 | function |
| EdY | generateProfilingReport | chunks.149.mjs:1247 | function |
| HhA | getPerformanceInstance | chunks.149.mjs:1205 | function |
| i1q | endProfiling | chunks.149.mjs:1224 | function |
| kdY | generatePhaseBreakdown | chunks.149.mjs:1282 | function |
| l1q | resetProfiling | chunks.149.mjs:1210 | function |
| n1q | printProfilingReport | chunks.149.mjs:1338 | function |
| st | formatMs | chunks.149.mjs:1229 | function |
| vdY | getSlowWarning | chunks.149.mjs:1237 | function |
| whA | memorySnapshots | chunks.149.mjs:1345 | variable |
| y3 | recordMark | chunks.149.mjs:1215 | function |
| YhA | performanceInstance | chunks.149.mjs:1351 | variable |
| zhA | firstChunkTime | chunks.149.mjs:1349 | variable |

---

## Module: Sandbox

> Full analysis: [18_sandbox/overview.md](../18_sandbox/overview.md), [05_tools/security_validation.md](../05_tools/security_validation.md)
> **⚠️ Symbol Validation Note:** `vA` (chunks.56.mjs:516) is the actual sandboxConfigObject, not `b8` as previously documented.
> **⚠️ Symbol Validation Note:** Several sandbox symbols were incorrectly documented with wrong file locations. The following table contains validated locations from source code analysis.

### Sandbox Core

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| vA | sandboxConfigObject | chunks.56.mjs:516 | object (public API facade) |
| aO | sandboxLowLevelModule | chunks.55.mjs:3436 | object (low-level implementation, exported from chunks.55) |
| Xx3 | wrapWithSandbox | chunks.56.mjs:417 | function |
| Px3 | sandboxInitialize | chunks.56.mjs:424 | function |
| h21 | isSandboxingEnabled | chunks.56.mjs:357 | function |
| $x3 | isAutoAllowBashIfSandboxedEnabled | chunks.56.mjs:338 | function |
| Hx3 | areUnsandboxedCommandsAllowed | chunks.56.mjs:341 | function |
| Jx3 | areSandboxSettingsLockedByPolicy | chunks.56.mjs:386 | function |
| Mx3 | setSandboxSettings | chunks.56.mjs:395 | function |
| Dx3 | getExcludedCommands | chunks.56.mjs:413 | function |
| Wx3 | refreshSandboxConfig | chunks.56.mjs:447 | function |
| Zx3 | sandboxReset | chunks.56.mjs:454 | function |
| TG7 | isSandboxEnabledInSettings | chunks.56.mjs:330 | function |
| vG7 | isPlatformInEnabledList | chunks.56.mjs:345 | function |
| R21 | buildSandboxConfig | chunks.56.mjs:224-292 | function (builds config from settings) |
| jx3 | getLinuxGlobPatternWarnings | chunks.56.mjs:364 | function (glob pattern warnings for Linux) |
| Uq6 | isAllowManagedDomainsOnly | chunks.56.mjs:220 | function (check policy managed domains) |
| pb3 | initializeLowLevel | chunks.55.mjs:3024 | function (initializes network infrastructure and log monitor) |
| rZ7 | isSupportedPlatform | chunks.55.mjs:3059 | function |
| Qb3 | isSandboxInitialized | chunks.55.mjs:3065 | function (checks if R5 config is loaded) |
| oZ7 | checkDependencies | chunks.55.mjs:3069 | function |
| ob3 | wrapWithSandboxInternal | chunks.55.mjs:3208 | function (internal dispatch to QZ7 or uZ7) |
| xw8 | reset | chunks.55.mjs:3288 | function (cleanup network bridges and state) |
| zG7 | waitForNetworkInitialization | chunks.55.mjs:3198 | function |
| tb3 | getSandboxViolationStore | chunks.55.mjs:3382 | function (returns V21 instance) |
| eb3 | annotateStderrWithSandboxFailures | chunks.55.mjs:3386 | function (appends violation block to stderr) |
| uZ7 | wrapWithLinuxSandbox | chunks.55.mjs:2564 | function |
| QZ7 | wrapWithMacOSSandbox | chunks.55.mjs:2803 | function (invokes sandbox-exec with SBPL profile) |
| xb3 | generateSeatbeltProfile | chunks.55.mjs:2755 | function (main SBPL generator) |
| yYz | isCommandInExcludedList | chunks.172.mjs:2412 | function (command exclusion pattern matching) |
| Ti | isCommandSandboxed | chunks.172.mjs:2454 | function |
| yfq | parseExclusionPattern | chunks.172.mjs:1530 | function (parses exclusion pattern into type/value) |
| Ln8 | extractPrefixPattern | chunks.172.mjs:1488 | function (extract prefix from command:* pattern) |
| TYz | isWildcardPattern | chunks.172.mjs:1492 | function (check if pattern contains wildcards) |
| Cn8 | matchWildcardPattern | chunks.172.mjs:1645 | function (glob-style wildcard matching) |
| Efq | convertWildcardToRegex | chunks.172.mjs:1503 | function (converts wildcard pattern to regex for matching) |
| bn8 | resolveCommandEnvVars | chunks.172.mjs:1682 | function (resolves symlink for command) |
| Ac | extractCommandBasename | chunks.172.mjs:1660 | function (gets basename from command path) |
| bw8 | matchesDomain | chunks.55.mjs:2952 | function (domain pattern matching with wildcard support) |
| Ezz | checkBashPermissionWithSandbox | chunks.172.mjs:1363 | function |
| E9z | getSandboxSystemPromptBlock | chunks.171.mjs:1892 | function |
| HD6 | SandboxViolationStore | chunks.55.mjs:2902-2936 | class (ring buffer for violations) |
| UZ7 | startLogMonitor | chunks.55.mjs:2843 | function (macOS log stream for sandbox violations) |
| nZ7 | checkNetworkPermission | chunks.55.mjs:2960 | function (domain-based network access control) |
| gb3 | createHttpProxy | chunks.55.mjs:2992 | function (creates HTTP proxy server) |
| Fb3 | createSocksProxy | chunks.55.mjs:3010 | function (creates SOCKS proxy server) |
| - | enableWeakerNetworkIsolation | settings | config key (macOS: allow Go TLS with custom proxy) |

### Sandbox Exclusion Pattern Constants

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| AS1 | SAFE_ENV_VARS_SET | chunks.172.mjs:2407 | constant (Set of safe env var names: NODE_ENV, RUST_LOG, etc.) |
| vYz | SHELL_COMMANDS_SET | chunks.172.mjs:2405 | constant (Set of shell names: sh, bash, zsh, fish, etc.) |
| xfq | LD_PATH_REGEX | chunks.172.mjs:2408 | constant (regex for LD_/DYLD_/PATH env vars) |

### Sandbox Internal State Variables

| Obfuscated | Readable | File:Line | Type | Notes |
|---|---|---|---|---|
| da | initializationPromise | chunks.56.mjs:478 | variable | Caches init promise |
| R5 | currentConfig | chunks.55.mjs:3407 | variable | Current sandbox configuration |
| LL | networkInfo | chunks.55.mjs:3409 | variable | Network infrastructure state |
| Ua | networkInitPromise | chunks.55.mjs:3411 | variable | Network init promise |
| V21 | violationStore | chunks.55.mjs:3421 | variable | SandboxViolationStore instance |
| N21 | logMonitorCleanup | chunks.55.mjs:3419 | variable | macOS log monitor cleanup fn |
| jD6 | httpProxyServer | chunks.55.mjs:3409 | variable | HTTP proxy server instance |
| Fq6 | socksProxyServer | chunks.55.mjs:3410 | variable | SOCKS proxy server instance |

### SandboxViolationStore Class (HD6)

> **Cross-validated location:** chunks.55.mjs:2902-2936

| Method | Purpose |
|--------|---------|
| `constructor()` | Initialize: violations=[], totalCount=0, maxSize=100, listeners=new Set |
| `addViolation(violation)` | Push to array, increment totalCount, trim if >maxSize, notify listeners |
| `getViolations(count?)` | Return copy of all or last N violations |
| `getCount()` | Return current array length |
| `getTotalCount()` | Return lifetime total |
| `getViolationsForCommand(encodedCommand)` | Filter by encoded command tag |
| `clear()` | Empty violations array, notify listeners |
| `subscribe(callback)` | Add to listeners Set, immediately call with current violations, return unsubscribe fn |
| `notifyListeners()` | Call all callbacks with current violations copy |

### Network Permission Control

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| nZ7 | checkNetworkPermission | chunks.55.mjs:2960-2978 | function (domain-based network access control) |
| bw8 | matchesDomain | chunks.55.mjs:2952-2958 | function (domain pattern matching with wildcard support) |
| gb3 | createHttpProxy | chunks.55.mjs:2992-3008 | function (creates HTTP proxy server) |
| Fb3 | createSocksProxy | chunks.55.mjs:3010-3022 | function (creates SOCKS proxy server) |

> **Previous Incorrect Mappings (v2.1.76):**
> - `Ye8` at chunks.59.mjs:5105 was incorrectly mapped to wrapWithMacOSSandbox. Actual `Ye8` is React fiber commitWork code. The correct symbol is `QZ7` at chunks.55.mjs:2803.
> - `FP5` at chunks.35.mjs:1456 was incorrectly mapped to buildSeatbeltProfile. Actual `FP5` is an AWS credential provider function. The correct symbol is `xb3` at chunks.55.mjs:2755.
> - `Sc` was incorrectly mapped to isCommandSandboxed. Actual `Sc` location unknown; the real function is `Ti` at chunks.172.mjs:2454.
> - `nBY` was incorrectly mapped to getSandboxSystemPromptBlock. Actual `nBY` location is different; the real function is `E9z` at chunks.171.mjs:1892.
> - `FOq` was incorrectly mapped to buildMcpCliInstructions. Actual `FOq` in chunks.159.mjs:294 is a QR code numeric mode encoder (`ov6` class).
> - `Lzz` was incorrectly mapped to isCommandInExcludedList. The correct symbol is `yYz` at chunks.172.mjs:2412.

### Sandbox Permission Sync (Swarm)

> **Note:** There are two sets of permission sync symbols:
> - chunks.130.mjs: Swarm coordination functions
> - chunks.134.mjs: Permission sync mailbox functions (validated)

**Swarm Coordination (chunks.130.mjs):**

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| Ib4 | generateSandboxRequestId | chunks.130.mjs:2809 (Ln 326587) | function |
| xb4 | sendSandboxPermissionRequest | chunks.130.mjs:2812 (Ln 326591) | function |
| bb4 | sendSandboxPermissionResponse | chunks.130.mjs:2840 (Ln 326619) | function |
| mb4 | registerSandboxCallback | chunks.130.mjs:2918 (Ln 326692) | function |
| Fb4 | hasSandboxCallback | chunks.130.mjs:2922 (Ln 326696) | function |
| Qb4 | processSandboxResponse | chunks.130.mjs:2926 (Ln 326700) | function |
| lM6 | registerPermissionCallback | chunks.130.mjs:2895 (Ln 326669) | function |
| eP1 | processPermissionResponse | chunks.130.mjs:2907 (Ln 326681) | function |
| ZAH | PermissionRequestSchema | chunks.130.mjs:2874 (Ln 326639) | object (Zod) |
| cM6 | sandboxCallbackMap | chunks.130.mjs:2936 (Ln 326705) | variable (Map) |
| RQ1 | permissionCallbackMap | chunks.130.mjs:2934 (Ln 326705) | variable (Map) |

**Permission Sync Mailbox Functions (chunks.134.mjs) - Validated:**

| Obfuscated | Readable | File:Line | Type | Notes |
|---|---|---|---|---|
| al4 | generateSandboxRequestId | chunks.134.mjs:1052 | function | Generate unique ID: `sandbox-{timestamp}-{random}` |
| sl4 | sendSandboxPermissionRequest | chunks.134.mjs:1056 | function | Send request to team leader via mailbox |
| tl4 | sendSandboxPermissionResponse | chunks.134.mjs:1084 | function | Send response to worker via mailbox |
| nc6 | sandboxPermissionCallbacks | chunks.134.mjs:1183 | variable | Map<requestId, {resolve, reject}> |
| Yi4 | hasSandboxCallback | chunks.134.mjs:1169 | function | Check if callback exists for request |
| zi4 | resolveSandboxCallback | chunks.134.mjs:1173 | function | Resolve callback promise with response |

### Seatbelt Profile Generation (macOS)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| xb3 | generateSeatbeltProfile | chunks.55.mjs:2755 | function (main SBPL generator) |
| Ib3 | generateFileReadRules | chunks.55.mjs:2715 | function (file read permission rules) |
| bb3 | generateFileWriteRules | chunks.55.mjs:2729 | function (file write permission rules) |
| Hv | quoteString | chunks.55.mjs:2789 | function (JSON stringification for SBPL) |
| ub3 | getTempDirPaths | chunks.55.mjs:2793 | function (macOS temp directory resolution) |
| QZ7 | wrapWithSeatbeltSandbox | chunks.55.mjs:2803 | function (invokes sandbox-exec) |

### Bubblewrap Implementation (Linux)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| uZ7 | wrapWithLinuxSandbox | chunks.55.mjs:2564 | function (main bwrap command builder for Linux) |
| xb3 | generateSeatbeltProfile | chunks.55.mjs:2755 | function (macOS SBPL profile generator) |
| QZ7 | wrapWithMacOSSandbox | chunks.55.mjs:2803 | function (macOS sandbox-exec wrapper) |
| Rb3 | generateBwrapArgs | chunks.55.mjs:2491 | function (filesystem mount arguments) |
| Lb3 | buildBridgeWrapperCommand | chunks.55.mjs:2474 | function (network bridge wrapper) |
| Sb3 | getDenyWritePaths | chunks.55.mjs:2669 | function (mandatory deny paths) |
| Cb3 | generateLogTag | chunks.55.mjs:2678 | function (command correlation identifier) |
| v21 | createdEmptyDirs | chunks.55.mjs:2666 | variable (Set for cleanup tracking) |
| yw8 | createdSeccompFilters | chunks.55.mjs:2666 | variable (Set for seccomp cleanup) |
| Vb3 | findSymlinkMountPoint | chunks.55.mjs:2269 | function (symlink attack detection) |
| kw8 | cleanupSeccompFilter | chunks.55.mjs:2375 | function (delete seccomp BPF file) |
| Rw8 | MANDATORY_DENY_SEARCH_DEPTH | chunks.55.mjs:2652 | constant (value: 3) |
| mb3 | setupProcessExitHandler | chunks.55.mjs:2992 | function (cleanup on process exit) |

### Network Proxy & Bridge Sockets

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| xZ7 | createBridgeSockets | chunks.55.mjs:2401 | function (Linux Unix socket bridges) |
| f21 | getProxyEnvVars | chunks.55.mjs:2606 | function (HTTP_PROXY, SOCKS_PROXY env vars) |
| AG7 | getHttpProxyPort | chunks.55.mjs:3183 | function |
| qG7 | getSocksProxyPort | chunks.55.mjs:3187 | function |

### Seccomp BPF Filter (Linux)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| Nw8 | getSeccompArch | chunks.55.mjs:2175 | function (maps arch to seccomp dir) |
| Vw8 | getBpfFilterPath | chunks.55.mjs:2203 | function (finds pre-generated BPF file) |
| Ex6 | getApplySeccompPath | chunks.55.mjs:2227 | function (finds apply-seccomp binary) |
| RZ7 | validateSeccompAvailability | chunks.55.mjs:2251 | function |
| Tb3 | findBpfFilterFile | chunks.55.mjs:2210 | function |
| vb3 | findApplySeccompBinary | chunks.55.mjs:2234 | function |

### Violation Monitoring (macOS)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| UZ7 | startLogMonitor | chunks.55.mjs:2843 | function (macOS log stream monitoring) |
| HD6 | SandboxViolationStore | chunks.55.mjs:2902 | class (ring buffer for violations) |
| FZ7 | SANDBOX_LOG_TAG | chunks.55.mjs:2899 | constant (unique session identifier) |
| T21 | encodeBase64 | chunks.55.mjs:2679 | function (command encoding) |
| EZ7 | decodeBase64 | - | function (command decoding) |

### Sandbox UI Components

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| bAz | sandboxSlashCommandDefinition | chunks.165.mjs:2007 | object (slash command descriptor with live status) |
| TPq | SandboxModeSelector | chunks.165.mjs:1737 | function (3-way mode picker: auto-allow/regular/disabled) |
| PPq | SandboxStatusDisplay | chunks.165.mjs:1399 | function (shows config summary: restrictions, excluded commands) |
| ZPq | SandboxOverridesSettings | chunks.165.mjs:1505 | function (open/closed policy toggle for unsandboxed fallback) |
| Ql8 | SandboxDependenciesPanel | chunks.165.mjs:1641 | function (shows bwrap, socat, seccomp dependency status) |
| aIq | SandboxViolationStatusLine | chunks.191.mjs:92 | function (status bar flash when violations detected) |

### Command Exclusion System

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| yYz | isCommandInExcludedList | chunks.172.mjs:2412 | function (checks command against exclusion patterns using BFS variant expansion) |
| yfq | parseExclusionPattern | chunks.172.mjs:1530 | function (parse pattern into {type, prefix/command/pattern}) |
| Ln8 | extractPrefixPattern | chunks.172.mjs:1488 | function (extract prefix from "command:*" pattern) |
| TYz | isWildcardPattern | chunks.172.mjs:1492 | function (check if pattern contains unescaped wildcards) |
| Cn8 | matchWildcardPattern | chunks.172.mjs:1645 | function (glob-style wildcard matching via Efq) |
| Efq | convertWildcardToRegex | chunks.172.mjs:1503 | function (converts glob pattern to regex) |
| Ac | extractCommandBasename | chunks.172.mjs:1660 | function (strip env vars and prefixes like timeout/sudo) |
| bn8 | resolveCommandEnvVars | chunks.172.mjs:1682 | function (strip LD_/DYLD_/PATH env vars for variant generation) |
| hn8 | removeComments | chunks.172.mjs:1649 | function (strip comment lines from command) |
| xfq | LD_PATH_REGEX | chunks.172.mjs:2408 | constant (regex for LD_/DYLD_/PATH env vars) |
| vYz | SHELL_COMMANDS_SET | chunks.172.mjs:2405 | constant (Set of shell commands: sh, bash, zsh, etc.) |
| AS1 | SAFE_ENV_VARS_SET | chunks.172.mjs:2407 | constant (Set of safe env var names: NODE_ENV, RUST_LOG, etc.) |
| Ti | isCommandSandboxed | chunks.172.mjs:2454 | function (4-gate check: enabled + override + command + excluded) |
| h21 | isSandboxingEnabled | chunks.56.mjs:357 | function (4-gate enablement: platform + deps + allowlist + settings) |

### Network Permission Control

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| nZ7 | checkNetworkPermission | chunks.55.mjs:2960 | function (domain-based network access control) |
| bw8 | matchesDomain | chunks.55.mjs:2952 | function (domain pattern matching with wildcard support) |
| mw8 | DomainPatternSchema | chunks.55.mjs:5 | constant (Zod schema for domain pattern validation) |

### Bash/Sed Security

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| lm | validateBashCommand | chunks.150.mjs:382652 | function |
| edY | validateJqSecurity | chunks.150.mjs:382334 | function |
| OcY | validateSedCommand | chunks.150.mjs:382743 | function |
| J6q | validateSedSubstitution | chunks.150.mjs:382780 | function |
| $cY | checkObfuscatedFlags | chunks.150.mjs:382534 | function |
| AcY | checkShellMetacharacters | chunks.150.mjs:382364 | function |
| qcY | checkDangerousVariables | chunks.150.mjs:382395 | function |
| KcY | checkCommandSubstitution | chunks.150.mjs:382412 | function |
| YcY | checkNewlineInjection | chunks.150.mjs:382453 | function |
| zcY | checkIfsInjection | chunks.150.mjs:382474 | function |
| wcY | checkProcEnvironAccess | chunks.150.mjs:382491 | function |
| HcY | checkMalformedTokens | chunks.150.mjs:382508 | function |

---

## Module: Permissions

> Full analysis: [01_cli/tools_integration.md](../01_cli/tools_integration.md)

### Permission Context Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| xM | createDefaultPermissionContext | chunks.56.mjs:1596 | function (factory for initial permission context) |
| Ez | permissionContextReducer | chunks.53.mjs:1224 | function (handles setMode, addRules, replaceRules, etc.) |
| _v | applyPermissionUpdates | chunks.53.mjs:1296 | function (apply multiple updates to context) |
| U84 | updateToolPermissionContext | chunks.172.mjs:2829 | function (merge settings into context) |
| Xk8 | filterToolsByMode | chunks.93.mjs:1568 | function (filter tools by mode/async context) |

### SDK Permission Handling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tJ | checkToolPermission | chunks.173.mjs:3-150 | function (main permission check with auto-mode classifier, denial tracking) |
| EDz | permissionRequestIterator | chunks.184.mjs:2234-2272 | async generator (iterates hook results for permission decision) |
| b_6 | executePermissionRequestHooks | chunks.175.mjs:2766-2820 | async generator (yields hook permission results) |
| JV6 | processPermissionResult | chunks.184.mjs:1621-1642 | function (processes SDK permission response, handles updatedPermissions) |
| VDz | formatDecisionReason | chunks.184.mjs:1924-1940 | function (extracts reason string from decisionReason object) |
| ao6 | permissionResponseSchema | chunks.184.mjs:1676 | constant (Zod schema for SDK permission response validation) |
| gN6 | hookCallbackResponseSchema | chunks.175.mjs:285 | constant (Zod schema for hook callback response validation) |

> **Note:** Previous versions incorrectly documented `tD` as `getDefaultTools`. This mapping is incorrect.
> Tool assembly is a composite operation using `filterToolsByMode` and permission rules.

---

## Module: Auth

> Full analysis: [24_auth/overview.md](../24_auth/overview.md), [24_auth/api_key_resolution.md](../24_auth/api_key_resolution.md)

### API Provider Detection

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| QA | getProvider | chunks.18.mjs:1861 | function (returns "bedrock"/"vertex"/"foundry"/"firstParty") |
| E4 | getApiProvider | chunks.16.mjs:448 (Ln 49998) | function |
| OH1 | isFirstPartyDirectConnect | chunks.16.mjs:456 (Ln 50006) | function |
| iA | isOAuthUser | chunks.177.mjs:3241 | function (checks if user authenticated via OAuth) |
| w8 | getFeatureFlag | chunks.177.mjs:217 | function (gets feature flag value from settings/cached growthbook) |

### API Key Resolution

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| yO | resolveApiKeyAndSource | chunks.40.mjs:48 (Ln 105694) | function |
| BF6 | getApiKeyFromFd | chunks.16.mjs:1183 (Ln 50684) | function |
| rs1 | getOAuthTokenFromFd | chunks.16.mjs:1157 (Ln 50658) | function |
| JR1 | getApiKeyHelper | chunks.40.mjs:~580 (Ln ~106170) | function (memoized) |
| _R1 | getApiKeyHelperConfig | chunks.40.mjs:98 (Ln 105744) | function |
| XR1 | getOAuthLoginKey | chunks.40.mjs:620 (Ln ~106228) | function (memoized) |
| a4 | getOAuthTokenData | chunks.40.mjs:640 (Ln ~106228) | function (memoized) |
| B95 | getApiKeyHelperTtl | chunks.40.mjs:134 (Ln 105780) | function |
| al8 | isApiKeyHelperFromProjectSettings | chunks.40.mjs:102 (Ln 105748) | function |

### OAuth Flow

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| mF6 | buildOAuthAuthorizeUrl | chunks.16.mjs:1265 (Ln 50762) | function |
| D$8 | exchangeCodeForToken | chunks.16.mjs:1282 (Ln 50778) | function |
| j$8 | refreshOAuthToken | chunks.16.mjs:1301 (Ln 50796) | function |
| FF6 | fetchOAuthProfile | chunks.16.mjs:1404 (Ln 50896) | function |
| M$8 | fetchUserRoles | chunks.16.mjs:1355 (Ln 50849) | function |
| P$8 | generateApiKeyFromOAuth | chunks.16.mjs:1377 (Ln 50870) | function |
| DH1 | fetchOAuthProfileRaw | chunks.16.mjs:1235 (Ln 50733) | function |
| uQ | isOAuthTokenExpiring | chunks.16.mjs:1398 (Ln 50891) | function |
| QF6 | storeOAuthAccountInfo | chunks.16.mjs:1467 (Ln 50957) | function |
| - | authLoginCommand | chunks.189.mjs | function (claude auth login CLI subcommand) |
| - | authStatusCommand | chunks.189.mjs | function (claude auth status CLI subcommand) |
| - | authLogoutCommand | chunks.189.mjs | function (claude auth logout CLI subcommand) |

### Credential Storage

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| T0 | getCredentialStore | chunks.16.mjs:1147 (Ln 50649) | function |
| O$8 | keychainStore | chunks.16.mjs:986 (Ln 50473) | object |
| uF6 | plaintextStore | chunks.16.mjs:1094 (Ln 50591) | object |
| $$8 | createStorageWithFallback | chunks.16.mjs:901 (Ln 50397) | function |
| xQ | getOAuthServiceName | chunks.16.mjs:938 (Ln 50440) | function |

### AWS Auth

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| Q95 | runAwsAuthRefresh | chunks.40.mjs:175 (Ln 105820) | function |
| g95 | runAwsCredentialExport | chunks.40.mjs:200 (Ln 105844) | function |
| y1A | getAwsAuthRefreshConfig | chunks.40.mjs:110 (Ln 105756) | function |
| C1A | getAwsCredentialExportConfig | chunks.40.mjs:122 (Ln 105768) | function |

---

## Module: Model Selection

> Full analysis: [03_llm_core/model_selection.md](../03_llm_core/model_selection.md)
> Model resolution, deployment types, fallback logic, and fast mode integration

### Model Registry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| OJ6 | MODEL_REGISTRY | chunks.39.mjs:2841-2853 | object (maps model aliases to deployment-specific IDs) |
| _3 | getModelRegistry | chunks.176.mjs:1194-1198 | function (returns model ID map for current deployment) |
| iD_ | ALL_MODEL_IDS | chunks.39.mjs:2853 | array (list of all first-party model IDs) |
| xK7 | MODEL_ID_TO_ALIAS | chunks.39.mjs:2853 | object (reverse map: model ID → alias) |

### Model Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| H5 | resolveModelAlias | chunks.176.mjs:1404-1425 | function (converts "opus"/"sonnet"/"haiku" to canonical ID) |
| Of | normalizeModelId | chunks.176.mjs:1301-1319 | function (extracts canonical family from partial ID) |
| IY | extractModelFamily | chunks.176.mjs:1321-1323 | function (wraps normalizeModelId) |
| lg | stripContextMarker | chunks.176.mjs:1469-1471 | function (removes [1m] suffix for API call) |
| e84 | normalizeModelIdVariant | chunks.85.mjs:1807-1819 | function (similar to Of, different implementation) |

### Default Model Getters

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| GN | getDefaultOpusModel | chunks.176.mjs:1263-1267 | function |
| Ef | getDefaultSonnetModel | chunks.176.mjs:1269-1273 | function |
| hT6 | getDefaultHaikuModel | chunks.176.mjs:1275-1278 | function |
| Mv | getDefaultModelWithFlags | chunks.176.mjs:1291-1295 | function (considers feature flags) |
| g0 | getDefaultModel | chunks.176.mjs:1297-1299 | function (wraps Mv) |
| mvq | getBestAvailableModel | chunks.176.mjs:1259-1261 | function (alias for getDefaultOpusModel) |

### Configuration Hierarchy

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| uR | getConfiguredModel | chunks.176.mjs:1242-1251 | function (reads env/settings) |
| cK | getEffectiveModel | chunks.176.mjs:1253-1257 | function (config → env → default) |
| lH | getSmallFastModel | chunks.176.mjs:1234-1236 | function (env var or Haiku default) |
| Ivq | buildModelRegistryForDeployment | chunks.176.mjs:1196-1197 | function |

### Model Fallback

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| R36 | ModelFallbackError | chunks.89.mjs:260-266 | class (signals Opus overload) |
| V36 | isOpusModel | chunks.176.mjs:1238-1240 | function (checks if model is Opus family) |

### Fast Mode Model Eligibility

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Dq | isFastModeAvailable | chunks.56.mjs:2654-2656 | function |
| yj | isFastModeEligible | chunks.56.mjs:2658-2661 | function |
| FH | isOpus46Model | chunks.56.mjs:2711-2715 | function (fast mode only works with Opus 4.6) |
| Jm | isInFastModeCooldown | chunks.56.mjs:2817-2819 | function |
| Mm | getFastModeState | chunks.56.mjs:2821-2826 | function (returns "on"/"off"/"cooldown") |
| ra | getFastModeBlockReason | chunks.56.mjs:2678-2696 | function |
| kf7 | setFastModeCooldown | chunks.56.mjs:2736-2749 | function |

### Context Window Markers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Cf | hasContextMarker | chunks.176.mjs:1495-1498 | function (detects [1m] suffix) |
| pH | is1MContextEnabled | chunks.176.mjs:1344-1347 | function |
| ke | is1MContextDisabled | chunks.176.mjs:1491-1493 | function |
| gr8 | supports1MContext | chunks.176.mjs:1500-1504 | function |
| uM | getContextWindowSize | chunks.176.mjs:1506-1510 | function |

### Model Display Names

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qJ | getDisplayName | chunks.176.mjs:1392-1396 | function |
| ei6 | getDisplayNameForModelId | chunks.176.mjs:1355-1390 | function |
| Of6 | getDefaultModelDescription | chunks.176.mjs:1325-1331 | function |
| cQ8 | getFullDisplayName | chunks.176.mjs:1398-1402 | function |

---

## Module: System Reminders

> Full analysis: [04_system_reminder/](../04_system_reminder/)
> Attachment production, normalization, and injection pipeline

### Core Orchestration Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _uY | assembleAllAttachments | chunks.147.mjs:3-18 | async function (main orchestrator) |
| Hz | timedAttachmentProducer | chunks.147.mjs:20-46 | async function (telemetry wrapper) |
| Ui8 | normalizeAttachmentForAPI | chunks.174.mjs:3-469 | function (main dispatcher) |
| b5 | wrapWithSystemReminderTags | chunks.173.mjs:2496-2523 | function |
| af | wrapInXmlTag | chunks.173.mjs:2490-2494 | function |
| p1 | createUserMessage | chunks.173.mjs:1378-1412 | function |
| nr6 | createToolCallMessage | chunks.174.mjs:490-495 | function |
| ir6 | createToolResultMessage | chunks.174.mjs:471-488 | function |
| EL9 | SYSTEM_REMINDER_REGEX | chunks.90.mjs:730 | constant (regex) |

### Plan Mode Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Wzz | planModeReminderDispatcher | chunks.173.mjs:2525-2530 | function |
| Zzz | ultraplanCompleteReminder | chunks.173.mjs:2532-2538 | function |
| Nzz | fullPlanReminder | chunks.173.mjs:2556-2627 | function |
| kzz | iterativePlanReminder | chunks.173.mjs:2637-2690 | function |
| Ezz | sparsePlanReminder | chunks.173.mjs:2692-2699 | function |
| yzz | subAgentPlanReminder | chunks.173.mjs:2701-2712 | function |
| Lzz | autoModeReminder | chunks.173.mjs:2714-2717 | function |
| Rzz | fullAutoModeReminder | chunks.173.mjs:2719-2732 | function |
| hzz | sparseAutoModeReminder | chunks.173.mjs:2734-2739 | function |
| DuY | getPlanModeAttachment | chunks.147.mjs:136-168 | async function |
| XuY | getPlanModeExitAttachment | chunks.147.mjs:170-181 | async function |
| JuY | countTurnsSincePlanMode | chunks.147.mjs:105-122 | function |
| MuY | countPlanModeReminders | chunks.147.mjs:124-134 | function |
| ZuY | getAutoModeAttachment | chunks.147.mjs:214-227 | async function |
| GuY | getAutoModeExitAttachment | chunks.147.mjs:229-235 | async function |
| PuY | countTurnsSinceAutoMode | chunks.147.mjs:183-200 | function |
| WuY | countAutoModeReminders | chunks.147.mjs:202-212 | function |

### User-Dependent Attachment Producers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| RuY | getAtMentionedFilesAttachment | chunks.147.mjs:407-439 | async function |
| SuY | getMcpResourcesAttachment | chunks.147.mjs | async function |
| huY | getAgentMentionsAttachment | chunks.147.mjs | function |

### Always-Computed Attachment Producers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CuY | getChangedFilesAttachment | chunks.147.mjs | async function |
| IuY | getNestedMemoryAttachments | chunks.147.mjs | async function |
| BuY | getDynamicSkillAttachments | chunks.147.mjs | async function |
| guY | getSkillListingAttachment | chunks.147.mjs | async function |
| VuY | getUltraClaudeMdAttachment | chunks.147.mjs:302-304 | function |
| fuY | getDateChangeAttachment | chunks.147.mjs:237-246 | function |
| TuY | getUltrathinkEffortAttachment | chunks.147.mjs:248-254 | function |
| xE1 | getDeferredToolsDeltaAttachment | chunks.147.mjs:256-267 | function |
| uE1 | getMcpInstructionsDeltaAttachment | chunks.147.mjs:269-282 | function |
| vuY | getCriticalSystemReminderAttachment | chunks.147.mjs:284-291 | function |
| NuY | getOutputStyleAttachment | chunks.147.mjs:293-300 | function |

### Todo and Task Producers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ruY | getTodoReminderAttachment | chunks.147.mjs:972-990 | async function |
| auY | getTaskReminderAttachment | chunks.147.mjs:1013-1031 | async function |
| suY | getUnifiedTasksAttachment | chunks.147.mjs:1033-1048 | async function |
| nuY | analyzeTodoUsageHistory | chunks.147.mjs | function |
| ouY | analyzeTaskUsageHistory | chunks.147.mjs:992-1011 | function |

### Main-Agent-Only Producers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kuY | getIdeSelectionAttachment | chunks.147.mjs:306-320 | async function |
| LuY | getIdeOpenedFileAttachment | chunks.147.mjs:397-405 | async function |
| cuY | getDiagnosticsAttachment | chunks.147.mjs | async function |
| luY | getLspDiagnosticsAttachment | chunks.147.mjs | async function |
| tuY | getAsyncHookResponsesAttachment | chunks.147.mjs:1050-1082 | async function |
| qmY | getTokenUsageAttachment | chunks.147.mjs:1108-1118 | function |
| YmY | getBudgetUsdAttachment | chunks.147.mjs:1124-1134 | function |
| KmY | getOutputTokenUsageAttachment | chunks.147.mjs:1120-1122 | function |
| OuY | getQueuedCommandsAttachment | chunks.147.mjs:48-68 | async function |
| _mY | getVerifyPlanReminderAttachment | chunks.147.mjs:1146-1148 | async function |

### Team/Swarm Mode Producers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| euY | getTeammateMailboxAttachment | chunks.147.mjs:1084-1087 | async function |
| AmY | getTeamContextAttachment | chunks.147.mjs:1089-1106 | function |

### Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| IE1 | TODO_REMINDER_CONSTANTS | chunks.147.mjs:1232-1235 | object ({TURNS_SINCE_WRITE: 10, TURNS_BETWEEN_REMINDERS: 10}) |
| t4q | PLAN_MODE_CONSTANTS | chunks.147.mjs:1235-1238 | object ({TURNS_BETWEEN_ATTACHMENTS: 5, FULL_REMINDER_EVERY_N_ATTACHMENTS: 5}) |
| e4q | AUTO_MODE_CONSTANTS | chunks.147.mjs:1238-1241 | object ({TURNS_BETWEEN_ATTACHMENTS: 5, FULL_REMINDER_EVERY_N_ATTACHMENTS: 5}) |
| YuY | ULTRAMEMORY_CONSTANTS | chunks.147.mjs:1241-1243 | object ({TOKEN_COOLDOWN: 5000}) |
| zuY | TASK_REMINDER_CONSTANTS | chunks.147.mjs:1243-1245 | object ({TURNS_BETWEEN_REMINDERS: 10}) |
| wuY | QUEUED_COMMAND_MODES | chunks.147.mjs:1246 | Set (["prompt", "task-notification"]) |

---

## Module: SDK Configuration

> Full analysis: [20_sdk/](../20_sdk/)
> Environment variables and functions for SDK mode detection and configuration

### Environment Variables

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CLAUDE_CODE_ENTRYPOINT | ENTRYPOINT_ENV | chunks.80.mjs:2666, chunks.189.mjs:917 | environment variable (cli, sdk-ts, sdk-py, sdk-cli, remote, local-agent, mcp, claude-vscode) |
| CLAUDE_AGENT_SDK_VERSION | SDK_VERSION_ENV | chunks.47.mjs:1725 | environment variable (SDK version for user-agent header) |
| CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS | DISABLE_BUILTIN_AGENTS_ENV | chunks.90.mjs:3049 | environment variable (disable built-in agents in SDK mode) |
| CLAUDE_CODE_REMOTE_SESSION_ID | REMOTE_SESSION_ID_ENV | chunks.80.mjs:2666 | environment variable |

### SDK Mode Detection Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| q7 | isNonInteractive | chunks.1.mjs:2720-2722 | function (returns !globalState.isInteractive; true when in SDK/print mode) |
| bL6 | setInteractive | chunks.1.mjs | function (sets global isInteractive flag) |
| L59 | getEntrypoint | chunks.75.mjs:1578-1580 | function (returns CLAUDE_CODE_ENTRYPOINT value) |
| iGz | setEntrypoint | chunks.189.mjs:916-928 | function (detects and sets CLAUDE_CODE_ENTRYPOINT) |
| Jr | getExternalUserAgent | chunks.47.mjs:1725-1728 | function (builds user-agent for SDK API requests) |

### SDK System Prompts

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| t17 | SDK_SYSTEM_PROMPT_CLI | chunks.169.mjs | constant ("You are Claude Code... running within the Claude Agent SDK") |
| e17 | SDK_SYSTEM_PROMPT_AGENT | chunks.169.mjs | constant ("You are a Claude agent, built on Anthropic's Claude Agent SDK") |
| B7A | BASE_SYSTEM_PROMPT | chunks.169.mjs | constant ("You are Claude Code, Anthropic's official CLI for Claude") |

### SDK Transport

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| so6 | StdioStreamIO | chunks.184.mjs:1942 | class |
| to6 | WebSocketTransport | chunks.184.mjs:2298 | class |
| eo6 | HybridTransport | chunks.184.mjs:2762 | class |
| AI1 | RemoteStreamIO | chunks.185.mjs:672 | class |
| URq | getTransportForUrl | chunks.185.mjs:296 | function |
| Y26 | BatchQueue | chunks.184.mjs:2642 | class |
| Pi6 | AsyncQueue | chunks.145.mjs:2959 | class |
| MV6 | RetryAfterError | chunks.184.mjs:2731 | class |
| uDz | computePostUrl | chunks.184.mjs:2740 | function |

### SDK Session Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| FXz | initializeHandler | chunks.187.mjs:1174 | function (processes initialize control request; applies system prompt, agents, hooks, jsonSchema) |
| oGz | streamJsonInputHandler | chunks.189.mjs:984-997 | function (routes stdin → stream based on input format) |
| yJz | buildPermissionHandlerSource | chunks.179.mjs:1635 | function (builds permission handler source identifier) |
| KR6 | setJsonSchema | chunks.179.mjs | function (sets JSON schema for structured output validation) |
| Gv6 | PermissionToolResponseSchema | chunks.178.mjs | Zod schema (validates MCP tool permission response) |
| zJ6 | HookCallbackResponseSchema | chunks.178.mjs | Zod schema (validates hook callback response) |
| hJz | handleSessionResume | chunks.187.mjs | function (handles --resume flag; loads previous session state) |
| UXz | createStreamIO | chunks.187.mjs:1467 | function (creates StdioStreamIO instance based on configuration) |
| thq | handleRewindRequest | chunks.187.mjs:1271-1303 | async function (API handler for rewind; dry-run returns diff stats, actual executes rewindHandler) |
| pXz | handleSetPermissionMode | chunks.187.mjs:1305 | function |
| - | SDKRateLimitInfo | chunks.178.mjs | type (rate limit info object) |
| - | SDKRateLimitEvent | chunks.178.mjs | type (rate limit event type) |
| - | supportsEffort | chunks.178.mjs | field (capability: model supports effort levels) |
| - | supportsAdaptiveThinking | chunks.178.mjs | field (capability: model supports adaptive thinking) |

### SDK Permission Handling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| JV6 | handlePermissionPromptToolResult | chunks.184.mjs:1621 | function (processes MCP tool permission result; handles allow/deny/interrupt) |
| $Jz | processPermissionRequestIterator | chunks.178.mjs:1242-1280 | function (generator: processes permission request with MCP tool fallback) |
| I51 | permissionRequestHandler | chunks.178.mjs:1250 | function (generator: core permission request handling logic) |
| uX | checkToolPermission | chunks.178.mjs | function (checks tool permission before execution; returns behavior + suggestions) |
| createCanUseTool | createCanUseTool | chunks.184.mjs:2119 | method (creates permission checker callback; wraps checkToolPermission) |
| createHookCallback | createHookCallback | chunks.184.mjs:2167 | method (creates callback wrapper for SDK hook execution) |
| handleElicitation | handleElicitation | chunks.184.mjs:2185 | method |
| createSandboxAskCallback | createSandboxAskCallback | chunks.184.mjs:2202 | method |
| sendMcpMessage | sendMcpMessage | chunks.184.mjs:2219 | method |

### SDK Error Handling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bQA | outputErrorAndExit | chunks.178.mjs:1238-1240 | function (outputs error to stderr and exits process with code 1) |
| Ev6 | outputError | chunks.179.mjs:1805-1820 | function (outputs error message in specified output format) |

### SDK MCP Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| oi8 | SdkMcpTransport | chunks.169.mjs:1506 | class |
| WGq | initializeSdkMcpClients | chunks.169.mjs:2437 | function |
| qSq | updateSdkServerState | chunks.187.mjs:1518 | function |

---

## Module: Helper/Utility Functions

> Core utility functions used across multiple modules

### File System Utilities (chunks.1.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $1 | getFileSystem | chunks.1.mjs:4044-4046 | function (returns fs-like object for file operations) |
| fz | writeFileSync | chunks.1.mjs:3878-3896 | function (write file with flush support; wraps fs.writeFileSync) |
| Dn4 | getDirectoryPath | chunks.1.mjs | function (wraps path.dirname) |
| Pn4 | setFilePermissions | chunks.1.mjs | function (wraps fs.chmodSync) |

### Boolean/Environment Parsing (chunks.1.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| t6 | parseBoolean | chunks.1.mjs:4491-4496 | function (parse string/boolean to boolean; handles "true", "1", "yes", etc.) |

### Logging & Telemetry (chunks.2.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| k | consoleLog | chunks.2.mjs:165-180 | function (console logging with level support) |
| d | telemetry | chunks.2.mjs:275-290 | function (record telemetry event; queues if not initialized) |

### Error Handling (chunks.14.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _6 | logError | chunks.14.mjs:726-740 | function (error logging with optional error reporting integration) |

### User Settings (chunks.177.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| X1 | getUserSettings | chunks.177.mjs:2046-2055 | function (get cached user configuration) |

### Diff Algorithm (chunks.56.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| na | computeDiff | chunks.56.mjs:2072-2074 | function (Myers diff algorithm; wraps diff library) |

---

