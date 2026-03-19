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
| rm4 | severityStringToInt | chunks.133.mjs:2363 | function |
| PvY | severityIntToString | chunks.133.mjs:2487 | function |
| am4 | hashDiagnostic | chunks.133.mjs:2378 | function |
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

### Tokenization & Parsing (chunks.169.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pz | shellTokenize | chunks.169.mjs:1824 | function (bash-parser external) |
| rZ1 | parseShellCommand | chunks.169.mjs:1716 | function |
| AD | extractSubcommands | chunks.169.mjs:1774 | function |
| XT6 | extractHeredocs | chunks.169.mjs:1596 | function |
| r9z | restoreHeredocs | chunks.169.mjs:1680 | function |
| eBA | restoreHeredocsInList | chunks.169.mjs:1686 | function |
| aOq | generateSentinels | chunks.169.mjs:1701 | function |
| c9z | generateRandomHex | chunks.169.mjs:1561 | function |
| i9z | isInsideQuotes | chunks.169.mjs:1565 | function |
| n9z | isInComment | chunks.169.mjs:1579 | function |
| a9z | isSimplePath | chunks.169.mjs:1712 | function |
| s9z | filterSeparatorTokens | chunks.169.mjs:1770 | function |
| e9z | isSimpleHelpCommand | chunks.169.mjs:1820 | function |
| t9z | extractAllPrefixes | chunks.169.mjs:1800 | function |
| KYz | hasOnlySimpleOperators | chunks.169.mjs:1979 | function |
| tOq | isCompoundDangerous | chunks.169.mjs:2006 | function |
| Pf6 | containsCdCommand | chunks.169.mjs:2014 | function |
| p9z | HEREDOC_PREFIX | chunks.169.mjs:1691 | constant ("__HEREDOC_") |
| d9z | HEREDOC_SUFFIX | chunks.169.mjs:1693 | constant ("__") |
| l9z | HEREDOC_REGEX | chunks.169.mjs:1698 | constant (regex) |

### Redirection Analysis (chunks.169.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| aI | extractRedirections | chunks.169.mjs:2021 | function |
| YYz | checkDangerousRedirection | chunks.169.mjs:2088 | function |
| AmA | handleFdRedirection | chunks.169.mjs:2218 | function |
| p_ | isOperatorToken | chunks.169.mjs:2076 | function |
| Py | isSafeRedirectionTarget | chunks.169.mjs:2080 | function |
| DF | containsVariable | chunks.169.mjs:2084 | function |
| oOq | isCommandSubstitutionContext | chunks.169.mjs:2249 | function |
| zYz | needsQuoting | chunks.169.mjs:2266 | function |

### Command Reconstruction (chunks.170.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wYz | reconstructCommand | chunks.170.mjs:3 | function |
| qmA | extractPrefixCached | chunks.170.mjs:103 | function (memoized wrapper) |
| Sd1 | CD_COMMAND_PATTERN | chunks.170.mjs:95 | constant (/^cd(?:\s|$)/) |
| Cd1 | STANDARD_FILE_DESCRIPTORS | chunks.170.mjs:96 | constant (Set ["0","1","2"]) |
| sOq | COMMAND_SEPARATOR_OPS | chunks.170.mjs:109 | constant (Set &&,\|\|,;,;;,\|) |
| qYz | ALL_REDIRECT_OPS | chunks.170.mjs:109 | constant (sOq + >&,>,>>) |

### LLM Prefix Extraction (chunks.169.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AYz | bashPreFlightCheck | chunks.169.mjs:1838 | function |

