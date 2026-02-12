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

---

## Module: Sandbox

> Full analysis: [05_tools/security_validation.md](../05_tools/security_validation.md)

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



