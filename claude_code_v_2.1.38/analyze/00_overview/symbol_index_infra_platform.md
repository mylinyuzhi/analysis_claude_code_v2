# Symbol Index - Platform Infrastructure (Claude Code 2.1.38)

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
| iP5 | isSandboxingEnabled | chunks.45.mjs:350 | function |
| L8 | sandboxDebugLog | chunks.44.mjs:64 (Ln 118569) | function |
| lP5 | sandboxInitialize | chunks.44.mjs:3388 (Ln 119501) | function |
| Nq6 | isSandboxingEnabled (public) | chunks.47.mjs:111 | function |
| st8 | wrapWithLinuxSandbox | chunks.44.mjs:2830 (Ln 118852) | function |
| Ye8 | wrapWithMacOSSandbox | chunks.44.mjs:3166 (Ln 119283) | function |
| ze8 | startMacOSLogMonitor | chunks.44.mjs:3207 (Ln 119324) | function |
| dy1 | SandboxViolationStore | chunks.44.mjs:3266 (Ln 119377) | class |
| $q6 | buildProxyEnvVars | chunks.44.mjs:2556 (Ln 118660) | function |
| Uy1 | getDefaultWriteAllowPaths | chunks.44.mjs:2551 (Ln 118655) | function |
| tC | resolvePath | chunks.44.mjs:2522 (Ln 118626) | function |
| Ut8 | getSandboxRuntimePaths | chunks.44.mjs:2587 (Ln 118701) | function |
| dt8 | getBpfFilterPath | chunks.44.mjs:2677 (Ln 118791) | function |
| py1 | getApplySeccompPath | chunks.44.mjs:2653 (Ln 118767) | function |
| _e8 | isNetworkPermissionAllowed | chunks.44.mjs:3324 (Ln 119440) | function |
| u8A | sandboxReset | chunks.45.mjs:200 (Ln 119740) | function |
| GG5 | isAutoAllowBashIfSandboxedEnabled | chunks.47.mjs:114 | function |
| ZG5 | areUnsandboxedCommandsAllowed | chunks.47.mjs:115 | function |

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
| phY | assembleAttachments | chunks.142.mjs:1948-1965 | function |
| gw | timedAttachmentProducer | chunks.142.mjs:1967-1991 | function |
| oP1 | attachmentGenerator | chunks.142.mjs:2494-2501 | async generator |
| K2z | normalizeAttachmentForAPI | chunks.173.mjs:698-1131 | function |
| _9 | wrapWithSystemReminderTags | chunks.173.mjs:496-523 | function |
| tI | wrapInXmlTag | chunks.173.mjs:490-494 | function |
| c6 | createUserMessage | chunks.172.mjs:2876-2912 | function |
| kq | createAttachmentMessage | chunks.142.mjs:2615-2622 | function |

### Plan Mode Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| azz | planModeReminderDispatcher | chunks.173.mjs:525-529 | function |
| szz | fullPlanReminder | chunks.173.mjs:531-609 | function |
| ezz | iterativePlanReminder | chunks.173.mjs:619-674 | function |
| A2z | sparsePlanReminder | chunks.173.mjs:676-683 | function |
| q2z | subAgentPlanReminder | chunks.173.mjs:685-696 | function |
| chY | countTurnsSincePlanMode | chunks.142.mjs:2003-2020 | function |
| lhY | countPlanModeReminders | chunks.142.mjs:2022-2032 | function |
| ihY | getPlanModeAttachment | chunks.142.mjs:2034-2058 | function |
| nhY | getPlanModeExitAttachment | chunks.142.mjs:2060-2071 | function |

### User-Dependent Attachment Producers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KIY | extractAtMentionedFiles | chunks.142.mjs:2199-2236 | function |
| zIY | extractMcpResources | chunks.142.mjs:2252-2283 | function |
| YIY | extractAgentMentions | chunks.142.mjs:2238-2250 | function |
| _IY | parseAtMentions | chunks.142.mjs:2397-2408 | function |
| JIY | parseMcpResourceMentions | chunks.142.mjs:2411-2415 | function |
| XIY | parseAgentMentions | chunks.142.mjs:2417-2427 | function |
| DIY | parseFilePathWithLineRange | chunks.142.mjs:2429-2440 | function |

