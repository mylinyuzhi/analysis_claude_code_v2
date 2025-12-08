# Symbol Index - Infrastructure Modules

> 符号映射表 Part 2: 基础设施模块
> 查找方式：按模块浏览，或 Ctrl+F 搜索混淆名/可读名。
>
> **Related file:** [symbol_index_core.md](./symbol_index_core.md) - Core execution modules (Agent Loop, Tools, Hooks, etc.)

---

## Quick Navigation

- [MCP Protocol](#module-mcp-protocol) - Server config, tool calling, result processing
- [Code Indexing](#module-code-indexing---tree-sitter) - Tree-sitter, file index, file cache
- [Shell Command Parser](#module-shell-command-parser) - Command parsing, pipes
- [Permission Checking](#module-permission-checking) - Rule matching, file/bash permissions
- [Sandbox](#module-sandbox) - macOS/Linux sandboxing, network proxy
- [Telemetry](#module-telemetry) - Analytics, error logging
- [UI Components](#module-ui-components) - Internal app
- [Model Selection](#module-model-selection) - Provider detection, model resolution
- [Prompt Building](#module-prompt-building) - System prompt assembly
- [API Calling](#module-api-calling) - Core API functions
- [Slash Commands](#module-slash-commands) - Command parsing, execution
- [Constants & Utilities](#constants-cross-module) - Cross-module constants

---

## Module: MCP Protocol

### Core Connection Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| D1A | connectSingleMcpServer | chunks.101.mjs:2309-2341 | function |
| v10 | batchConnectMcpServers | chunks.101.mjs:2350-2411 | function |
| ZYA | connectToMcpServer | chunks.101.mjs:2685-2950 | function |
| IYA | initializeMcpServer | chunks.101.mjs | function |

### Server Configuration Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| K1A | addServerToConfig | chunks.101.mjs:1699-1768 | function |
| S10 | removeServerFromConfig | chunks.101.mjs:1770-1810 | function |
| GYA | getServerByName | chunks.101.mjs:1938-1952 | function |
| fk | loadAllMcpServers | chunks.101.mjs:1955-2026 | function |
| sX | loadScopeServers | chunks.101.mjs | function |
| ZMA | parseMcpConfigObject | chunks.101.mjs:2028-2094 | function |
| BYA | parseMcpConfigFile | chunks.101.mjs:2096-2155 | function |
| IMA | isServerDisabled | chunks.101.mjs | function |
| T32 | isServerBlocked | chunks.101.mjs | function |
| P10 | isServerAllowedByPolicy | chunks.101.mjs | function |
| C21 | isProjectServerApproved | chunks.101.mjs | function |

### Configuration File Operations

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| j10 | loadProjectMcpConfig | chunks.101.mjs | function |
| M32 | saveProjectMcpConfig | chunks.101.mjs | function |
| N1 | getUserSettings | chunks.101.mjs | function |
| c0 | saveUserSettings | chunks.101.mjs | function |
| j5 | getLocalSettings | chunks.101.mjs | function |
| AY | saveLocalSettings | chunks.101.mjs | function |
| H21 | getEnterpriseConfig | chunks.101.mjs | function |
| _10 | enterpriseConfigExists | chunks.101.mjs | function |
| O22 | configObjectSchema | chunks.101.mjs | constant |
| il | serverConfigSchema | chunks.101.mjs | constant |

### Timeout Configuration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| MY5 | getMCPToolTimeout | chunks.101.mjs:2271-2273 | function |
| z21 | getMCPConnectionTimeout | chunks.101.mjs:2275-2277 | function |
| OY5 | getMCPServerConnectionBatchSize | chunks.101.mjs:2279-2281 | function |
| PY5 | batchProcessWithLimit | chunks.101.mjs | function |

### Tool Calling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| y32 | callMcpTool | chunks.101.mjs:2523-2568 | function |
| x10 | listMcpTools | chunks.101.mjs | function |
| _32 | listMcpPrompts | chunks.101.mjs | function |
| S32 | listMcpResources | chunks.101.mjs | function |
| aT | toolResultSchema | chunks.91.mjs:231-235 | constant |
| y0 | logMcpDebug | chunks.101.mjs | function |
| WI | logMcpError | chunks.101.mjs | function |

### Result Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| b10 | processMcpResult | chunks.101.mjs:2491-2513 | function |
| jY5 | processMcpToolResult | chunks.101.mjs:2515-2521 | function |
| k32 | convertMCPContent | chunks.101.mjs:2413-2474 | function |
| U21 | formatSchemaForDisplay | chunks.101.mjs | function |

### Result Size Limiting

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DB2 | limitToolResultSize | chunks.94.mjs:372-375 | function |
| $e1 | exceedsTokenLimit | chunks.94.mjs:341-356 | function |
| B95 | truncateResultWithWarning | chunks.94.mjs:358-370 | function |
| Q95 | truncateContentArrayToTokens | chunks.94.mjs:308-339 | function |
| A95 | truncateStringToTokens | chunks.94.mjs | function |
| xQ1 | getMaxMcpOutputTokens | chunks.94.mjs:269-271 | function |
| t25 | getMaxTokensForTruncation | chunks.94.mjs:291-293 | function |
| e25 | getTruncationWarningMessage | chunks.94.mjs:295-301 | function |
| Ue1 | countApproxTokens | chunks.94.mjs | function |
| bNA | countTokensAccurately | chunks.94.mjs | function |
| FB2 | isTextContent | chunks.94.mjs | function |
| KB2 | isImageContent | chunks.94.mjs | function |

### Image Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| rt | processImageForSize | chunks.70.mjs:1035-1069 | function |
| yz6 | multiScaleResizing | chunks.70.mjs:1101-1115 | function |
| xz6 | applyFormatSpecificEncoding | chunks.70.mjs:1117-1136 | function |
| vz6 | pngCompressionOptimization | chunks.70.mjs:1138-1149 | function |
| bz6 | jpegQualityOptimization | chunks.70.mjs:1151-1160 | function |
| fz6 | aggressiveJpegCompression | chunks.70.mjs:1162-1170 | function |
| KMB | resizeImageToFitLimit | chunks.70.mjs:1077-1090 | function |
| w$A | encodeImageAsBase64 | chunks.70.mjs | function |

### Transport Types

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ut1 | StdioClientTransport | chunks.101.mjs | class |
| NQ1 | SseClientTransport | chunks.101.mjs | class |
| Xe1 | HttpClientTransport | chunks.101.mjs | class |
| BQ1 | StdClient | chunks.101.mjs | class |
| lAA | AuthProvider | chunks.101.mjs | class |
| E21 | buildAuthHeaders | chunks.101.mjs | function |
| Wt | getUserAgent | chunks.101.mjs | function |

### Resource Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Wh | readResourceTool | chunks.101.mjs | object |
| Xh | refreshResourcesTool | chunks.101.mjs | object |

### MCP Constants

| Obfuscated | Readable | Value | Type |
|------------|----------|-------|------|
| $$A | DEFAULT_IMAGE_MAX_BYTES | 3932160 | constant |
| VB2 | IMAGE_TOKEN_COST | 1600 | constant |
| o25 | THRESHOLD_MULTIPLIER | 0.5 | constant |
| Z95 | LARGE_RESPONSE_THRESHOLD | 10000 | constant |
| LY5 | IMAGE_SUPPORTED_MIME_TYPES | Set | constant |

### Tool Naming

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| n7 | normalizeToolName | chunks.158.mjs | function |

---

## Module: Code Indexing - Tree-sitter

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Q05 | loadTreeSitterWasm | chunks.90.mjs:465-498 | function |
| jA2 | ensureTreeSitterLoaded | chunks.90.mjs:500-503 | function |
| B05 | parseCommand | chunks.90.mjs:505-523 | function |
| SA2 | findCommandNode | chunks.90.mjs:525-539 | function |
| G05 | extractEnvVars | chunks.90.mjs:541-550 | function |
| Z05 | extractCommandArgs | chunks.90.mjs:552-569 | function |
| I05 | stripQuotes | chunks.90.mjs:571-573 | function |
| q01 | parserInstance | chunks.90.mjs | variable |
| jo1 | bashLanguage | chunks.90.mjs | variable |
| Po1 | initPromise | chunks.90.mjs | variable |
| No1 | ParserClass | chunks.90.mjs | class |
| qo1 | LanguageClass | chunks.90.mjs | class |
| s15 | maxCommandLength | chunks.90.mjs | constant |
| r15 | declarationCommands | chunks.90.mjs | constant |
| o15 | argumentNodeTypes | chunks.90.mjs | constant |
| t15 | substitutionTypes | chunks.90.mjs | constant |
| To1 | commandNodeTypes | chunks.90.mjs | constant |

---

## Module: Code Indexing - File Index

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| UO3 | getFileIndex | chunks.138.mjs:1954-1962 | function |
| NO3 | buildFileIndex | chunks.138.mjs:1976-1998 | function |
| MO3 | searchFileIndex | chunks.138.mjs:2028-2075 | function |
| jJ0 | refreshIndexCache | chunks.138.mjs:2077-2086 | function |
| x09 | autocompleteFiles | chunks.138.mjs:2102-2121 | function |
| wO3 | extractDirectoryPrefixes | chunks.138.mjs:1964-1970 | function |
| qO3 | getAdditionalFiles | chunks.138.mjs:1972-1974 | function |
| LO3 | commonPrefix | chunks.138.mjs:2000-2005 | function |
| y09 | findCommonCompletionPrefix | chunks.138.mjs:2007-2016 | function |
| jZ1 | createFileResult | chunks.138.mjs:2018-2026 | function |
| PZ1 | fileIndexInstance | chunks.138.mjs | variable |
| PJ0 | useFuseJsFallback | chunks.138.mjs | variable |
| SJ0 | cachedFileIndex | chunks.138.mjs | variable |
| _J0 | cachedFileList | chunks.138.mjs | variable |
| fXA | refreshPromise | chunks.138.mjs | variable |
| k09 | lastRefreshTimestamp | chunks.138.mjs | variable |
| $O3 | cacheTTL | chunks.138.mjs | constant |
| sPA | maxResults | chunks.138.mjs | constant |
| KO3 | lruMaxEntries | chunks.138.mjs | constant |
| DO3 | lruCacheTTL | chunks.138.mjs | constant |
| j09 | lruCacheInstance | chunks.138.mjs | variable |

---

## Module: Code Indexing - File Cache

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Kh0 | FileContentCache | chunks.16.mjs:199-247 | class |
| Dh0 | fileContentCacheInstance | chunks.16.mjs:249 | variable |

---

## Module: Code Indexing - File Watching

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| k64 | initializeWatcher | chunks.19.mjs:307-324 | function |
| dd0 | disposeWatcher | chunks.19.mjs:326-329 | function |
| y64 | subscribeToChanges | chunks.19.mjs:331-335 | function |
| x64 | markInternalWrite | chunks.19.mjs:337-340 | function |
| v64 | getWatchedFiles | chunks.19.mjs:342-354 | function |
| b64 | onFileChange | chunks.19.mjs:356-365 | function |
| f64 | onFileUnlink | chunks.19.mjs:367-371 | function |
| cd0 | findSettingByPath | chunks.19.mjs:373-375 | function |
| fm | watcherManager | chunks.19.mjs:403-408 | object |
| h9A | chokidarInstance | chunks.19.mjs | variable |
| gd0 | watcherInitialized | chunks.19.mjs | variable |
| md0 | watcherDisposed | chunks.19.mjs | variable |
| pxA | debounceTimestamps | chunks.19.mjs | variable |
| wKA | subscriberCallbacks | chunks.19.mjs | variable |
| j64 | stabilityThreshold | chunks.19.mjs | constant |
| S64 | pollInterval | chunks.19.mjs | constant |
| _64 | debounceWindow | chunks.19.mjs | constant |

---

## Module: Shell Command Parser

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _A2 | FallbackCommandParser | chunks.90.mjs:600-637 | class |
| Y05 | createTreeSitterCommandParser | chunks.90.mjs:646-724 | function |
| N01 | shellParserFacade | chunks.90.mjs:724-737 | object |
| yA2 | analyzeCommandWithPipes | chunks.90.mjs:804-829 | function |
| J05 | checkPipePermissions | chunks.90.mjs:739-797 | function |
| W05 | stripOutputRedirections | chunks.90.mjs:799-802 | function |

---

## Module: Permission Checking

### Core Permission Decision Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Wb3 | toolPermissionDecisionEngine | chunks.153.mjs:1358-1417 | function |
| M$ | toolPermissionDispatcher | chunks.153.mjs:1480-1502 | function |
| KVA | getDenialRules | chunks.153.mjs:1299-1305 | function |
| CVA | getAllowRules | chunks.153.mjs:1250-1256 | function |
| yY1 | getAskRules | chunks.153.mjs:1307-1313 | function |
| so1 | findAllowRuleForTool | chunks.153.mjs:1323-1325 | function |
| ro1 | findDenyRuleForTool | chunks.153.mjs:1327-1329 | function |
| oo1 | findAskRuleForTool | chunks.153.mjs:1331-1333 | function |
| OK0 | ruleMatchesTool | chunks.153.mjs:1315-1321 | function |

### Rule Parsing Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nN | parseRuleString | chunks.153.mjs:1230-1244 | function |
| B3 | stringifyRule | chunks.153.mjs:1246-1248 | function |
| mU | parseMcpToolName | chunks.154.mjs:2554-2563 | function |
| RK0 | getRulesForToolByBehavior | chunks.153.mjs:1339-1356 | function |
| fU | getRulesForToolWrapper | chunks.153.mjs:1335-1337 | function |

### Permission Context Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ZE | initializePermissionContext | chunks.70.mjs:2169-2176 | function |
| UF | applyPermissionUpdate | chunks.16.mjs:1122-1192 | function |
| JxA | persistRuleAddition | chunks.16.mjs:1072-1098 | function |
| fh0 | persistRuleDeletion | chunks.16.mjs:1038-1060 | function |
| FV9 | deletePermissionRule | chunks.153.mjs:1419-1446 | function |
| PE9 | ruleAggregation | chunks.153.mjs:1448-1466 | function |
| MK0 | PERMISSION_SOURCES | chunks.153.mjs:1517 | constant |
| iN | FILE_BASED_SOURCES | chunks.16.mjs:1007 | constant |

### File Permission Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| jD | filePathRuleMatching | chunks.154.mjs:1697-1726 | function |
| L0A | checkEditPermission | chunks.154.mjs:1815-1856 | function |
| OB | readSettingsFile | chunks.154.mjs:2359-2366 | function |
| cB | writeSettingsFile | chunks.154.mjs:2368-2407 | function |
| X2 | isPlanFile | chunks.154.mjs | function |
| yR | checkFileSafety | chunks.154.mjs | function |

### Bash Permission Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| no1 | bashCommandPermissionCheck | chunks.90.mjs:1935-2008 | function |
| io1 | exactBashCommandMatcher | chunks.90.mjs:2055-2096 | function |
| oA2 | prefixBashCommandMatcher | chunks.90.mjs:2098-2156 | function |
| k05 | sandboxAutoAllowBash | chunks.90.mjs:1903-1933 | function |
| fo1 | pathRedirectionPermissionCheck | chunks.90.mjs:1163-1185 | function |
| _05 | mcpToolPermissionCheck | chunks.90.mjs:1759-1822 | function |
| xo1 | checkPathPermission | chunks.90.mjs:854-888 | function |
| F05 | resolveAndCheckPath | chunks.90.mjs:890-899 | function |
| V05 | extractDirectoryFromGlob | chunks.90.mjs:845-852 | function |
| hA2 | formatPathList | chunks.90.mjs:839-843 | function |
| J05 | checkPipePermissions | chunks.90.mjs:739-797 | function |

### Helper Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hV0 | sourceLabelFormatter | chunks.153.mjs:1209-1228 | function |
| yV | permissionMessageBuilder | chunks.153.mjs:1258-1297 | function |
| Fv | permissionModeLabel | chunks.19.mjs:835-848 | function |
| SE9 | initializePermissionMode | chunks.153.mjs:1537-1567 | function |
| nT | extractCommandRedirections | chunks.153.mjs:800-848 | function |

---

## Module: Sandbox

### Core Initialization

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $44 | initializeSandbox | chunks.17.mjs:250-288 | function |
| s64 | initializeSandboxFromSettings | chunks.19.mjs:695-711 | function |
| sH1 | parseSettingsToSandboxConfig | chunks.19.mjs:549-607 | function |
| r64 | refreshSandboxConfig | chunks.19.mjs:713-718 | function |
| o64 | resetSandbox | chunks.19.mjs:720-722 | function |

### State Getters

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ixA | isSandboxingEnabled | chunks.19.mjs:628-634 | function |
| w44 | isSandboxConfigLoaded | chunks.17.mjs:294-296 | function |
| m64 | isSandboxEnabledInSettings | chunks.19.mjs:609-616 | function |
| d64 | isAutoAllowBashEnabled | chunks.19.mjs:618-621 | function |
| c64 | areUnsandboxedCommandsAllowed | chunks.19.mjs:623-626 | function |
| l64 | areSandboxSettingsLocked | chunks.19.mjs:657-664 | function |
| i64 | setSandboxSettings | chunks.19.mjs:666-682 | function |
| n64 | getExcludedCommands | chunks.19.mjs:684-686 | function |

### Configuration Getters

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| q44 | getFsReadConfig | chunks.17.mjs:311-321 | function |
| N44 | getFsWriteConfig | chunks.17.mjs:323-340 | function |
| L44 | getNetworkRestrictionConfig | chunks.17.mjs:342-354 | function |
| bm0 | getAllowUnixSockets | chunks.17.mjs:356-358 | function |
| km0 | getAllowAllUnixSockets | chunks.17.mjs:360-362 | function |
| fm0 | getAllowLocalBinding | chunks.17.mjs:364-366 | function |
| hm0 | getIgnoreViolations | chunks.17.mjs:368-370 | function |
| gm0 | getEnableWeakerNestedSandbox | chunks.17.mjs:372-374 | function |
| um0 | getHttpProxyPort | chunks.17.mjs:386-388 | function |
| mm0 | getSocksProxyPort | chunks.17.mjs:390-392 | function |

### Command Wrapping

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| a64 | wrapWithSandbox | chunks.19.mjs:688-693 | function |
| Tm0 | macOSSandboxWrapper | chunks.17.mjs:45-80 | function |
| qm0 | linuxSandboxWrapper | chunks.16.mjs:3401-3484 | function |

### macOS Seatbelt Implementation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| H44 | generateSandboxProfile | chunks.17.mjs:3-29 | function |
| K44 | buildFileReadPolicy | chunks.16.mjs:3551-3563 | function |
| D44 | buildFileWritePolicy | chunks.16.mjs:3565-3589 | function |
| Rm0 | buildWriteUnlinkDenyRules | chunks.16.mjs:3530-3549 | function |
| jxA | globToSeatbeltRegex | chunks.16.mjs:3510-3512 | function |
| F44 | generateCommandTag | chunks.16.mjs:3514-3516 | function |

### macOS Violation Monitoring

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Pm0 | startMacOSViolationMonitor | chunks.17.mjs:82-128 | function |
| XKA | SandboxViolationStore | chunks.17.mjs:140-174 | class |
| Xm0 | decodeCommandTag | chunks.16.mjs:3126-3128 | function |

### Linux bwrap Implementation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| J44 | buildFilesystemRestrictions | chunks.16.mjs:3356-3399 | function |
| wm0 | initializeLinuxBridges | chunks.16.mjs:3266-3337 | function |
| Y44 | buildNetworkAndSeccompCommand | chunks.16.mjs:3339-3354 | function |
| $m0 | checkLinuxDependencies | chunks.16.mjs:3242-3264 | function |
| Z44 | findDangerousFilesForDenylist | chunks.16.mjs:3193-3231 | function |
| V44 | getMandatoryDenyPatterns | chunks.16.mjs:3502-3508 | function |

### Linux Seccomp Filter

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| NH1 | findSeccompBPFFilter | chunks.16.mjs:3157-3167 | function |
| PxA | findApplySeccompBinary | chunks.16.mjs:3169-3179 | function |
| Dm0 | getSeccompFilter | chunks.16.mjs:3181-3187 | function |
| Km0 | getArchitectureForSeccomp | chunks.16.mjs:3138-3155 | function |

### Network Proxy

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| z44 | initializeHTTPProxy | chunks.17.mjs:219-234 | function |
| U44 | initializeSOCKSProxy | chunks.17.mjs:236-248 | function |
| ym0 | checkNetworkAccess | chunks.17.mjs:198-217 | function |
| _m0 | domainMatches | chunks.17.mjs:190-196 | function |
| RxA | buildProxyEnvironmentVars | chunks.16.mjs:3108-3119 | function |

### Permission Checking

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WIA | isBashSandboxed | chunks.106.mjs:446-452 | function |
| k05 | sandboxAutoAllowBash | chunks.90.mjs:1903-1933 | function |

### UI & Display

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| dU6 | getSandboxRestrictionsSummary | chunks.71.mjs:670-734 | function |

### Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| YKA | DANGEROUS_CONFIG_FILES | chunks.16.mjs:3135 | constant |
| B44 | DANGEROUS_DIRECTORIES | chunks.16.mjs:3135 | constant |
| RH1 | DEFAULT_MANDATORY_DENY_DEPTH | chunks.16.mjs:3488 | constant |
| OH1 | temporarySeccompFilters | chunks.16.mjs:3490 | variable |
| Um0 | cleanupHandlerRegistered | chunks.16.mjs:3492 | variable |

---

## Module: Telemetry

### Core Event Logging Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| GA | analyticsEvent | chunks.1.mjs:2997-3007 | function |
| eu | analyticsEventAsync | chunks.1.mjs:3009-3019 | function |
| Hz0 | attachTelemetryProvider | chunks.1.mjs:2985-2995 | function |
| M9 | telemetryMarker | chunks.1.mjs:3034-3037 | function |
| AA | errorLog | chunks.1.mjs:3738-3752 | function |
| uN | logWarning | chunks.107.mjs | function |

### Provider State Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tu | telemetryProvider | chunks.1.mjs:~2980 | variable |
| NFA | pendingEventQueue | chunks.1.mjs:~2982 | variable |
| SX1 | getLoggerProvider | chunks.1.mjs:2674 | function |
| gE0 | setLoggerProvider | chunks.1.mjs:2678 | function |
| uE0 | getEventLogger | chunks.1.mjs:2682 | function |
| mE0 | setEventLogger | chunks.1.mjs:2686 | function |
| dE0 | getMeterProvider | chunks.1.mjs:2690 | function |
| cE0 | setMeterProvider | chunks.1.mjs:2694 | function |
| _X1 | getTracerProvider | chunks.1.mjs:2698 | function |
| pE0 | setTracerProvider | chunks.1.mjs:2702 | function |

### OpenTelemetry Initialization

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XO2 | initializeOpenTelemetry | chunks.118.mjs:559-664 | function |
| VO2 | flushPendingMetrics | chunks.118.mjs:666 | function |
| ev5 | configureOtelHeaders | chunks.118.mjs | function |
| W80 | BigQueryMetricsExporter | chunks.118.mjs:3-115 | class |
| Gb5 | createBigQueryExporter | chunks.118.mjs | function |
| Zb5 | isBigQueryEnabled | chunks.118.mjs | function |

### Multi-Destination Routing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hg3 | logEventSync | chunks.156.mjs:2014-2024 | function |
| gg3 | logEventAsync | chunks.156.mjs:2026-2037 | function |
| $D0 | sendToDatadog | chunks.156.mjs:1909-1952 | function |
| TW0 | sendToSegment | chunks.156.mjs | function |
| SCB | logToSentry | chunks.156.mjs | function |
| Hh1 | sendToSentryAsync | chunks.156.mjs | function |
| Gh1 | logLocal | chunks.156.mjs | function |
| Qh1 | getSampleRate | chunks.156.mjs | function |

### Feature Gate Checks

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| n$9 | isSegmentEnabled | chunks.156.mjs:1996-2004 | function |
| a$9 | isDatadogEnabled | chunks.156.mjs:2006-2012 | function |
| fX | isTelemetryDisabled | chunks.57.mjs:1975-1977 | function |

### Structured Event Logging

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| HO | logStructuredEvent | chunks.121.mjs:887-901 | function |
| kJA | getCommonAttributes | chunks.121.mjs | function |

### Error Tracking (Sentry)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Az0 | addToInMemoryErrorLog | chunks.1.mjs:2778 | function |
| z2A | getInMemoryErrorLog | chunks.1.mjs:2774 | function |
| ZP9 | getSentryErrorPath | chunks.1.mjs:3734 | function |
| IP9 | sendToSentry | chunks.1.mjs:3769 | function |

### Privacy Controls (Grove)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _Q0 | markGroveNoticeViewed | chunks.108.mjs:242-255 | function |
| i91 | updateGroveSetting | chunks.108.mjs:257-275 | function |
| yi | fetchGroveConfiguration | chunks.108.mjs:277-318 | function |
| fYA | isGroveEnabled | chunks.108.mjs | function |
| zD9 | shouldShowGroveNotice | chunks.149.mjs:3076-3086 | function |

### Startup Performance Profiling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| gX1 | getPerformanceApi | chunks.1.mjs | function |
| Ez0 | generateStartupReport | chunks.1.mjs | function |
| VT9 | extractTimingMetrics | chunks.1.mjs | function |
| XT9 | getStartupReportPath | chunks.1.mjs | function |
| Uz0 | enableStartupProfiling | chunks.1.mjs | variable |
| RkA | captureMemoryMetrics | chunks.1.mjs | variable |
| $z0 | memoryUsageMap | chunks.1.mjs | variable |

### Datadog Configuration

| Obfuscated | Readable | Value | Type |
|------------|----------|-------|------|
| jg3 | DATADOG_ENDPOINT | https://http-intake.logs.datadoghq.com/api/v2/logs | constant |
| kg3 | DATADOG_BATCH_SIZE | 100 | constant |
| _g3 | DATADOG_FLUSH_INTERVAL | 15000 | constant |
| vg3 | DATADOG_TAGS | Array | constant |
| iSA | datadogBuffer | chunks.156.mjs | variable |
| Iu | datadogFlushTimer | chunks.156.mjs | variable |
| UD0 | flushDatadogBuffer | chunks.156.mjs | function |

### Statsig Feature Gates

| Obfuscated | Readable | Value | Type |
|------------|----------|-------|------|
| l$9 | SEGMENT_GATE_NAME | "tengu_log_segment_events" | constant |
| i$9 | DATADOG_GATE_NAME | "tengu_log_datadog_events" | constant |
| wD0 | segmentGateValue | chunks.156.mjs | variable |
| qD0 | datadogGateValue | chunks.156.mjs | variable |

---

## Module: UI Components

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BsA | InternalApp | chunks.68.mjs:100-300 | class |

---

## Module: Model Selection

### Provider Detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| V6 | getProvider | chunks.19.mjs:451-452 | function |
| Y0 | parseBoolean | chunks.107.mjs | function |

### Model ID Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TzA | SONNET_37_IDS | chunks.56.mjs:1450-1454 | constant |
| PzA | SONNET_35_IDS | chunks.56.mjs:1455-1459 | constant |
| jzA | HAIKU_35_IDS | chunks.56.mjs:1460-1464 | constant |
| SzA | HAIKU_45_IDS | chunks.56.mjs:1465-1469 | constant |
| At | SONNET_40_IDS | chunks.56.mjs:1470-1474 | constant |
| fv1 | SONNET_45_IDS | chunks.56.mjs:1475-1479 | constant |
| _zA | OPUS_40_IDS | chunks.56.mjs:1480-1484 | constant |
| kzA | OPUS_41_IDS | chunks.56.mjs:1485-1489 | constant |
| yzA | OPUS_45_IDS | chunks.56.mjs:1490-1494 | constant |

### Model ID Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| eI | getModelIds | chunks.56.mjs:1586-1589 | function |
| NiA | getProviderModelIds | chunks.56.mjs:1533-1544 | function |
| $kA | getCachedModelIds | chunks.56.mjs | function |
| Pr8 | initializeModelIds | chunks.56.mjs:1577-1583 | function |
| Rr8 | fetchBedrockModelIds | chunks.56.mjs:1547-1574 | function |
| w_ | findModel | chunks.56.mjs | function |

### Model Selection Priority Chain

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| yE0 | getSessionOverrideModel | chunks.1.mjs:2591-2592 | function |
| mnA | getActiveModelSource | chunks.59.mjs:2737-2745 | function |
| Tt | getActiveModel | chunks.59.mjs:2748-2754 | function |
| k3 | getFinalModel | chunks.59.mjs:2757-2760 | function |
| CCB | getDefaultModelOverride | chunks.59.mjs:2812-2816 | function |
| cnA | getFallbackModel | chunks.59.mjs:2819-2827 | function |
| jt | getFallbackModelNormalized | chunks.59.mjs:2829-2830 | function |

### Default Model Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XU | getDefaultSonnetModel | chunks.59.mjs:2763-2765 | function |
| wUA | getDefaultOpusModel | chunks.59.mjs:2776-2779 | function |
| X7A | getDefaultHaikuModel | chunks.59.mjs:2782-2785 | function |
| MW | getSmallFastModel | chunks.59.mjs:2725-2726 | function |

### Model Alias & Normalization

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Y7A | MODEL_ALIASES | chunks.59.mjs:3147 | constant |
| J7A | FULL_MODEL_ALIASES | chunks.59.mjs:3147 | constant |
| Vh1 | isKnownAlias | chunks.59.mjs:2994-2995 | function |
| UD | normalizeModelName | chunks.59.mjs:2998-3013 | function |
| inA | resolveAgentModel | chunks.59.mjs:3028-3037 | function |
| YM | getModelDisplayName | chunks.59.mjs:3016-3025 | function |
| nnA | getModelDisplayLabel | chunks.59.mjs:3040-3043 | function |

### Plan/Subscription Checks

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Pt | selectModelForPermissionMode | chunks.59.mjs:2792-2800 | function |
| BB | isClaudePro | chunks.59.mjs | function |
| pw | hasPaidExtras | chunks.59.mjs | function |
| UUA | isMaxPlan | chunks.59.mjs:2768-2769 | function |
| $UA | isTeamPlan | chunks.59.mjs:2772-2773 | function |
| W7A | isOpusModelById | chunks.59.mjs:2729-2730 | function |
| KT | isOpusModel | chunks.59.mjs:2733-2734 | function |
| Wh1 | isSonnet1MExperimentEnabled | chunks.59.mjs:2803-2809 | function |
| dnA | isHaikuDefaultForPro | chunks.59.mjs:2788-2789 | function |

### Model Display Config

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Xh1 | SONNET_CONFIG | chunks.59.mjs:3151-3155 | constant |
| UCB | SONNET_1M_CONFIG | chunks.59.mjs:3156-3160 | constant |
| wCB | HAIKU_45_CONFIG | chunks.59.mjs:3161-3165 | constant |
| xY6 | HAIKU_35_CONFIG | chunks.59.mjs:3166-3170 | constant |
| bY6 | OPUS_CONFIG | chunks.59.mjs:3172-3175 | constant |
| pnA | getDefaultModelDescription | chunks.59.mjs:2874-2877 | function |

---

## Module: Prompt Building

### System Prompt Assembly

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Tn | buildCompleteSystemPrompt | chunks.152.mjs:2307-2448 | function |
| CE9 | getEnvironmentContext | chunks.152.mjs:2582-2601 | function |
| GSA | getAgentSpecificContext | chunks.152.mjs:2616-2625 | function |
| kv3 | getGitStatusPrompt | chunks.152.mjs | function |

### Identity Selection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| rnA | getSessionTypeIdentity | chunks.60.mjs:465-472 | function |
| gCB | getCoreSystemPrompt | chunks.60.mjs:474-476 | function |
| hCB | CLAUDE_CODE_IDENTITY | chunks.60.mjs:478 | constant |
| sY6 | CLAUDE_CODE_SDK_IDENTITY | chunks.60.mjs:479 | constant |
| rY6 | CLAUDE_AGENT_IDENTITY | chunks.60.mjs:480 | constant |

### MCP Instructions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| HE9 | getMCPToolsPrompt | chunks.152.mjs:2465-2580 | function |
| bv3 | getMCPServerInstructions | chunks.152.mjs:2450-2463 | function |
| bZ | isMCPEnabled | chunks.152.mjs | function |

### Git Instructions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cU6 | getGitInstructions | chunks.71.mjs:787-875 | function |
| EOB | getBashToolDescription | chunks.71.mjs:736-785 | function |

### Security & Guidelines

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DE9 | SECURITY_GUIDELINES | chunks.152.mjs | constant |

---

## Module: API Calling

### Core API Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $E9 | streamApiCall | chunks.153.mjs:3-361 | function |
| t61 | withRetry | chunks.121.mjs:1988-2046 | function |
| Kq | createApiClient | chunks.88.mjs:3-105 | function |
| U | buildRequestPayload | chunks.153.mjs | function |

### Response Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| RYA | streamingApiCallWrapper | chunks.146.mjs | function |
| wy | nonStreamingApiCall | chunks.153.mjs | function |
| Ao1 | wrapMessageStream | chunks.153.mjs | function |

### Error Handling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| E81 | FallbackTriggeredError | chunks.121.mjs | class |
| X81 | RetryError | chunks.121.mjs | class |

---

## Constants (Cross-Module)

### Threshold Constants

| Obfuscated | Readable | Value | Description |
|------------|----------|-------|-------------|
| GY2.TURNS_SINCE_WRITE | TODO_TURNS_SINCE_WRITE | 7 | Min turns before todo reminder |
| GY2.TURNS_BETWEEN_REMINDERS | TODO_TURNS_BETWEEN | 3 | Min turns between reminders |
| IH5.TURNS_BETWEEN_ATTACHMENTS | PLAN_MODE_THROTTLE | 5 | Min turns between plan_mode |

### String Constants

| Obfuscated | Readable | Description |
|------------|----------|-------------|
| tA5 | MALWARE_WARNING_REMINDER | Appended to all file reads |
| $q | EMPTY_CONTENT_PLACEHOLDER | Empty message placeholder |
| xO | TOOL_USE_PLACEHOLDER | Tool use placeholder text |
| sJA | EMPTY_PROMPT_PLACEHOLDER | Empty prompt text |
| pXA | INTERRUPTED_MESSAGE | Interrupted tool message |

### Numeric Constants

| Obfuscated | Readable | Value | Description |
|------------|----------|-------|-------------|
| NKA | MAX_LINES_BEFORE_TRUNCATE | - | Truncation limit for files |
| ZN | DEFAULT_HOOK_TIMEOUT | 60000 | Hook timeout in ms |

---

## Utility Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nO | generateUUID | chunks.153.mjs | function |
| Y0 | parseBooleanEnv | chunks.107.mjs | function |
| o9 | createAbortController | chunks.107.mjs | function |
| B9 | extractXmlTagContent | chunks.153.mjs:2260-2279 | function |
| nJ | splitMessageContent | chunks.153.mjs:2290-2346 | function |
| cV | createLocalCommandCaveat | chunks.153.mjs:2229-2234 | function |

---

## Module: Slash Commands

### Command Parsing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _P2 | parseSlashCommandInput | chunks.121.mjs:913-1016 | function |
| rJA | extractCommandParts | chunks.121.mjs:862-877 | function |
| if5 | isValidCommandName | chunks.121.mjs:909-911 | function |
| ph | commandExists | chunks.152.mjs:2174-2176 | function |
| Pq | lookupCommand | chunks.152.mjs:2178-2182 | function |
| Ny | getBuiltinCommandNames | chunks.152.mjs:2265 | function |
| KE9 | getAllBuiltinCommands | chunks.152.mjs:2265 | function |

### Command Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nf5 | executeCommand | chunks.121.mjs:1018-1147 | function |
| kP2 | processPromptCommand | chunks.121.mjs:1177-1214 | function |
| a61 | formatCommandMetadata | chunks.121.mjs:1149-1153 | function |
| Y$ | buildMessageContent | chunks.153.mjs:2207-2216 | function |
| w0A | parseAllowedTools | chunks.153.mjs:1569-1600 | function |
| sf5 | formatCommandMetadataForPrompt | chunks.121.mjs:1155-1175 | function |
| s61 | processSlashCommandTool | chunks.121.mjs:1217-1300 | function |

### Custom Command Loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _n | loadCommandFilesFromDirectories | chunks.153.mjs:1855-1882 | function |
| TK0 | scanMarkdownFiles | chunks.153.mjs:1809-1836 | function |
| NV | parseFrontmatter | chunks.16.mjs:892-919 | function |
| fC9 | loadCustomCommandsForExecution | chunks.152.mjs:909-994 | function |
| Zv3 | generateCommandName | chunks.152.mjs:894-896 | function |
| Bv3 | generateSkillCommandName | chunks.152.mjs:880-892 | function |
| Gv3 | generateRegularCommandName | chunks.152.mjs:870-878 | function |
| Qv3 | deduplicateCommands | chunks.152.mjs:852-868 | function |
| WK0 | isSkillMarkdown | chunks.152.mjs:848-850 | function |
| RSA | getDirectoryPath | chunks.152.mjs | function |
| Sv3 | getSkillsFromPluginsAndDirectories | chunks.152.mjs:2151-2168 | function |
| zb3 | getProjectRoots | chunks.153.mjs:1840-1853 | function |
| PK0 | directoryExists | chunks.153.mjs:1805-1807 | function |

### Built-in Command Definitions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ky3 | configCommand | chunks.148.mjs:312-326 | object |
| rV9 | configCommandRef | chunks.148.mjs:326 | object |
| by3 | contextCommand | chunks.148.mjs:659-694 | object |
| QF9 | contextCommandRef | chunks.148.mjs:694 | object |
| hy3 | costCommand | chunks.148.mjs:707-732 | object |
| GF9 | costCommandRef | chunks.148.mjs:732 | object |
| cy3 | doctorCommand | chunks.148.mjs:1311-1324 | object |
| EF9 | doctorCommandRef | chunks.148.mjs:1324 | object |
| sy3 | helpCommand | chunks.148.mjs:1642-1659 | object |
| kF9 | helpCommandRef | chunks.148.mjs:1659 | object |
| ey3 | ideCommand | chunks.148.mjs:1921-2002 | object |
| gF9 | ideCommandRef | chunks.148.mjs:2002 | object |
| Ax3 | initCommand | chunks.148.mjs:2013-2048 | object |
| mF9 | initCommandRef | chunks.148.mjs:2048 | object |
| ny3 | memoryCommand | chunks.148.mjs:1480-1500 | object |
| MF9 | memoryCommandRef | chunks.148.mjs:1500 | object |
| Ny3 | clearCommand | chunks.147.mjs:2275-2290 | object |
| LV9 | clearCommandRef | chunks.147.mjs:2290 | object |
| Ly3 | compactCommand | chunks.147.mjs:2309-2357 | object |
| OV9 | compactCommandRef | chunks.147.mjs:2357 | object |
| wy3 | feedbackCommand | chunks.147.mjs:2208-2228 | object |
| qV9 | feedbackCommandRef | chunks.147.mjs:2228 | object |
| Ix3 | mcpCommand | chunks.149.mjs:1422-1455 | object |
| jK9 | mcpCommandRef | chunks.149.mjs:1455 | object |
| yK9 | prCommentsCommand | chunks.149.mjs:1457-1530 | object |
| Yx3 | releaseNotesCommand | chunks.149.mjs:1531-1570 | object |
| bK9 | releaseNotesCommandRef | chunks.149.mjs:1570 | object |
| Jx3 | renameCommand | chunks.149.mjs:1571-1590 | object |
| hK9 | renameCommandRef | chunks.149.mjs:1590 | object |
| Kx3 | resumeCommand | chunks.149.mjs:2294-2357 | object |
| JJ1 | reviewCommand | chunks.149.mjs:2367-2432 | object |
| Dx3 | statusCommand | chunks.149.mjs:2419-2445 | object |
| sK9 | statusCommandRef | chunks.149.mjs:2445 | object |
| Hx3 | tasksCommand | chunks.149.mjs:2446-2494 | object |
| oK9 | tasksCommandRef | chunks.149.mjs:2494 | object |
| ID9 | usageCommand | chunks.149.mjs:2755-2770 | object |
| Ux3 | vimCommand | chunks.149.mjs:2802-2823 | object |

### Command Queue Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| m89 | enqueueCommand | chunks.142.mjs:1717-1722 | function |
| n89 | dequeueSingleCommand | chunks.142.mjs:1724-1732 | function |
| a89 | dequeueAllCommands | chunks.142.mjs:1734-1744 | function |
| VI1 | popAllCommandsAndMerge | chunks.142.mjs:1755-1771 | function |
| P8 | processCommandsCallback | chunks.145.mjs:164-170 | function |
| D69 | handleEscapeKey | chunks.142.mjs:2494-2511 | function |

### Error Classes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WW | AbortError | chunks.16.mjs:1329-1333 | class |
| oj | CommandNotFoundError | chunks.16.mjs:1328 | class |
| yY | SDKAbortError | chunks.153.mjs:259 | class |
| IS | TimeoutError | chunks.153.mjs:264 | class |

### Telemetry Events

| Event Name | Description |
|------------|-------------|
| tengu_input_slash_missing | Input doesn't start with `/` or parse fails |
| tengu_input_slash_invalid | Valid command name but command doesn't exist |
| tengu_input_command | Command executed successfully |
| tengu_input_prompt | Fallback to prompt mode |
| tengu_slash_command_tool_invocation | Command invoked as tool |
| tengu_dir_search | Directory search metrics |

---

## See Also

- [symbol_index_core.md](./symbol_index_core.md) - Core execution modules (Agent Loop, Tools, Hooks, etc.)
- [file_index.md](./file_index.md) - File → content index
- [architecture.md](./architecture.md) - System architecture overview
