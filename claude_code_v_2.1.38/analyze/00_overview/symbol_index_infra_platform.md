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
| cq6 | getSystemPrompt | chunks.47.mjs:2470 | function |
| lq6 | getAttributionHeader | chunks.47.mjs:2484 | function |
| F9z | buildSystemPromptWithCache | chunks.169.mjs:150 | function |
| A67 | calculatePromptHash | chunks.47.mjs:2528 | function |

---

## Module: MCP Protocol

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ce | parseMcpCliCommand | chunks.174.mjs:2627 | function |
| CYz | processMcpCliResult | chunks.170.mjs:473 | function |
| ECA | callMcpServer | chunks.170.mjs:480 (referenced) | function |
| CJq | updateMcpSessionState | chunks.174.mjs:353 | function |
| FOq | buildMcpCliInstructions | chunks.169.mjs:264 | function |
| hc | getMcpCliCacheDir | chunks.174.mjs:282 | function |
| ST6 | getMcpSessionFilePath | chunks.174.mjs:311 | function |
| ln4 | McpMetaTool | chunks.144.mjs:309 | object |
| A11 | mcpCliProgram | chunks.175.mjs:452442 | object (Commander) |
| yHz | executeMcpTool | chunks.175.mjs:452355 | function |
| rH6 | McpClient | chunks.79.mjs:214313 | class |
| SJA | StdioClientTransport | chunks.79.mjs:214693 | class |
| zY1 | callRemoteMcpEndpoint | chunks.175.mjs:452318 | function |
| mFA | parseToolIdentifier | chunks.175.mjs:452309 | function |
| SHz | runMcpCliCommand | chunks.175.mjs:452397 | function |

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


