# Symbol Index - Infrastructure Platform (Claude Code 2.1.7)

> Symbol mapping table Part 3: Platform & protocol infrastructure
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.
>
> **Related files:**
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution modules
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core feature modules
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integration modules

---

## Quick Navigation

- [Model Selection](#module-model-selection) - Model tiers, providers, discovery
- [Prompt Building](#module-prompt-building) - System prompt assembly, caching
- [MCP Protocol](#module-mcp-protocol) - Auto-search, connection, execution
- [Permissions & Sandbox](#module-permissions--sandbox) - Wildcards, security, sandbox
- [Auth & OAuth](#module-auth--oauth) - OAuth endpoints, token management
- [CLI Initialization & Network](#module-cli-initialization--network) - Startup pipeline, proxy, mTLS
- [Telemetry](#module-telemetry) - Metrics, sanitization
- [SDK Transport](#module-sdk-transport) - SDK communication layer

---

## Module: Model Selection

> Full analysis: [03_llm_core/model_selection.md](../03_llm_core/model_selection.md)

### Model Tier Definitions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ENA | MODEL_TIER_OPUS45 | chunks.28.mjs:1912-1920 | object |
| zNA | MODEL_TIER_SONNET45 | chunks.28.mjs:1921-1929 | object |
| $NA | MODEL_TIER_HAIKU45 | chunks.28.mjs:1930-1938 | object |
| CNA | MODEL_TIER_OPUS4 | chunks.28.mjs:1939-1947 | object |
| Z0A | MODEL_TIER_SONNET4 | chunks.28.mjs:1948-1956 | object |
| fP1 | MODEL_TIER_HAIKU4 | chunks.28.mjs:1957-1965 | object |
| UNA | MODEL_TIER_OPUS35 | chunks.28.mjs:1966-1974 | object |
| qNA | MODEL_TIER_SONNET35 | chunks.28.mjs:1975-1983 | object |
| NNA | MODEL_TIER_HAIKU35 | chunks.28.mjs:1984-1992 | object |

### Provider Detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| R4 | getActiveProvider | chunks.27.mjs:2062-2063 | function |
| u2 | ANTHROPIC_PROVIDER | chunks.27.mjs:2000 | constant ("anthropic") |
| p2 | BEDROCK_PROVIDER | chunks.27.mjs:2001 | constant ("bedrock") |
| L1 | VERTEX_PROVIDER | chunks.27.mjs:2002 | constant ("vertex") |
| Y1 | FOUNDRY_PROVIDER | chunks.27.mjs:2003 | constant ("foundry") |

### Model Selection Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| B5 | getDefaultModel | chunks.46.mjs:2225-2228 | function |
| OR | resolveModelFromFlag | chunks.46.mjs:2230-2245 | function |
| sJA | resolveModelFromConfig | chunks.46.mjs:2247-2262 | function |
| fp1 | resolveModelFromSubscription | chunks.46.mjs:2264-2280 | function |
| Uz | normalizeModelName | chunks.46.mjs:2299-2306 | function |

### Bedrock Model Discovery

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Cw3 | loadBedrockModels | chunks.46.mjs:1536-1564 | function |
| Aw3 | parseBedrockModelId | chunks.46.mjs:1566-1580 | function |
| zw3 | BEDROCK_MODEL_PATTERN | chunks.46.mjs:1535 | constant (RegExp) |

### Vertex Region Selection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SdA | getVertexRegion | chunks.1.mjs:3084-3093 | function |
| UdA | VERTEX_REGIONS | chunks.1.mjs:3076-3082 | constant |

### Model Alias System

| Alias | Resolution |
|-------|------------|
| `sonnet` | Sonnet 4.5 |
| `opus` | Opus 4.5 |
| `haiku` | Haiku 4.5 |
| `opusplan` | Opus (planning mode) |
| `inherit` | Parent model |

---

## Module: Prompt Building

> Full analysis: [03_llm_core/prompt_building.md](../03_llm_core/prompt_building.md)

### System Prompt Assembly

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| rc | buildSystemPrompt | chunks.146.mjs:2467-2605 | function |
| Fz7 | buildMCPServerInstructions | chunks.146.mjs:2607-2619 | function |
| oY9 | buildMCPCLIInstructions | chunks.146.mjs:2622-2737 | function |
| rY9 | buildEnvironmentContext | chunks.146.mjs:2739-2765 | function |
| sY9 | buildOutputStyle | chunks.147.mjs:2160-2172 | function |
| qt8 | getGitInstructions | chunks.85.mjs:1601-1691 | function |

### Prompt Caching

> Full analysis: [../23_prompt_cache/](../23_prompt_cache/)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AJ9 | isPromptCachingSupported | chunks.146.mjs:2872-2886 | function |
| wuA | getCacheControl | chunks.146.mjs:2889-2895 | function |
| qz7 | applyMessageCacheBreakpoints | chunks.147.mjs:483-490 | function |
| $z7 | applyUserMessageCacheBreakpoint | chunks.146.mjs:2948-2972 | function |
| Cz7 | applyAssistantMessageCacheBreakpoint | chunks.146.mjs:2975-3000 | function |
| Nz7 | formatSystemPromptWithCache | chunks.147.mjs:492-502 | function |
| rO0 | formatSystemPrompt | chunks.133.mjs:2563-2577 | function |
| dhA | mergeUsage | chunks.147.mjs:447-462 | function |
| SH1 | aggregateUsage | chunks.147.mjs:465-480 | function |
| Cj | DEFAULT_USAGE | chunks.134.mjs:1847-1859 | constant |
| Lw3 | calculateCost | chunks.46.mjs:1909-1910 | function |
| i77 | trackForkAgentQuery | chunks.134.mjs:2036-2063 | function |
| KQA | SONNET_PRICING | chunks.46.mjs:1961-1966 | constant |
| seA | OPUS_PRICING | chunks.46.mjs:1967-1972 | constant |
| vp1 | HAIKU45_PRICING | chunks.46.mjs:1985-1990 | constant |

### Agent Identity System

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| u3 | AGENT_IDENTITY_MAIN | chunks.93.mjs:100 | constant |
| v3 | AGENT_IDENTITY_REPL | chunks.93.mjs:110 | constant |
| w3 | AGENT_IDENTITY_BACKGROUND | chunks.93.mjs:120 | constant |
| x3 | AGENT_IDENTITY_CUSTOM | chunks.93.mjs:130 | constant |
| y3 | AGENT_IDENTITY_PLAN | chunks.93.mjs:140 | constant |

### Conditional Sections

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tY9 | buildPlanModeSection | chunks.147.mjs:2174-2200 | function |
| uY9 | buildDelegateModeSection | chunks.147.mjs:2202-2230 | function |
| vY9 | buildWebSearchSection | chunks.147.mjs:2232-2260 | function |
| wY9 | buildTodoSection | chunks.147.mjs:2262-2290 | function |
| xY9 | buildCodeReferencesSection | chunks.147.mjs:2292-2320 | function |

### Git/PR Protocol Templates

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SS | GIT_SAFETY_PROTOCOL | chunks.85.mjs:1607-1655 | constant |
| TS | COMMIT_INSTRUCTIONS | chunks.85.mjs:1657-1720 | constant |
| US | PR_CREATION_TEMPLATE | chunks.85.mjs:1722-1800 | constant |

### Section Assembly Order

| Order | Section | Condition |
|-------|---------|-----------|
| 1 | Agent Identity | Always |
| 2 | Tool Usage Policy | Always |
| 3 | Tone & Style | Always |
| 4 | Professional Objectivity | Always |
| 5 | Task Management | Always |
| 6 | Code References | Always |
| 7 | Plan Mode | If in plan mode |
| 8 | Delegate Mode | If delegate agent |
| 9 | Web Search | If web search enabled |
| 10 | Todo List | If todos tool available |
| 11 | Security Guidelines | Always (repeated 2x) |
| 12 | MCP Instructions | If MCP servers connected |
| 13 | Environment Context | Always |
| 14 | Git Status | If git repo |
| 15 | Claude.md Content | If exists |
| 16 | Background Info | Always |
| 17 | Output Style | If custom style set |

---

## Module: MCP Protocol

### MCP Auto-Search Mode (Default in 2.1.7)

> When MCP tool descriptions exceed 10% of context window, they are deferred
> and discovered via MCPSearch tool instead of being loaded upfront.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Db | MCPSEARCH_TOOL_NAME | chunks.85.mjs:487 | constant ("MCPSearch") |
| RZ0 | shouldEnableToolSearch | chunks.85.mjs:559-592 | function |
| geB | calculateContextThreshold | chunks.85.mjs:491-494 | function |
| k9A | getToolSearchMode | chunks.85.mjs:506-515 | function |
| heB | MCP_SEARCH_CONTEXT_RATIO | chunks.85.mjs:623 | constant (0.1 = 10%) |
| At8 | CHAR_TO_TOKEN_MULTIPLIER | chunks.85.mjs:624 | constant (2.5) |
| _Z0 | findDiscoveredToolsInHistory | chunks.85.mjs:607-620 | function |
| ueB | isModelSupportedForToolSearch | chunks.85.mjs:526-531 | function |
| meB | isMcpSearchToolAvailable | chunks.85.mjs:545-546 | function |
| e3 | sanitizeMcpServerName | chunks.131.mjs:60-63 | function |

### list_changed Notifications (NEW in 2.1.0)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| jY0 | TOOLS_LIST_CHANGED_NOTIFICATION | chunks.86.mjs:1741 | constant |
| _Y0 | PROMPTS_LIST_CHANGED_NOTIFICATION | chunks.86.mjs:1697 | constant |
| NY0 | RESOURCES_LIST_CHANGED_NOTIFICATION | chunks.86.mjs:1628 | constant |

### MCP Server Connection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SO | connectMcpServer | chunks.131.mjs:1563-1900 | function |
| cEA | loadAllMcpConfig | chunks.131.mjs:535-587 | function |
| EL0 | batchInitializeAllServers | chunks.131.mjs:1175-1240 | function |
| eKA | ensureServerConnected | chunks.131.mjs:1106-1111 | function |
| C3A | reconnectMcpServer | chunks.131.mjs:1125-1166 | function |
| $r2 | dynamicMcpServerInit | chunks.131.mjs:1440-1520 | function |
| PF1 | prefetchAllMcpResources | chunks.131.mjs:2047-2087 | function |
| Fr2 | CONNECTION_TIMEOUT | chunks.131.mjs:1507 | constant (60000ms) |
| _F1 | getMcpHeaders | chunks.131.mjs:816-823 | function |
| Wr2 | withMcpTimeout | chunks.131.mjs:1050-1074 | function |
| Q4A | withDefaultFetchOptions | chunks.89.mjs:859-872 | function |
| NZ | logMCPError | chunks.1.mjs:4618-4630 | function |
| i0 | logMCPDebug | chunks.1.mjs:4632-4644 | function |

### MCP Tool Discovery

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ax | fetchMcpTools | chunks.131.mjs:1917-1988 | function (memoized) |
| ZhA | fetchMcpPrompts | chunks.131.mjs:2003-2046 | function (memoized) |
| GhA | fetchMcpResources | chunks.131.mjs:1988-2002 | function (memoized) |
| WxA | toolsListSchema | chunks.86.mjs:1727 | schema |
| IxA | promptsListSchema | chunks.86.mjs | schema |
| l9A | resourcesListSchema | chunks.86.mjs | schema |

### MCP Tool Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| zr2 | executeMcpTool | chunks.131.mjs:1369-1433 | function |
| tB7 | processToolResult | chunks.131.mjs:1349-1367 | function |
| sq0 | normalizeToolResponse | chunks.131.mjs:1320-1342 | function |
| Er2 | convertMcpContent | chunks.131.mjs:1242-1303 | function |
| U3A | getMCPToolTimeout | chunks.148.mjs:3508-3510 | function |
| $C7 | DEFAULT_MCP_TOOL_TIMEOUT | chunks.148.mjs:3546 | constant (100000000ms) |
| iC | toolResultSchema | chunks.86.mjs | schema |

### MCP Description Size Calculation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Zt8 | calculateMcpDescriptionSize | chunks.85.mjs:549-557 | function |

### MCP Transport Classes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KX0 | StdioClientTransport | (external) | class |
| rG1 | SSEClientTransport | (external) | class |
| kX0 | HttpClientTransport | (external) | class |
| JZ1 | WebSocketClientTransport | (external) | class |
| VL0 | SDKServerTransport | (external) | class |
| PG1 | MCPClient | (external) | class |
| I4A | McpAuthProvider | chunks.131.mjs | class |

### MCP Configuration Schemas

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| x62 | mcpServersConfigSchema | chunks.90.mjs:1303-1305 | schema |
| YI0 | stdioServerConfigSchema | chunks.90.mjs | schema |
| A75 | sseServerConfigSchema | chunks.90.mjs | schema |
| Q75 | wsServerConfigSchema | chunks.90.mjs | schema |
| B75 | httpServerConfigSchema | chunks.90.mjs | schema |
| efA | parseMcpConfigObject | chunks.131.mjs:604-665 | function |

### MCP System Prompt Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Fz7 | buildMCPServerInstructions | chunks.146.mjs:2607-2619 | function |
| oY9 | buildMCPCLIInstructions | chunks.146.mjs:2622-2737 | function |

### Chrome Browser MCP (Reserved)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ej | CHROME_MCP_SERVER_NAME | chunks.131.mjs:49 | constant ("claude-in-chrome") |
| ST0 | getChromeAutomationPrompt | chunks.145.mjs:1140-1188 | function |
| JZ9 | CHROME_AUTOMATION_PROMPT | chunks.145.mjs:1191-1238 | constant |
| XZ9 | MCP_SEARCH_REMINDER | chunks.145.mjs:1240-1251 | constant |
| xT0 | CHROME_SKILL_REMINDER | chunks.145.mjs:1253-1257 | constant |
| uEA | isReservedMcpServerName | chunks.130.mjs:3266-3268 | function |
| Ir2 | getChromeMcpToolRenderers | chunks.131.mjs:1003-1023 | function |

### MCP-Plugin Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| To2 | getPluginMcpServers | chunks.130.mjs:1530-1537 | function |
| aQ7 | unifyMcpServerConfig | chunks.130.mjs:1363-1412 | function |
| rw0 | loadMcpJsonFile | chunks.130.mjs:1414-1438 | function |
| jo2 | loadMcpbFile | chunks.130.mjs:1094-1160 | function |
| sQ7 | expandPluginMcpConfig | chunks.130.mjs:1464-1528 | function |
| oQ7 | addPluginNamespace | chunks.130.mjs:1440-1450 | function |
| ifA | replacePluginRoot | chunks.130.mjs:1452-1454 | function |
| rQ7 | replaceUserConfig | chunks.130.mjs:1456-1462 | function |
| U75 | mcpServersDefinitionSchema | chunks.90.mjs:1665 | schema |
| m62 | mcpbFileSchema | chunks.90.mjs:1623-1627 | schema |
| Hj | isMcpbPath | chunks.130.mjs:978 | function |

> Key files: chunks.131.mjs (connection, discovery, execution), chunks.130.mjs (plugin MCP), chunks.85.mjs (auto-search), chunks.86.mjs (schemas), chunks.138.mjs (notification handlers), chunks.145.mjs (Chrome browser), chunks.146.mjs (system prompt), chunks.148.mjs (timeout config)
> Full analysis: [../06_mcp/](../06_mcp/)

---

## Module: Permissions & Sandbox

> Full analysis: [../18_sandbox/](../18_sandbox/)

### Wildcard Permissions (NEW in 2.1.2)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| gq0 | classifyPermissionPattern | chunks.123.mjs:2016-2030 | function |
| Ga5 | containsUnescapedWildcard | chunks.123.mjs:1981-1989 | function |
| hq0 | matchWildcardPattern | chunks.123.mjs:1992-2013 | function |
| kq0 | findMatchingPermissionRules | chunks.123.mjs:2061-2088 | function |
| uq0 | getMatchingRulesByType | chunks.123.mjs:2091-2102 | function |
| Pq0 | stripCommandPrefixes | chunks.123.mjs:2043-2058 | function |

### Permission Rule Patterns

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fq0 | extractPrefixFromLegacy | chunks.123.mjs:~2015 | function |
| I75 | validatePermissionRule | chunks.90.mjs:1380-1481 | function |
| qZ1 | permissionRuleSchema | chunks.90.mjs:1491-1505 | object |

### Tool Groupings

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XG9 | getToolGroups | chunks.144.mjs:1259-1281 | function |

Tool groups defined in `XG9`:
- `READ_ONLY`: Read, Glob, Grep, WebFetch, WebSearch, LSP, TaskOutput, ReadMcpResource
- `EDIT`: Edit, Write, NotebookEdit
- `EXECUTION`: Bash (execute mode)
- `MCP`: Dynamic MCP tools (populated at runtime)
- `OTHER`: Remaining tools

### Security Checks (Command Injection)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Mf | checkCommandInjection | chunks.121.mjs:1446-1475 | function |
| eY | SECURITY_CHECK_IDS | chunks.121.mjs:1508-1523 | object |
| Mi5 | DANGEROUS_PATTERNS | chunks.121.mjs:1487-1507 | array |
| ci5 | checkObfuscatedFlags | chunks.121.mjs:1328-1444 | function |
| hi5 | checkNewlines | chunks.121.mjs:1248-1265 | function |
| ui5 | checkIfsInjection | chunks.121.mjs:1268-1282 | function |
| mi5 | checkProcEnviron | chunks.121.mjs:1285-1300 | function |
| di5 | checkMalformedTokens | chunks.121.mjs:1302-1325 | function |

### Compound Command Security (2.1.7 Fix)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cn5 | validatePathOperation | chunks.123.mjs:1123-1171 | function |
| nn5 | validateOutputRedirection | chunks.123.mjs:1232-1260 | function |
| pn5 | createPathValidator | chunks.123.mjs:1173-1203 | function |

### Sandbox Core

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| P58 | initializeSandbox | chunks.53.mjs:2785-2823 | function |
| XB | sandboxManager | chunks.55.mjs:1518-1546 | object |
| xEB | isSandboxEnabledInSettings | chunks.55.mjs:1509-1511 | function |
| yEB | isAutoAllowBashEnabled | chunks.55.mjs:1512-1514 | function |
| vEB | areUnsandboxedCommandsAllowed | chunks.55.mjs:1515-1517 | function |

### Sandbox - Linux Implementation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| JHB | checkLinuxDependencies | chunks.53.mjs:2170-2192 | function |
| XHB | initializeLinuxBridges | chunks.53.mjs:2194-2265 | function |
| C58 | buildFilesystemRestrictions | chunks.53.mjs:2284-2337 | function |
| IHB | linuxSandboxWrapper | chunks.53.mjs:2339-2423 | function |
| a58 | generateSeccompFilter | chunks.53.mjs:2035-2076 | function |
| GHB | buildBwrapArgs | chunks.53.mjs:2267-2282 | function |

### Sandbox - macOS Implementation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EHB | startMacOSViolationMonitor | chunks.53.mjs:2617-2663 | function |
| nMA | SandboxViolationStore | chunks.53.mjs:2675-2709 | class |
| w58 | encodeCommandTag | chunks.53.mjs:2454-2456 | function |
| B58 | generateSeatbeltProfile | chunks.53.mjs:2458-2530 | function |
| x58 | macosSandboxWrapper | chunks.53.mjs:2532-2615 | function |
| FHB | parseViolationLog | chunks.53.mjs:2665-2673 | function |

### Sandbox Tool Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KEA | isBashSandboxed | chunks.124.mjs:1217-1223 | function |
| ya5 | isExcludedCommand | chunks.124.mjs:~1221 | function |
| Ct8 | getSandboxRestrictionsSummary | chunks.85.mjs:1479-1543 | function |
| Vb5 | cleanSandboxViolations | chunks.112.mjs:44-51 | function |
| D71 | stripSandboxTags | chunks.112.mjs:~49 | function |
| ka5 | bashToolHandler | chunks.124.mjs:1258-1273 | function |
| e51 | executeShellCommandWithSandbox | chunks.85.mjs:2492-2584 | function |

### Sandbox Main Loop Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hw9 | initializeAgentSession | chunks.155.mjs:3094-3103 | function |
| KZ8 | initializeSandboxIfNeeded | chunks.55.mjs:1319-1442 | function |
| cW9 | sandboxViolationNotificationBanner | chunks.151.mjs:1004-1030 | function |
| m58 | annotateStderrWithSandboxFailures | chunks.53.mjs:3113-3120 | function |

### Sandbox Session Restore

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Zt | loadConversation | chunks.120.mjs:2608-2643 | function |

> Key files: chunks.53.mjs (core sandbox, Linux bwrap, macOS Seatbelt), chunks.55.mjs (configuration), chunks.85.mjs (system reminders), chunks.112.mjs (violation cleaning), chunks.124.mjs (Bash tool integration), chunks.155.mjs (app startup), chunks.120.mjs (session restore)

---

## Module: Auth & OAuth

> Full analysis: [24_auth/auth_overview.md](../24_auth/auth_overview.md)

### OAuth Endpoints (Updated in 2.1.7)

> Changed from console.anthropic.com → platform.claude.com

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| b5Q | OAUTH_CONFIG | chunks.20.mjs:543-554 | object |

**OAuth URLs (from b5Q config object):**

| Property | Value |
|----------|-------|
| CONSOLE_AUTHORIZE_URL | `https://platform.claude.com/oauth/authorize` |
| TOKEN_URL | `https://platform.claude.com/v1/oauth/token` |
| CONSOLE_SUCCESS_URL | `https://platform.claude.com/buy_credits?returnUrl=...` |
| CLAUDEAI_SUCCESS_URL | `https://platform.claude.com/oauth/code/success?app=claude-code` |
| MANUAL_REDIRECT_URL | `https://platform.claude.com/oauth/code/callback` |
| BASE_API_URL | `https://api.anthropic.com` |
| CLIENT_ID | `9d1c250a-e61b-44d9-88ed-5944d1962f5e` |

### Authentication Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Oz | getApiKeyAndSource | chunks.48.mjs:1780-1828 | function |
| YL | getApiKey | chunks.48.mjs:1763-1768 | function |
| an | getOAuthTokenSource | chunks.48.mjs:1735-1761 | function |
| iq | shouldUseOAuth | chunks.48.mjs:1723-1733 | function |
| qB | isClaudeAiOAuth | chunks.48.mjs:2125-2128 | function |
| xg | hasClaudeAiScope | chunks.48.mjs | function |

### Token Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| g4 | getClaudeAiOAuth | chunks.48.mjs (memoized) | function |
| xR | refreshOAuthTokenIfNeeded | chunks.48.mjs:2056-2123 | function |
| yg | isTokenExpiringSoon | chunks.48.mjs | function |
| XXA | saveOAuthTokens | chunks.48.mjs | function |
| vi | clearOAuthCache | chunks.48.mjs | function |
| rT1 | refreshAccessToken | chunks.48.mjs | function |

### Subscription Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| N6 | getSubscriptionType | chunks.48.mjs:2152-2158 | function |
| v3 | getOAuthAccount | chunks.48.mjs:2136-2138 | function |
| mi1 | getSubscriptionName | chunks.48.mjs:2167-2180 | function |
| ju | isPaidSubscription | chunks.48.mjs:2140-2145 | function |
| dA1 | isPersonalPaidSubscription | chunks.48.mjs:2225-2228 | function |
| IXA | getRateLimitTier | chunks.48.mjs:2160-2165 | function |

### API Client Creation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XS | createApiClient | chunks.82.mjs:2630-2737 | function |
| Xn8 | addAuthorizationHeader | chunks.82.mjs:2739-2742 | function |
| In8 | parseCustomHeaders | chunks.82.mjs:2744-2758 | function |
| hP | AnthropicClient | chunks.69.mjs | class |
| b41 | AnthropicBedrock | chunks.70.mjs | class |
| v61 | AnthropicVertex | chunks.82.mjs | class |
| u41 | AnthropicFoundry | chunks.82.mjs | class |

### Provider Detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| R4 | getProviderType | chunks.27.mjs:2063 | function |
| Yk | isExternalProvider | chunks.48.mjs:2182-2184 | function |
| kBB | isUsingApiKey | chunks.48.mjs:2130-2134 | function |

### API Key Helper

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| uOA | hasApiKeyHelper | chunks.48.mjs:1830-1832 | function |
| mOA | executeApiKeyHelper | chunks.48.mjs (memoized) | function |
| jBB | isApiKeyHelperFromProject | chunks.48.mjs:1834-1840 | function |
| fb3 | getApiKeyHelperTTL | chunks.48.mjs:1866-1876 | function |
| gA1 | clearApiKeyHelperCache | chunks.48.mjs:1878-1880 | function |

### AWS Credential Helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hi1 | getAwsAuthRefreshCommand | chunks.48.mjs:1842-1844 | function |
| gb3 | runAwsAuthRefresh | chunks.48.mjs:1891-1919 | function |
| gi1 | getAwsCredentialExportCommand | chunks.48.mjs:1854-1856 | function |
| DQA | getAWSCredentials | chunks.48.mjs (memoized) | function |
| TBB | isAwsAuthRefreshFromProject | chunks.48.mjs:1846-1852 | function |
| PBB | isAwsCredentialExportFromProject | chunks.48.mjs:1858-1864 | function |

### Bedrock/Vertex Auth

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| PeB | shouldRefreshBedrockAuth | chunks.85.mjs:110-115 | function |
| lAA | getDefaultAWSRegion | chunks.85.mjs | function |
| SdA | getVertexRegion | chunks.1.mjs:3084-3093 | function |
| xBB | prefetchBedrockAuth | chunks.156.mjs | function |

### Rate Limit / Usage Warnings

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| crB | checkUsageWarning | chunks.82.mjs:2802-2829 | function |
| gG0 | getUsageErrorMessage | chunks.82.mjs:2831-2835 | function |
| uG0 | getUsageWarningMessage | chunks.82.mjs:2837-2839 | function |
| mrB | isRateLimitError | chunks.82.mjs:2788-2790 | function |

> Key files: chunks.20.mjs (OAuth config), chunks.48.mjs (token management, auth resolution), chunks.82.mjs (API client creation), chunks.85.mjs (Bedrock auth)

## Module: CLI Initialization & Network

### Startup Pipeline

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| zI9 | initializeConfig | chunks.149.mjs:2065-2105 | function |
| F7Q | configureWindowsShell | chunks.20.mjs:2146-2152 | function |
| B2B | initializeFirstLaunchTime | chunks.48.mjs:3148-3153 | function |
| AX9 | registerMcpCliCleanup | chunks.148.mjs:1924-1929 | function |
| K$A | isScratchpadEnabled | chunks.148.mjs:2082-2084 | function |
| YX9 | initializeScratchpad | chunks.148.mjs:2099-2105 | function |

### Network & Proxy Configuration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| btQ | configureGlobalMTLS | chunks.46.mjs:1148-1151 | function |
| mtQ | configureGlobalAgents | chunks.46.mjs:1273-1291 | function |
| gtQ | getAxiosProxyAgent | chunks.46.mjs:1242-1255 | function |
| utQ | getUndiciProxyAgent | chunks.46.mjs:1326-1339 | function |
| wp1 | getUndiciMtlsAgent | chunks.46.mjs:1131-1144 | function |
| tT | getMtlsConfig | chunks.46.mjs:1162-1184 | function |
| ktQ | getHttpsAgentWithMtls | chunks.46.mjs:1185-1193 | function |
| bn | getProxyUrl | chunks.46.mjs:1212-1214 | function |
| leA | shouldBypassProxy | chunks.46.mjs:1220-1240 | function |

---

## Module: Telemetry

> Full analysis: [../17_telemetry/opentelemetry.md](../17_telemetry/opentelemetry.md)

### Core Event Logging Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AR7 | logEvent | chunks.155.mjs:1952-1962 | function |
| QR7 | logEventAsync | chunks.155.mjs:1964-1975 | function |
| tN9 | registerTelemetryProvider | chunks.155.mjs:1981-1986 | function |
| Uh0 | attachTelemetryProvider | chunks.1.mjs:3982-3992 | function |
| l | analyticsEvent | chunks.1.mjs:3982-3992 | function (alias) |
| kl | analyticsEventAsync | chunks.1.mjs:3994-4004 | function |
| uCA | pendingEventQueue | chunks.1.mjs:4006 | array |
| vl | telemetryProvider | chunks.1.mjs:4008 | variable |

### Event Sampling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ma1 | getSampleRate | chunks.51.mjs:573-581 | function |
| P18 | getEventSamplingConfig | chunks.51.mjs:569-571 | function |
| T18 | EVENT_SAMPLING_CONFIG_KEY | chunks.51.mjs:706 | constant ("tengu_event_sampling_config") |

### Datadog Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Zy0 | sendToDatadog | chunks.155.mjs:1843-1888 | function |
| Gy0 | flushToDatadog | chunks.155.mjs:1819-1834 | function |
| tM7 | scheduleDatadogFlush | chunks.155.mjs:1836-1841 | function |
| rN9 | isDatadogEnabled | chunks.155.mjs:1943-1950 | function |
| lM7 | DATADOG_ENDPOINT | chunks.155.mjs:1890 | constant |
| iM7 | DATADOG_API_KEY | chunks.155.mjs:1892 | constant |
| nM7 | DATADOG_FLUSH_INTERVAL | chunks.155.mjs:1894 | constant (15000) |
| aM7 | DATADOG_BATCH_SIZE | chunks.155.mjs:1896 | constant (100) |
| oM7 | DATADOG_TIMEOUT | chunks.155.mjs:1898 | constant (5000) |
| rM7 | DATADOG_TRACKED_EVENTS | chunks.155.mjs:1918 | Set |
| sM7 | DATADOG_ALLOWED_TAGS | chunks.155.mjs:1918 | array |
| qmA | datadogBuffer | chunks.155.mjs:1904 | array |
| lN9 | toSnakeCase | chunks.155.mjs:1815-1817 | function |
| aN9 | DATADOG_FEATURE_FLAG | chunks.155.mjs:1990 | constant ("tengu_log_datadog_events") |

### Segment Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Dz0 | sendToSegment | chunks.110.mjs:1146-1169 | function |
| oN9 | isSegmentEnabled | chunks.155.mjs:1934-1941 | function |
| nN9 | SEGMENT_FEATURE_FLAG | chunks.155.mjs:1988 | constant ("tengu_log_segment_events") |
| ij2 | getSegmentAnalytics | chunks.110.mjs | function |

### OpenTelemetry (1P) Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| IKB | initializeOpenTelemetry | chunks.51.mjs:652-698 | function |
| ca1 | sendTo1PLogger | chunks.51.mjs:615-619 | function |
| S18 | emitLogRecord | chunks.51.mjs:594-613 | function |
| da1 | shutdownOpenTelemetry | chunks.51.mjs:583-588 | function |
| VMA | isTelemetryEnabled | chunks.51.mjs:590-592 | function |
| NXA | loggerProvider | chunks.51.mjs:710 | variable (LoggerProvider) |
| KMA | eventLogger | chunks.51.mjs:708 | variable (Logger) |
| ua1 | AnthropicLogExporter | chunks.51.mjs | class |
| y18 | DEFAULT_EXPORT_INTERVAL | chunks.51.mjs:712 | constant (5000) |
| v18 | DEFAULT_BATCH_SIZE | chunks.51.mjs:714 | constant (200) |
| k18 | DEFAULT_QUEUE_SIZE | chunks.51.mjs:716 | constant (8192) |

### Performance Markers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| x9 | telemetryMarker | chunks.1.mjs:4019-4022 | function |
| Mq1 | getPerformanceApi | chunks.1.mjs:4014-4017 | function |
| Nh0 | generateProfilingReport | chunks.1.mjs:4032-4050 | function |
| Mh0 | saveProfilingReport | chunks.1.mjs:4052-4063 | function |
| CS9 | emitStartupPerfTelemetry | chunks.1.mjs:4069-4082 | function |
| Lh0 | enableStartupProfiling | chunks.1.mjs:4089 | variable |
| idA | captureMemoryMetrics | chunks.1.mjs:4084 | variable |
| Oh0 | memoryUsageMap | chunks.1.mjs | Map |

### Feature Gate System

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| f8 | checkFeatureGate | chunks.51.mjs:811-819 | function |
| tn | isTelemetryEnabled | chunks.51.mjs:746-748 | function |
| gW | isNonessentialTrafficDisabled | chunks.51.mjs | function |
| HMA | getGrowthBookFeature | chunks.51.mjs | function |
| XKB | emitExperimentEvent | chunks.51.mjs:625-650 | function |

### Error Logging

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| e | logError | chunks.155.mjs:2048 | function |
| Iy0 | getJsonlLogger | chunks.155.mjs:2025-2042 | function |
| GR7 | createJsonlWriter | chunks.155.mjs:2013-2023 | function |
| Gw9 | getErrorLogPath | chunks.155.mjs:2005-2007 | function |
| Xy0 | getMcpLogPath | chunks.155.mjs:2009-2011 | function |

### Telemetry Initialization

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| eN9 | initializeTelemetry | chunks.155.mjs:1996-2003 | function |
| iN9 | initializeDatadog | chunks.155.mjs:1912-1932 | function |
| FMA | initializeOtel | chunks.51.mjs:718-732 | function |
| sN9 | cacheFeatureGates | chunks.155.mjs:1977-1979 | function |

### Context Metadata

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| dn | getEnvironmentContext | chunks.51.mjs | function |
| RQA | getUserMetadata | chunks.51.mjs | function |
| xu | getUserId | chunks.51.mjs | function |
| YKB | generateEventId | chunks.51.mjs | function |

### MCP Tool Name Sanitization

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| k9 | obfuscateToolName | chunks.134.mjs | function |

> Key files: chunks.155.mjs (event routing, Datadog), chunks.51.mjs (OpenTelemetry 1P, sampling), chunks.1.mjs (performance markers, provider attach), chunks.110.mjs (Segment)

---

## Module: SDK Transport

> Full analysis: [../20_sdk/](../20_sdk/)

### Transport Classes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wmA | StdioSDKTransport | chunks.155.mjs:2621-2790 | class |
| Fy0 | WebSocketSDKTransport | chunks.155.mjs:3000-3034 | class |
| Vy0 | WebSocketTransport | chunks.155.mjs:2805-2963 | class |
| khA | AsyncMessageQueue | chunks.133.mjs:3218-3281 | class |

### SDK Entry Points

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| LR7 | runSDKAgentLoop | chunks.155.mjs:3207-3466 | function |
| hw9 | runNonInteractiveSession | chunks.155.mjs:3094-3205 | function |
| TR7 | createIOHandler | chunks.155.mjs:3159-3165 | function |
| MR7 | createPermissionCallback | chunks.155.mjs:3513-3530 | function |
| B_7 | setEntryPoint | chunks.156.mjs:1818-1831 | function |
| G_7 | mainFunction | chunks.156.mjs:1833-1855 | function |

### Control Request Handling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| RR7 | handleInitializeRequest | chunks.155.mjs:3532-3602 | function |
| _R7 | updatePermissionMode | chunks.155.mjs:3638-3660 | function |
| gw9 | rewindFiles | chunks.155.mjs:3604-3636 | function |
| SR7 | handleMcpSetServers | chunks.155.mjs:3427-3433 | function |
| OR7 | createPermissionPromptTool | chunks.155.mjs:3468-3511 | function |

### Response Schemas

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| JU1 | canUseToolResponseSchema | chunks.155.mjs:2600 | schema |
| AY1 | hookCallbackResponseSchema | chunks.155.mjs (inferred) | schema |
| VR7 | toolPermissionBehaviorSchema | chunks.155.mjs:~2595 | schema |
| FR7 | toolPermissionPromptSchema | chunks.155.mjs:~2598 | schema |

### Transport Methods

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| - | read() | chunks.155.mjs:2633-2652 | method (generator) |
| - | processLine() | chunks.155.mjs:2659-2692 | method |
| - | write() | chunks.155.mjs:2693-2696 | method |
| - | sendRequest() | chunks.155.mjs:2697-2737 | method |
| - | createCanUseTool() | chunks.155.mjs:2738-2762 | method |
| - | createHookCallback() | chunks.155.mjs:2763-2780 | method |
| - | sendMcpMessage() | chunks.155.mjs:2781-2789 | method |

### WebSocket Constants

| Obfuscated | Readable | Value | Type |
|------------|----------|-------|------|
| zR7 | MESSAGE_BUFFER_SIZE | 1000 | constant |
| Rw9 | MAX_RECONNECT_ATTEMPTS | 3 | constant |
| $R7 | INITIAL_RECONNECT_DELAY_MS | 1000 | constant |
| CR7 | MAX_RECONNECT_DELAY_MS | 30000 | constant |
| UR7 | PING_INTERVAL_MS | 10000 | constant |

### Output Utilities

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| J9 | writeToStdout | chunks.1.mjs:646-648 | function |
| HR7 | generateControlRequestId | chunks.155.mjs (inferred) | function |
| Wy0 | exitWithError | chunks.155.mjs:2792-2794 | function |
| QC | extractLastMessage | chunks.155.mjs (inferred) | function |
| Sw9 | createIdleExitTimer | chunks.155.mjs:3036-3054 | function |

### SDK Identity System

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EB1 | getAgentIdentity | chunks.58.mjs:3251-3258 | function |
| l10 | CLI_IDENTITY | chunks.58.mjs:3265 | constant |
| XCB | SDK_CLI_IDENTITY | chunks.58.mjs:3267 | constant |
| ICB | SDK_AGENT_IDENTITY | chunks.58.mjs:3269 | constant |
| DCB | IDENTITY_SET | chunks.58.mjs:3279 | constant (Set) |

### SDK Agent Loop

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| v19 | sdkAgentLoopGenerator | chunks.135.mjs:3-255 | async generator |
| aN | coreMessageLoop | chunks.134.mjs:99-400 | async generator |

### Session Loading (SDK Mode)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| jR7 | loadInitialMessages | chunks.156.mjs:3-62 | function |
| vw9 | parseResumeTarget | chunks.155.mjs:3061-3088 | function |
| PR7 | handleOrphanedPermission | chunks.156.mjs:81-110 | function |
| fw9 | restoreFileHistory | chunks.156.mjs (inferred) | function |

### Message Deduplication

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pJ9 | isDuplicateMessage | chunks.148.mjs:1393-1395 | function |
| bw9 | processedUuidsInMemory | chunks.156.mjs:311 | Set |
| cJ9 | getProcessedMessageUuids | chunks.148.mjs (inferred) | function |

### Entry Point Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `CLAUDE_CODE_ENTRYPOINT` | `cli` | Interactive CLI mode |
| `CLAUDE_CODE_ENTRYPOINT` | `sdk-cli` | SDK print mode (--print) |
| `CLAUDE_CODE_ENTRYPOINT` | `sdk-py` | Python SDK |
| `CLAUDE_CODE_ENTRYPOINT` | `sdk-ts` | TypeScript SDK |
| `CLAUDE_CODE_ENTRYPOINT` | `mcp` | MCP server mode |
| `CLAUDE_CODE_ENTRYPOINT` | `local-agent` | Local agent mode |
| `CLAUDE_AGENT_SDK_VERSION` | (version) | SDK version tracking |
| `CLAUDE_CODE_EXIT_AFTER_STOP_DELAY` | (ms) | Idle exit delay |

> Key files: chunks.155.mjs (transport, agent loop), chunks.156.mjs (entry points), chunks.133.mjs (AsyncMessageQueue), chunks.58.mjs (SDK identity prompts)

---

## See Also

- [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution modules (Agent Loop, Tools, LLM API)
- [symbol_index_core_features.md](./symbol_index_core_features.md) - Core feature modules (Plan Mode, Hooks, Skills)
- [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integration modules (LSP, Chrome, IDE, UI, Plugin)
- [file_index.md](./file_index.md) - File content index
- [changelog_analysis.md](./changelog_analysis.md) - Version changes
