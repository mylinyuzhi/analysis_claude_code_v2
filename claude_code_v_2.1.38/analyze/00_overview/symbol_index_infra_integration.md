# Symbol Index - Integration Infrastructure (Claude Code 2.1.38)

> Symbol mapping table Part 4: External integrations and UI components
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.

---

## Quick Navigation

- [LSP Integration](#module-lsp-integration) - **NEW in 2.1.20**
- [Browser Control](#module-browser-control) - **NEW in 2.1.25**
- [IDE Integration](#module-ide-integration)
- [UI Components](#module-ui-components)
- [Plugin System](#module-plugin-system)
- [Code Indexing](#module-code-indexing)
- [Shell Parser](#module-shell-parser)
- [Slash Commands](#module-slash-commands)

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

### Indexing Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| LiY | getFileIndex | chunks.152.mjs:1007 | function |
| xiY | rebuildIndex | chunks.152.mjs:1164 | function |
| SiY | getFilesUsingGit | chunks.152.mjs:1077 | function |
| uiY | searchFileIndex | chunks.152.mjs:1226 | function |
| OIA | refreshIndexCache | chunks.152.mjs:1275 | function |
| IiY | getProjectFiles | chunks.152.mjs:1148 | function |
| BAq | loadIgnorePatterns | chunks.152.mjs:1055 | function |
| sG1 | nativeFileIndex | chunks.152.mjs:1342 | variable |
| tG1 | jsFileListCache | chunks.152.mjs:1344 | variable |
| RiY | CACHE_TTL_MS | chunks.152.mjs:1350 | constant (60000) |

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

---

## Module: IDE Integration

> Full analysis: [22_ide_integration/overview.md](../22_ide_integration/overview.md)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iV | findConnectedIdeClient | chunks.80.mjs:1868 (Ln 217207) | function |
| mx7 | closeAllDiffTabs | chunks.80.mjs:1874 (Ln 217212) | function |
| hx7 | sendIdeConnectedNotification | chunks.145.mjs:2183 | function |
| fVq | useIdeSelection / trackMcpIdeStatus | chunks.186.mjs:410 (Ln 482303) | function (hook) |
| oMz | selectionChangedSchema | chunks.186.mjs:463 (Ln 482347) | object (Zod) |
| VG6 | WebSocketClientTransport | chunks.144.mjs:? | class |

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

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| xM6 | trackSkillUsage | chunks.130.mjs:1383 | function |
| bM6 | getDecayedSkillScore | chunks.130.mjs:1399 | function |

### Hook Registration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| IM6 | registerSkillHooks | chunks.130.mjs:1361 | function |

---

## Module: UI Components (Ink)

> Full analysis: [03_llm_core/ui_linkage.md](../03_llm_core/ui_linkage.md) - LLM streaming → UI render pipeline

### Message Rendering Components (chunks.161.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KYq | SessionLogRenderer | chunks.161.mjs:917 | component (transcript display) |
| Yd1 | AssistantMessageRenderer | chunks.161.mjs:874 | component (single message text) |
| g91 | MessageTranscript | chunks.161.mjs:600 | component (full conversation list) |

### Tool Output Components (chunks.162.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BYq | BashOutputRenderer | chunks.162.mjs:3 | component (shell output detail panel) |

### Stream Event Processing (chunks.173.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iW1 | processStreamEvent | chunks.173.mjs:390 | function (routes stream events to React state) |
| DJq | createAssistantMessage | chunks.172.mjs:2860 | function (constructs assistant message object) |

