# Symbol Index - Platform Infrastructure (Claude Code 2.1.76)

> Symbol mapping table Part 3: Platform, protocols, and infrastructure
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.

---

## Quick Navigation

- [Remote Sessions](#module-remote-sessions) - **NEW in 2.1.27**
- [MCP Protocol](#module-mcp-protocol)
- [Permissions](#module-permissions)
- [Sandbox](#module-sandbox)
- [Auth](#module-auth)
- [Model Selection](#module-model-selection)
- [Telemetry](#module-telemetry)

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

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| A67 | calculatePromptHash | chunks.47.mjs:2528 | function |
| cq6 | getSystemPrompt | chunks.47.mjs:2470 | function |
| dZ | buildSystemPrompt | chunks.169.mjs:236 | function (main entry, selects full vs simplified) |
| F9z | buildSystemPromptWithCache | chunks.169.mjs:1394 | function |
| FOq | buildMcpCliInstructions | chunks.169.mjs:264 | function |
| G9z | buildBasePersonaSection | chunks.169.mjs:436267 | function ("You are an interactive CLI tool...") |
| hOq | buildSimplifiedSystemPrompt | chunks.169.mjs:225 | function (proactive/simplified variant) |
| IOq | buildSimplifiedEnvInfo | chunks.169.mjs:402 | function (compact env for simplified prompt) |
| lq6 | getAttributionHeader | chunks.47.mjs:2484 | function |
| nBA | buildFullEnvInfo | chunks.169.mjs:378 | function (XML-format env for standard prompt) |
| ot | buildFinalSystemPrompt | chunks.188.mjs:537 | function (combines custom + default prompts) |
| Pf5 | isAttributionHeaderEnabled | chunks.47.mjs:2484 | function |
| xG1 | GLOBAL_CACHE_MARKER | chunks.169.mjs:216 | constant (cache boundary delimiter) |
| Zf5 | getFirstUserMessageText | chunks.47.mjs:2528 | function (extracts text for hash) |
| - | modelOverrides | settings | config key (per-model configuration overrides map) |
| - | includeGitInstructions | settings | config key (include git-specific instructions in system prompt) |
| CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS | DISABLE_GIT_INSTRUCTIONS_ENV | process.env | environment variable |

---

## Module: MCP Protocol

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ce | parseMcpCliCommand | chunks.174.mjs:2627 | function |
| CYz | processMcpCliResult | chunks.170.mjs:473 | function |
| ECA | callMcpServer | chunks.145.mjs:1627 | function |
| CJq | updateMcpSessionState | chunks.174.mjs:353 | function |
| FOq | buildMcpCliInstructions | chunks.169.mjs:264 | function |
| hc | getMcpCliCacheDir | chunks.174.mjs:282 | function |
| ST6 | getMcpSessionFilePath | chunks.174.mjs:311 | function |
| ln4 | McpMetaTool | chunks.144.mjs:309 | object |
| A11 | mcpCliProgram | chunks.175.mjs:452442 | object (Commander) |
| yHz | executeMcpTool | chunks.175.mjs:452355 | function |
| rH6 | McpClient | chunks.79.mjs:214313 | class |
| SJA | StdioClientTransport | chunks.79.mjs:1922 | class |
| zY1 | callRemoteMcpEndpoint | chunks.175.mjs:452318 | function |
| mFA | parseToolIdentifier | chunks.175.mjs:452309 | function |
| SHz | runMcpCliCommand | chunks.175.mjs:452397 | function |

### MCP Transport Layer

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hb1 | LineBuffer | chunks.79.mjs:1881 | class |
| sH6 | createEventSourceParser | chunks.79.mjs:2028 | function |
| D$6 | SSEClientTransport | chunks.80.mjs:458 | class |
| j$6 | StreamableHTTPClientTransport | chunks.80.mjs:650 | class |

### MCP Hub & Context

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nXq | McpHub | chunks.175.mjs:1897 | class |
| ZQA | MCPContext | chunks.176.mjs:2333 | class |
| K11 | onChangeAppStateHandler | chunks.176.mjs:581 | function |
| Jf1 | findMcpClientByServerName | chunks.175.mjs:1211 | function |

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

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XVq | mergeMcpClients | chunks.186.mjs:163 | function |
| sgA | mergeCommands | chunks.186.mjs:177 | function |
| WWq | ElicitationDialog | chunks.188.mjs:1247 | function |
| RV6 | setupElicitationRequestHandler | chunks.156.mjs:1540 | function (MCP elicitation handler; handles server elicitation requests) |
| - | ElicitationRequestSchema | chunks.156.mjs | schema (MCP elicitation request Zod schema) |
| - | ElicitationResponseSchema | chunks.156.mjs | schema (MCP elicitation response Zod schema) |
| - | oauth.authServerMetadataUrl | settings | config key (OAuth metadata URL for MCP servers) |

---

## Module: Telemetry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
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

### Sandbox Core

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| b8 | sandboxConfigObject | chunks.47.mjs:109 | object |
| eP5 | wrapWithSandbox | chunks.45.mjs:136 (Ln 119677) | function |
| FP5 | buildSeatbeltProfile | chunks.44.mjs:3122 (Ln 119238) | function |
| hO | sandboxModule | chunks.45.mjs:347 (Ln 119860) | object |
| iP5 | isSandboxingEnabled (low-level) | chunks.45.mjs:350 (Ln 119542) | function |
| Je8 | isSupportedPlatform | chunks.45.mjs:~118 (Ln 119536) | function |
| Xe8 | checkDependencies | chunks.45.mjs:~125 (Ln 119546) | function |
| L8 | sandboxDebugLog | chunks.44.mjs:64 (Ln 118569) | function |
| lP5 | sandboxInitialize | chunks.44.mjs:3388 (Ln 119501) | function |
| Nq6 | isSandboxingEnabled (public) | chunks.46.mjs:2818 (Ln 123689) | function |
| le8 | isSandboxEnabledInSettings | chunks.46.mjs:2790 (Ln 123661) | function |
| oe8 | isPlatformInEnabledList | chunks.46.mjs:2809 (Ln 123680) | function |
| GG5 | isAutoAllowBashIfSandboxedEnabled | chunks.46.mjs:2799 (Ln 123670) | function |
| ZG5 | areUnsandboxedCommandsAllowed | chunks.46.mjs:2804 (Ln 123675) | function |
| VG5 | areSandboxSettingsLockedByPolicy | chunks.46.mjs:2847 (Ln 123718) | function |
| NG5 | setSandboxSettings | chunks.46.mjs:2874 (Ln 123726) | function |
| TG5 | getExcludedCommands | chunks.46.mjs:2874 (Ln 123744) | function |
| fG5 | getLinuxGlobPatternWarnings | chunks.46.mjs:2825 (Ln 123696) | function |
| vG5 | wrapWithSandboxFromSettings | chunks.46.mjs:2880 (Ln 123747) | function |
| WG5 | extractCommandPrefix | chunks.46.mjs:2680 (Ln 123555) | function |
| KC1 | isManagedDomainsOnlyPolicy | chunks.46.mjs:2693 (Ln 123564) | function |
| n8A | buildSandboxConfigFromSettings | chunks.46.mjs:2697 (Ln 123568) | function |
| EG5 | initializeSandboxFromSettings | chunks.47.mjs:3 (Ln 123753) | function |
| kG5 | refreshSandboxConfig | chunks.47.mjs:21 (Ln 123771) | function |
| LG5 | resetSandboxAndSettings | chunks.47.mjs:28 (Ln 123777) | function |
| ae8 | addExcludedCommand | chunks.47.mjs:32 (Ln 123781) | function |
| Or | sandboxInitializationPromise | chunks.47.mjs:~800 (Ln 123800) | variable |
| r8A | settingsChangeUnsubscribe | chunks.47.mjs:~800 (Ln 123800) | variable |
| st8 | wrapWithLinuxSandbox | chunks.44.mjs:2830 (Ln 118852) | function |
| Ye8 | wrapWithMacOSSandbox | chunks.44.mjs:3166 (Ln 119283) | function |
| ze8 | startMacOSLogMonitor | chunks.44.mjs:3208 (Ln 119324) | function |
| Oq6 | encodeCommandForViolation | chunks.44.mjs:2569 (Ln 118673) | function |
| uP5 | buildCommandLogTag | chunks.44.mjs:3045 (Ln 119045) | function |
| gt8 | decodeBase64Command | chunks.44.mjs:2573 (Ln 118678) | function |
| qe8 | sandboxSessionId | chunks.44.mjs:3258 (Ln 119371) | variable |
| dy1 | SandboxViolationStore | chunks.44.mjs:3266 (Ln 119377) | class |
| $q6 | buildProxyEnvVars | chunks.44.mjs:2556 (Ln 118660) | function |
| Uy1 | getDefaultWriteAllowPaths | chunks.44.mjs:2551 (Ln 118655) | function |
| tC | resolvePath | chunks.44.mjs:2522 (Ln 118626) | function |
| Ut8 | getSandboxRuntimePaths | chunks.44.mjs:2587 (Ln 118701) | function |
| dt8 | getBpfFilterPath | chunks.44.mjs:2677 (Ln 118791) | function |
| py1 | getApplySeccompPath | chunks.44.mjs:2653 (Ln 118767) | function |
| _e8 | isNetworkPermissionAllowed | chunks.44.mjs:3324 (Ln 119440) | function |
| b8A | domainMatchesPattern | chunks.44.mjs:3270 (Ln 119433) | function |
| pP5 | getMitmSocketPath | chunks.44.mjs:3290 (Ln 119461) | function |
| dP5 | startHttpProxyServer | chunks.44.mjs:3300 (Ln 119471) | function |
| cP5 | startSocksProxyServer | chunks.44.mjs:3315 (Ln 119488) | function |
| UP5 | registerCleanup | chunks.44.mjs:3250 (Ln 119423) | function |
| u8A | sandboxReset | chunks.45.mjs:200 (Ln 119740) | function |
| KW5 | getSandboxViolationStore | chunks.45.mjs:270 (Ln 119834) | function |
| YW5 | annotateStderrWithSandboxFailures | chunks.45.mjs:275 (Ln 119838) | function |
| nP5 | getFsReadConfig | chunks.45.mjs:~155 (Ln 119570) | function |
| rP5 | getFsWriteConfig | chunks.45.mjs:~165 (Ln 119582) | function |
| oP5 | getNetworkRestrictionConfig | chunks.45.mjs:~178 (Ln 119601) | function |
| We8 | getHttpProxyPort | chunks.45.mjs:~108 (Ln 119653) | function |
| Ge8 | getSocksProxyPort | chunks.45.mjs:~112 (Ln 119657) | function |
| Ze8 | getLinuxHttpSocketPath | chunks.45.mjs:~116 (Ln 119661) | function |
| fe8 | getLinuxSocksSocketPath | chunks.45.mjs:~120 (Ln 119665) | function |
| Ve8 | waitForNetworkInitialization | chunks.45.mjs:~124 (Ln 119668) | function |
| Sc | isCommandSandboxed | chunks.172.mjs:1763 (Ln 443570) | function |
| Lzz | isCommandInExcludedList | chunks.172.mjs:1741 (Ln 443548) | function |
| Ezz | checkBashPermissionWithSandbox | chunks.172.mjs:1363 (Ln ~443181) | function |
| nBY | getSandboxSystemPromptBlock | chunks.146.mjs:883 (Ln 372152) | function |
| - | enableWeakerNetworkIsolation | settings | config key (macOS: allow Go TLS with custom proxy) |

### Sandbox Permission Sync (Swarm)

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

## Module: Auth

> Full analysis: [24_auth/overview.md](../24_auth/overview.md), [24_auth/api_key_resolution.md](../24_auth/api_key_resolution.md)

### API Provider Detection

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| E4 | getApiProvider | chunks.16.mjs:448 (Ln 49998) | function |
| OH1 | isFirstPartyDirectConnect | chunks.16.mjs:456 (Ln 50006) | function |

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
| w4 | isNonInteractive | chunks.1.mjs:2730-2732 | function (returns true when in SDK/print mode) |
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
| thq | handleRewindRequest | chunks.187.mjs:1271 | function |
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

