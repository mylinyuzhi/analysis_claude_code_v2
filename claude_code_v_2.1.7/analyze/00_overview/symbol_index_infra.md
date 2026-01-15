# Symbol Index - Infrastructure Modules (Claude Code 2.1.7)

> Symbol mapping table Part 2: Infrastructure & support modules
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.
>
> **Related file:** [symbol_index_core.md](./symbol_index_core.md) - Core execution modules

---

## Quick Navigation

- [Model Selection](#module-model-selection) - **NEW analysis in 2.1.7**
- [Prompt Building](#module-prompt-building) - **NEW analysis in 2.1.7**
- [LSP Integration](#module-lsp-integration) - **NEW in 2.0.74**
- [Chrome/Browser](#module-chromebrowser-integration) - **NEW in 2.0.72**
- [IDE Integration](#module-ide-integration) - Process detection, keybindings, extension install
- [MCP Protocol](#module-mcp-protocol) - Enhanced with auto-search
- [Permissions & Sandbox](#module-permissions--sandbox) - Wildcard support
- [Auth & OAuth](#module-auth--oauth) - Updated endpoints
- [Telemetry](#module-telemetry)
- [UI Components](#module-ui-components)
- [Plugin System](#module-plugin-system)
- [Code Indexing](#module-code-indexing)
- [Shell Parser](#module-shell-parser)

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

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qz7 | applyMessageCacheBreakpoints | chunks.147.mjs:483-490 | function |
| $z7 | applyUserMessageCacheBreakpoint | chunks.146.mjs:2950-2970 | function |
| Cz7 | applyAssistantMessageCacheBreakpoint | chunks.146.mjs:2975-3000 | function |
| wuA | getCacheControl | chunks.146.mjs:2889-2895 | function |
| AJ9 | isPromptCachingSupported | chunks.147.mjs:63 | function |

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
| SU0 | formatWorkspaceSymbolResult | chunks.119.mjs:3001-3023 | function |
| Ng2 | formatCallHierarchyItem | chunks.119.mjs:3026-3035 | function |
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

LSP Server Instance Internal API:
| Internal | Exported As | Description |
|----------|-------------|-------------|
| X | start | Start server and initialize LSP |
| I | stop | Graceful shutdown |
| D | restart | Stop and restart with max retry limit |
| W | isHealthy | Health check (running + initialized) |
| K | sendRequest | Send LSP request with retry logic |
| V | sendNotification | Send LSP notification |
| F | onNotification | Register notification handler |
| H | onRequest | Register request handler |

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

### LSP Plugin Loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Sg5 | loadLspServersFromPluginDefault | chunks.114.mjs:1979-2013 | function |
| xg5 | loadLspServersFromManifest | chunks.114.mjs:2016-2075 | function |
| Pg5 | validatePluginPath | chunks.114.mjs:1971-1977 | function |
| vg5 | expandLspServerConfig | chunks.114.mjs:2082-2111 | function |
| yg5 | replacePluginRoot | chunks.114.mjs:2078-2079 | function |
| kg5 | namespaceLspServers | chunks.114.mjs:2113-2124 | function |
| Ey2 | loadPluginLspServers | chunks.114.mjs:2126-2141 | function |

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

### Chrome Initialization & Detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| az1 | shouldEnableChromeIntegration | chunks.145.mjs:1259-1268 | function |
| I$A | isClaudeInChromeAutoEnabled | chunks.145.mjs:1270-1273 | function |
| oz1 | getClaudeInChromeConfig | chunks.145.mjs:1275-1309 | function |
| FH7 | getCachedExtensionStatus | chunks.145.mjs:1378-1385 | function |
| qp | detectChromeExtension | chunks.145.mjs:1387-1409 | function |
| HH7 | getChromeUserDataPath | chunks.145.mjs:1411-1427 | function |
| iz1 | cachedAutoEnableResult | chunks.145.mjs:1437 | variable |

### Native Host Scripts

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KZ9 | createNativeHostWrapperScript | chunks.145.mjs:1358-1376 | function |
| WZ9 | installNativeHostManifest | chunks.145.mjs:1329-1349 | function |
| nz1 | NATIVE_HOST_NAME | chunks.145.mjs:1431 | constant |
| DH7 | CHROME_RECONNECT_URL | chunks.145.mjs:1429 | constant |

### Chrome Onboarding UI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CH7 | ChromeIntegrationSetup | chunks.145.mjs:1453-1550 | component |
| UH7 | renderChromeSetup | chunks.145.mjs:1543-1555 | function |
| Ej | CHROME_MCP_SERVER_NAME | - | constant |

### Chrome Slash Command

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qH7 | chromeSettingsCommand | chunks.145.mjs:1583-1591 | command |
| zZ9 | chromeSettingsCommand | chunks.145.mjs:1591 | alias |

### Chrome URL Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EH7 | CHROME_EXTENSION_INSTALL_URL | chunks.145.mjs:1561 | constant |
| zH7 | CHROME_PERMISSIONS_URL | chunks.145.mjs:1563 | constant |
| $H7 | CHROME_RECONNECT_URL | chunks.145.mjs:1565 | constant |
| wU7 | CHROME_EXTENSION_URL | chunks.157.mjs:1595 | constant |
| LU7 | CHROME_BUG_REPORT_URL | chunks.157.mjs:1597 | constant |
| dB7 | CHROME_TAB_DEEPLINK_URL | chunks.131.mjs:1035 | constant |

### System Prompt Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| JZ9 | BROWSER_AUTOMATION_PROMPT | chunks.145.mjs:1191-1238 | constant |
| XZ9 | MCP_SEARCH_REMINDER | chunks.145.mjs:1240-1251 | constant |
| xT0 | CHROME_SKILL_REMINDER | chunks.145.mjs:1253-1257 | constant |

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

## Module: IDE Integration

> Full analysis: [../22_ide_integration/overview.md](../22_ide_integration/overview.md)
> Supports 18+ IDEs including VSCode-based (Cursor, Windsurf, VS Code) and JetBrains suite

### IDE Configuration Map

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iEA | IDE_CONFIG_MAP | chunks.131.mjs:2903-3030 | object |
| kF1 | isVSCodeIDE | chunks.131.mjs | function |
| Rx | isJetBrainsIDE | chunks.131.mjs | function |

### IDE Detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| z27 | detectRunningIDEs | chunks.131.mjs:2733-2779 | function |
| OL0 | populateIDECache | chunks.131.mjs:2782-2785 | function |
| br2 | getAvailableIDEs | chunks.131.mjs:2787-2790 | function |
| yr2 | checkCursorInstalled | chunks.131.mjs:2720-2722 | function |
| vr2 | checkWindsurfInstalled | chunks.131.mjs:2724-2726 | function |
| kr2 | checkVSCodeInstalled | chunks.131.mjs:2728-2731 | function |
| pEA | getTerminalIDEName | chunks.131.mjs:2346-2349 | function |

### Lock File Handling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bF1 | getIDELockFiles | chunks.131.mjs:2351-2369 | function |
| Sr2 | parseLockFile | chunks.131.mjs:2371-2403 | function |
| I27 | getIDEDirectories | chunks.131.mjs:2426-2458 | function |
| D27 | cleanupStaleLockFiles | chunks.131.mjs:2460-2490 | function |
| yF1 | PATH_SEPARATOR | chunks.131.mjs | constant |

### Connection Validation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| IhA | getAvailableIDEConnections | chunks.131.mjs:2532-2587 | function |
| Mr2 | waitForIDEConnection | chunks.131.mjs:2517-2530 | function |
| X27 | isIDEProcessRunning | chunks.131.mjs:2315-2332 | function |
| Pr2 | isProcessAlive | chunks.131.mjs | function |
| NL0 | isPortReachable | chunks.131.mjs:2405-2424 | function |
| Cr2 | notifyIDEConnected | chunks.131.mjs:2589-2596 | function |

### Extension Installation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| F27 | installVSCodeExtension | chunks.131.mjs:2614-2632 | function |
| H27 | getInstalledExtensionVersion | chunks.131.mjs:2654-2666 | function |
| Rr2 | checkExtensionInstalled | chunks.131.mjs:2602-2612 | function |
| xr2 | getVSCodeCLIPath | chunks.131.mjs:2702-2718 | function |
| E27 | findCLIFromParentProcess | chunks.131.mjs:2668-2700 | function |
| _r2 | getMinRequiredVersion | chunks.131.mjs:2643-2652 | function |
| LL0 | getCleanEnv | chunks.131.mjs:2635-2641 | function |
| V27 | CLAUDE_CODE_EXTENSION_ID | chunks.131.mjs:2872 | constant ("anthropic.claude-code") |

### Terminal Keybinding Setup

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EjA | supportsKeybindingSetup | chunks.68.mjs:2412-2414 | function |
| uB0 | setupTerminalKeybinding | chunks.68.mjs:2416-2458 | function |
| fB0 | installVSCodeKeybinding | chunks.68.mjs:2476-2511 | function |
| gE8 | setupAppleTerminal | chunks.68.mjs:2539-2573 | function |
| uE8 | setupAlacritty | chunks.68.mjs:2575-2611 | function |

### IDE Connection & State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hr2 | initializeIDEConnection | chunks.131.mjs:2830-2854 | function |
| hF9 | useIDEAutoConnect | chunks.153.mjs:157-185 | function |
| fF1 | hasConnectedIDE | chunks.131.mjs:2598-2600 | function |
| nN | getIDEClient | chunks.131.mjs:2818-2822 | function |
| hF1 | getIDEName | chunks.131.mjs:2792-2795 | function |
| ML0 | getIDENameFromClient | chunks.131.mjs:2797-2800 | function |
| EK | getIDEDisplayName | chunks.131.mjs:2802-2816 | function |
| zK | isInCodeTerminal | chunks.131.mjs:3035-3037 | function |
| JhA | isVSCodeTerminal | chunks.131.mjs:3031-3033 | function |
| XhA | isJetBrainsTerminal | chunks.131.mjs:3033-3035 | function |

### IDE Diff Support

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tI9 | useDiffWithIDE | chunks.149.mjs:3253-3313 | function |
| wq7 | openDiffInIDE | chunks.149.mjs:3328-3380 | function |
| VS0 | closeTab | chunks.149.mjs:3382-3391 | function |
| fr2 | closeAllDiffTabs | chunks.131.mjs:2824-2828 | function |
| Nq7 | processEdits | chunks.149.mjs:3315-3326 | function |

### IDE Context Attachments

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| k27 | generateIdeSelectionAttachment | chunks.131.mjs:3287-3300 | function |
| f27 | generateIdeOpenedFileAttachment | chunks.131.mjs:3362-3370 | function |

### IDE Display Name Mapping

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| jr2 | IDE_DISPLAY_NAMES | chunks.131.mjs:3039-3052 | object |

**IDE Display Name Map:**
| Key | Display Name |
|-----|--------------|
| code | VS Code |
| cursor | Cursor |
| windsurf | Windsurf |
| vim/vi | Vim |
| emacs | Emacs |
| nano | nano |
| subl | Sublime Text |

### WSL Support

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| gr2 | getIDEHost | chunks.131.mjs:3053-3070 | function |
| lEA | WSLPathConverter | chunks.149.mjs:3356 | class |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| CLAUDE_CODE_AUTO_CONNECT_IDE | Enable/disable auto-connect to IDE |
| CLAUDE_CODE_SSE_PORT | Force specific IDE port connection |
| CLAUDE_CODE_IDE_SKIP_VALID_CHECK | Skip workspace validation |
| CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL | Skip extension auto-installation |
| CLAUDE_CODE_IDE_HOST_OVERRIDE | Override IDE host address |
| FORCE_CODE_TERMINAL | Force detection as running in code terminal |
| WSL_DISTRO_NAME | WSL distribution name for path translation |

> Key files: chunks.131.mjs (detection, connection, lock files), chunks.68.mjs (keybindings), chunks.149.mjs (diff support), chunks.153.mjs (auto-connect hook)

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
| Model Selection | ✅ Complete (v2.1.7) | P1 |
| Prompt Building | ✅ Complete (v2.1.7) | P1 |
| LSP Integration | ✅ Complete | P1 |
| Chrome/Browser | ✅ Complete | P1 |
| IDE Integration | ✅ Complete (v2.1.7) | P1 |
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
