# Symbol Index - Infrastructure Modules (Claude Code 2.1.7)

> Symbol mapping table Part 2: Infrastructure & support modules
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.
>
> **Related file:** [symbol_index_core.md](./symbol_index_core.md) - Core execution modules

---

## Quick Navigation

- [LSP Integration](#module-lsp-integration) - **NEW in 2.0.74**
- [Chrome/Browser](#module-chromebrowser-integration) - **NEW in 2.0.72**
- [MCP Protocol](#module-mcp-protocol) - Enhanced with auto-search
- [Permissions & Sandbox](#module-permissions--sandbox) - Wildcard support
- [Auth & OAuth](#module-auth--oauth) - Updated endpoints
- [Telemetry](#module-telemetry)
- [UI Components](#module-ui-components)
- [Plugin System](#module-plugin-system)
- [Code Indexing](#module-code-indexing)
- [Shell Parser](#module-shell-parser)

---

## Module: LSP Integration

> **NEW in 2.0.74** - Language Server Protocol for code intelligence

### LSP Tool Definition

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vU0 | lspTool | chunks.120.mjs:15-176 | object |
| Sg2 | LSP_TOOL_NAME | chunks.119.mjs:3121 | constant ("LSP") |
| xU0 | lspToolDescription | chunks.119.mjs:3122-3141 | constant |
| Ol5 | lspInputSchema | chunks.120.mjs:15-19 | schema |
| Ml5 | lspOutputSchema | chunks.120.mjs:20-25 | schema |

### LSP Tool UI Rendering

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vg2 | lspUserFacingName | chunks.119.mjs:3210-3212 | function |
| kg2 | formatLspToolUse | chunks.119.mjs:3214-3231 | function |
| bg2 | renderLspToolRejected | chunks.119.mjs:3233-3235 | function |
| fg2 | renderLspToolError | chunks.119.mjs:3237-3247 | function |
| hg2 | renderLspToolProgress | chunks.119.mjs:3249-3251 | function |
| gg2 | renderLspToolResult | chunks.119.mjs:3253-3318 | function |
| Nl5 | LspResultRenderer | chunks.119.mjs:3180-3208 | function |
| xg2 | extractSymbolAtPosition | chunks.119.mjs:3143-3172 | function |

### LSP Request Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Rl5 | buildLspRequest | chunks.119.mjs:3320-3407 | function |
| jl5 | formatLspResult | chunks.119.mjs:3410-3520 | function |
| Ll5 | pathToFileUri | chunks.119.mjs:~3320 | function |
| wl5 | readFile | cli.chunks.mjs:3185 | function |

### LSP Result Formatters

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| PU0 | formatGoToDefinitionResult | chunks.119.mjs:2878-2896 | function |
| Lg2 | formatFindReferencesResult | chunks.119.mjs:2898-2921 | function |
| Og2 | formatHoverResult | chunks.119.mjs:2935-2946 | function |
| Rg2 | formatDocumentSymbolResult | chunks.119.mjs:2991-3003 | function |
| Mg2 | flattenDocumentSymbol | chunks.119.mjs:2979-2989 | function |
| _g2 | formatPrepareCallHierarchy | chunks.119.mjs:3038-3045 | function |
| jg2 | formatIncomingCalls | chunks.119.mjs:3047-3080 | function |
| Tg2 | formatOutgoingCalls | chunks.119.mjs:3082-3115 | function |
| rHA | symbolKindToName | chunks.119.mjs:2948-2977 | function |

### LSP Location Helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WK1 | formatLocation | chunks.119.mjs:2860-2865 | function |
| wg2 | groupLocationsByFile | chunks.119.mjs:~2898 | function |
| qg2 | isLocationLink | chunks.119.mjs:2873-2876 | function |
| Ug2 | locationLinkToLocation | chunks.119.mjs:2867-2871 | function |
| Ul5 | extractHoverContent | chunks.119.mjs:2923-2933 | function |

### LSP Server Manager (Singleton)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Py2 | initializeLspServerManager | chunks.114.mjs:2640-2665 | function |
| Rc | getLspManager | chunks.114.mjs:~2668 | function |
| f6A | getLspManagerStatus | chunks.114.mjs:~2668 | function |
| Ty2 | waitForLspManagerInit | chunks.114.mjs:~2668 | function |
| Yx | lspManager | chunks.114.mjs:~2668 | variable |
| kO | lspState | chunks.114.mjs:~2668 | variable |
| DW1 | lastError | chunks.114.mjs:~2668 | variable |
| IW1 | generationCounter | chunks.114.mjs:~2668 | variable |
| WW1 | initPromise | chunks.114.mjs:~2668 | variable |

### LSP Server Manager (Factory)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Uy2 | createLspServerManager | chunks.114.mjs:2171-2340 | function |
| $y2 | getAllLspServers | chunks.114.mjs:2143-2162 | function |

LSP Server Manager API:
| Internal | Exported As | Description |
|----------|-------------|-------------|
| G | initialize | Load configs, start servers |
| Z | shutdown | Stop all servers |
| Y | getServerForFile | Get server by file extension |
| J | ensureServerStarted | Start server if not running |
| X | sendRequest | Send LSP request |
| I | getAllServers | Get all server instances |
| D | openFile | Send textDocument/didOpen |
| W | changeFile | Send textDocument/didChange |
| K | saveFile | Send textDocument/didSave |
| V | closeFile | Send textDocument/didClose |
| F | isFileOpen | Check if file is tracked |

### LSP Server Instance

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Vy2 | createLspServerInstance | chunks.114.mjs:1784-1958 | function |
| P$0 | MAX_RETRIES | chunks.114.mjs:~1784 | constant |
| Rg5 | CONTENT_MODIFIED_ERROR_CODE | chunks.114.mjs:~1784 | constant |
| _g5 | BASE_RETRY_DELAY | chunks.114.mjs:~1784 | constant |

### LSP Client (Low-level)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Dy2 | createLspClient | chunks.114.mjs:1580-1773 | function |

### LSP Plugin Configuration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| N75 | lspPluginSchema | chunks.90.mjs:1688-1689 | object |
| ZVA | lspConfigPathSchema | chunks.90.mjs:~1688 | schema |
| YVA | lspServerConfigSchema | chunks.90.mjs:1668-1687 | schema |

> Key files: chunks.120.mjs (tool def), chunks.119.mjs (formatters/UI), chunks.114.mjs (server manager), chunks.90.mjs (plugin schema)

---

## Module: Chrome/Browser Integration

> **NEW in 2.0.72** - "Claude in Chrome" browser control via Chrome extension
> Three-process architecture: CLI → Native Host Bridge (socket) → Chrome Extension

### Chrome Skill

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TI9 | registerClaudeInChromeSkill | chunks.149.mjs:2633-2654 | function |
| Fq7 | chromeSkillPrompt | chunks.149.mjs:2658-2662 | constant |
| Vq7 | CHROME_MCP_TOOLS | chunks.149.mjs:~2633 | constant |
| I$A | isClaudeInChromeEnabled | chunks.149.mjs:~2666 | function |

### MCP Tools Array

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Pe | CHROME_MCP_TOOLS | chunks.145.mjs:4-445 | array |

### Socket Client

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AZ9 | SocketClient | chunks.145.mjs:787-970 | class |
| QZ9 | createSocketClient | chunks.145.mjs:972-974 | function |
| z8A | SocketConnectionError | chunks.145.mjs:978-984 | class |
| QH7 | createConnection | (net module) | function |

### Tool Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ZH7 | executeToolViaSocket | chunks.145.mjs:987-1053 | function |
| BZ9 | getDisconnectedResponse | chunks.145.mjs:1055-1062 | function |
| GZ9 | handleToolCall | chunks.145.mjs:1072-1087 | function |
| YH7 | isAuthenticationError | chunks.145.mjs:1064-1070 | function |

### MCP Server Factory

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| PT0 | createMcpServer | chunks.145.mjs:1093-1125 | function |
| WuA | McpServer | chunks.145.mjs:484-777 | class |

### System Prompts

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ST0 | getSystemPrompt | chunks.145.mjs:1140-1188 | function |
| JZ9 | SYSTEM_PROMPT_TEMPLATE | chunks.145.mjs:1191+ | constant |

### Native Host Registration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KH7 | getNativeHostDir | chunks.145.mjs:1311-1326 | function |
| WH7 | NATIVE_HOST_MANIFEST_NAME | chunks.145.mjs:1450 | constant |
| DZ9 | WINDOWS_REGISTRY_KEY | chunks.145.mjs:1450 | constant |
| VH7 | registerWindowsNativeHost | chunks.145.mjs:1350-1360 | function |

### CLI Entry Points

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| oX9 | startMcpClient | chunks.157.mjs:1599-1616 | function |
| AI9 | startNativeHostBridge | chunks.157.mjs:1666-1677 | function |
| rX9 | McpClientLogger | chunks.157.mjs:1618-1639 | class |

### Native Host Server

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| QI9 | NativeHostServer | chunks.157.mjs:1679-1816 | class |
| BI9 | StdinReader | chunks.157.mjs:1818-1858 | class |
| FW | logNativeHost | chunks.157.mjs:1647-1658 | function |
| C$A | sendNativeMessage | chunks.157.mjs:1660-1664 | function |
| jU7 | NATIVE_HOST_VERSION | chunks.157.mjs:1641 | constant ("1.0.0") |
| eP0 | MAX_MESSAGE_SIZE | chunks.157.mjs:1643 | constant (1048576) |

### Socket Path Configuration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| sfA | getSocketPath | chunks.131.mjs:32-35 | function |
| oo2 | getSocketName | chunks.131.mjs:37-39 | function |
| SB7 | getUsername | chunks.131.mjs:41-47 | function |

### Chrome Settings

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| - | claudeInChromeDefaultEnabled | chunks.137.mjs:954-967 | setting |
| - | hasCompletedClaudeInChromeOnboarding | chunks.155.mjs:2195-2202 | state |

### MCP Tools (18 total)

| Tool Name | Description |
|-----------|-------------|
| `javascript_tool` | Execute JS in page context |
| `read_page` | Get accessibility tree |
| `find` | Natural language element search |
| `form_input` | Set form field values |
| `computer` | Mouse/keyboard control (12+ actions) |
| `navigate` | URL navigation + history |
| `resize_window` | Browser window resizing |
| `gif_creator` | Record/export GIF animations |
| `upload_image` | Upload images to pages |
| `get_page_text` | Extract page text content |
| `tabs_context_mcp` | Get current tab group info |
| `tabs_create_mcp` | Create a new tab |
| `update_plan` | Plan approval for domain access |
| `read_console_messages` | Read browser console |
| `read_network_requests` | Monitor HTTP requests |
| `shortcuts_list` | List available shortcuts |
| `shortcuts_execute` | Execute shortcuts |

> Key files: chunks.145.mjs (MCP tools, socket client, server factory), chunks.149.mjs (skill), chunks.157.mjs (native host bridge), chunks.131.mjs (socket paths), chunks.137.mjs (settings)

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

### list_changed Notifications (NEW in 2.1.0)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| jY0 | TOOLS_LIST_CHANGED_NOTIFICATION | chunks.138.mjs:2917 | constant |
| _Y0 | PROMPTS_LIST_CHANGED_NOTIFICATION | chunks.138.mjs:2929 | constant |
| NY0 | RESOURCES_LIST_CHANGED_NOTIFICATION | chunks.138.mjs:2941 | constant |
| Ax | fetchMcpTools | chunks.138.mjs:2923 | function (with cache) |
| ZhA | fetchMcpPrompts | chunks.138.mjs:2935 | function (with cache) |
| GhA | fetchMcpResources | chunks.138.mjs:2947 | function (with cache) |

### MCP Server Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | initializeMcpState | TBD | function |
| TBD | loadMcpConfig | TBD | function |
| TBD | connectMcpServer | TBD | function |

> Key files: chunks.85.mjs (auto-search), chunks.138.mjs (list_changed), chunks.120.mjs, chunks.145.mjs

---

## Module: Permissions & Sandbox

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

### Sandbox Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Vb5 | cleanSandboxViolations | chunks.112.mjs:44-51 | function |
| D71 | stripSandboxTags | TBD | function |

> Identified in: chunks.53, 54, 55, 90, 92, 98, 114, 123, 124, 144

---

## Module: Auth & OAuth

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

### Token Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | refreshOAuthToken | TBD | function |
| TBD | validateAccessToken | TBD | function |
| TBD | getAccessToken | TBD | function |

### Bedrock/Vertex Auth

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| PeB | shouldRefreshBedrockAuth | chunks.85.mjs:110-115 | function |
| qBB | isBedrockAuthError | TBD | function |
| uA1 | resetBedrockAuth | chunks.85.mjs:118 | function |

> Key file: chunks.20.mjs (OAuth config), chunks.85.mjs (Bedrock auth)

---

## Module: Telemetry

### Metrics Endpoint

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | METRICS_ENDPOINT | TBD | constant |
| TBD | emitTelemetry | TBD | function |
| TBD | trackEvent | TBD | function |

### MCP Tool Name Sanitization (2.1.0)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | sanitizeMcpToolName | TBD | function |

---

## Module: UI Components

### Terminal Rendering

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| M6A | BashOutputRenderer | chunks.112.mjs:66-107 | function |
| $T2 | UserMemoryInput | chunks.112.mjs:7-29 | function |
| qT2 | BashStdoutStderr | chunks.112.mjs:121-134 | function |

### Vim Motions (NEW in 2.1.0)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | repeatFMotion | TBD | function |
| TBD | yankOperator | TBD | function |
| TBD | textObjectHandlers | TBD | object |
| TBD | indentDedent | TBD | function |

### IME Support (2.0.68)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | imeCompositionHandler | TBD | function |
| TBD | positionImeWindow | TBD | function |

---

## Module: Plugin System

> Full analysis: [../25_plugin/](../25_plugin/)

### Unified Manifest Schema (v2.1.7)

> Plugins unify all component types (agents, skills, commands, hooks, MCP, LSP) in single manifest

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| V4A | unifiedPluginManifestSchema | chunks.90.mjs:1690-1698 | schema |
| V75 | baseMetadataSchema | chunks.90.mjs:1631-1641 | schema |
| E75 | commandsDefinitionSchema | chunks.90.mjs:1656-1657 | schema |
| z75 | agentsDefinitionSchema | chunks.90.mjs:1658-1659 | schema |
| $75 | skillsDefinitionSchema | chunks.90.mjs:1660-1661 | schema |
| C75 | outputStylesDefinitionSchema | chunks.90.mjs:1662-1663 | schema |
| F75 | hooksConfigurationSchema | chunks.90.mjs:1645-1646 | schema |
| U75 | mcpServersDefinitionSchema | chunks.90.mjs:1664-1665 | schema |
| N75 | lspServersDefinitionSchema | chunks.90.mjs:1688-1689 | schema |
| LF1 | parsePluginManifest | chunks.130.mjs | function |

### Component Priority & Merging

> Priority determines which component wins when same name exists in multiple sources

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| mb | mergeAgentsBySource | chunks.93.mjs:602-614 | function |
| n32 | sortHooksByPriority | chunks.91.mjs:2779 | function |
| lo2 | mergeHooksArrays | chunks.130.mjs:2830-2838 | function |
| aQ7 | unifyMcpServerConfig | chunks.130.mjs:1360-1411 | function |

**Hook Priority Order:**
| Source | Priority | Execution Order |
|--------|----------|--------------------|
| `localSettings` | 0 | First (highest) |
| `projectSettings` | 1 | Second |
| `userSettings` | 2 | Third |
| `pluginHook` | 999 | Last (lowest) |

**Agent Priority Order (later overwrites earlier):**
1. `built-in` → 2. `plugin` → 3. `userSettings` → 4. `projectSettings` → 5. `flagSettings` → 6. `policySettings`

### Plugin Discovery & Loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DG | discoverPluginsAndHooks | chunks.130.mjs:3246-3263 | function |
| OB7 | loadMarketplacePlugins | chunks.130.mjs:2841-2888 | function |
| RB7 | loadInlinePlugins | chunks.130.mjs:3180-3221 | function |
| MB7 | initializePluginFromMarketplace | chunks.130.mjs:2890-3177 | function |
| ao2 | loadPluginDefinitionFromPath | chunks.130.mjs:2612-2820 | function |
| po2 | loadHooksFile | chunks.130.mjs:2602-2610 | function |
| lo2 | mergeHookConfigs | chunks.130.mjs:2830-2838 | function |
| Bt | clearPluginCache | chunks.130.mjs:3224-3226 | function |
| Qf0 | getInlinePlugins | chunks.1.mjs:2678 | function |
| W0/_U1 | createMemoizedAsync | chunks.1.mjs:636-656 | function |
| zB7 | normalizePath | chunks.130.mjs | function |
| $B7 | extractPluginNameFromPath | chunks.130.mjs | function |
| LF1 | loadManifest | chunks.130.mjs | function |

### Plugin Component Loaders

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| O4A | getPluginAgents | chunks.93.mjs:554-588 | function |
| tw0 | getPluginSkills | chunks.130.mjs:1945-1980 | function |
| ew0 | getPluginOutputStyles | chunks.130.mjs:2043-2084 | function |
| N52 | loadAgentsFromDirectory | chunks.93.mjs:564 | function |
| w52 | loadAgentFromFile | chunks.93.mjs:577 | function |
| So2 | loadSkillsFromPath | chunks.130.mjs:1957 | function |
| yo2 | scanOutputStylesDirectory | chunks.130.mjs:1982-2004 | function |
| vo2 | loadOutputStyleFromFile | chunks.130.mjs:2006-2035 | function |
| AL0 | clearOutputStylesCache | chunks.130.mjs:2037-2039 | function |
| $F1 | clearSkillsCache | chunks.130.mjs | function |
| L52 | clearAgentsCache | chunks.93.mjs | function |
| Bq0 | clearHooksCache | chunks.130.mjs | function |

### LSP Server Loading from Plugins

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| xg5 | loadLspServersFromPlugin | chunks.114.mjs:2016-2075 | function |
| yg5 | replacePluginRoot | chunks.114.mjs:2078-2080 | function |
| vg5 | expandLspServerConfig | chunks.114.mjs:2082-2099 | function |
| Pg5 | validatePluginPath | chunks.114.mjs:2021 | function |
| YVA | lspServerConfigSchema | chunks.90.mjs:1668-1687 | schema |

### Plugin Installation (Git Submodule Fix in 2.1.7)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ofA | installPlugin | chunks.130.mjs:2267-2303 | function |
| wF1 | copyToVersionedCache | chunks.130.mjs:2368-2400 | function |
| Tr | getPluginCacheDir | chunks.130.mjs:2320-2322 | function |
| xb | getVersionedCachePath | chunks.130.mjs:2324-2331 | function |
| rfA | copyDirectoryRecursive | chunks.130.mjs:2333-2366 | function |
| G32 | gitCloneWithSubmodules | chunks.90.mjs:2382-2389 | function |
| r75 | gitCloneWithRetry | chunks.90.mjs:2392-2424 | function |
| B32 | isGitAuthError | chunks.90.mjs:2378-2379 | function |

### Plugin Marketplace

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| NS | addMarketplaceSource | chunks.91.mjs:136-156 | function |
| VI0 | loadMarketplaceSource | chunks.91.mjs:17-134 | function |
| _Z1 | removeMarketplaceSource | chunks.91.mjs:158-201 | function |
| Rr | refreshMarketplace | chunks.91.mjs:299-320 | function |
| I32 | setMarketplaceAutoUpdate | chunks.91.mjs:322-331 | function |
| rC | loadOrFetchMarketplace | chunks.91.mjs:355-370 | function |
| NF | findPluginInMarketplaces | chunks.91.mjs:264-285 | function |
| HI0 | findPluginInCachedMarketplace | chunks.91.mjs:237-262 | function |
| FI0 | loadMarketplaceFromCache | chunks.91.mjs:204-219 | function |
| e75 | loadCachedMarketplace | chunks.91.mjs:221-235 | function |
| D5 | loadMarketplaceConfigs | chunks.90.mjs:2232 | function |
| FVA | saveMarketplaceConfig | chunks.90.mjs:2258 | function |
| MZ1 | getMarketplaceConfigPath | chunks.90.mjs:2220 | function |
| Z32 | getMarketplacesCacheDir | chunks.90.mjs:2224 | function |
| H4A | isMarketplaceSourceAllowed | chunks.91.mjs:137 | function |
| AyA | isMarketplaceSourceBlocked | chunks.91.mjs:138 | function |
| WVA | getAllowedMarketplaceSources | chunks.91.mjs:139 | function |
| JVA | marketplaceJsonSchema | chunks.91.mjs:93 | schema |
| t75 | generateTempName | chunks.91.mjs:3-5 | function |
| J32 | parseAndValidateSchema | chunks.91.mjs:7-15 | function |

### Plugin State Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| f_ | loadInstalledPluginsRegistry | chunks.91.mjs:551-579 | function |
| UI0 | saveInstalledPluginsRegistry | chunks.91.mjs:580-596 | function |
| NI0 | addPluginToRegistry | chunks.91.mjs:680-725 | function |
| F32 | removePluginFromRegistry | chunks.91.mjs:597-650 | function |
| wI0 | syncRegistryWithSettings | chunks.91.mjs:726-780 | function |
| E32 | initializePluginsSystem | chunks.91.mjs:651-679 | function |
| Od | resolvePluginVersion | chunks.91.mjs:373-384 | function |
| AG5 | getGitCommitSha | chunks.91.mjs:386-396 | function |

### Plugin Schemas

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| l62 | hooksFileSchema | chunks.130.mjs | schema |
| W4A | pluginIdSchema | chunks.91.mjs | schema |
| Hq | SchemaValidationError | chunks.91.mjs | class |

### Plugin CLI Commands

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ON9 | installPluginCommand | chunks.157.mjs:1052-1058 | function |
| MN9 | uninstallPluginCommand | chunks.157.mjs:1059-1065 | function |
| RN9 | enablePluginCommand | chunks.157.mjs:1066-1076 | function |
| _N9 | disablePluginCommand | chunks.157.mjs:1077-1087 | function |
| jN9 | updatePluginCommand | chunks.157.mjs:1088-1096 | function |
| Az1 | validatePluginManifest | chunks.157.mjs:962 | function |
| nE1 | parseMarketplaceSource | chunks.157.mjs:984 | function |
| X32 | updateAllMarketplaces | chunks.157.mjs:1045 | function |
| jU | validScopes | chunks.157.mjs | constant |
| OgA | updateValidScopes | chunks.157.mjs:1088 | constant |
| NY | clearAllCaches | chunks.130.mjs:2090-2092 | function |
| IB7 | clearPluginCaches | chunks.130.mjs:2086-2088 | function |

### Plugin Error Formatting

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| h_ | formatPluginError | chunks.91.mjs:846-898 | function |

---

## Module: Code Indexing

### Tree-sitter Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | parseWithTreeSitter | TBD | function |
| TBD | freeParseTree | TBD | function |

---

## Module: Shell Parser

### Bash Parsing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Fb5 | extractCwdReset | chunks.112.mjs:53-64 | function |
| UT2 | CWD_RESET_REGEX | chunks.112.mjs:118 | constant |

### Command Extraction

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | extractCommandPrefix | TBD | function |
| TBD | parseLineContinuation | TBD | function |

---

## New Slash Commands

### Session Management (Named Sessions 2.0.64, Teleport 2.1.0)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Vz1 | renameSession | chunks.148.mjs:1237-1247 | function |
| bT0 | tagSession | chunks.148.mjs:1249-1258 | function |
| Yt | resumeTeleportSession | chunks.120.mjs:3274-3319 | function |
| Xq0 | validateSessionRepository | chunks.120.mjs:3247-3272 | function |
| BEA | switchToBranch | chunks.120.mjs:3225-3245 | function |
| Bw | getSessionStorage | chunks.148.mjs:~1238 | function |
| q0 | getCurrentSessionId | chunks.148.mjs:~1245 | function |
| qP0 | saveSessionMetadata | chunks.148.mjs:~1239 | function |
| xkA | fetchSessionData | chunks.120.mjs:3286 | function |

### /plan (NEW in 2.1.0)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | planCommand | TBD | object |
| TBD | enablePlanMode | TBD | function |

---

## Environment Variables (NEW)

| Name | Version | Purpose |
|------|---------|---------|
| CLAUDE_CODE_TMPDIR | 2.1.5 | Override temp directory |
| CLAUDE_CODE_DISABLE_BACKGROUND_TASKS | 2.1.4 | Disable background tasks |
| CLAUDE_CODE_SHELL | 2.0.65 | Override shell detection |
| CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS | 2.1.0 | Override file read limit |
| FORCE_AUTOUPDATE_PLUGINS | 2.1.2 | Force plugin updates |
| IS_DEMO | 2.1.0 | Hide email/org in UI |

---

## Analysis Progress

| Module | Status | Priority |
|--------|--------|----------|
| LSP Integration | ✅ Complete | P1 |
| Chrome/Browser | ✅ Complete | P1 |
| Wildcard Permissions | ✅ Complete | P1 |
| Plugin System | ✅ Complete (v2.1.7) | P1 |
| Plugin Unified Loading | ✅ Complete (v2.1.7) | P1 |
| MCP Auto-Search | Locations found | P2 |
| OAuth Updates | Endpoints documented | P3 |
| All others | TBD | P3+ |

---

## See Also

- [symbol_index_core.md](./symbol_index_core.md) - Core execution modules
- [file_index.md](./file_index.md) - File content index
- [changelog_analysis.md](./changelog_analysis.md) - Version changes
