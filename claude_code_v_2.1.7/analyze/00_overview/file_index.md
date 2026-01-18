# File Index - Claude Code 2.1.7

> Maps chunk files to their content and key functions.
> Total: 157 chunk files, 16,225 symbols

---

## Quick Navigation

- [High-Symbol Files](#high-symbol-files-top-30) - Files with most symbols
- [Core Modules](#core-modules) - Agent loop, tools, API
- [New Features](#new-features-217) - Background agents, LSP, Chrome
- [Infrastructure](#infrastructure) - MCP, telemetry, auth

---

## High-Symbol Files (Top 30)

| File | Symbols | Expected Content |
|------|---------|------------------|
| chunks.1.mjs | 976 | Foundation runtime, module loader, global utilities |
| chunks.153.mjs | 463 | LLM API, System Prompts (from 2.0.59) |
| chunks.55.mjs | 366 | **File System** - Directory walking (JEB class), file type filtering (500+ extensions) |
| chunks.78.mjs | 364 | Azure Auth helpers, token management |
| chunks.58.mjs | 336 | Core feature class (bQ1), stream utilities |
| chunks.16.mjs | 332 | Tool constants, figures, frontmatter parsing |
| chunks.86.mjs | 304 | **Plan Mode** - Session ID generation (Z12 "sparkling-fox-baking" names) |
| chunks.68.mjs | 285 | Shell command wrapper, bash utilities |
| chunks.77.mjs | 267 | UI components, React context |
| chunks.46.mjs | 257 | **HTTP** - BtQ request handler class |
| chunks.85.mjs | 251 | Async generator utilities (v51) |
| chunks.148.mjs | 244 | **Attachment normalization** - q$7, OuA, MuA, hO message construction |
| chunks.66.mjs | 236 | sD8 object exports, tqB utilities |
| chunks.89.mjs | 234 | **Azure SDK** - PG1 service class |
| chunks.79.mjs | 233 | State management helpers |
| chunks.19.mjs | 223 | Tool name constants |
| chunks.136.mjs | 223 | **Agent Loop** - Background agent result processing (f09, _Z7) |
| chunks.91.mjs | 219 | t75, J32 utility functions |
| chunks.82.mjs | 214 | **Azure Auth** - C9A service class, hl8 API version |
| chunks.151.mjs | 210 | **IDE Integration** - VW9 component handler |
| chunks.112.mjs | 202 | **Shell Parser** - CWD reset detection (Fb5), stderr cleaning |
| chunks.152.mjs | 198 | Skill loading, output style |
| chunks.155.mjs | 196 | Commander.js framework |
| chunks.135.mjs | 195 | **CRITICAL: Agent Loop Core** - v19 main async generator |
| chunks.107.mjs | 190 | Compact, attachments, telemetry |
| chunks.53.mjs | 188 | **File System** - Directory filtering functions (Xa, CFB, qFB) |
| chunks.131.mjs | 187 | **MCP Management (2.1.7)** - Wildcard permissions (hB7), server config |
| chunks.63.mjs | 185 | **WebSocket** - Permessage-deflate, buffer masking, frame fragmentation |
| chunks.57.mjs | 184 | **Stream Utilities** - DY8 stream function |
| chunks.150.mjs | 183 | **IDE Integration** - Edit approval UI (AD9), DIFF_REJECTED handling |

---

## Core Modules (From 2.0.59 Analysis)

### Entry & CLI
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.157.mjs | Main CLI program, Commander.js | D_7 (mainEntry), J_7 (commandHandler), nX9 (mcpCliHandler) |
| cli.chunks.mjs | MCP CLI (--mcp-cli mode), 5441 lines | de (mcpProgram), qU7 (callMcpTool), NU7 (readMcpResource) |
| chunks.149.mjs | Commander.js library | O$1 (Command), LK (Option) |

### Agent Loop & Tool Execution
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.146.mjs | Main agent loop, tool executor | mainAgentLoop, StreamingToolExecutor |

### LLM API
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.153.mjs | API streaming, request building | streamApiCall, buildRequestPayload |
| chunks.121.mjs | Retry wrapper, prompt hooks | retryWrapper, executePromptHook |

### System Prompts
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.152.mjs | Core system prompt | getCoreSystemPrompt |
| chunks.107.mjs | Attachments, reminders | generateAllAttachments |

### Tools
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.16.mjs | BASH_TOOL_NAME constant | C9 |
| chunks.19.mjs | READ/WRITE/EDIT tool names | d5, wX, $5 |
| chunks.60.mjs | TodoWrite tool | BY, QEB |
| chunks.130.mjs | Skills, Plan mode tools | ln, gq |

### Agents & Subagents
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.125.mjs | Built-in agents, agent helpers | generalPurposeAgent, exploreAgent |
| chunks.145.mjs | Task tool, subagent execution | executeAgent, TaskTool |

### Compact
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.107.mjs | Auto-compact, micro-compact | fullCompact, autoCompactDispatcher |

### Hooks
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.147.mjs | Hook execution | executeHooksInREPL |
| chunks.146.mjs | Shell/agent hooks | executeShellHook, executeAgentHook |

### Skills
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.130.mjs | Skill tool definition | SkillTool |
| chunks.152.mjs | Skill loading | loadSkillsFromDirectory |

---

## New Features (2.1.7)

### Background Agents (2.0.60)
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.136.mjs | Background agent result processing, aggregation | f09, _Z7 |
| chunks.146.mjs | Ctrl+B backgrounding integration | backgroundSignalMap, agentBackgroundHandler |
| chunks.154.mjs | Task file storage, symlink management | createTaskNotification, getTaskOutputPath |

### LSP Tool (2.0.74)
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.142.mjs | LSP server initialization, manager | LspServerManager, LspServerInstance |
| chunks.143.mjs | LSP tool definition, operations | LspTool, goToDefinition, findReferences |
| chunks.144.mjs | LSP client, workspace sync | LspClient, syncDocument |

### Chrome Integration (2.0.72)
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.145.mjs:4-445 | MCP tool definitions (18 tools) | Pe (CHROME_MCP_TOOLS) |
| chunks.145.mjs:787-970 | SocketClient for IPC | AZ9 (SocketClient), z8A (SocketConnectionError) |
| chunks.145.mjs:1259-1309 | Enable/config logic | az1, I$A, oz1 |
| chunks.157.mjs:1679-1816 | NativeHostServer | QI9 (NativeHostServer), BI9 (StdinReader) |

### MCP Auto-Search (2.1.7)
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.131.mjs | MCP server management, auto-search | mcpAutoSearch, searchMcpTools |
| chunks.101.mjs | MCP state initialization | initializeMcpState, mcpClientState |

### Wildcard Permissions (2.1.2)
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.131.mjs | Wildcard pattern matching | hB7 (wildcardPermissionRegex), checkPermissionPattern |
| chunks.121.mjs | Permission validation | validateWildcardPermission, matchWildcard |

---

## Infrastructure

### State Management
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.70.mjs | App state, React context | appState, AppStateProvider |
| chunks.154.mjs | Session storage paths | getProjectDir |
| chunks.106.mjs | Settings, todo persistence | loadSettings |

### MCP
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.101.mjs | MCP state initialization | initializeMcpState |

### Telemetry
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.107.mjs | BigQuery metrics | metrics endpoint |

### Auth
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.88.mjs | API client creation | createApiClient |

### Sandbox/Permissions
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.131.mjs | MCP wildcard permissions, pattern matching | hB7 (wildcardPermissionRegex) |
| chunks.115.mjs | Tool checkPermissions methods | Various per-tool |
| chunks.119.mjs | Tool checkPermissions methods | Various per-tool |
| chunks.147.mjs | Permission check orchestration | Line 1568 |

---

## File Analysis Progress

| Status | Count | Description |
|--------|-------|-------------|
| Fully Documented | 52 | Core modules + new features (with content descriptions) |
| Categorized | ~70 | Module category known |
| Not Mentioned | ~105 | Foundation/utility files not explicitly documented |

**Note:** The 105 undocumented files are primarily:
- chunks.2-15 (foundation/initialization)
- chunks.20-39 (utilities, parsers)
- chunks.92-99 (mid-range utilities)
- These contain vendor libraries and utilities, not core Claude Code logic

---

## Complete Chunk Categorization by Module

### PLATFORM INFRASTRUCTURE

#### HTTP/Network (Fetch API)
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.40.mjs | HTTP client headers, request objects | LmQ, OmQ, xsA |
| chunks.45.mjs | HTTP request/response protocol, body handling | Request, Response |
| chunks.46.mjs | HTTP request handler class | BtQ |

#### Telemetry/Observability
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.50.mjs | OpenTelemetry constants (200+ ATTR_*) | ATTR_HTTP_METHOD, etc. |
| chunks.100.mjs | OTLP encoding (hrTimeToNanos, binary) | hrTimeToNanos, encodeAsLongBits |

#### Authentication (Azure)
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.80.mjs | Azure MSAL OAuth/OIDC token handling | t31 (token manager), acquireToken |
| chunks.82.mjs | Azure auth service integration | C9A, hl8 (API version) |
| chunks.89.mjs | Azure SDK service class | PG1 |

---

### CORE FEATURES

#### Agent Loop (CRITICAL)
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.135.mjs | **Main v19 agent loop generator** | v19, canUseTool, orphanedPermission |
| chunks.136.mjs | Agent result processing, background integration | f09, _Z7 |
| chunks.146.mjs | Tool executor, streaming | mainAgentLoop, StreamingToolExecutor |

#### Plan Mode
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.86.mjs | Session ID generation ("sparkling-fox-baking") | Z12 (generateProcName) |
| chunks.130.mjs | Plan mode tools, skill integration | ln, gq |

#### File System
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.53.mjs | Directory filtering utilities | Xa, CFB, qFB |
| chunks.55.mjs | Directory walking stream (500+ file types) | JEB (StreamWalker), vr1 (filter) |
| chunks.57.mjs | Stream utilities | DY8 |

#### Shell Parser
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.112.mjs | CWD reset detection, stderr cleaning | Fb5 (extractCwdReset), UT2 (CWD_RESET_REGEX) |
| chunks.121.mjs | Shell security analysis, operator checking | Mf (shellOperatorChecker), dangerous patterns |
| chunks..123.mjs | Tree-sitter parser, command analysis | cK1 (shellCommandParser), mm2 (RichCommand) |
| chunks.147.mjs | Tokenization, redirection extraction | ZfA (tokenizeCommand), Hx (extractOutputRedirections) |

---

### NEW FEATURES (2.0.60+)

#### Background Agents (2.0.60)
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.136.mjs | Result aggregation | f09, _Z7 |
| chunks.146.mjs | Ctrl+B handler | backgroundSignalMap |
| chunks.154.mjs | Task file storage | createTaskNotification |

#### Chrome Integration (2.0.72)
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.145.mjs | Full Chrome module (tools, socket, config) | AZ9, QI9, Pe |
| chunks.149.mjs | Skill registration | TI9 (registerClaudeInChromeSkill) |
| chunks.157.mjs | Native host server, stdin reader | QI9, BI9 |

#### IDE Integration (2.0.71)
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.150.mjs | Edit approval UI, DIFF_REJECTED | AD9 |
| chunks.151.mjs | IDE component handler | VW9 |

#### MCP Management (2.1.7)
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.131.mjs | MCP config, wildcard permissions | hB7, sfA (getSocketPath) |

---

### UI/RENDERING
| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.60.mjs | React UI components, error handling | lCB, createElement |
| chunks.77.mjs | UI components, React context | various |
| chunks.150.mjs | Edit approval UI | AD9 |
| chunks.151.mjs | IDE component handlers | VW9 |

---

### PREVIOUSLY TBD - NOW ANALYZED

#### chunks.148.mjs (244 symbols)
**Content:** Attachment normalization and system message construction for Agent Loop
**Key Functions:**
- `q$7` (normalizeAttachmentForAPI) - Converts attachments to LLM format
- `OuA` (mapToolResultToContent) - Tool result mapping
- `MuA` (createToolCallMessage) - Message blocks for tool invocations
- `hO` (createSystemMessage) - System-level informational messages
- `V19` (createStopHookSummary) - Hook execution aggregation
- `qc` (isCompactBoundary), `N$7` (findLastCompactBoundary), `_x` (getMessagesAfterCompaction)
**Module:** Core Execution - Agent Loop / System Messages

#### chunks.63.mjs (185 symbols)
**Content:** WebSocket protocol utilities, buffer management, compression
**Key Functions:**
- `YqB` - Permessage-deflate extension (RFC 7692)
- `AqB` - Concurrent job queue for compression
- Buffer masking/unmasking utilities (sUB, tUB)
- Zlib stream compression/decompression
- Frame fragmentation and payload validation
**Module:** Infra/Platform - WebSocket/Network

#### chunks.66.mjs (236 symbols)
**Content:** React/Ink terminal UI rendering engine
**Key Components:**
- React renderer with host config and Yoga layout engine
- Color system: Light/dark/ANSI themes (60+ colors)
- `C21` (KeypressEvent), `p_A` (TerminalEvent) - Input handling
- `AW8`, `QW8`, `BW8` - Theme color objects
- Terminal mode controls and synchronization
**Module:** UI/Integration - Terminal UI (Ink)

#### chunks.91.mjs (219 symbols)
**Content:** Plugin marketplace management and configuration
**Key Functions:**
- `t75` (generateCacheId) - Cache identifier from marketplace source
- `J32` (loadJsonWithSchema) - JSON validation
- `VI0` (fetchMarketplace) - Multi-source support (URL, GitHub, git, file)
- `NS` (installMarketplace), `_Z1` (removeMarketplace)
- `rC` - Marketplace loader with caching
- Plugin reference parsing, scope mapping, settings migration
**Module:** Infra/Integration - Plugin System

---

## Module Consolidation Notes (v2.0.59 → v2.1.7)

### Slash Command Module (09)
v2.0.59 had 8 files, v2.1.7 has 4 files:

**Removed Files - Content Relocated:**
| File | Size | New Location |
|------|------|--------------|
| context.md | 37K | Merged into execution.md |
| output_style.md | 23K | Moved to 25_plugin/schemas.md (output style definitions) |
| prompt_suggestions.md | 37K | Merged into builtin_commands.md |
| streaming_errors.md | 17K | Moved to 03_llm_core/stream_aggregation.md |

**Retained Files:**
- builtin_commands.md (19K → reduced from 42K, focused on core commands)
- custom_commands.md (15K → reduced from 25K)
- execution.md (20K → includes context info)
- parsing.md (16K → reduced from 29K)

### LLM Core Module (03)
v2.0.59 had 5 files, v2.1.7 has 7 files:

**New Files:**
- response_abstraction.md (742 lines) - Response type handling
- stream_aggregation.md (755 lines) - **Includes streaming_errors content**

---

## Performance Constants & Rationale

### Retry Configuration

| Constant | Value | Location | Rationale |
|----------|-------|----------|-----------|
| MAX_RETRIES (API) | 10 | chunks.112.mjs:999 | Balance between resilience and user wait time |
| MAX_RETRIES (Session) | 10 | chunks.154.mjs | Optimistic locking conflicts during concurrent writes |
| BASE_DELAY_MS | 500ms | chunks.154.mjs | Initial backoff for exponential retry |
| maxRetries (Segment) | 3 | chunks.110.mjs:928 | Telemetry is non-critical, fail fast |
| maxRetries (Azure SDK) | 20 | chunks.77.mjs:2384 | Azure SDK default for transient failures |
| maxRetries (gRPC) | 5 | chunks.48.mjs:2103 | Standard gRPC retry policy |

### Timeout Configuration

| Constant | Value | Location | Rationale |
|----------|-------|----------|-----------|
| API_TIMEOUT_MS | env override | chunks.110.mjs:1746 | Configurable for slow networks |
| OTEL_SHUTDOWN_TIMEOUT_MS | 2000ms | chunks.107.mjs:332 | Quick shutdown, non-blocking |
| OTEL_FLUSH_TIMEOUT_MS | 5000ms | chunks.107.mjs:438 | Allow telemetry flush before exit |
| USER_ACTIVITY_TIMEOUT_MS | 5000ms | chunks.107.mjs:1735 | Detect user presence for auto-compact |
| NORMAL_TIMEOUT | 50ms | chunks.67.mjs:41 | Input debounce |
| PASTE_TIMEOUT | 500ms | chunks.67.mjs:42 | Paste detection window |

### Polling & Intervals

| Constant | Value | Location | Rationale |
|----------|-------|----------|-----------|
| Task polling | 100ms | chunks.119.mjs | Balance responsiveness vs CPU |
| Remote session polling | 1000ms | chunks.121.mjs | Balance API load vs updates |
| Telemetry export interval | configurable | chunks.107.mjs:146 | Batch efficiency |

### Buffer Limits

| Constant | Value | Location | Rationale |
|----------|-------|----------|-----------|
| ATTRIBUTE_COUNT_LIMIT | 128 | chunks.106.mjs:2145 | OpenTelemetry standard |
| TASK_MAX_OUTPUT_LENGTH | env | chunks.119.mjs | Prevent context overflow |

**Design principle:** Configurable via environment variables where possible, with sensible defaults that balance responsiveness, reliability, and resource usage.

---

## Chunk Range Summary

| Range | Primary Content |
|-------|-----------------|
| 1-20 | Foundation, constants, tool names |
| 20-40 | Utilities, parsers (shell-parse wrapper) |
| 40-60 | HTTP, file system, UI components |
| 60-80 | Shell utilities, state management |
| 80-100 | Azure auth, plan mode, telemetry encoding |
| 100-120 | MCP state, compact logic |
| 120-140 | Shell parser, MCP management, agent loop |
| 140-157 | Chrome, IDE, LSP integration, CLI entry |
