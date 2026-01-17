# Symbol Index - Infrastructure Integration (Claude Code 2.1.7)

> Symbol mapping table Part 4: External integrations & UI components
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.
>
> **Related files:**
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution modules
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core feature modules
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infrastructure

---

## Quick Navigation

- [LSP Integration](#module-lsp-integration) - Language Server Protocol (NEW in 2.0.74)
- [Chrome/Browser](#module-chromebrowser-integration) - Chrome extension (NEW in 2.0.72)
- [IDE Integration](#module-ide-integration) - VSCode, JetBrains, keybindings
- [UI Components](#module-ui-components) - Ink framework, rendering
- [Plugin System](#module-plugin-system) - Unified manifest, marketplace
- [Code Indexing](#module-code-indexing) - Tree-sitter
- [Shell Parser](#module-shell-parser) - Bash parsing
- [Slash Commands](#new-slash-commands) - Session management
- [Environment Variables](#environment-variables-new) - Configuration

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

## Module: UI Components

> Full analysis: [../02_ui/](../02_ui/)

### Ink Framework Core

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Sa | InkRenderer | chunks.66.mjs:60-252 | object |
| w21 | InternalApp | chunks.67.mjs:23-280 | class |
| l_A | TerminalDimensionsContext | chunks.67.mjs:47 | context |
| AN | InkContext | chunks.67.mjs:52 | context |
| K21 | ExitContext | chunks.67.mjs:54 | context |
| xQ0 | ThemeProvider | chunks.67.mjs:58 | component |
| V21 | StdinContext | chunks.67.mjs:62 | context |
| F21 | FocusContext | chunks.67.mjs:70 | context |
| E21 | TerminalFocusContext | chunks.67.mjs:83 | context |

### Markdown Rendering

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| VE | tokenToText | chunks.97.mjs:3-113 | function |
| JV | MarkdownRenderer | chunks.97.mjs:329-353 | function |
| gG2 | TableRenderer | chunks.97.mjs:171-307 | function |
| n7 | markedLexer | chunks.97.mjs:334 | object |
| dY1 | highlightJS | chunks.97.mjs:13 | module |

### Animation & Status Indicators

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| zW5 | createBlinkingManager | chunks.97.mjs:726-745 | function |
| WZ2 | useBlinkingState | chunks.97.mjs:747-759 | function |
| k4A | StatusIndicator | chunks.97.mjs:772-784 | function |
| xJ | BULLET_CHAR | chunks.97.mjs:717-723 | constant |
| Hb | BlinkingSpinner | chunks.97.mjs:368 | component |
| $6A | useShimmerAnimation | chunks.107.mjs:2155-2176 | hook |
| ws | AnimatedChar | chunks.107.mjs:2023-2035 | function |
| XE0 | AnimatedMessage | chunks.107.mjs:2044-2092 | function |
| ZE0 | FlashChar | chunks.107.mjs:2000-2014 | function |
| DE0 | useFlashOpacity | chunks.107.mjs:2185-2194 | hook |
| zz8 | RAINBOW_COLORS | chunks.68.mjs:3572 | constant |
| $z8 | RAINBOW_SHIMMER_COLORS | chunks.68.mjs:3572 | constant |
| $jA | getRainbowColor | chunks.135.mjs:2120-2121 | function |

### Text Input Components

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cH1 | TextInputComponent | chunks.135.mjs:2163-2214 | function |
| d09 | HighlightedTextRenderer | chunks.135.mjs:2103-2150 | function |
| V09 | splitByHighlights | chunks.135.mjs:2080-2100 | function |
| s19 | usePasteDetection | chunks.135.mjs:2173 | hook |
| e19 | usePlaceholder | chunks.135.mjs:2191 | hook |
| J0 | useInput | chunks.135.mjs:2198 | hook |
| M8 | Transform | chunks.135.mjs:2145 | component |

### Key Parsing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| j$B | parseKey | chunks.67.mjs:2969-3039 | function |
| k$B | KEY_CODE_MAP | chunks.67.mjs | constant |
| NwB | parseKeySequence | chunks.67.mjs:127 | function |
| BK8 | dispatchKeyEvents | chunks.67.mjs | function |

### File Watcher System

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fm | watcherManager | chunks.11.mjs | object |
| y64 | subscribe | chunks.11.mjs | function |
| k64 | initializeWatcher | chunks.11.mjs | function |
| fd0 | chokidar | chunks.55.mjs:688 | module |
| h9A | chokidarInstance | chunks.11.mjs | variable |
| x64 | markInternalWrite | chunks.11.mjs | function |

### Theme Colors

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| xQ0 | ThemeProvider | chunks.66.mjs | component |
| sQ | getThemeColor | chunks.66.mjs | function |

### Tool Use Display

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| VZ2 | ToolUseDisplay | chunks.97.mjs:795-865 | function |
| $W5 | renderToolUseMessage | chunks.97.mjs:867-883 | function |
| CW5 | renderToolUseProgress | chunks.97.mjs:885-899 | function |

### Plan Mode UI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iY1 | PlanRejectedDisplay | chunks.97.mjs:381-395 | function |
| mG2 | LoadingSpinner | chunks.97.mjs:367-371 | function |

### Tool Confirm Dialog

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ih | ToolUseConfirmDialog | chunks.150.mjs:101-223 | function |
| AD9 | IDEDiffSupport | chunks.150.mjs:29-89 | function |
| rI9 | useConfirmOptions | chunks.150.mjs:122 | hook |
| tI9 | useIDEDiff | chunks.150.mjs:168 | hook |

### Attachment Conversion

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| q$7 | normalizeAttachmentForAPI | chunks.148.mjs:3-371 | function |
| z$7 | generatePlanModeReminder | chunks.148.mjs:177 | function |
| H0 | createMetaMessage | chunks.147.mjs:2410 | function |
| Yh | wrapSystemReminder | chunks.147.mjs:3212 | function |
| q5 | wrapSystemReminderArray | chunks.147.mjs:3218 | function |
| OuA | createToolResultMessage | chunks.148.mjs:373-390 | function |
| MuA | createToolUseMessage | chunks.148.mjs:392-397 | function |

### Terminal Rendering

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| M6A | BashOutputRenderer | chunks.112.mjs:66-107 | function |
| $T2 | UserMemoryInput | chunks.112.mjs:7-29 | function |
| qT2 | BashStdoutStderr | chunks.112.mjs:121-134 | function |

### Streaming Pipeline

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| aN | mainAgentLoop | chunks.134.mjs:99-250 | function |
| _77 | maxToolConcurrency | chunks.134.mjs:79-80 | function |
| R77 | timingBreakdown | chunks.134.mjs:3-57 | function |
| oHA | streamAPICall | chunks.147.mjs | function |
| _H1 | StreamingToolExecutor | chunks.134.mjs | class |
| $K1 | streamEventProcessor | chunks.147.mjs:3115-3209 | function |
| k77 | progressStreamingQueue | chunks.134.mjs:741-770 | function |

### Accessibility (NEW in 2.1.7)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| a1 | parseBoolean | chunks.67.mjs:92 | function |
| i_A | FOCUS_REPORTING_ENABLE | chunks.67.mjs:92 | constant |
| TP | FOCUS_REPORTING_DISABLE | chunks.67.mjs:95 | constant |

**Environment Variables:**
| Variable | Purpose |
|----------|---------|
| CLAUDE_CODE_ACCESSIBILITY | Disable focus reporting for accessibility |
| CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY | Max parallel tool executions (default: 10) |

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

### FileIndex - File Path Autocomplete

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| QY7 | getFileIndex | chunks.136.mjs:1521-1529 | function |
| YY7 | getFilesUsingGit | chunks.136.mjs:1594-1649 | function |
| XY7 | getProjectFiles | chunks.136.mjs:1664-1678 | function |
| IY7 | initializeFileIndex | chunks.136.mjs:1680-1711 | function |
| WY7 | performSearch | chunks.136.mjs:1742-1789 | function |
| IQ9 | getFileSuggestions | chunks.136.mjs:1816-1842 | function |
| XR0 | refreshIndexCache | chunks.136.mjs:1791-1799 | function |
| ZQ9 | loadIgnorePatterns | chunks.136.mjs:1572-1592 | function |
| KR0 | extractDirectoryPrefixes | chunks.136.mjs:1651-1658 | function |
| ehA | createFileResult | chunks.136.mjs:1732-1740 | function |
| KY7 | listCurrentDirectory | chunks.136.mjs:1802-1814 | function |
| ZY7 | mergeUntrackedFiles | chunks.136.mjs:1552-1570 | function |
| JQ9 | clearFileIndexCache | chunks.136.mjs:1531-1533 | function |
| XE1 | clearAllCaches | chunks.136.mjs:1903-1905 | function |
| GY7 | isGitRepo | chunks.136.mjs:1535-1542 | function |
| DY7 | commonPrefix | chunks.136.mjs:1714-1719 | function |
| XQ9 | getCommonPrefixFromResults | chunks.136.mjs:1721-1730 | function |

### FileIndex - Global Variables

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wzA | rustFileIndex | chunks.136.mjs:1858 | variable |
| LzA | fallbackFileList | chunks.136.mjs:1860-1900 | variable |
| VR0 | lastRefreshTimestamp | chunks.136.mjs:1864 | variable |
| f3A | refreshPromise | chunks.136.mjs:1862 | variable |
| BY7 | CACHE_TTL | chunks.136.mjs:1866 | constant |
| NzA | MAX_SUGGESTIONS | chunks.136.mjs:1880 | constant |
| shA | fileIndexInstance | chunks.136.mjs:1854 | variable |
| GE1 | rustModuleFailed | chunks.136.mjs:1856 | variable |
| qzA | trackedFiles | chunks.136.mjs:1874 | variable |
| DR0 | ignorePatterns | chunks.136.mjs:1876 | variable |
| WR0 | ignorePatternsKey | chunks.136.mjs:1878 | variable |
| thA | isGitRepoCache | chunks.136.mjs:1868 | variable |
| IR0 | gitRepoCacheCwd | chunks.136.mjs:1870 | variable |
| ZE1 | untrackedFetchPromise | chunks.136.mjs:1872 | variable |

### Tree-sitter - WASM Classes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| yK1 | Language | chunks.122.mjs:736-859 | class |
| rbA | Parser | chunks.122.mjs:2144-2226 | class |
| ii5 | Tree | chunks.122.mjs:~860 | class |

### Tree-sitter - Initialization

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Mn5 | initializeTreeSitter | chunks.123.mjs:562-593 | function |
| hm2 | ensureTreeSitterLoaded | chunks.123.mjs:595-598 | function |
| xn5 | isTreeSitterAvailable | chunks.123.mjs:816-825 | function |

### Tree-sitter - Parsing Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Rn5 | parseCommand | chunks.123.mjs:600-618 | function |
| gm2 | findCommandNode | chunks.123.mjs:620-634 | function |
| _n5 | extractEnvironmentVariables | chunks.123.mjs:636-645 | function |
| jn5 | extractCommandArguments | chunks.123.mjs:647-664 | function |
| Pn5 | extractPipePositions | chunks.123.mjs:741-749 | function |
| Sn5 | extractRedirections | chunks.123.mjs:751-766 | function |
| Mq0 | traverseTree | chunks.123.mjs:734-739 | function |
| Tn5 | unquoteString | chunks.123.mjs:666-668 | function |
| vn5 | stripOutputRedirections | chunks.123.mjs:904-907 | function |

### Tree-sitter - Command Classes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| um2 | SimpleCommand | chunks.123.mjs:695-732 | class |
| mm2 | RichCommand | chunks.123.mjs:768-807 | class |
| cK1 | shellCommandParser | chunks.123.mjs:826-841 | object |

### Tree-sitter - Global Variables

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DEA | globalParser | chunks.123.mjs:680 | variable |
| GfA | globalBashLanguage | chunks.123.mjs:682 | variable |
| wq0 | initPromise | chunks.123.mjs:684 | variable |
| Un5 | MAX_COMMAND_LENGTH | chunks.123.mjs:670 | constant |
| Nq0 | COMMAND_NODE_TYPES | chunks.123.mjs:678 | constant |
| qn5 | DECLARATION_KEYWORDS | chunks.123.mjs:672 | constant |
| Nn5 | ARGUMENT_TYPES | chunks.123.mjs:674 | constant |
| wn5 | SUBSTITUTION_TYPES | chunks.123.mjs:676 | constant |

### Tokenization (chunks.147.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ZfA | tokenizeCommand | chunks.147.mjs:765-817 | function |
| Hx | extractOutputRedirections | chunks.147.mjs:909-957 | function |
| DJ9 | getEscapeMarkers | chunks.147.mjs:~700 | function |
| IP0 | extractHeredocs | chunks.147.mjs:~720 | function |
| YJ9 | reconstructHeredocs | chunks.147.mjs:~750 | function |

### File Attachment Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TL0 | processFileAttachment | chunks.132.mjs:3-85 | function |
| X4 | createAttachment | chunks.132.mjs:87-94 | function |
| xL0 | getPlanFileReference | chunks.132.mjs:688-697 | function |
| $97 | getInvokedSkillsAttachment | chunks.132.mjs:699-711 | function |
| C97 | getBackgroundTaskAttachments | chunks.132.mjs:713-729 | function |

### Ripgrep Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| gy | executeRipgrep | chunks.5.mjs:1049-1091 | function |
| ZpA | getRipgrepConfig | chunks.5.mjs:1159-1181 | function |
| Xs0 | getRipgrepStatus | chunks.5.mjs:1101-1108 | function |
| yA4 | ensureRipgrepAvailable | chunks.5.mjs:1110-1128 | function |

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
| Code Indexing | ✅ Complete (v2.1.7) | P1 |
| MCP Auto-Search | Locations found | P2 |
| OAuth Updates | Endpoints documented | P3 |
| All others | TBD | P3+ |

---

## See Also

- [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution modules (Agent Loop, Tools, LLM API)
- [symbol_index_core_features.md](./symbol_index_core_features.md) - Core feature modules (Plan Mode, Hooks, Skills)
- [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infrastructure (MCP, Permissions, Auth)
- [file_index.md](./file_index.md) - File content index
- [changelog_analysis.md](./changelog_analysis.md) - Version changes
