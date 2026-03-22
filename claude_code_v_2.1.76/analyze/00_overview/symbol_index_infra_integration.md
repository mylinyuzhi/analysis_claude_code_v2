# Symbol Index - Integration Infrastructure (Claude Code 2.1.76)

> Symbol mapping table Part 4: External integrations and UI components
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.

---

## Quick Navigation

- [Agent SDK Transport](#module-agent-sdk-transport) - **DEEP ANALYSIS**
- [Tool UI Rendering](#module-tool-ui-rendering) - **NEW (full analysis)**
- [LSP Integration](#module-lsp-integration) - **NEW in 2.1.20**
- [Browser Control](#module-browser-control) - **NEW in 2.1.25**
- [IDE Integration](#module-ide-integration)
- [UI Components](#module-ui-components)
- [Plugin System](#module-plugin-system)
- [Code Indexing](#module-code-indexing)
- [Shell Parser](#module-shell-parser)
- [Slash Commands](#module-slash-commands)

---

## Module: Agent SDK Transport

> Full analysis: [20_sdk/](../20_sdk/)
> Deep reverse engineering of the NDJSON streaming protocol, WebSocket transport, and UI linkage.

### SDK I/O Transport Classes (chunks.184.mjs, chunks.185.mjs, chunks.187.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| so6 | StdioStreamIO | chunks.184.mjs:1942-2220 | class (base NDJSON transport over stdio; owns Pi6 outbound queue) |
| AI1 | RemoteStreamIO | chunks.185.mjs:672-780 | class (extends so6; bridges selected transport → PassThrough stream; uses URq to select WebSocket/Hybrid/SSE) |
| to6 | WebSocketTransport | chunks.184.mjs:2298-2762 | class (WebSocket connection with reconnect, message buffer, ping/pong) |
| eo6 | HybridTransport | chunks.184.mjs:2762-2870 | class (extends to6; reads via WS, writes stream_event via HTTP POST batch; owns Y26 BatchQueue) |
| z26 | SSETransport | chunks.184.mjs | class (SSE-based transport for CCR v2 protocol) |
| URq | getTransportForUrl | chunks.185.mjs:296 | function (selects to6/eo6/z26 based on URL and env vars for RemoteStreamIO) |
| UXz | createStreamIO | chunks.187.mjs:1467-1481 | function (factory: selects StdioStreamIO or RemoteStreamIO based on sdkUrl option) |
| jc1 | handlePermissionPromptToolResult | chunks.184.mjs:989-1010 | function (processes MCP tool permission result; handles allow/deny/interrupt) |
| oGz | streamJsonInputHandler | chunks.189.mjs:984-997 | function (routes stdin → stream; text mode buffers, stream-json mode returns raw stream) |
| createHookCallback | createHookCallback | chunks.184.mjs:2167-2184 | method (on StdioStreamIO: creates callback wrapper for SDK hook execution via control_request) |
| handleElicitation | handleElicitation | chunks.184.mjs:2185-2201 | method (on StdioStreamIO: sends structured elicitation control_request; awaits user input response) |
| createSandboxAskCallback | createSandboxAskCallback | chunks.184.mjs:2202-2220 | method (on StdioStreamIO: creates callback for sandbox permission decisions via control_request) |
| sendMcpMessage | sendMcpMessage | chunks.184.mjs | method (on StdioStreamIO: sends MCP message through SDK control channel) |
| CJz | initializeSession | chunks.187.mjs | function (processes initialize control request, registers hooks/agents/schema) |
| hJz | handleSessionResume | chunks.187.mjs | function (handles --continue/--resume/--teleport for print mode) |
| Ev6 | outputError | chunks.187.mjs | function (formats error output for SDK mode; stream-json vs text) |
| SJz | setPermissionMode | chunks.187.mjs | function (sets permission mode from SDK request) |
| $Jz | tryPermissionHookFirst | chunks.184.mjs | function (attempts hook-based permission before prompt) |

### SDK MCP Transport (chunks.144.mjs, chunks.145.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wCA | SdkMcpTransport | chunks.144.mjs:1747-1768 | class (MCP transport for SDK mode; routes through sendMcpMessage) |
| io4 | initializeSdkMcpClients | chunks.145.mjs:1769-1832 | function (initializes MCP clients from SDK configuration) |
| rH6 | McpClient | chunks.145.mjs | class (MCP client for tool discovery and execution) |
| wI | discoverMcpTools | chunks.145.mjs | function (discovers tools from connected MCP servers) |

### WebSocket Transport Constants (chunks.184.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| OJz | WS_MESSAGE_BUFFER_SIZE | chunks.184.mjs:2517 | constant (1000: circular buffer capacity for message replay) |
| _Jz | WS_BASE_BACKOFF_MS | chunks.184.mjs:2519 | constant (1000: initial reconnection backoff in ms) |
| JJz | WS_MAX_BACKOFF_MS | chunks.184.mjs:2521 | constant (30000: max reconnection backoff cap in ms) |
| XJz | WS_MAX_RECONNECT_DURATION_MS | chunks.184.mjs:2523 | constant (600000: total reconnection time budget, 10 minutes) |
| IDz | STREAM_EVENT_BUFFER_TIMEOUT_MS | chunks.184.mjs | constant (100: ms to buffer stream_event before HTTP POST flush in HybridTransport) |
| bDz | HYBRID_FLUSH_TIMEOUT_MS | chunks.184.mjs | constant (15000: per-batch HTTP POST timeout for HybridTransport) |
| xDz | HYBRID_CLOSE_FLUSH_TIMEOUT_MS | chunks.184.mjs | constant (3000: close flush timeout for graceful HybridTransport shutdown) |
| dz | AbortError | chunks.10.mjs:1232 | class (thrown when sendRequest is cancelled via AbortSignal) |
| wJz | generateRequestId | cli.chunks.mjs:6315 | function (randomUUID, generates UUID for control request correlation) |

### Stream Event Processing (chunks.173.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iW1 | handleStreamEvent | chunks.173.mjs:390-488 | function (central dispatcher: stream_event → UI state transitions, text/tool/thinking callbacks) |

### Outbound Queue Classes (chunks.145.mjs, chunks.184.mjs)

> Full analysis: [20_sdk/sdk_outbound_queue.md](../20_sdk/sdk_outbound_queue.md)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Pi6 | AsyncQueue | chunks.145.mjs:2959 | class (async-iterable FIFO queue; StdioStreamIO outbound buffer and runHeadless output collector) |
| so6 | StdioStreamIO | chunks.184.mjs:1942 | class (owner of AsyncQueue outbound; primary definition in chunks.184.mjs) |
| BXz | runHeadless | chunks.145.mjs | function (non-interactive execution loop; uses AsyncQueue to collect all output messages) |
| Y26 | BatchQueue | chunks.184.mjs:2642 | class (HTTP POST batch uploader with backpressure, retry, and exponential backoff) |
| eo6 | HybridTransport | chunks.184.mjs | class (owns BatchQueue uploader for telemetry/event delivery) |
| MV6 | RetryAfterError | chunks.184.mjs:2731 | class (Error subclass with retryAfterMs field; signals server-directed retry delay) |
| uDz | computePostUrl | chunks.184.mjs:2740 | function (converts wss://host/ws/<id> → https://host/session/<id>/events) |

---

## Module: Tool UI Rendering

> Full analysis: [05_tools/ui_rendering.md](../05_tools/ui_rendering.md)

### Tool Result Rendering Infrastructure (chunks.130.mjs)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| SfY | renderToolUseResult | chunks.130.mjs:3 | function (React component) |
| tx4 | renderToolUseSummary | chunks.130.mjs:91 | function (React component) |
| rK1 | StatusIndicator | chunks.130.mjs | component |
| z5 | ToolResultDisplay | chunks.130.mjs | component |

### Edit Tool UI Renderers (chunks.134.mjs)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| IF4 | renderEditToolUseMessage | chunks.134.mjs:1234 | function |
| xF4 | renderEditToolProgress | chunks.134.mjs:1246 | function |
| bF4 | renderEditToolResult | chunks.134.mjs:1250 | function |
| uF4 | renderEditToolRejected | chunks.134.mjs:1271 | function |
| BF4 | renderEditToolError | chunks.134.mjs:1320 | function |
| SP6 | DiffViewer | chunks.134.mjs | component |
| ZW1 | EditPreview | chunks.134.mjs | component |
| AE | FilePathBreadcrumb | chunks.134.mjs | component |

### NotebookEdit Tool UI Renderers (chunks.134.mjs)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| sF4 | renderNotebookEditUseMessage | chunks.134.mjs | function |
| tF4 | renderNotebookEditRejected | chunks.134.mjs | function |
| eF4 | renderNotebookEditError | chunks.134.mjs | function |
| AQ4 | renderNotebookEditProgress | chunks.134.mjs | function |
| qQ4 | renderNotebookEditResult | chunks.134.mjs | function |

### Grep Tool UI Renderers (chunks.76.mjs)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| OR7 | renderGrepToolUseMessage | chunks.76.mjs | function |
| DR7 | renderGrepToolResultMessage | chunks.76.mjs | function |

### Bash Tool UI Renderers (chunks.150.mjs / chunks.162.mjs)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| BYq | BashOutputComponent | chunks.162.mjs:417249 | component |
| ZhA | bashProgressHandler | chunks.150.mjs:2332 | function (generator) |

---

## Module: LSP Integration

> Full analysis: [27_lsp_integration/](../27_lsp_integration/)

### Core Layer (chunks.133.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| um4 | createLspProcessWrapper | chunks.133.mjs:1614 | function |
| Fm4 | createLspClient | chunks.133.mjs:1785 | function |
| HvY | loadPluginLspConfig | chunks.133.mjs:1980 | function |
| GP6 | vscode_languageserver_protocol | chunks.133.mjs:881 | library |
| Zm4 | vscode_jsonrpc | chunks.133.mjs:3 | library |
| lm4 | LspServerManager | chunks.133.mjs:2172 | function |
| dm4 | loadLspConfigs | chunks.133.mjs:2144 | function |
| om4 | registerDiagnostics | chunks.133.mjs:2350 | function |
| sm4 | checkDiagnosticsRegistry | chunks.133.mjs:2412 | function |
| em4 | registerNotificationHandlers | chunks.133.mjs:2532 | function |
| tm4 | clearPendingDiagnostics | chunks.133.mjs:2459 | function |
| NP6 | clearDeliveredDiagnosticsForUri | chunks.133.mjs:2463 | function |
| nm4 | LSP_MAX_DIAGNOSTICS_TOTAL | chunks.133.mjs:2469 | constant (30) |
| VP6 | LSP_MAX_DIAGNOSTICS_PER_FILE | chunks.133.mjs:2467 | constant (10) |
| WvY | convertDiagnosticUriToPath | chunks.133.mjs:2502 | function |
| jvY | deduplicateDiagnostics | chunks.133.mjs:2388 | function |
| OvY | expandPluginRootVar | chunks.133.mjs:2079 | function |
| _vY | expandLspConfigVars | chunks.133.mjs:2083 | function |
| JvY | namespacePluginServers | chunks.133.mjs:2114 | function |
| Um4 | loadSinglePluginLspConfig | chunks.133.mjs:2127 | function |
| $vY | resolvePluginLspServersField | chunks.133.mjs:2017 | function |
| wvY | safePluginRelativePath | chunks.133.mjs:1972 | function |
| qvY | CONTENT_MODIFIED_ERROR_CODE | chunks.133.mjs:1959 | constant (-32801) |
| fkA | LSP_MAX_RETRIES | chunks.133.mjs:1961 | constant (3) |
| KvY | LSP_RETRY_BASE_DELAY_MS | chunks.133.mjs:1963 | constant (500) |
| VP6 | LSP_MAX_DIAGNOSTICS_PER_FILE | chunks.133.mjs:2467 | constant (10) |
| nm4 | LSP_MAX_DIAGNOSTICS_TOTAL | chunks.133.mjs:2469 | constant (30) |
| DvY | LSP_DIAGNOSTICS_LRU_SIZE | chunks.133.mjs:2471 | constant (500) |
| cQ1 | pendingDiagnosticsMap | chunks.133.mjs:2473 | variable (Map) |
| MW1 | deliveredDiagnosticsLru | chunks.133.mjs:2475 | variable (LRU Map) |
| startupTimeout | startupTimeout | chunks.133.mjs | config key (LSP server startup timeout) |

### LSP Helpers (chunks.144.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| x1q | isDefinitionLink | chunks.144.mjs:111 | function (checks if LSP result has targetUri) |
| KF8 | formatDefinitionNotFound | chunks.144.mjs:115 | function |

### Singleton Manager (chunks.133.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KF4 | initializeLspServerManager | chunks.133.mjs:2641 | function |
| YF4 | shutdownLspServerManager | chunks.133.mjs:2658 | function |
| md | getLspManager | chunks.133.mjs:2615 | function |
| W51 | getLspManagerStatus | chunks.133.mjs:2620 | function |
| qF4 | waitForLspManager | chunks.133.mjs:2636 | function |
| jI | lspManagerInstance | chunks.133.mjs:2669 | variable (singleton) |
| ev | lspManagerState | chunks.133.mjs:2671 | variable ("not-started"\|"pending"\|"success"\|"failed") |
| vP6 | lspManagerLastError | chunks.133.mjs:2673 | variable |
| TP6 | lspInitGeneration | chunks.133.mjs:2675 | variable (number) |
| EP6 | lspInitPromise | chunks.133.mjs:2677 | variable (Promise) |

### LSP Tool (chunks.140.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vRA | LspTool | chunks.140.mjs:698 | object (tool) |
| VRA | LSP_TOOL_NAME | chunks.140.mjs:226 | constant ("LSP") |
| NRA | LSP_TOOL_DESCRIPTION | chunks.140.mjs:228 | constant (string) |
| ECY | lspInputSchema | chunks.140.mjs:687 | variable (Zod lazy) |
| kCY | lspOutputSchema | chunks.140.mjs:692 | variable (Zod lazy) |
| Dd4 | lspInputSchemaStrict | chunks.140.mjs:732 | variable (referenced) |
| LCY | buildLspRequestParams | chunks.140.mjs:454 | function |
| yCY | formatLspResult | chunks.140.mjs:567 | function |
| NCY | LspResultSummaryComponent | chunks.140.mjs:285 | component |
| VCY | OPERATION_LABELS | chunks.140.mjs:413 | constant (object) |
| Cd4 | renderLspToolUseMessage | chunks.140.mjs:347 | function |
| Sd4 | renderLspToolUseRejectedMessage | chunks.140.mjs:366 | function |
| hd4 | renderLspToolUseErrorMessage | chunks.140.mjs:370 | function |
| Id4 | renderLspToolUseProgressMessage | chunks.140.mjs:382 | function |
| xd4 | renderLspToolResultMessage | chunks.140.mjs:386 | function |
| Ld4 | extractSymbolAtPosition | chunks.140.mjs:248 | function |
| Zd4 | formatFindReferencesResult | chunks.140.mjs:3 | function |
| fd4 | formatHoverResult | chunks.140.mjs:40 | function |
| Nd4 | formatDocumentSymbolResult | chunks.140.mjs:96 | function |
| fRA | formatWorkspaceSymbolResult | chunks.140.mjs:107 | function |
| Vd4 | formatSymbolHierarchy | chunks.140.mjs:84 | function |
| ZRA | formatGoToDefinitionResult | chunks.140.mjs:575 | function (referenced) |
| ud4 | normalizeLocation | chunks.140.mjs:559 | function |
| RCY | isLocationLink | chunks.140.mjs:555 | function |
| cW1 | symbolKindToString | chunks.140.mjs:53 | function |
| Td4 | formatCallHierarchyResult | chunks.140.mjs:629 | function (referenced) |
| vd4 | formatIncomingCallsResult | chunks.140.mjs:635 | function (referenced) |
| Ed4 | formatOutgoingCallsResult | chunks.140.mjs:187 | function |
| Bd4 | countHierarchicalSymbols | chunks.140.mjs:544 | function |
| CW6 | countUniqueFiles | chunks.140.mjs:551 | function |
| CCY | countCallHierarchyFiles | chunks.140.mjs:654 | function |
| SCY | countIncomingCallerFiles | chunks.140.mjs:659 | function |
| hCY | countOutgoingCalleeFiles | chunks.140.mjs:664 | function |
| vCY | pathToFileUrl | chunks.140.mjs:455 | function (referenced) |
| TRA | nodePathModule | chunks.140.mjs:800 | variable (path module) |
| TCY | readFileForLsp | chunks.140.mjs:796 | function (referenced) |
| yd4 | getLspUserFacingName | chunks.140.mjs:343 | function |

### Diagnostics Attachment (chunks.142.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WIY | getLSPDiagnosticAttachments | chunks.142.mjs:2473 | function |

### LSP Config Schema (chunks.15.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ew1 | lspServerConfigSchema | chunks.15.mjs:274 | object (Zod strictObject) |
| ZOK | fileExtensionSchema | chunks.15.mjs:272 | variable (Zod string) |
| fOK | pluginLspServersSchema | chunks.15.mjs:295 | object (Zod) |

---

## Module: Browser Control (Chrome)

> Full analysis: [28_browser_control/](../28_browser_control/)

### MCP Config & Server (chunks.166.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| HBA | getChromeMcpConfig | chunks.166.mjs:1351 | function |
| KBA | createChromeMcpServer | chunks.166.mjs:1127 | function |
| vHq | handleToolCall | chunks.166.mjs:1100 | function (arrow) |
| kHq | selectBridgeClient | chunks.166.mjs:1123 | function |
| YKz | executeBridgeTool | chunks.166.mjs:970 | function |
| qBA | buildDisconnectedResponse | chunks.166.mjs:1038 | function |
| zKz | setPermissionModeHandler | chunks.166.mjs:1047 | function |
| wKz | switchBrowserHandler | chunks.166.mjs:1060 | function |
| HKz | isAuthenticationError | chunks.166.mjs:1092 | function |
| YBA | getChromeSystemPrompt | chunks.166.mjs:1175 | function |
| NHq | createSocketPoolClient | chunks.166.mjs:962 | function |
| LHq | initChromeMcpDeps | chunks.166.mjs:1159 | variable (init fn) |
| QN6 | initChromeMcpCore | chunks.166.mjs:1169 | variable (init fn) |

### Feature Flags & Detection (chunks.166.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| UN6 | isClaudeInChromeEnabled | chunks.166.mjs:1335 | function |
| cZ1 | isAutoEnableEnabled | chunks.166.mjs:1346 | function |
| WKz | isExtensionInstalledCached | chunks.166.mjs:1475 | function |
| Ec | detectChromeExtension | chunks.166.mjs:1484 | function |
| SHq | detectExtensionInPaths | chunks.166.mjs:1287 | function |
| hHq | isExtensionInPaths | chunks.166.mjs:1327 | function |
| _Kz | getExtensionIds | chunks.166.mjs:1283 | function |
| MKz | getNativeHostPaths | chunks.166.mjs:1396 | function |

### Native Host Installation (chunks.166.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bHq | installNativeHostManifest | chunks.166.mjs:1407 | function |
| uHq | createNativeHostWrapper | chunks.166.mjs:1455 | function |
| PKz | registerWindowsNativeHost | chunks.166.mjs:1440 | function |

### Constants (chunks.166.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| OKz | CHROME_EXTENSION_ID | chunks.166.mjs:1331 | constant (`fcoeoabgfenejglbffodgkkbkcdhcgfn`) |
| wBA | NATIVE_HOST_NAME | chunks.166.mjs:1492 | constant (`com.anthropic.claude_code_browser_extension`) |
| jKz | RECONNECT_URL | chunks.166.mjs:1490 | constant (`https://clau.de/chrome/reconnect`) |
| xHq | MANIFEST_FILENAME | chunks.166.mjs:1510 | constant (`com.anthropic.claude_code_browser_extension.json`) |
| gN6 | autoEnableCache | chunks.166.mjs:1496 | variable (undefined \| boolean) |
| QHq | CHROME_SETTINGS_MODULE | chunks.166.mjs:1513 | constant (module exports) |
| RHq | CHROME_SYSTEM_PROMPT_ALT | chunks.166.mjs:1224 | constant (string) |
| yHq | CHROME_SKILL_BRIEF | chunks.166.mjs:1271 | constant (string) |
| zBA | CHROME_SYSTEM_REMINDER | chunks.166.mjs:1281 | constant (string) |

### UI Components (chunks.166.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| VKz | ChromeOnboarding | chunks.166.mjs:1515 | function/component |
| LKz | chromeSettingsLoader | chunks.166.mjs:1710 | function (async) |
| RKz | chromeSettingsMeta | chunks.166.mjs:1748 | object (command meta) |
| UHq | chromeSettingsMetaAlias | chunks.166.mjs:1756 | variable (alias of RKz) |
| kKz | getMcpClients | chunks.166.mjs:1696 | function (state selector) |
| EKz | isChromeClientConnected | chunks.166.mjs:1692 | function (filter) |
| NKz | stepIncrPermissions | chunks.166.mjs:1680 | function (`A+1`) |
| TKz | stepIncrReconnect | chunks.166.mjs:1684 | function (`A+1`) |
| vKz | stepIncrInstall | chunks.166.mjs:1688 | function (`A+1`) |
| gHq | initChromeUiDeps | chunks.166.mjs:1725 | variable (init fn) |
| GKz | CHROME_INSTALL_URL | chunks.166.mjs:1704 | constant (`https://claude.ai/chrome`) |
| ZKz | CHROME_PERMISSIONS_URL | chunks.166.mjs:1706 | constant (`https://clau.de/chrome/permissions`) |
| fKz | CHROME_RECONNECT_URL_UI | chunks.166.mjs:1708 | constant (`https://clau.de/chrome/reconnect`) |
| pHq | initChromeSettingsModule | chunks.166.mjs:1746 | variable (init fn) |

### Browser Registry & Paths (chunks.143.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| mg1 | BROWSER_CONFIG | chunks.143.mjs:1743 | object (7-browser registry) |
| DG6 | SUPPORTED_BROWSERS | chunks.143.mjs:1864 | constant (array of 7 browser names) |
| jxY | browserOpenListeners | chunks.143.mjs:1865 | variable (Set) |
| Zn4 | getBrowserDataPaths | chunks.143.mjs:1546 | function |
| fn4 | getNativeHostPathsPerBrowser | chunks.143.mjs:1580 | function |
| Vn4 | getWindowsRegistryPaths | chunks.143.mjs:1607 | function |
| DxY | detectInstalledBrowser | chunks.143.mjs:1619 | function |
| jG6 | openBrowserToUrl | chunks.143.mjs:1660 | function |
| KG1 | isChromeMcpServer | chunks.143.mjs:1652 | function |
| Nn4 | addBrowserOpenListener | chunks.143.mjs:1656 | function |
| qy | CHROME_MCP_SERVER_NAME | chunks.143.mjs:1730 | constant (`"claude-in-chrome"`) |
| Fg1 | getTempSocketDir | chunks.143.mjs:1693 | function |
| MG6 | getChromeMcpSocketPath | chunks.143.mjs:1696 | function |
| Tn4 | getChromeMcpSocketPaths | chunks.143.mjs:1701 | function |
| vn4 | getSocketPipeName | chunks.143.mjs:1718 | function |
| byA | getUsername | chunks.143.mjs:1722 | function |

### Bridge Clients (chunks.165.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ouA | WebSocketBridgeClient | chunks.165.mjs:2050 | class |
| auA | createWebSocketBridgeClient | chunks.165.mjs:2606 | function |
| ZHq | UnixSocketClient | chunks.165.mjs:1822 | class |
| FN6 | createUnixSocketClient | chunks.165.mjs:2031 | function |
| Hf | SocketConnectionError | chunks.165.mjs:2038 | class |
| Gd1 | initSocketError | chunks.165.mjs:2037 | variable (init fn) |
| KKz | EXTENSIONS_LIST_TIMEOUT | chunks.165.mjs:2610 | constant (5000ms) |
| fHq | PEER_CONNECTED_WAIT_TIMEOUT | chunks.165.mjs:2612 | constant (10000ms) |
| suA | initBridgeClientDeps | chunks.165.mjs:2614 | variable (init fn) |
| ruA | getPlatformString | chunks.165.mjs:2046 | function |
| mt | WebSocket | chunks.165.mjs (imported) | class (ws library) |
| AKz | isToolResultMessage | chunks.165.mjs:1814 | function |
| qKz | isNotificationMessage | chunks.165.mjs:1818 | function |

### Socket Pool Client (chunks.166.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| VHq | SocketPoolClient | chunks.166.mjs:791 | class |
| NHq | createSocketPoolClient | chunks.166.mjs:962 | function |
| THq | initSocketPoolDeps | chunks.166.mjs:966 | variable (init fn) |

---

## Module: Shell Parser

> Full analysis: [29_shell_parser/](../29_shell_parser/)
>
> **NOTE:** This section was corrected in v2.1.76 analysis. Previous documentation incorrectly
> mapped symbols to chunks.149/150/169.mjs. The actual shell parser code is in chunks.91.mjs
> (security checks), chunks.171.mjs (parsing), and chunks.56.mjs (heredoc extraction).

### Tokenization & Parsing (chunks.171.mjs, chunks.56.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bW6 | parseShellCommand | chunks.171.mjs:1139 | function (sentinel-based tokenization with heredoc handling) |
| EO | extractSubcommands | chunks.171.mjs:1202 | function (removes redirections, returns cleaned subcommand list) |
| ca | extractHeredocs | chunks.56.mjs:945 | function (extracts heredoc blocks, replaces with placeholders) |
| iGq | generateSentinels | chunks.171.mjs:1121 | function (creates random hex placeholder strings) |
| yu3 | generateRandomHex | chunks.56.mjs:941 | function (generates 16-char random hex string for heredoc placeholders) |
| M9z | isSimplePath | chunks.171.mjs:1132 | function (checks if redirection target is safe) |
| D9z | filterSeparatorTokens | chunks.171.mjs:1198 | function (filters out &&, \|\|, ;, ;;, \|, >&, >, >>) |
| X9z | isSimpleHelpCommand | chunks.171.mjs:1230 | function (checks if command is simple --help request) |
| ik | extractRedirections | chunks.171.mjs:1301 | function (analyzes all redirections, classifies safe/dangerous) |
| f9z | checkDangerousRedirection | chunks.171.mjs:1384 | function (per-redirection risk assessment) |
| xh | isSafeRedirectionTarget | chunks.171.mjs:1369 | function (checks if target has no shell specials) |
| CN | containsVariable | chunks.171.mjs:1374 | function (checks if token contains $, %, or glob chars) |
| MH | isOperator | chunks.171.mjs:1365 | function (checks if token is specific operator type) |
| ch1 | handleFdRedirect | chunks.171.mjs:1537 | function (handles file descriptor redirect analysis) |
| rGq | COMMAND_SEPARATOR_OPS | chunks.171.mjs:1759 | constant (Set: &&, \|\|, ;, ;;, \|) |
| W9z | ALL_REDIRECT_OPS | chunks.171.mjs:1759 | constant (rGq + >&, >, >>) |
| $9z | SHELL_INTERPRETERS | chunks.171.mjs:1118 | constant (Set: sh, bash, zsh, fish, etc.) |
| hN6 | FILE_DESCRIPTOR_SET | chunks.171.mjs:1749 | constant (Set: "0", "1", "2" for stdin/stdout/stderr) |

### LLM Prefix Extraction (chunks.171.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nGq | bashPreFlightCheck | chunks.171.mjs:1750 | function (created via QGq; LLM-based prefix extraction) |
| pr6 | extractPrefixCached | chunks.171.mjs:1758 | function (created via UGq; memoized wrapper for nGq) |
| QGq | createPrefixExtractor | chunks.171.mjs:977 | function (factory for prefix extraction with policy spec) |
| UGq | createMemoizedPrefix | chunks.171.mjs:993 | function (memoization wrapper for prefix extraction) |
| f3q | clearPrefixCaches | chunks.171.mjs:1248 | function (clears nGq.cache and pr6.cache) |

### Security Pipeline (chunks.91.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| O01 | runSecurityChecksAsync | chunks.91.mjs:2272 | function (async; master security validation with tree-sitter) |
| Rp6 | runSecurityChecksSync | chunks.91.mjs:2209 | function (sync; security validation without tree-sitter) |
| zg9 | parseCommandTreeSitter | chunks.91.mjs:1104 | function (alias to O01; entry point name used in docs) |
| w3 | SECURITY_CHECK_IDS | chunks.91.mjs:2394 | constant (enum object with 23 check IDs) |
| wg9 | DANGEROUS_PATTERNS | chunks.91.mjs:2361 | constant (array of 11 pattern+message objects) |
| lV8 | HEREDOC_IN_SUBSTITUTION_PATTERN | chunks.91.mjs:2361 | constant (regex: /\$\(.*<</) |

### Allow-List Security Checks (chunks.91.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| uY4 | checkEmptyCommand | chunks.91.mjs:1224 | function (allows empty commands) |
| mY4 | checkIncompleteCommand | chunks.91.mjs:1241 | function (detects fragments: tab, flag, operator prefix) |
| gY4 | checkHeredocInSubstitution | chunks.91.mjs:1411 | function (allows $(cat <<'EOF') patterns) |
| Hg9 | isQuotedHeredocInSubstitution | chunks.91.mjs:1272 | function (validates heredoc-in-$() safety) |
| FY4 | checkGitCommitMessage | chunks.91.mjs:1435 | function (git commit -m "..." safety logic) |

### Deny-List Security Checks (chunks.91.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pY4 | checkJqCommand | chunks.91.mjs:1507 | function (jq system() and file flag detection) |
| rY4 | checkObfuscatedFlags | chunks.91.mjs:1759 | function (ANSI-C quoting, locale quoting, quoted flags) |
| QY4 | checkShellMetacharacters | chunks.91.mjs:1537 | function (;, \|, & in quoted arguments) |
| UY4 | checkDangerousVariables | chunks.91.mjs:1568 | function ($VAR in redirection/pipe contexts) |
| w01 | checkNewlines | chunks.91.mjs:1635 | function (embedded newlines as command separators) |
| lY4 | checkIFSInjection | chunks.91.mjs:~1700 | function ($IFS manipulation detection) |
| iY4 | checkProcEnviron | chunks.91.mjs:1716 | function (/proc/*/environ access) |
| dY4 | checkDangerousPatterns | chunks.91.mjs:1585 | function (backticks, $(), ${}, <(), >()) |
| _01 | checkRedirections | chunks.91.mjs:1611 | function (< and > in unquoted content) |
| nY4 | checkMalformedTokenInjection | chunks.91.mjs:1733 | function (tokenizer-based unbalanced bracket detection) |
| oY4 | checkBackslashEscapedWhitespace | chunks.91.mjs:1916 | function (backslash before whitespace) |
| sY4 | checkBraceExpansion | chunks.91.mjs:1978 | function (brace expansion patterns: {a,b}, {1..3}) |
| tY4 | checkUnicodeWhitespace | chunks.91.mjs:2040 | function (non-ASCII whitespace chars) |
| eY4 | checkMidWordHash | chunks.91.mjs:2056 | function (# in middle of word) |
| Kz4 | checkZshDangerousCommands | chunks.91.mjs:2179 | function (zmodload, emulate, sysopen, etc.) |
| aY4 | checkBackslashEscapedOperators | chunks.91.mjs:1954 | function (backslash before ;, \|, &, <, >) |
| Az4 | checkCommentQuoteDesync | chunks.91.mjs:2075 | function (quote inside # comment) |
| qz4 | checkQuotedNewline | chunks.91.mjs:2129 | function (quoted newline + # pattern) |
| cY4 | checkExcessClosingBraces | chunks.91.mjs:1656 | function (unbalanced braces after quote strip) |

### Quote Stripping Helpers (chunks.91.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bY4 | stripQuotes | chunks.91.mjs:1167 | function (dual-mode: withDoubleQuotes + fullyUnquoted) |
| xY4 | stripRedirections | chunks.91.mjs:1206 | function (removes safe redirect patterns) |
| $g9 | hasUnescapedChar | chunks.91.mjs:1210 | function (checks for unescaped char in string) |
| jg9 | hasBackslashEscapedWhitespace | chunks.91.mjs:1891 | function (detects \ before space/tab in unquoted context) |
| Mg9 | hasBackslashEscapedOperator | chunks.91.mjs:1929 | function (detects \ before ;, \|, &, <, >) |
| n36 | isEscapedBrace | chunks.91.mjs:1971 | function (checks if brace at position is escaped) |

### Pre-Check (chunks.42.mjs, chunks.10.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| X38 | hasSingleQuotedBackslashBypass | chunks.42.mjs:531 | function (detects 'a\' bypass pattern) |
| CY8 | hasSingleQuotedBackslashBypass | chunks.10.mjs:1031 | function (alias/duplicate; X38 is primary) |

### Security Constants (chunks.91.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Og9 | ZSH_DANGEROUS_COMMANDS | chunks.91.mjs:2394 | Set (zmodload, emulate, sysopen, zpty, etc.) |
| Jg9 | SHELL_OPERATORS | chunks.91.mjs:2419 | Set (;, \|, &, <, >) |
| Dg9 | UNICODE_WHITESPACE_REGEX | chunks.91.mjs:2420 | RegExp (non-ASCII whitespace chars) |
| Yz4 | CONTROL_CHARACTERS_REGEX | chunks.91.mjs:2421 | RegExp (non-printable control chars \x00-\x08, etc.) |

### Permission Checking (chunks.172.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Tn8 | checkBashPermissions | chunks.172.mjs:1930 | function (async; main Bash tool permission checker) |
| dr6 | runBashSecurityChecks | chunks.172.mjs | function (security validation called from Tn8) |
| vfq | analyzeSubcommands | chunks.172.mjs | function (compound command analysis) |
| PYz | checkCdGitCompound | chunks.172.mjs:1312 | function (cd+git security check) |

### Progress Throttling (chunks.146.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Zi6 | progressCache | chunks.146.mjs:1341 | variable (Map: toolUseID → lastEmitTime) |
| yxY | PROGRESS_THROTTLE_INTERVAL_MS | chunks.146.mjs:1325 | constant (30000 = 30 seconds) |
| ExY | MAX_PROGRESS_CACHE_SIZE | chunks.146.mjs:1323 | constant (100 entries) |

---

## Module: Code Indexing

> Full analysis: [14_code_indexing/](../14_code_indexing/)
> UI linkage: [14_code_indexing/ui_linkage.md](../14_code_indexing/ui_linkage.md)

### Indexing Core (chunks.152.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| LiY | getFileIndex | chunks.152.mjs:1007 | function (lazy singleton Rust FileIndex loader) |
| xiY | rebuildIndex | chunks.152.mjs:1164 | function (master rebuild: scan + load Rust/Fuse index) |
| SiY | getFilesUsingGit | chunks.152.mjs:1077 | function (git ls-files + background untracked fetch) |
| uiY | searchFileIndex | chunks.152.mjs:1226 | function (dual-mode: Rust then Fuse.js fallback) |
| OIA | refreshIndexCache | chunks.152.mjs:1275 | function (TTL guard + async rebuild trigger) |
| IiY | getProjectFiles | chunks.152.mjs:1148 | function (dispatcher: git → ripgrep fallback) |
| hiY | getNonProjectFiles | chunks.152.mjs:1144 | function (fetch files from workspace folder sources) |
| BAq | loadIgnorePatterns | chunks.152.mjs:1055 | function (.ignore/.rgignore loader with key cache) |
| gAq | getFileSuggestions | chunks.152.mjs:1300 | function (main @-mention entry point with cache management) |
| tU1 | formatFileSuggestion | chunks.152.mjs:1216 | function (path → {id:"file-${path}", displayText, metadata}) |
| CiY | mergeUntrackedIntoIndex | chunks.152.mjs:~1120 | function (hot-merges background untracked files into live index) |
| uAq | makeRelativePaths | chunks.152.mjs:~1090 | function (normalizes git absolute paths to project-relative) |
| yiY | isGitRepository | chunks.152.mjs:~1050 | function (cached git repo check) |
| BiY | listCurrentDirectory | chunks.152.mjs:~1295 | function (fs.readdir for empty query branch) |
| DIA | getDirectoriesFromFiles | chunks.152.mjs:~1170 | function (extracts unique parent dirs from file list) |

### Indexing State (chunks.152.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| aU1 | rustFileIndexSingleton | chunks.152.mjs:~1338 | variable (singleton Rust FileIndex instance) |
| Sf6 | fallbackMode | chunks.152.mjs:~1339 | variable (permanent flag: Rust unavailable) |
| sG1 | rustIndex | chunks.152.mjs:1342 | variable (current active Rust index) |
| tG1 | jsFileListCache | chunks.152.mjs:1344 | variable (JS fallback file list) |
| O91 | cacheRefreshPromise | chunks.152.mjs:~1346 | variable (in-flight rebuild promise, dedup guard) |
| jIA | lastCacheTime | chunks.152.mjs:~1348 | variable (epoch ms of last successful rebuild) |
| RiY | CACHE_TTL_MS | chunks.152.mjs:1350 | constant (60000 = 60 seconds) |
| aG1 | MAX_RESULTS | chunks.152.mjs:~1352 | constant (15 = max file suggestions) |
| oG1 | globalTrackedFiles | chunks.152.mjs:~1354 | variable (raw tracked files from last git ls-files) |
| hf6 | untrackedFetchPromise | chunks.152.mjs:~1356 | variable (promise for background untracked file fetch) |
| JIA | lastIgnorePatterns | chunks.152.mjs:~1358 | variable (cached ignore filter object) |
| XIA | lastIgnoreCacheKey | chunks.152.mjs:~1360 | variable ("gitRoot:projectCwd" cache key string) |

### Suggestion Aggregation UI (chunks.182.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| NgA | fileSuggestionsWrapper | chunks.182.mjs:2316 | function (merges file + MCP + agent suggestions with Fuse.js scoring) |
| A0z | getAgentSuggestions | chunks.182.mjs:~2290 | function (builds agent-type suggestion items from agents map) |
| $Gq | formatSuggestion | chunks.182.mjs:~2370 | function (final normalization: ensures id + consistent shape) |
| _Gq | truncateDescription | chunks.182.mjs:~2310 | function (truncates MCP resource description text) |
| VgA | MAX_SUGGESTIONS | chunks.182.mjs:~2316 | constant (max suggestions after cross-source merge) |

### Suggestion List Rendering (chunks.151.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| rU1 | renderSuggestionList | chunks.151.mjs:1758 | function (scrolling list container; viewport 1-6 items) |
| vlY | suggestionItemComponent | chunks.151.mjs:1819 | function (React.memo item renderer with file/MCP/generic branches) |
| ElY | getSuggestionWidth | chunks.151.mjs:~1810 | function (calculates terminal display width of a suggestion) |

### Autocomplete Input Hook (chunks.183.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WGq | useAutocompleteInput | chunks.183.mjs:1 | function (React hook: @-mention autocomplete state manager) |

---

## Module: Plugin System

> Full analysis: [25_plugin_system/](../25_plugin_system/)
> **v2.1.76 Note:** Plugin functions moved from chunks.143.mjs to chunks.94.mjs, chunks.95.mjs, chunks.135.mjs

### Plugin Management (chunks.95.mjs, chunks.94.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _z | getLoadedPlugins | chunks.95.mjs:965 | variable (memoized) |
| h24 | loadPluginManifest | chunks.95.mjs:176 | function |
| N24 | loadPluginHooks | chunks.95.mjs:138 | function (parse hooks.json) |
| sp6 | cachePluginFromSource | chunks.94.mjs:3 | function |
| ip9 | loadMarketplacePlugins | chunks.95.mjs | function |
| rp9 | loadInlinePlugins | chunks.95.mjs:853 | function |
| op9 | deduplicatePlugins | chunks.95.mjs | function |
| M24 | demoteEnterprisePlugins | chunks.95.mjs | function |
| Qv | lookupPluginEntry | chunks.94.mjs:2120 | function (marketplace context) |
| k_4 | getManagedPluginNames | chunks.94.mjs | function |
| AE8 | getBuiltinPlugins | chunks.94.mjs | function |
| e1 | memoize | chunks.94.mjs | function (utility: caches async function results) |
| Qp9 | cloneGitSubdir | chunks.143.mjs:2920 | function (sparse checkout for git-subdir sources) |

### Plugin Hook System (chunks.94.mjs, chunks.135.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nB | loadAllPluginHooks | chunks.94.mjs:824-870 | variable (memoized) |
| nF9 | extractPluginHooksForEvent | chunks.94.mjs:751-790 | function (converts hooksConfig to event-indexed format) |
| d01 | clearPluginHookCache | chunks.94.mjs:792-794 | function (invalidates nB memo + deregisters hooks) |
| oF9 | setupPluginHookHotReload | chunks.94.mjs:806-818 | function (subscribes to policySettings changes) |
| rF9 | resetHotReloadState | chunks.94.mjs:796-800 | function (clears Sk8 guard and U01 hash) |
| l1z | allowManagedHooksOnly | chunks.163.mjs:2537 | function (enterprise policy check) |
| JN1 | executePluginHooksForSession | chunks.135.mjs:1836-1880 | function (SessionStart hook execution) |
| oN1 | executePluginHooksForSetup | chunks.135.mjs:1882-1920 | function (Setup hook execution) |
| KA6 | registerPluginHooks | chunks.94.mjs:872-890 | function (registers hooks into global registry) |
| lu1 | deregisterPluginHooks | chunks.94.mjs:892-904 | function (removes plugin hooks from registry) |
| F_4 | getEnabledPluginsHash | chunks.94.mjs:800-804 | function (hash for change detection) |

### Plugin Skills & Commands (chunks.94.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| w96 | getPluginCommands | chunks.94.mjs:582-706 | variable (memoized) |
| hk8 | getPluginSkills | chunks.94.mjs:707-746 | variable (memoized) |
| m_4 | loadCommandsFromDir | chunks.94.mjs:470-520 | function (scan for .md command files) |
| B_4 | loadSkillsFromDir | chunks.94.mjs:522-580 | function (scan for SKILL.md files) |
| dp6 | createCommandObject | chunks.94.mjs:420-468 | function (factory for command/skill objects) |
| F_4 | getEnabledPluginsHash | chunks.94.mjs:800-804 | function (for hot reload change detection) |

### Plugin Agents (chunks.95.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KQ6 | getPluginAgents | chunks.95.mjs:1121-1162 | variable (memoized) |
| S24 | PLUGIN_MEMORY_TYPES | chunks.95.mjs:1120 | constant (["user", "project", "local"]) |
| C24 | loadAgentsFromDir | chunks.95.mjs:1001-1021 | function (scan for AGENT.md files) |
| I24 | loadAgentFromMarkdown | chunks.95.mjs:1024-1097 | function (parse single AGENT.md into definition) |
| a01 | clearPluginAgentsCache | chunks.95.mjs:1099-1100 | function (invalidates KQ6 memo) |

### Plugin Output Styles (chunks.94.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ik8 | getPluginOutputStyles | chunks.94.mjs:941-974 | variable (memoized) |
| p_4 | loadOutputStylesFromDir | chunks.94.mjs:873-940 | function (scan for .json style configs) |

### Plugin Installation Registry (chunks.94.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Rk8 | syncInstalledPlugins | chunks.94.mjs:110 | function |
| Ek8 | initializeVersionedPlugins | chunks.94.mjs:21 | function |
| gI | getInstalledPluginsState | chunks.94.mjs | function |
| F01 | persistInstalledPlugins | chunks.94.mjs | function |
| Lk8 | savePluginInstallation | chunks.94.mjs:72 | function |
| iB | isPluginInstalled | chunks.94.mjs:58 | function |
| nW6 | isPluginInstalledForUser | chunks.94.mjs:65 | function |
| u_4 | removePluginsByMarketplace | chunks.94.mjs:32 | function |
| sM | serializePluginError | chunks.94.mjs | function |
| x_4 | updateInstalledPluginOnDisk | chunks.94.mjs:3 | function |
| I_4 | readPluginVersionFromManifest | chunks.94.mjs:97 | function |
| g01 | getGitCommitSha | chunks.94.mjs:93 | function |

### Marketplace Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wE | installMarketplaceSource | chunks.143.mjs:180 | function |
| OG6 | removeMarketplaceSource | chunks.143.mjs:212 | function |
| St | refreshMarketplace | chunks.143.mjs:357 | function |
| Yn4 | refreshAllMarketplaces | chunks.143.mjs:345 | function |
| zn4 | setMarketplaceAutoUpdate | chunks.143.mjs:393 | function |
| RyA | fetchAndCacheMarketplace | chunks.143.mjs:60 | function |
| qn4 | downloadMarketplaceFromUrl | chunks.143.mjs:3 | function |
| HG6 | readMarketplaceFromCache | chunks.143.mjs:260 | function |
| iIY | getCachedMarketplaceSync | chunks.143.mjs:277 | function |
| NZ | getMarketplaceCached | chunks.143.mjs:430 | variable (memoized) |
| AG1 | clearMarketplaceCache | chunks.143.mjs:3066 | function |
| n5 | getMarketplaceConfig | chunks.143.mjs:3069 | function |
| qG1 | saveMarketplaceConfig | chunks.143.mjs:3095 | function |
| $G6 | getKnownMarketplacesPath | chunks.143.mjs:3057 | function |
| ei4 | getMarketplacesDir | chunks.143.mjs:3061 | function |
| a0 | lookupPluginEntry | chunks.143.mjs:322 | function (plugin loading context) |
| yyA | lookupPluginEntryFromCache | chunks.143.mjs:295 | function |
| lIY | getTempMarketplaceName | chunks.143.mjs:41 | function |
| Kn4 | readAndValidateJsonFile | chunks.143.mjs:45 | function |
| KxY | gitCloneRepo | chunks.143.mjs:676 | function |
| Mn4 | cloneFromGitUrl | chunks.143.mjs:700 | function |
| YxY | cloneFromGitHub | chunks.143.mjs:707 | function |
| AxY | validateGitUrl | chunks.143.mjs:648 | function |
| qxY | installNpmPackage | chunks.143.mjs:661 | function |
| An4 | GIT_ENV_NO_PROMPT | chunks.143.mjs:426 | constant |
| AH1 | marketplaceSchema | chunks.143.mjs:31 | object (Zod schema) |
| pw8 | validateMarketplaceName | chunks.143.mjs:199 | function |
| Qp9 | cloneGitSubdir | chunks.143.mjs:2920 | function (sparse checkout for git-subdir) |

### Enterprise Policy (chunks.93.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ke | getAllowedMarketplaceSources | chunks.93.mjs:2355 | function |
| Gk8 | getBlockedMarketplaces | chunks.93.mjs:2361 | function |
| mq1 | isMarketplaceAllowed | chunks.93.mjs | function |
| nb1 | isExplicitlyBlocked | chunks.93.mjs | function |
| gF9 | matchesHostPattern | chunks.93.mjs | function |
| FF9 | matchesPathPattern | chunks.93.mjs:2437 | function |
| V_4 | getPluginTrustMessage | chunks.93.mjs:2367 | function |

### Enterprise Policy

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Fq1 | isMarketplaceAllowed | chunks.81.mjs:41 | function |
| nb1 | isExplicitlyBlocked | chunks.81.mjs:35 | function |
| mq1 | getAllowedMarketplaceSources | chunks.80.mjs:2987 | function |
| iD9 | getBlockedMarketplaces | chunks.80.mjs:2993 | function |
| nD9 | marketplaceSourceEquals | chunks.80.mjs:2999 | function |
| vXA | getMarketplaceHost | chunks.80.mjs:3019 | function |
| Yb7 | getPluginsSetupState | chunks.81.mjs:72 | function |
| o01 | formatMarketplaceSourceId | chunks.81.mjs:51 | function |
| Da | parsePluginNameAndMarketplace | chunks.81.mjs:94 | function |
| kB | scopeToSettingsKey | chunks.81.mjs:107 | function |
| zb7 | settingsKeyToScope | chunks.81.mjs:112 | function |

### Plugin MCP Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| VU7 | loadPluginMcpServers | chunks.87.mjs:1697 | function |
| b0A | resolvePluginMcpConfig | chunks.87.mjs:1530 | function |
| bN9 | namespaceMcpServers | chunks.87.mjs:1607 | function |
| BN9 | expandMcpServerVariables | chunks.87.mjs:1631 | function |
| x0A | readMcpJsonFile | chunks.87.mjs:1581 | function |
| Iu1 | expandPluginRootVar | chunks.87.mjs:1619 | function |
| uN9 | expandUserConfigVars | chunks.87.mjs:1623 | function |
| zG1 | getAllMcpServersWithPlugins | chunks.143.mjs:2380 | function |

### Plugin MCP Integration
|------------|----------|-----------|------|
| HGz | handlePluginList | chunks.188.mjs:2596 | function |
| XGz | handlePluginInstall | chunks.188.mjs:2800 | function |
| DGz | handlePluginUninstall | chunks.188.mjs:2811 | function |
| KGz | handlePluginDisable | chunks.188.mjs:2837 | function |
| PGz | handlePluginUpdate | chunks.189.mjs:3 | function |
| $Gz | handleMarketplaceAdd | chunks.188.mjs:2693 | function |
| OGz | handleMarketplaceList | chunks.188.mjs:2717 | function |
| _Gz | handleMarketplaceRemove | chunks.188.mjs:2768 | function |
| JGz | handleMarketplaceUpdate | chunks.188.mjs:2779 | function |
| fDq | installPlugin | chunks.176.mjs:210 | function |
| VDq | uninstallPlugin | chunks.176.mjs:231 | function |
| NDq | enablePlugin | chunks.176.mjs:244 | function |
| TDq | disablePlugin | chunks.176.mjs:257 | function |
| vDq | disableAllPlugins | chunks.176.mjs:270 | function |
| EZ1 | updatePlugin | chunks.176.mjs:280 | function |
| uV6 | parseMarketplaceSource | chunks.188.mjs:2697 | function |
| ZP | VALID_PLUGIN_SCOPES | chunks.188.mjs:2804 | constant |

### Plugin Telemetry Events

| Event Name | When Fired |
|------------|-----------|
| tengu_plugin_installed | Plugin installation completes |
| tengu_plugin_installed_cli | CLI install command completes |
| tengu_plugin_uninstalled_cli | CLI uninstall command completes |
| tengu_plugin_enabled_cli | CLI enable command completes |
| tengu_plugin_disabled_cli | CLI disable command completes |
| tengu_plugin_disabled_all_cli | All plugins disabled |
| tengu_plugin_updated_cli | Update command completes |
| tengu_plugin_list_command | List command executed |
| tengu_plugin_install_command | Install command started |
| tengu_plugin_uninstall_command | Uninstall command started |
| tengu_plugin_enable_command | Enable command started |
| tengu_plugin_disable_command | Disable command started |
| tengu_plugin_update_command | Update command started |
| tengu_plugins_loaded | Plugins loaded in session |
| tengu_marketplace_added | Marketplace added |
| tengu_marketplace_removed | Marketplace removed |
| tengu_marketplace_updated | Marketplace updated |

---

## Module: IDE Integration

> Full analysis: [22_ide_integration/overview.md](../22_ide_integration/overview.md)
> UI linkage: [22_ide_integration/ui_linkage.md](../22_ide_integration/ui_linkage.md)

### Core Detection & Connection (chunks.80.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iV | findConnectedIdeClient | chunks.80.mjs:1868 | function |
| N$6 | hasConnectedIde | chunks.80.mjs:1648 | function |
| T$6 | getIdeName | chunks.80.mjs:1842 | function |
| DXA | getIdeDisplayName | chunks.80.mjs:1847 | function |
| Q01 | getDefaultIdeType | chunks.80.mjs:1392 | function |
| f$6 | isVsCodeIde | chunks.80.mjs:1380 | function |
| Oh | isJetBrainsIde | chunks.80.mjs:1386 | function |
| Qb1 | isVsCodeRunning | chunks.80.mjs:2081 | function (memoized) |
| gb1 | isJetBrainsRunning | chunks.80.mjs:2083 | function (memoized) |
| bX | isIdeEnvironment | chunks.80.mjs:2085 | function (memoized) |
| U01 | IDE_CONFIG_MAP | chunks.80.mjs:1953 | object (18-IDE registry: 3 VSCode + 15 JetBrains) |
| wD9 | VSCODE_EXTENSION_ID | chunks.80.mjs:1922 | constant (`"anthropic.claude-code"`) |
| OD9 | findVsCodeBinaryFromParentProcess | chunks.80.mjs:1718 | function (macOS: walks ppid tree) |

### IDE Discovery & Installation (chunks.80.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ub1 | detectAvailableIDEs | chunks.80.mjs:1578 | function (async: scans ~/.claude/ide/*.json port files) |
| Ex7 | waitForIdeConnection | chunks.80.mjs:1563 | function (async: polls 1s/30s for IDE appearance) |
| Fx7 | handleIdeAutoInstallation | chunks.80.mjs:1880 | function (async: install + wait + onboarding orchestrator) |
| HD9 | installIdeExtension | chunks.80.mjs:1664 | function (async: runs `code --install-extension`) |
| kx7 | checkExtensionInstalled | chunks.80.mjs:1652 | function (async: checks extension list or JetBrains plugin) |
| zD9 | installAndReturnStatus | chunks.80.mjs:1538 | function (async: wraps HD9, returns {installed, error, version}) |
| $D9 | getInstalledExtensionVersion | chunks.80.mjs:1704 | function (async: parses `--list-extensions --show-versions`) |

### Onboarding State (chunks.80.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| P$6 | hasIdeOnboardingBeenShown | chunks.80.mjs:1292 | function |
| aX9 | markIdeOnboardingAsShown | chunks.80.mjs:1298 | function |
| W$6 | ideConnectionAbortController | chunks.80.mjs:1920 | variable (AbortController for waitForIdeConnection) |

### MCP Notifications & Connection (chunks.80.mjs / chunks.145.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hx7 | sendIdeConnectedNotification | chunks.80.mjs:1639 | function (sends `ide_connected` with pid) |
| mx7 | closeAllDiffTabs | chunks.80.mjs:1874 | function |
| VG6 | WebSocketClientTransport | chunks.144.mjs:1 | class (ws-ide transport, handles Bun+Node.js) |

### Tool Invocation Layer (chunks.145.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _h | callMcpTool | chunks.145.mjs:~1430 | function (thin wrapper: toolName+args+client → content) |
| lo4 | executeMcpTool | chunks.145.mjs:1676 | function (async: timeout race, 30s progress log, auth error) |

### Diff Review Tools (chunks.180.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| MPq | IDEDiffHandler | chunks.180.mjs:3 | function (hook: routes diff to IDE vs terminal) |
| aJz | openDiffInIde | chunks.180.mjs:78 | function (async: blocking openDiff call + response handling) |
| aQA | closeDiffTab | chunks.180.mjs:132 | function (async: `close_tab` MCP tool call) |
| eJz | isFileSaved | chunks.180.mjs:151 | function (checks FILE_SAVED response code) |
| sJz | isTabClosed | chunks.180.mjs:143 | function (checks TAB_CLOSED response code) |
| tJz | isDiffRejected | chunks.180.mjs:147 | function (checks DIFF_REJECTED response code) |

### Diagnostics Bridge (chunks.146.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KI | DiagnosticsManager | chunks.146.mjs:3 | class (singleton: baseline+delta IDE diagnostics) |

### Selection Tracking (chunks.186.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fVq | useIdeSelection | chunks.186.mjs:410 | function (hook: subscribes to selection_changed) |
| oMz | selectionChangedSchema | chunks.186.mjs:463 | object (Zod schema for selection_changed notification) |
| aVq | syncPermissionModeToIde | chunks.186.mjs:1736 | function (hook: sends set_permission_mode to Chrome MCP) |

### UI Components (chunks.182.mjs / chunks.187.mjs / chunks.188.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| FWq | IdeSelectionIndicator | chunks.182.mjs:1514 | component (status bar: "⧉ 3 lines selected" / "⧉ In file.ts") |
| Rf1 | getIdeConnectionStatus | chunks.182.mjs:1500 | function (hook: "connected"\|"disconnected"\|null) |
| dLq | useIdeStatusMonitoring | chunks.187.mjs:2265 | function (hook: 4 notification effects for IDE state) |
| Nx7 | IDEOnboardingDialog | chunks.188.mjs:1268 | component (first-run onboarding dialog) |

---

## Module: Slash Commands

> Full analysis: [09_slash_command/](../09_slash_command/)
> - [forked_execution.md](../09_slash_command/forked_execution.md) - Isolated sub-agent execution
> - [system_reminder_integration.md](../09_slash_command/system_reminder_integration.md) - Skill listing injection

### Parsing & Dispatch

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| uc4 | parseSlashCommand | chunks.133.mjs:820 | function (parses `/command args` from input) |
| DvY | handleSlashInput | chunks.133.mjs:1120 | function (top-level slash command dispatcher) |
| XvY | executeCommand | chunks.133.mjs:1247 | function (type router: local/local-jsx/prompt) |

### Command Registry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| I0 | getAllSkills | chunks.168.mjs:2013 | function (memoized, merges all command sources) |
| Ci8 | getBuiltinCommands | chunks.168.mjs:2012 | function (memoized, returns hardcoded built-in command array) |
| _9z | getSkills | chunks.171.mjs:799 | function (loads skill-dir and plugin skills) |
| NR | getAllSkillsForTool | chunks.168.mjs:2029 | function (memoized, filters for Skill tool invocation) |
| vp6 | getSlashCommandSkills | chunks.168.mjs:2031 | function (memoized, filters for slash command picker) |
| Qg | builtinCommandNames | chunks.168.mjs:2012 | function (memoized, Set of built-in command names) |
| UBA | clearCommandRegistryCache | chunks.168.mjs:2139 | function |
| bm | clearAllCommandCaches | chunks.168.mjs:2143 | function |
| yOq | filterEssentialCommands | chunks.168.mjs:2147 | function |

### Command Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| G66 | findCommandBase | chunks.168.mjs:1850 | function (base lookup with alias support) |
| kf6 | findCommand | chunks.168.mjs:1858 | function (findCommandBase with error throwing) |
| rY6 | isCommandAvailable | chunks.168.mjs:1854 | function (checks if command exists) |
| jZ1 | formatCommandDescription | chunks.168.mjs:2161 | function |

### Forked Command Support

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| MvY | handleForkedCommand | chunks.133.mjs:1025 | function (forked sub-agent execution) |
| DN1 | buildForkedCommandConfig | chunks.148.mjs:1951 | function (prepares forked command execution context) |
| XN1 | extractResultFromEvents | chunks.148.mjs:1971 | function (extracts result text from accumulated events) |
| ff6 | renderForkedProgress | chunks.133.mjs:490 | function (renders forked command progress UI) |
| bI | generateAgentId | chunks.93.mjs:1557 | function (creates unique agent ID for forked execution) |
| ABY | createIsolatedAppState | chunks.148.mjs:1934 | function (creates state wrapper with injected allowedTools for forked isolation) |
| Bc6 | createChildToolUseContext | chunks.148.mjs:1978 | function (creates child context for nested agent execution with state isolation) |
| bX | getLastMessage | chunks.148.mjs | function (retrieves last message from event stream) |
| qh | runAgentLoop | chunks.148.mjs | function (agent loop generator for forked execution) |

### /color Command (v2.1.76)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SQ8 | colorCommandDefinition | chunks.150.mjs:1385-1398 | object (local-jsx command definition) |
| OFY | handleColorCommand | chunks.150.mjs:1326-1369 | async function (sets session color, validates input) |
| k3q | colorCommandModule | chunks.150.mjs:1324 | object (module exports for /color) |
| E3q | initColorCommand | chunks.150.mjs:1373-1379 | function (initializes color command module) |
| wFY | RESET_COLOR_VALUES | chunks.150.mjs:1378 | constant (["default", "reset", "none", "gray", "grey"]) |
| s$ | AVAILABLE_COLORS | chunks.93.mjs:1443 | constant (["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"]) |
| t$ | COLOR_CSS_CLASSES | chunks.93.mjs:1443-1453 | object (maps colors to CSS class names) |
| Vy1 | saveColorPreference | chunks.150.mjs | async function (persists color to session file) |
| $Y | isSwarmTeammate | chunks.150.mjs | function (checks if current session is swarm teammate) |

### Command Building & Formatting

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| PvY | buildUserPrompt | chunks.133.mjs:1420 | function (builds user-facing prompt display based on invocability) |
| xc6 | formatCommandInvocation | chunks.133.mjs:1406 | function (formats `/name args` string for display) |
| sc4 | isValidCommandName | chunks.133.mjs:1116 | function (validates command name chars: a-zA-Z0-9:\-_) |
| oc4 | buildInvocableCommandPrompt | chunks.133.mjs:1415 | function (builds command-name/command-message XML for user-invocable skills) |
| tc4 | buildNonInvocableSkillPrompt | chunks.133.mjs:1410 | function (builds skill display for Claude-only skills with progress message) |

### Prompt Command Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ec4 | handlePromptCommand | chunks.133.mjs:1433 | function (inline prompt command execution) |
| MvY | handleForkedCommand | chunks.133.mjs:1025 | function (forked sub-agent execution) |
| Kh | filterAllowedTools | chunks.173.mjs:509 | function (filters tool whitelist for skill) |
| Tf6 | getAgentContext | chunks.133.mjs:837 | function (gets current agent context store) |
| Pb4 | handlePromptCommandFromTool | chunks.130.mjs:1819 | function |
| VQ1 | formatCommandName | chunks.6.mjs:1797 | function |
| nfY | buildSkillMetadata | chunks.131.mjs:1813 | function |
| jb4 | buildUserFacingMetadata | chunks.130.mjs:1808 | function |
| evA | buildForkedSkillMetadata | chunks.130.mjs:1803 | function |

### Skill Usage Scoring

> Note: Detailed skill system symbols are in [symbol_index_core_features.md](symbol_index_core_features.md) under Skill System section.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ON1 | trackSkillUsage | chunks.133.mjs:884 | function (records skill invocation in session state) |
| ux8 | computeSkillScore | chunks.133.mjs:900 | function (7-day half-life decay scoring) |

### Built-in Command Definitions

> Detailed analysis: [../09_slash_command/](../09_slash_command/)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| NdY | helpCommand | chunks.153.mjs:1458 | constant (object) |
| _FY | clearCommand | chunks.150.mjs:1309 | constant (object) |
| ZpY | compactCommand | chunks.151.mjs:188 | constant (object) |
| lzq | loginCommand | chunks.153.mjs:2468 | function (returns object) |
| nzq | logoutCommand | chunks.153.mjs:2487 | constant (object) |
| gdY | initCommand | chunks.153.mjs:2077 | constant (object) |
| F6z | vimCommand | chunks.162.mjs:1614 | constant (object) |
| k1z | fastCommand | chunks.163.mjs:866 | constant (object) |
| $FY | colorCommand | chunks.150.mjs:1386 | constant (object) |
| qpY | copyCommand | chunks.150.mjs:2965 | constant (object) |
| XYq | contextCommand | chunks.152.mjs:1301 | constant (object) |
| cBY | addDirCommand | chunks.149.mjs:1819 | constant (object) |
| YAz | reloadPluginsCommand | chunks.165.mjs:671 | constant (object) |
| YgY | feedbackCommand | chunks.149.mjs:2466 | constant (object) |

### Hook Registration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| gc4 | registerSkillHooks | chunks.133.mjs:862 | function (registers hooks from skill definition during prompt command execution) |
| IM6 | registerSkillHooks | chunks.51.mjs:1361 | function (alternative hook registration path) |
| JW1 | registerSingleHook | chunks.133.mjs | function (registers a single hook with matcher and optional one-shot cleanup) |
| l24 | removeHook | chunks.133.mjs | function (removes a hook after one-shot execution) |

### Autocomplete UI (chunks.182.mjs / chunks.183.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| PgA | filterCommandSuggestions | chunks.182.mjs:1971 | function (fuzzy filter for "/" suggestions) |
| NF | isSlashInput | chunks.182.mjs:1930 | function (`A.startsWith("/")`) |
| QDz | isInArgsMode | chunks.182.mjs:1932 | function (non-trailing space = suppress picker) |
| pv6 | findInlineSlashToken | chunks.182.mjs:1896 | function (detects `/cmd` mid-sentence) |
| MgA | getInlineGhostSuffix | chunks.182.mjs:1913 | function (ghost text completion suffix) |
| WgA | acceptCommandSuggestion | chunks.182.mjs:2057 | function (writes `/{name} ` on Tab) |
| sWq | toSuggestionItem | chunks.182.mjs:1957 | function (command → suggestion display object) |
| WGq | useCommandSuggestions | chunks.183.mjs:1 | function (React hook: orchestrates all autocomplete) |
| PE6 | handleSubmitCommand | chunks.185.mjs:3067 | function (REPL submit: immediate vs deferred slash) |

### Skill Tool (chunks.132.mjs / chunks.89.mjs / chunks.88.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| NJ | SKILL_TOOL_NAME | chunks.89.mjs:586 | constant ("Skill") |
| wt | skillToolDefinition | chunks.132.mjs:820 | object (full Skill tool with call/permissions/schema) |
| d0A | getSkillToolPrompt | chunks.88.mjs:10 | function (memoized Skill tool description text) |

### Skill System Reminder Injection (chunks.147.mjs / chunks.90.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| guY | generateSkillListingAttachment | chunks.147.mjs:700 | function (delta-skill-listing attachment) |
| nT6 | sentSkillNames | chunks.147.mjs:1247 | Set (session-level dedup for skill listing) |
| fV8 | formatSkillListing | chunks.90.mjs:2654 | function (budget-aware skill list text) |
| GV8 | formatSkillDescriptionLine | chunks.90.mjs:2645 | function (`description - whenToUse` string) |
| PB9 | formatSkillEntry | chunks.90.mjs:2649 | function (`- name: desc` line) |
| UP1 | tokenLimitToCharLimit | chunks.90.mjs | function (budget = contextTokens × 4 × 0.02 or 16000) |
| r94 | SKILL_BUDGET_RATIO | chunks.90.mjs:2720 | constant (0.02 — 2% of context window for skill listings) |
| o94 | TOKENS_PER_CHAR | chunks.90.mjs:2722 | constant (4 — approximate tokens per character ratio) |
| a94 | MAX_FALLBACK_CHARS | chunks.90.mjs:2724 | constant (16000 — max character budget fallback) |
| WB9 | MIN_DESCRIPTION_CHARS | chunks.90.mjs:2726 | constant (20 — minimum description length before truncation) |
| bE1 | forceInitialLoad | chunks.147.mjs | variable (flag to force initial skill list after /compact) |

### Invoked Skills Tracking (chunks.1.mjs / chunks.147.mjs)

> Note: Full skill tracking symbols are in [symbol_index_core_features.md](symbol_index_core_features.md) under Skill-Compact Integration.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Uw6 | registerInvokedSkill | chunks.1.mjs:3037 | function (records skill invocation in session state) |
| St6 | getInvokedSkillsForAgent | chunks.1.mjs:3052 | function (returns invoked skills Map filtered by agentId) |
| Tqq | getInvokedSkillsAttachment | chunks.147.mjs:1896 | function (builds invoked_skills attachment) |

### XML Tag Constants (chunks.9.mjs)

> Full analysis: [09_slash_command/output_style.md](../09_slash_command/output_style.md)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SG | COMMAND_NAME_TAG | chunks.9.mjs:1239 | constant ("command-name") |
| pP | COMMAND_MESSAGE_TAG | chunks.9.mjs:1241 | constant ("command-message") |
| Pw1 | LOCAL_COMMAND_STDOUT_TAG | chunks.9.mjs:1247 | constant ("local-command-stdout") |
| ao1 | LOCAL_COMMAND_STDERR_TAG | chunks.9.mjs:1249 | constant ("local-command-stderr") |

### Output Style Rendering (chunks.127.mjs / chunks.129.mjs / chunks.132.mjs)

> Full analysis: [09_slash_command/output_style.md](../09_slash_command/output_style.md)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iI4 | commandMessageRenderer | chunks.127.mjs:422 | function (`<command-message>` invocation bubble renderer) |
| _x4 | localCommandResultRenderer | chunks.129.mjs:274 | function (`<local-command-stdout/stderr>` block renderer) |
| Ox4 | CommandOutputLine | chunks.129.mjs:308 | component (single output line with `  ⎿  ` prefix) |
| C4 | extractXmlTag | chunks.129.mjs | function (extracts content from `<tag>...</tag>` in text) |
| TJ | AnsiText | chunks.129.mjs | component (ANSI escape code renderer) |
| bu4 | skillRenderToolResultMessage | chunks.132.mjs:574 | function (Skill tool result: "Successfully loaded skill") |
| uu4 | skillRenderToolUseMessage | chunks.132.mjs:589 | function (Skill tool-use header label with/without `/`) |
| HP6 | skillRenderToolUseProgressMessage | chunks.132.mjs:598 | function (scrollable progress list, last 3 items) |
| Bu4 | skillRenderToolUseRejectedMessage | chunks.132.mjs:634 | function (progress list + ✘ rejection indicator) |
| mu4 | skillRenderToolUseErrorMessage | chunks.132.mjs:640 | function (progress list + error detail block) |
| YNY | MAX_SKILL_PROGRESS_VISIBLE | chunks.132.mjs:661 | constant (3 — max visible progress lines) |
| zNY | SKILL_INITIALIZING_TEXT | chunks.132.mjs | constant ("Initializing…" — initial progress placeholder) |
| oA | DimText | chunks.132.mjs | component (dimmed/gray text for secondary info) |
| Y9 | RejectedResult | chunks.132.mjs | component (✘ rejection indicator row) |
| z5 | ErrorResult | chunks.132.mjs | component (error detail block) |

---

## Module: UI Components (Ink)

> Full analysis:
> - [02_ui/user_interaction_loop.md](../02_ui/user_interaction_loop.md) - REPL state machine and query pipeline
> - [02_ui/rendering_pipeline.md](../02_ui/rendering_pipeline.md) - Message rendering pipeline (7 stages)
> - [02_ui/dialog_system.md](../02_ui/dialog_system.md) - Priority dialog system
> - [02_ui/elicitation_system.md](../02_ui/elicitation_system.md) - MCP elicitation forms
> - [02_ui/input_handling.md](../02_ui/input_handling.md) - PromptInput, history, vim mode
> - [02_ui/spinner_status.md](../02_ui/spinner_status.md) - Spinner visibility, loading states
> - [02_ui/streaming_ui.md](../02_ui/streaming_ui.md) - Streaming tool uses, thinking blocks
> - [02_ui/integration_summary.md](../02_ui/integration_summary.md) - Cross-module integration
> - [04_system_reminder/ui_linkage.md](../04_system_reminder/ui_linkage.md) - System reminder UI visibility

### REPL Core (chunks.196.mjs) - ✅ ALL VERIFIED 2026-03-22

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ot8 | REPL | chunks.196.mjs:3 | component (main session orchestrator) ✅ |
| ra6 | getInputDialogType | chunks.196.mjs:387-404 | function (priority dialog dispatcher) ✅ |
| TM | handleCancel | chunks.196.mjs:420-432 | function (escape/cancel with per-dialog behavior) ✅ |
| xN6 | handleToolUseStream | chunks.173.mjs:2384-2480 | function (streaming event processor) ✅ |
| HIq | ToolPermissionDialog | chunks.190.mjs:899 | component (tool use approval dialog) ✅ |
| fIq | PromptDialog | chunks.190.mjs:2125 | component (tool prompt selection dialog) ✅ |
| ct8 | SandboxPermissionDialog | chunks.194.mjs:2899 | component (network/sandbox approval dialog) ✅ |
| ZIq | ElicitationRouter | chunks.190.mjs:1242 | component (MCP elicitation dialog router) ✅ |
| zs8 | MessageSelector | chunks.185.mjs:1179 | component (conversation history browser) ✅ |

### Message Rendering Components (chunks.161.mjs, chunks.58.mjs) - ✅ ALL VERIFIED 2026-03-22

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| veY | MessageListImpl | chunks.161.mjs:3 | component (base conversation list implementation, React Compiler optimized with 111-slot cache) ✅ |
| G_6 | memoizedMessageList | chunks.161.mjs:355 | component (memo wrapper around veY with custom comparison for streamingToolUses) ✅ |
| A6 | useMemoCache | chunks.58.mjs:1796 | function (React Compiler cache accessor: `Up3.H.useMemoCache(N)` returns N-slot array for memoization) ✅ |
| Ic8 | MESSAGE_TRUNCATION_LIMIT | chunks.160.mjs:3112 | constant (30 messages - number to show in truncated transcript view) ✅ |
| Fjq | MAX_RENDER_MESSAGES | chunks.160.mjs:3114 | constant (200 messages - max to render before virtual scroll/cap) ✅ |

### Message Pipeline Functions (chunks.172.mjs, chunks.173.mjs, chunks.160.mjs, chunks.174.mjs) - ✅ ALL VERIFIED 2026-03-22

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| xN6 | handleToolUseStream | chunks.173.mjs:2384-2488 | function (streaming event processor) ✅ |
| af | wrapInXmlTag | chunks.173.mjs:2490-2494 | function (creates `<system-reminder>` XML wrapper) ✅ |
| b5 | wrapWithSystemReminderTags | chunks.173.mjs:2496-2523 | function (wraps messages in system-reminder tags) ✅ |
| Wzz | planModeReminderDispatcher | chunks.173.mjs:2525-2530 | function (routes to plan mode variant) ✅ |
| Nzz | fullPlanReminder | chunks.173.mjs:2556-2627 | function (full plan mode instructions) |
| Ezz | sparsePlanReminder | chunks.173.mjs:2692-2699 | function (sparse plan mode reminder) |
| yzz | subAgentPlanReminder | chunks.173.mjs:2701-2712 | function (subagent plan mode reminder) |
| Zzz | ultraplanCompleteReminder | chunks.173.mjs:2532-2538 | function (ultraplan complete notification) |
| Lzz | autoModeReminder | chunks.173.mjs:2714-2739 | function (auto mode instructions dispatcher) |
| WJ | normalizeMessages | chunks.173.mjs:89 | function (raw messages → render-ready format) |
| - | findCompactBoundaryIndex | chunks.150.mjs:2523 | pattern (inline: `messages.findLastIndex(m => m.type === "system" && m.subtype === "compact_boundary")`) |
| - | getVisibleMessagesAfterCompact | chunks.150.mjs:2523 | pattern (inline: `messages.slice(boundaryIndex)` after findLastIndex) |
| XV6 | shouldShowMessageInChat | chunks.185.mjs:1692-1702 | function (filters isMeta, tool_result, and visibility tier; VALIDATED) ✅ |
| qYq | generalVisibilityFilter | chunks.173.mjs:1292-1297 | function (simple isMeta + isVisibleInTranscriptOnly check; VALIDATED) ✅ |
| Hz6 | isSpecialMessageType | chunks.173.mjs:1275-1277 | function (checks if message content matches TF6 Set of special patterns; VALIDATED) ✅ |
| Gi6 | filterEmptyMessages | chunks.173.mjs:1502-1509 | function (filters progress/attachment/system, checks content length; VALIDATED) ✅ |
| JM | flattenMessageContent | chunks.173.mjs:1516-1545 | function (splits multi-content assistant messages into separate entries; VALIDATED) ✅ |
| pjq | groupToolsWithHooks | chunks.173.mjs:1591-1669 | function (groups tool_use with PreToolUse/PostToolUse hooks by ID; VALIDATED) ✅ |
| rr6 | isHookAttachmentMessage | chunks.173.mjs:1671-1673 | function (checks if message is hook result: hook_blocking_error, hook_success, etc; VALIDATED) ✅ |
| wl6 | isToolResultMessage | chunks.173.mjs:1587-1589 | function (checks if user message has tool_result content; VALIDATED) ✅ |
| K2z | normalizeAttachmentForAPI | chunks.173.mjs | function (converts attachment to user message) |
| lzz | mergeUserMessages | chunks.173.mjs:209 | function (combines consecutive user messages) |
| izz | mergeAssistantMessages | chunks.173.mjs:221 | function (combines split assistant messages) |
| gP | getLastMessage | chunks.173.mjs | function (returns last element of array) |
| V8z | extractStreamingToolId | chunks.161.mjs:577 | function (extracts contentBlock.id for filtering) |
| Z8z | createStreamingToolMessage | chunks.161.mjs:566 | function (wraps streaming tool as message) |
| O8z | hasNextAssistantContent | chunks.161.mjs:336 | function (checks if more content follows this message) |
| ep7 | isToolInInProgressSet | chunks.161.mjs | function (checks tool use ID membership) |
| I2z | extractChatTitle | chunks.174.mjs:60 | function (extracts conversation title, skips command output via fJq) |
| fJq | SKIP_TITLE_REGEX | chunks.174.mjs:273 | constant (regex: tag patterns excluded from title extraction) |
| PE6 | processInput | chunks | function (routes input to query/command handlers) |
| V_6 | getPreviousQueuedMessage | chunks | function (history navigation with image restore) |
| p1 | createUserMessage | chunks.173.mjs:1378 | function (constructs user message with isMeta/visibility flags) |
| qr6 | extendUuid | chunks.173.mjs:1511 | function (extends UUID with content index for multi-content messages) |

### Special Message Types (TF6 Set) - ✅ NEW 2026-03-22

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TF6 | SPECIAL_MESSAGE_TYPES | chunks.174.mjs:1099 | constant (Set of 5 special message text patterns) ✅ |
| D66 | INTERRUPTED_BY_USER | chunks.174.mjs:984 | constant ("[Request interrupted by user]") ✅ |
| P0 | INTERRUPTED_FOR_TOOL_USE | chunks.174.mjs:986 | constant ("[Request interrupted by user for tool use]") ✅ |
| R96 | USER_DECLINED_ACTION | chunks.174.mjs:988 | constant ("The user doesn't want to take this action right now...") ✅ |
| h96 | USER_DECLINED_TOOL_USE | chunks.174.mjs:990 | constant ("The user doesn't want to proceed with this tool use...") ✅ |
| N36 | NO_RESPONSE_REQUESTED | chunks.174.mjs:1007 | constant ("No response requested.") ✅ |

### REPL State Variables (chunks.196.mjs)

| Obfuscated | Readable | Setter | Line | Description |
|------------|----------|--------|------|-------------|
| u7 | messages | Xz (gq) | 173 | Array of conversation messages |
| m5 | inputValue | ew (P5) | 185 | Current input text value |
| d7 | streamMode | W4 | 96 | "responding" \| "tool-input" \| "thinking" \| "requesting" \| "tool-use" |
| JK | streamingToolUses | F3 | 98 | Array of partial tool use objects during streaming |
| MK | streamingThinking | k3 | 98 | Thinking block state with isStreaming, streamingEndedAt |
| M5 | abortController | x5 | 108 | AbortController for in-flight API requests |
| n4 | inProgressToolUseIDs | iK | 200 | Set of tool use IDs currently executing |
| a8 | toolUseConfirmQueue | $A | 167 | Array of pending tool permission requests |
| G7 | sandboxPermissionQueue | Q1 | 167 | Array of pending sandbox permission requests |
| zA | promptQueue | gA | 167 | Array of pending prompt requests from tools |
| n.queue | workerSandboxPermissions.queue | Zustand | 34 | Worker sandbox requests store |
| o.queue | elicitationState.queue | Zustand | 34 | MCP elicitation requests store |
| j8 | toolJSX | l8 | 143 | Local JSX command state (for /help, /clear, etc.) |
| K2 | focusedInputDialog | - | 405 | Current dialog type from getInputDialogType (derived) |
| y2 | isPaused | s6 | 130 | Streaming paused state (user typing) |
| ZH | inputMode | ZY | 197 | "prompt" \| "shift-enter" (multi-line mode) |
| sZ | vimMode | rF | 235 | "INSERT" \| "NORMAL" |
| k6 | screenMode | Z6 | 47 | "chat" \| "transcript" (view mode toggle) |
| lV6 | isViewingDialogHistory | $T | 385 | History browsing overlay active |
| na6 | hasActiveNotification | u26 | 385 | Full-screen notification active |
| W7 | isMessageSelectorVisible | Hq | 235 | Message selector overlay visible |
| m26 | showCostWarning | - | 386 | Cost warning dialog should show (derived) |
| W6 | showIdeOnboarding | n6 | 49 | IDE onboarding dialog should show |
| g6 | showEffortCallout | D1 | 51 | Effort callout dialog should show |
| J1 | showRemoteCallout | - | 34 | Remote callout dialog should show (from Zustand) |
| e8 | lspRecommendation | - | 62 | LSP recommendation object |
| E1 | showDesktopUpsell | K8 | 51 | Desktop upsell dialog should show |

### REPL Core Functions (chunks.196.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| dE | resetLoadingState | chunks.196.mjs:260 | function (clears all streaming state on abort/complete) |
| B4 | setIsLoading | chunks.196.mjs:123 | function (sets loading with timing reset) |
| P5 | setInputValue | chunks.196.mjs:188 | function (updates input + triggers pause state) |
| gq | setMessages | chunks.196.mjs:173 | function (useCallback wrapper with ref sync) |

### Derived State Variables (chunks.196.mjs)

| Obfuscated | Readable | Line | Calculation | Purpose |
|------------|----------|------|-------------|---------|
| QV6 | showSpinner | 305 | `(!toolJSX \|\| toolJSX.showSpinner) && toolUseConfirmQueue.length === 0 && ...` | Spinner visibility |
| UV6 | hasActiveDialogs | 306 | `toolUseConfirmQueue.length > 0 \|\| sandboxPermissionQueue.length > 0 \|\| ...` | Any dialog pending |
| K2 | focusedInputDialog | 405 | `getInputDialogType()` | Current dialog type |
| Cb1 | blockedItems | 406 | `isPaused && (queue[0] \|\| ...)` | Blocked items indicator |
| C2 | isToolOnlyMode | 304 | All pending tools are permission-only | Tool-only execution mode |

### Dialog Component Props (chunks.196.mjs) - ✅ ALL VERIFIED 2026-03-22

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| HIq | ToolPermissionDialog | chunks.190.mjs:899 | component (tool use approval) ✅ |
| ct8 | SandboxPermissionDialog | chunks.194.mjs:2899 | component (network/sandbox approval) ✅ |
| ZIq | ElicitationRouter | chunks.190.mjs:1242 | component (MCP elicitation dialog router) ✅ |
| BWz | ElicitationFormDialog | chunks.190.mjs:1268 | component (JSON Schema-based MCP form) ✅ |
| tuq | asyncToolPermissionRequest | chunks.194.mjs:3 | function (worker thread permission request handler for swarm mode) ✅ |
| gWz | ElicitationUrlDialog | chunks.190.mjs:1943 | component (URL-opening MCP dialog) ✅ |
| zs8 | MessageSelector | chunks.185.mjs:1179 | component (conversation history browser) ✅ |
| jSq | CostWarningDialog | chunks.187.mjs:1852 | component (API cost threshold warning) ✅ |
| dj8 | IDEOnboardingDialog | chunks.65.mjs:1381 | component (IDE extension setup wizard) ✅ |
| uBq | LSPRecommendationDialog | chunks.195.mjs:544 | component (LSP plugin suggestion) ✅ |
| fIq | PromptDialog | chunks.190.mjs:2125 | component (tool prompt queue dialog) ✅ |
| gmq | EffortCalloutDialog | chunks.194.mjs:1755 | component (effort level selection for extended thinking) ✅ |
| pWq | RemoteCalloutDialog | chunks.168.mjs:381 | component (remote session options dialog) ✅ |
| zyq | DesktopUpsellDialog | chunks.180.mjs:1836 | component (desktop app promotion) ✅ |
| Ls8 | WorkerRequestDisplay | chunks.196.mjs:1531 | component (passive worker request banner) |
| GR4 | SpinnerComponent | chunks.196.mjs | component (loading indicator with mode text) |

### Tool Output Components (chunks.162.mjs, chunks.76.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BYq | BashOutputRenderer | chunks.162.mjs:3 | component (shell output detail panel) |
| mx1 | ScrollContainer | chunks.76.mjs:524 | component (scroll context provider; used by skill progress list) |

### Sandbox UI Components (chunks.165.mjs, chunks.182.mjs, chunks.187.mjs, chunks.154.mjs)

> Full analysis: [18_sandbox/ui_linkage.md](../18_sandbox/ui_linkage.md)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| oqz | sandboxSlashCommandHandler | chunks.165.mjs:1723 (Ln 427401) | function (dispatches /sandbox subcommands) |
| aqz | sandboxSlashCommandDefinition | chunks.165.mjs:1781 (Ln 427456) | object (slash command descriptor) |
| _Hq | SandboxModeSelector | chunks.165.mjs:1517 (Ln 427195) | component (3-way mode picker: auto-allow/regular/disabled) |
| zHq | SandboxStatusDisplay | chunks.165.mjs:1179 (Ln 426863) | component (configuration summary panel) |
| HHq | SandboxOverridesSettings | chunks.165.mjs:967 (Ln 426967) | component (open/closed override policy selector) |
| nuA | SandboxDependenciesPanel | chunks.165.mjs:1421 (Ln 427101) | component (bwrap/socat/seccomp status) |
| iqz | renderWarningEntry | chunks.165.mjs:1269 (Ln 426953) | function (single warning line renderer) |
| lWq | SandboxViolationStatusLine | chunks.182.mjs:1592 (Ln 472208) | component (status bar flash, auto-dismiss 5s) |
| HLq | SandboxViolationListPanel | chunks.187.mjs:~1294 (Ln 485694) | component (last-10 violations detail, macOS only) |
| qWz | renderViolationEntry | chunks.187.mjs:~1330 (Ln 485737) | function (single violation row with timestamp) |
| Q7q | SandboxDoctorCheck | chunks.154.mjs:2979 (Ln 396902) | component (dependency warnings in /doctor) |
| ToY | renderWarningRow | chunks.154.mjs:3030 (Ln 396933) | function (warning row in doctor check) |
| voY | renderErrorRow | chunks.154.mjs:3038 (Ln 396940) | function (error row in doctor check) |

### New UI Components (v2.1.76)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KIq | PlanInterviewQuestionComponent | chunks.190.mjs:3 | component (plan mode interview form UI) |
| dIq | IdeSelectionIndicator | chunks.191.mjs:3 | component (IDE selection line count/path display) |
| qGz | AgentTabComponent | chunks.192.mjs:3 | component (agent team tab with selected/viewed/idle state) |
| Efz | MainReplComponent | chunks.193.mjs:3 | component (main REPL orchestrator with all session state) |
| evz | WrongDirectoryDialog | chunks.197.mjs:3 | component (wrong directory resume dialog) |

### /color Command (v2.1.76) - ✅ NEW

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SQ8 | colorCommandDefinition | chunks.150.mjs:1385-1399 | object (slash command descriptor for /color) |
| OFY | handleColorCommand | chunks.150.mjs:1326-1369 | function (sets session color in standaloneAgentContext) |
| k3q | colorCommandModule | chunks.150.mjs:1324 | object (module exports for /color command) |
| E3q | initColorCommand | chunks.150.mjs:1373-1378 | function (initializes color command, defines reset values) |
| wFY | RESET_COLOR_VALUES | chunks.150.mjs:1378 | array (["default", "reset", "none", "gray", "grey"] - reset to default) |