### Always-Computed Attachment Producers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wIY | getChangedFilesAttachment | chunks.142.mjs:2285-2335 | function |
| HIY | getNestedMemoryAttachments | chunks.142.mjs:2337-2348 | function |
| $IY | getDynamicSkillAttachments | chunks.142.mjs:2350-2375 | function |
| OIY | getSkillListingAttachment | chunks.142.mjs:2381-2395 | function |
| thY | getUltraClaudeMdAttachment | chunks.142.mjs:2110-2112 | function |
| rhY | getDelegateModeAttachment | chunks.142.mjs:2073-2083 | function |
| ohY | getDelegateModeExitAttachment | chunks.142.mjs:2085-2090 | function |
| ahY | getCriticalSystemReminder | chunks.142.mjs:2092-2099 | function |
| shY | getOutputStyleAttachment | chunks.142.mjs:2101-2108 | function |

### Todo and Task Producers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fIY | getTodoReminderAttachment | chunks.142.mjs:2645-2661 | function |
| NIY | getTaskReminderAttachment | chunks.142.mjs:2684-2701 | function |
| vIY | getUnifiedTasksAttachment | chunks.142.mjs:2719-2756 | function |
| ZIY | analyzeToDoUsageHistory | chunks.142.mjs:2624-2643 | function |
| VIY | analyzeTaskUsageHistory | chunks.142.mjs:2663-2682 | function |
| TIY | getTaskProgressHistory | chunks.142.mjs:2703-2717 | function |

### Main-Agent-Only Producers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ehY | getIdeSelectionAttachment | chunks.142.mjs:2114-2127 | function |
| qIY | getIdeOpenedFileAttachment | chunks.142.mjs:2189-2197 | function |
| PIY | getDiagnosticsAttachment | chunks.142.mjs:2463-2471 | function |
| WIY | getLspDiagnosticsAttachment | chunks.142.mjs:2473-2492 | function |
| EIY | getAsyncHookResponsesAttachment | chunks.142.mjs:2758-2789 | function |
| RIY | getTokenUsageAttachment | chunks.142.mjs:2815-2825 | function |
| yIY | getBudgetUsdAttachment | chunks.142.mjs:2827-2835 | function |
| dhY | getQueuedCommandsAttachment | chunks.142.mjs:1993-2001 | function |
| SIY | getVerifyPlanReminderAttachment | chunks.142.mjs:? | function |

### Team/Swarm Mode Producers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kIY | getTeammateMailboxAttachment | chunks.142.mjs:2791-2794 | function |
| LIY | getTeamContextAttachment | chunks.142.mjs:2796-2813 | function |

### Helper Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ri4 | loadNestedMemory | chunks.142.mjs:2163-2187 | function |
| AIY | getNestedMemoryPaths | chunks.142.mjs:2129-2145 | function |
| NyA | createNestedMemoryAttachments | chunks.142.mjs:2147-2161 | function |
| TyA | loadFileAttachment | chunks.142.mjs:2524-2613 | function |
| GIY | createPdfReferenceAttachment | chunks.142.mjs:2503-2522 | function |
| pd1 | createToolCallMessage | chunks.173.mjs:1152-1157 | function |
| Ud1 | createToolResultMessage | chunks.173.mjs:1133-1150 | function |

### Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AC1 | MAX_FILE_LINES | chunks.142.mjs:? | constant |
| ii4 | PLAN_MODE_CONSTANTS | chunks.142.mjs:? | object |
| eW6 | TODO_REMINDER_CONSTANTS | chunks.142.mjs:? | object |
| ghY | TASK_PROGRESS_TURNS_THRESHOLD | chunks.142.mjs:? | constant |

---