### Security Pipeline (chunks.150.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| lm | runSecurityChecks | chunks.150.mjs:321 | function |
| PhA | HEREDOC_IN_SUBSTITUTION_PATTERN | chunks.150.mjs:366 | constant (/\$\(.*<</) |
| ddY | DANGEROUS_PATTERNS | chunks.150.mjs:366 | constant (array) |
| kH | SECURITY_CHECK_IDS | chunks.150.mjs:390 | constant (enum object) |

### Allow-List Security Checks (chunks.149.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ndY | checkEmptyCommand | chunks.149.mjs:2818 | function |
| rdY | checkIncompleteCommand | chunks.149.mjs:2835 | function |
| adY | checkHeredocInSubstitution | chunks.149.mjs:2905 | function |
| odY | isQuotedHeredocInSubstitution | chunks.149.mjs:2866 | function |
| sdY | checkGitCommitMessage | chunks.149.mjs:2929 | function |
| tdY | checkQuotedHeredoc | chunks.149.mjs:2976 | function |
| cdY | stripQuotes | chunks.149.mjs:2766 | function |
| ldY | stripRedirections | chunks.149.mjs:2800 | function |
| idY | hasUnescapedChar | chunks.149.mjs:2804 | function |
| pdY | hasMalformedBrackets | chunks.149.mjs:2748 | function |

### Deny-List Security Checks (chunks.150.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| edY | checkJqCommand | chunks.150.mjs:3 | function |
| $cY | checkObfuscatedFlags | chunks.150.mjs:203 | function |
| AcY | checkShellMetacharacters | chunks.150.mjs:33 | function |
| qcY | checkDangerousVariables | chunks.150.mjs:64 | function |
| YcY | checkNewlines | chunks.150.mjs:122 | function |
| zcY | checkIFSInjection | chunks.150.mjs:143 | function |
| wcY | checkProcEnviron | chunks.150.mjs:160 | function |
| KcY | checkDangerousPatterns | chunks.150.mjs:81 | function |
| HcY | checkMalformedTokenInjection | chunks.150.mjs:177 | function |

### Pre-Check (chunks.10.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CY8 | hasSingleQuotedBackslashBypass | chunks.10.mjs:1031 | function |

### Safe Command Registry (chunks.150.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WcY | isInSafeCommandRegistry | chunks.150.mjs:680 | function |
| NcY | isReadOnlyCommand | chunks.150.mjs:831 | function |
| Of6 | checkReadOnlyBehavior | chunks.150.mjs:881 | function |
| GcY | buildSimpleCommandRegex | chunks.150.mjs:788 | function |
| TcY | isGitCommand | chunks.150.mjs:846 | function |
| vcY | containsGitSubcommand | chunks.150.mjs:850 | function |
| EcY | isBareGitRepo | chunks.150.mjs:854 | function |
| $f6 | isWindowsUncPath | chunks.150.mjs:792 | function |
| VcY | containsGlobPattern | chunks.150.mjs:803 | function |
| jcY | SAFE_COMMAND_REGISTRY | chunks.150.mjs:992 | object (command→flags map) |
| fcY | SAFE_COMMAND_PATTERNS | chunks.150.mjs:2314 | constant (Set of regex) |
| ZcY | SIMPLE_SAFE_COMMANDS | chunks.150.mjs:2314 | constant (array of strings) |
| PcY | XARGS_SAFE_COMMANDS | chunks.150.mjs:2314 | constant (array) |
| j6q | FLAG_PATTERN | chunks.150.mjs:953 | constant (/^-[a-zA-Z0-9_-]/) |
| M6q | validateFlagArgument | chunks.150.mjs:661 | function |
| X6q | allFlagsSupported | chunks.150.mjs:408 | function |
| McY | getSafeCommandRegistry | chunks.150.mjs:657 | function |

### Sed Validation (chunks.150.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| QU1 | validateSedCommand | chunks.150.mjs:493 | function |
| OcY | isSafeReadOnlySed | chunks.150.mjs:418 | function |
| J6q | isSafeSubstituteSed | chunks.150.mjs:455 | function |
| JcY | sedHasFileRedirection | chunks.150.mjs:516 | function |
| XcY | extractSedExpressions | chunks.150.mjs:553 | function |
| DcY | isDangerousSedExpression | chunks.150.mjs:595 | function |
| D6q | checkSedCommand | chunks.150.mjs:629 | function |
| _cY | isSafeSedPrintPattern | chunks.150.mjs:450 | function |

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

### Plugin Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $xY | loadPlugin | chunks.143.mjs:1167 | function |
| Pn4 | loadPluginManifest | chunks.143.mjs:889 | function |
| HxY | loadEnabledPlugins | chunks.143.mjs:1118 | function |
| OxY | loadInlinePlugins | chunks.143.mjs:1458 | function |
| Xn4 | loadPluginHooks | chunks.143.mjs:879 | function |
| Dn4 | mergeHooks | chunks.143.mjs:1107 | function |
| XG6 | readManifestFile | chunks.143.mjs:845 | function |
| iY | getLoadedPlugins | chunks.143.mjs:1526 | variable (memoized) |
| Sv | clearPluginsCache | chunks.143.mjs:1502 | function |
| $61 | getInlinePlugins | chunks.1.mjs:2823 | function |
| inlinePlugins | inlinePlugins | chunks.1.mjs:2398 | state key |
| useCoworkPlugins | useCoworkPlugins | chunks.1.mjs:2399 | state key |

### Versioned Cache

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| RB | buildPluginCacheKey | chunks.143.mjs:585 | function |
| JG6 | copyPluginToVersionedCache | chunks.143.mjs:629 | function |
| F51 | downloadAndCachePlugin | chunks.143.mjs:748 | function |
| od | resolvePluginVersion | chunks.143.mjs:448 | function |
| Uq1 | getPluginCacheDir | chunks.143.mjs:581 | function |
| Bg1 | copyDirectoryRecursive | chunks.143.mjs:594 | function |
| IyA | pathTraversalSafeJoin | chunks.143.mjs:475 | function |
| kyA | cleanupOrphanedPluginCache | chunks.143.mjs:2950 | function |
| FIY | getActivePluginPaths | chunks.143.mjs:2989 | function |
| QIY | deleteOrphanedVersion | chunks.143.mjs:3001 | function |
| bIY | ORPHANED_AT_MARKER | chunks.143.mjs:3039 | constant (".orphaned_at") |
| uIY | ORPHAN_GRACE_PERIOD_MS | chunks.143.mjs:3041 | constant (604800000 = 7 days) |

### Plugin Installation Registry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| uM | getInstalledPluginsState | chunks.81.mjs:242 | function (cached) |
| x$6 | persistInstalledPlugins | chunks.81.mjs:271 | function |
| hXA | savePluginInstallation | chunks.81.mjs:387 | function |
| $b7 | removePluginInstallation | chunks.81.mjs:288 | function |
| _b7 | removePluginsByMarketplace | chunks.81.mjs:367 | function |
| BM | isPluginInstalled | chunks.81.mjs:383 | function |
| eD9 | getInstalledPluginMetadata | chunks.81.mjs:353 | function |
| ja | loadInstalledPlugins | chunks.81.mjs:301 | function |
| rb1 | getInstalledPluginsPath | chunks.81.mjs:135 | function |
| Ob7 | updateInstalledPluginOnDisk | chunks.81.mjs:324 | function |
| SXA | initializeVersionedPlugins | chunks.81.mjs:342 | function |
| IXA | migrateInstalledPlugins | chunks.81.mjs:426 | function |
| tD9 | migratePluginFiles | chunks.81.mjs:143 | function |
| yXA | convertV1toV2Format | chunks.81.mjs:223 | function |
| LB | installedPluginsCache | chunks.81.mjs:528 | variable (in-memory cache) |

### Plugin Installation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ug1 | installPlugin | chunks.143.mjs:528 | function |
| HE | installPluginFromEntry | chunks.143.mjs:482 | function |
| On4 | recordInlinePluginInstall | chunks.143.mjs:518 | function |
| I$6 | getPluginGitSha | chunks.81.mjs:408 | function |
| Hb7 | readPluginVersionFromManifest | chunks.81.mjs:412 | function |

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
| a0 | lookupPluginEntry | chunks.143.mjs:322 | function |
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

### Plugin Skills & Commands Loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| YK1 | getPluginCommands | chunks.87.mjs:2039 | variable (memoized) |
| B0A | getPluginSkills | chunks.87.mjs:2157 | variable (memoized) |
| TU7 | loadCommandsFromDir | chunks.87.mjs:1856 | function |
| vU7 | loadSkillsFromDir | chunks.87.mjs:1943 | function |
| uu1 | createCommandObject | chunks.87.mjs:1870 | function |
| FN9 | findMarkdownFiles | chunks.87.mjs:1802 | function |
| QN9 | groupFilesByDirectory | chunks.87.mjs:1838 | function |
| mN9 | deriveCommandName | chunks.87.mjs:1825 | function |
| yD | parseMarkdownWithFrontmatter | chunks.87.mjs:1731 | function |
| Rx | isAlreadySeen | chunks.87.mjs:1798 | function |
| pO6 | isSkillFile | chunks.87.mjs:1848 | function |
| dO6 | clearCommandsCache | chunks.87.mjs:1939 | function |
| EU7 | clearSkillsCache | chunks.87.mjs:2018 | function |
| kj1 | pathJoin | chunks.87.mjs:1748 | function (alias) |
| Lj1 | pathBasename | chunks.87.mjs:1750 | function (alias) |
| Qa | pathDirname | chunks.87.mjs:1752 | function (alias) |

### Plugin Agents Loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wK1 | getPluginAgents | chunks.87.mjs:2509 | variable (memoized) |
| CU7 | loadAgentsFromDir | chunks.87.mjs:2470 | function |
| yU7 | VALID_SCOPES | chunks.87.mjs:2508 | constant (["user", "project", "local"]) |

### Plugin CLI Commands

| Obfuscated | Readable | File:Line | Type |
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

### Plugin Hook Registration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pa | loadAllPluginHooks | chunks.87.mjs:2606 | variable (memoized) |
| oN9 | extractPluginHooksForEvent | chunks.87.mjs:2547 | function |
| O61 | registerPluginHooks | chunks.1.mjs:2912 | function |
| YR6 | deregisterPluginHooks | chunks.1.mjs:2929 | function |
| sN9 | setupPluginHookHotReload | chunks.87.mjs:2589 | function |
| rO6 | clearPluginHookCache | chunks.87.mjs:2581 | function |
| aN9 | resetHotReloadState | chunks.87.mjs:2585 | function |
| PP | executePluginHooksForSession | chunks.142.mjs:248 | function |
| FW6 | executePluginHooksForSetup | chunks.142.mjs:290 | function |
| Ap | allowManagedHooksOnly | chunks.80.mjs:2821 | function |

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

### Parsing & Dispatch

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Db4 | parseSlashCommand | chunks.130.mjs:1344 | function |
| Mb4 | handleSlashInput | chunks.130.mjs:1506 | function |
| ifY | executeCommand | chunks.130.mjs:1627 | function |
| lfY | isValidCommandName | chunks.130.mjs:1502 | function |

### Command Registry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cZ | getAllCommands | chunks.168.mjs:2292 | function (memoized) |
| QBA | getBuiltinCommands | chunks.168.mjs:2291 | function (memoized) |
| _9z | getSkills | chunks.168.mjs:2118 | function |
| hv | getSkillToolCommands | chunks.168.mjs:2307 | function (memoized) |
| aO6 | getSlashCommandSkills | chunks.168.mjs:2309 | function (memoized) |
| pBA | BUILTIN_COMMAND_SET | chunks.168.mjs:2315 | Set |
| Cd | builtinCommandNames | chunks.168.mjs:2291 | function (memoized) |
| UBA | clearCommandRegistryCache | chunks.168.mjs:2139 | function |
| bm | clearAllCommandCaches | chunks.168.mjs:2143 | function |
| yOq | filterEssentialCommands | chunks.168.mjs:2147 | function |

### Command Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Sd | isCommandAvailable | chunks.168.mjs:2151 | function |
| zI | findCommand | chunks.168.mjs:2155 | function |
| jZ1 | formatCommandDescription | chunks.168.mjs:2161 | function |

### Prompt Command Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Wb4 | handlePromptCommand | chunks.130.mjs:1826 | function |
| cfY | handleForkedCommand | chunks.130.mjs:1411 | function |
| Pb4 | handlePromptCommandFromTool | chunks.130.mjs:1819 | function |
| VQ1 | formatCommandName | chunks.130.mjs:1797 | function |
| nfY | buildSkillMetadata | chunks.130.mjs:1813 | function |
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
| IM6 | registerSkillHooks | chunks.130.mjs:1361 | function |

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

### REPL Core (chunks.188.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TUA | REPL | chunks.188.mjs:3 | component (main session orchestrator) |
| lgA | Header | chunks.188.mjs:1063 | component (status bar: version, model, directory) |
| igA | InputBox | chunks.188.mjs:1065 | component (user text input field) |
| ngA | DialogsOverlay | chunks.188.mjs:1068 | component (keyboard shortcut overlay dialogs) |
| Z$ | handleSubmit | chunks.188.mjs:686 | function (user input entry + slash command router) |
| ff | executeQuery | chunks.188.mjs:589 | function (concurrency guard + query dispatch) |
| oc | handleQuery | chunks.188.mjs:550 | function (agent loop bridge + streaming) |
| T11 | handleToolUseStreamCallback | chunks.188.mjs:542 | function (streaming event adapter for React state) |
| f11 | getInputDialogType | chunks.188.mjs:304 | function (priority dialog dispatcher) |
| N11 | handleCancel | chunks.188.mjs:328 | function (escape/cancel with per-dialog behavior) |
| TA | setToolJSX | chunks.188.mjs:111 | function (animation/local JSX command state manager) |
| YK | resetLoadingState | chunks.188.mjs:218 | function (post-query cleanup: loading/streaming/spinner) |
| rc | rejectAndRestoreInput | chunks.188.mjs:341 | function (reject tool + restore input box) |

### REPL State Variables (chunks.188.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| O7 / tK | streamMode / setStreamMode | chunks.188.mjs:87 | state ("responding"\|"thinking"\|"tool-input"\|"tool-use") |
| gq / xq | streamingToolUses / setStreamingToolUses | chunks.188.mjs:87 | state (in-flight tool use entries) |
| U8 / R4 | streamingThinking / setStreamingThinking | chunks.188.mjs:87 | state (active thinking block + 30s timer) |
| _4 / C3 | isLoading / setIsLoading | chunks.188.mjs:99 | state (agent responding flag) |
| W4 / F1 | messages / setMessagesRaw | chunks.188.mjs:145 | state (full conversation history) |
| T6 | deferredMessages | chunks.188.mjs:151 | derived (useDeferredValue of messages for perf) |
| K8 / $8 | inputValue / setInputValue | chunks.188.mjs:153 | state (current text input) |
| e4 / Rq | inputMode / setInputMode | chunks.188.mjs:167 | state ("prompt"\|"bash") |
| cJ / lJ | vimMode / setVimMode | chunks.188.mjs:194 | state ("INSERT"\|"NORMAL") |
| IH / aw | pastedContents / setPastedContents | chunks.188.mjs:192 | state (image/file attachments by id) |
| nA / V8 | messageHistory / setMessageHistory | chunks.188.mjs:153 | state (historical inputs for navigation) |
| vK / l9 | toolJSX / setToolJSXState | chunks.188.mjs:111 | state (local JSX animation/command rendering) |
| F7 / f8 | toolUseConfirmQueue / setToolUseConfirmQueue | chunks.188.mjs:135 | state (pending tool approvals) |
| oq / j5 | sandboxPermissionQueue / setSandboxPermissionQueue | chunks.188.mjs:135 | state (pending network approvals) |
| O3 / HY | abortController / setAbortController | chunks.188.mjs:99 | state (in-flight API request controller) |
| XO | focusedInputDialog | chunks.188.mjs:318 | derived (result of f11() - active dialog type) |
| PG | showSpinner | chunks.188.mjs:231 | derived (controls spinner vs input display) |
| Gw | hasActiveDialogs | chunks.188.mjs:232 | derived (any queue has items) |
| I6 | isQueryInProgress | chunks.188.mjs:196 | ref (concurrency guard) |
| $Y | queryStartTime | chunks.188.mjs:99 | ref (for elapsed time calculation) |
| OY | totalPausedMs | chunks.188.mjs:99 | ref (tool permission wait time excluded) |
| Qj | responseLength | chunks.188.mjs:192 | ref (accumulated streaming text length) |
| gj / S3 | spinnerText / setSpinnerText | chunks.188.mjs:176 | state (compact progress, hook status) |
| eK / OO | spinnerColor / setSpinnerColor | chunks.188.mjs:176 | state (spinner foreground color) |
| HD / xH | spinnerShimmer / setSpinnerShimmer | chunks.188.mjs:176 | state (spinner animation shimmer color) |
| W$ / c9 | isPaused / setIsPaused | chunks.188.mjs:99 | state (input typing indicator with 1500ms timeout) |
| V11 | blockedItemsWhenPaused | chunks.188.mjs:319 | derived (dialogs waiting while paused) |
| s_ | isSearchingInputHistory | chunks.188.mjs:302 | state (history search overlay active) |
| ow / r_ | inProgressToolUseIDs / setInProgressToolUseIDs | chunks.188.mjs:176 | state (Set of tool use IDs still executing) |
| T4 | isSearchingHistory | chunks.188.mjs:194 | state (search overlay active) |
| D2 | isHelpOpen | chunks.188.mjs:194 | state (help overlay active) |

### Message Rendering Components (chunks.161.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KYq | SessionLogRenderer | chunks.161.mjs:917 | component (transcript display) |
| Yd1 | AssistantMessageRenderer | chunks.161.mjs:874 | component (single message text) |
| g91 | MessageListDefinition | chunks.161.mjs:587 | component (full conversation list, wrapped by P8z) |
| P8z | MessageList | chunks.161.mjs:587 | component (memoized wrapper around g91) |
| n9q | MessageComponent | chunks.161.mjs | component (single message renderer) |
| f8z | isNotProgress | chunks.161.mjs:571 | function (filters out progress-type messages) |

### Message Pipeline Functions (chunks.172.mjs, chunks.173.mjs, chunks.160.mjs, chunks.174.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iW1 | handleStreamEvent | chunks.173.mjs:390-488 | function (central dispatcher: stream_event → UI state transitions, text/tool/thinking callbacks) |
| DJq | createAssistantMessage | chunks.172.mjs:2860 | function (constructs assistant message object) |
| t9q | normalizeDisplayMessages | chunks.172.mjs:3072 | function (groups tool uses with hooks+results) |
| q9q | groupToolResults | chunks.160.mjs:1849 | function (collapses repeated tool executions) |
| WJ | normalizeMessages | chunks.173.mjs:89 | function (raw messages → render-ready format) |
| dzz | reorderAttachments | chunks.172.mjs:3244 | function (positions attachments near their turns) |
| QbA | extractToolInfo | chunks.160.mjs | function (extracts toolName/messageId from message) |
| XJq | isToolUseMessage | chunks.160.mjs | function (detects assistant tool_use messages) |
| dd1 | isHookAttachment | chunks.160.mjs | function (detects hook event attachments) |
| EN | getVisibleMessagesAfterCompact | chunks.173.mjs:1286 | function (slices messages to show only post-compact) |
| Y2z | findLastCompactBoundary | chunks.173.mjs | function (finds last compact_boundary index) |
| qYq | shouldShowMessageInChat | chunks.173.mjs:1292 | function (filters isMeta and visibility tier) |
| pmA | isApiErrorMessage | chunks.173.mjs | function (detects API error messages) |
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

### Dialog Components (chunks.188.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _Wq | ToolPermissionDialog | chunks.188.mjs:1197 | component (tool use approval) |
| wUA | SandboxPermissionDialog | chunks.188.mjs:1168 | component (network/sandbox approval) |
| dMq | CostWarningDialog | chunks.188.mjs:1261 | component (API cost threshold warning) |
| Nx7 | IDEOnboardingDialog | chunks.188.mjs:1268 | component (IDE extension setup wizard) |
| kLq | LSPRecommendationDialog | chunks.188.mjs:1271 | component (LSP plugin suggestion) |
| fMq | MessageSelectorDialog | chunks.188.mjs:1337 | component (conversation history browser) |
| nQA | WorkerRequestDisplay | chunks.188.mjs:1205 | component (passive worker request banner) |
| GR4 | SpinnerComponent | chunks.188.mjs:1142 | component (loading indicator with mode text) |

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

