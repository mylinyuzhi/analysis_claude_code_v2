# Claude Code v2.0.59 - Detailed File & Function Mapping

## Overview

This document provides a comprehensive mapping of chunk files to their functionality, with **function-level detail** for quick code lookup.

## File Count Summary

- **Total chunk files**: 80 files
- **Total lines of code**: ~241,704 lines
- **Average file size**: ~3,000 lines / ~95KB per file

---

## Quick Reference by Topic

### "I want to understand..."

| Topic | Primary File | Key Functions | Lines |
|-------|-------------|---------------|-------|
| **Main entry point** | chunks.158.mjs | `mu3()`, `hu3()` | 1-200 |
| **CLI argument parsing** | chunks.155.mjs | Commander.js setup | 1-500 |
| **LLM API streaming** | chunks.153.mjs | `$E9()` (streamApiCall) | 3-361 |
| **Retry logic** | chunks.121.mjs | `t61()` (retryWrapper) | 1988-2046 |
| **System prompts** | chunks.107.mjs | `gCB()`, `rnA()` | 1-200 |
| **System reminders** | chunks.107.mjs | `JH5()`, `FH5()` | 1813-1900 |
| **Attachment conversion** | chunks.154.mjs | `kb3()` | 1-400 |
| **Tool definitions** | chunks.125.mjs | Tool interfaces | 400-900 |
| **Bash tool** | chunks.106.mjs | `call()` method | 775-850 |
| **Read tool** | chunks.88.mjs | `call()` method | 1258-1400 |
| **Write tool** | chunks.122.mjs | `call()` method | 3371-3450 |
| **Glob/Grep tools** | chunks.125.mjs | `call()` methods | 529-890 |
| **Edit tool** | chunks.123.mjs | `call()` method | 1-300 |
| **TodoWrite tool** | chunks.60.mjs | `call()` method | 1124-1200 |
| **Built-in agents** | chunks.125.mjs | `o51`, `Gf2`, `xq`, `kWA` | 1243-1500 |
| **claude-code-guide agent** | chunks.60.mjs | `iCB` | 783-897 |
| **Task tool dispatch** | chunks.145.mjs | agent spawning | 1-400 |
| **Hook schema** | chunks.122.mjs | hook types | 1-500 |
| **Hook execution** | chunks.147.mjs | `executeHook()` | 1-600 |
| **Slash commands** | chunks.121.mjs | command parsing | 1-500 |
| **Skill system** | chunks.94.mjs | `b69()`, `VK0()` | 1-400 |
| **Compact/summarization** | chunks.107.mjs | `R91()` prompt | 537-733 |
| **Plan mode** | chunks.107.mjs | `VH5()` | 1700-1800 |
| **Tree-sitter WASM** | chunks.89.mjs | Parser, Language | 1-600 |
| **App state (f0)** | chunks.158.mjs | state structure | 500-1000 |
| **MCP client** | chunks.131.mjs | `D1A()` | 1-400 |
| **Telemetry** | chunks.117.mjs | `M9()`, `GA()` | 1-500 |

---

## Detailed Function Index

### Core Entry & Bootstrap

| Function | Readable Name | Description | File | Lines |
|----------|---------------|-------------|------|-------|
| `mu3` | mainEntry | Main CLI entry point, Commander setup | chunks.158.mjs | 1-50 |
| `hu3` | commandHandler | Pre-action hook, mode selection | chunks.158.mjs | 51-150 |
| `FU9` | initializeConfig | Configuration and database init | chunks.158.mjs | 200-300 |
| `ju3` | runMigrations | Database migrations | chunks.158.mjs | 300-400 |
| `VG` | renderInteractive | Start interactive React app | chunks.158.mjs | 400-500 |
| `Rw9` | runNonInteractive | Print mode execution | chunks.158.mjs | 500-600 |
| `WVA` | MainInteractiveApp | Main React component | chunks.158.mjs | 600-900 |

### LLM API Calling

| Function | Readable Name | Description | File | Lines |
|----------|---------------|-------------|------|-------|
| `$E9` | streamApiCall | Async generator for streaming API | chunks.153.mjs | 3-361 |
| `t61` | retryWrapper | Retry with exponential backoff | chunks.121.mjs | 1988-2046 |
| `Kq` | createApiClient | Create Anthropic/Bedrock client | chunks.88.mjs | 3-105 |
| `U` | buildRequestPayload | Construct API request | chunks.153.mjs | 100-200 |

### System Prompts & Reminders

| Function | Readable Name | Description | File | Lines |
|----------|---------------|-------------|------|-------|
| `gCB` | getCoreSystemPrompt | Main system prompt | chunks.152.mjs | 1-100 |
| `rnA` | getSessionTypeIdentity | Session identity selection | chunks.107.mjs | 50-100 |
| `HE9` | getMCPToolsPrompt | MCP CLI instructions | chunks.107.mjs | 100-200 |
| `JH5` | generateAllAttachments | Main attachment orchestrator | chunks.107.mjs | 1813-1829 |
| `aY` | wrapWithErrorHandling | Attachment error wrapper | chunks.107.mjs | 1832-1856 |
| `FH5` | criticalSystemReminder | User-configured reminder | chunks.107.mjs | 378-386 |
| `wH5` | generateChangedFiles | File change detection | chunks.107.mjs | 1860-1920 |
| `qH5` | generateNestedMemory | Nested memory attachment | chunks.107.mjs | 1920-1960 |
| `DH5` | generateUltraClaudeMd | CLAUDE.md processing | chunks.107.mjs | 1960-2000 |
| `VH5` | generatePlanMode | Plan mode context | chunks.107.mjs | 2000-2050 |
| `_H5` | generateTodoReminders | Todo list reminders | chunks.107.mjs | 2050-2100 |
| `vH5` | generateTeammateMailbox | Async messages | chunks.107.mjs | 2100-2150 |
| `kb3` | convertToSystemMessage | Attachment → API message | chunks.154.mjs | 3-321 |
| `R91` | getSummarizationPrompt | Compact prompt template | chunks.107.mjs | 537-733 |

### Tool System

| Function | Readable Name | Description | File | Lines |
|----------|---------------|-------------|------|-------|
| `C9` | BASH_TOOL_NAME | Bash tool constant | chunks.16.mjs | 1367 |
| `d5` | READ_TOOL_NAME | Read tool constant | chunks.19.mjs | 499 |
| `wX` | WRITE_TOOL_NAME | Write tool constant | chunks.19.mjs | 2176 |
| `$5` | EDIT_TOOL_NAME | Edit tool constant | chunks.19.mjs | 449 |
| `iK` | GLOB_TOOL_NAME | Glob tool constant | chunks.19.mjs | 2147 |
| `xY` | GREP_TOOL_NAME | Grep tool constant | chunks.19.mjs | 2172 |
| `A6` | TASK_TOOL_NAME | Task tool constant | chunks.19.mjs | - |
| `QEB` | TODOWRITE_TOOL_NAME | TodoWrite constant | chunks.60.mjs | 1124 |
| `$X` | WEBFETCH_TOOL_NAME | WebFetch constant | chunks.19.mjs | 428 |
| `WS` | WEBSEARCH_TOOL_NAME | WebSearch constant | chunks.19.mjs | 2232 |
| `JS` | NOTEBOOKEDIT_TOOL_NAME | NotebookEdit constant | chunks.19.mjs | 2192 |

### Tool Implementations

| Tool | call() Location | Key Logic |
|------|-----------------|-----------|
| **Bash** | chunks.106.mjs:775-850 | Command execution, timeout, background |
| **Read** | chunks.88.mjs:1258-1400 | Multi-type file reading (text/image/PDF/notebook) |
| **Write** | chunks.122.mjs:3371-3450 | File creation with validation |
| **Edit** | chunks.123.mjs:1-300 | String replacement with validation |
| **Glob** | chunks.125.mjs:886-950 | Pattern matching via fast-glob |
| **Grep** | chunks.125.mjs:529-812 | Ripgrep wrapper with modes |
| **TodoWrite** | chunks.60.mjs:1136-1200 | Todo state management |

### Built-in Agents

| Variable | Agent Type | Description | File | Lines |
|----------|------------|-------------|------|-------|
| `o51` | general-purpose | Multi-purpose research agent | chunks.125.mjs | 1243-1267 |
| `Gf2` | statusline-setup | Status line configuration | chunks.125.mjs | 1272-1360 |
| `xq` | Explore | Fast read-only exploration | chunks.125.mjs | 1366-1413 |
| `kWA` | Plan | Software architect agent | chunks.125.mjs | 1420-1484 |
| `iCB` | claude-code-guide | Documentation guide | chunks.60.mjs | 783-897 |
| `N70` | getBuiltInAgents | Agent list function | chunks.125.mjs | 1489-1493 |

### Hook System

| Function | Readable Name | Description | File | Lines |
|----------|---------------|-------------|------|-------|
| `Oy3` | executeCommandHook | Run command hook | chunks.147.mjs | 100-200 |
| `Iy3` | executePromptHook | Run prompt hook | chunks.147.mjs | 200-300 |
| `By3` | executeAgentHook | Run agent hook | chunks.147.mjs | 300-400 |
| `Qy3` | executeCallbackHook | Run callback hook | chunks.147.mjs | 400-500 |
| `Ay3` | executeFunctionHook | Run function hook | chunks.147.mjs | 500-600 |
| `ZN` | DEFAULT_TIMEOUT | 60000ms timeout | chunks.147.mjs | constant |

### Skill System

| Function | Readable Name | Description | File | Lines |
|----------|---------------|-------------|------|-------|
| `b69` | loadSkillFile | Load skill from file | chunks.94.mjs | 100-200 |
| `VK0` | loadSkillCommands | Load from directories | chunks.94.mjs | 200-300 |
| `Sv3` | aggregateSkills | Combine all skills | chunks.94.mjs | 300-400 |

### State Management

| Structure | Description | File | Lines |
|-----------|-------------|------|-------|
| `f0` | Application state object | chunks.158.mjs | 500-700 |
| `Yu` | State update callback | chunks.158.mjs | 700-750 |
| `$T` | Settings loader | chunks.158.mjs | 200-250 |
| `e1` | Session ID resolver | chunks.158.mjs | 250-280 |

### Tree-sitter / Code Indexing

| Class | Description | File | Lines |
|-------|-------------|------|-------|
| `Parser` | WASM parser wrapper | chunks.89.mjs | 100-200 |
| `Language` | Language definition | chunks.89.mjs | 200-300 |
| `Tree` | Parsed AST | chunks.89.mjs | 300-400 |
| `TreeCursor` | AST traversal | chunks.89.mjs | 400-500 |
| `Node` | AST node | chunks.89.mjs | 500-600 |
| `marshalNode` | Node → WASM memory | chunks.89.mjs | 50-80 |
| `unmarshalNode` | WASM → Node | chunks.89.mjs | 80-110 |

### MCP Protocol

| Function | Readable Name | Description | File | Lines |
|----------|---------------|-------------|------|-------|
| `D1A` | connectMcpServer | Connect to MCP server | chunks.131.mjs | 100-200 |
| `y32` | callMcpTool | Execute MCP tool | chunks.131.mjs | 200-300 |
| `b10` | processMcpResult | Handle MCP result | chunks.131.mjs | 300-400 |
| `v10` | batchConnect | Connect multiple servers | chunks.131.mjs | 400-500 |

### Telemetry

| Function | Readable Name | Description | File | Lines |
|----------|---------------|-------------|------|-------|
| `M9` | telemetryMarker | Lifecycle markers | chunks.117.mjs | 100-200 |
| `GA` | analyticsEvent | Event tracking | chunks.117.mjs | 200-300 |
| `AA` | errorLog | Error logging | chunks.117.mjs | 300-400 |

---

## Data Structures Index

| Structure | Description | File | Lines |
|-----------|-------------|------|-------|
| **f0** | Complete application state | chunks.158.mjs | 500-700 |
| **Tool Interface** | Tool definition schema | chunks.125.mjs | 100-150 |
| **Agent Config** | Agent definition structure | chunks.125.mjs | 1200-1240 |
| **Hook Schema** | Hook configuration types | chunks.122.mjs | 1-100 |
| **Attachment Types** | 23+ attachment types | chunks.107.mjs | 1800-2200 |
| **Message Format** | API message structure | chunks.154.mjs | 1-50 |
| **Stream Events** | Streaming event types | chunks.153.mjs | 200-300 |

### f0 Application State Structure

```
f0 = {
  settings           // User settings from settings.json
  messages           // Conversation history
  toolPermissionContext  // Current permission mode
  backgroundTasks    // Running background shells (Map)
  asyncAgents        // Running subagents (Map)
  agentId            // Current session/agent ID
  verbose            // Verbose logging mode
  mainLoopModel      // Current model
  mcpClients         // Connected MCP servers
  mcpTools           // Available MCP tools
  pluginState        // Plugin data
  notificationQueue  // Pending notifications
  elicitation        // User questions
  todos              // Current todo list items
  fileHistory        // Read file tracking (Map)
  sessionHooks       // Programmatic hooks
  promptSuggestions  // Suggested prompts
  commandQueue       // Queued commands
  gitDiff            // Tracked git diff
}
```

---

## File Section Breakdown

### chunks.153.mjs (LLM API)

| Lines | Content |
|-------|---------|
| 1-50 | Imports, constants |
| 51-100 | Helper functions |
| 100-200 | Request payload building |
| 200-300 | Stream event processing |
| 300-361 | Error handling, fallback |

### chunks.107.mjs (System Prompts & Reminders)

| Lines | Content |
|-------|---------|
| 1-200 | System prompt templates |
| 200-400 | Prompt helper functions |
| 400-536 | Session prompts |
| 537-733 | Summarization prompt (R91) |
| 733-1000 | Context injection |
| 1000-1500 | CLAUDE.md processing |
| 1500-1800 | IDE integration |
| 1800-2200 | Attachment generators (JH5, wH5, etc.) |

### chunks.125.mjs (Agents & Tools)

| Lines | Content |
|-------|---------|
| 1-100 | Imports, constants |
| 100-400 | Tool interface helpers |
| 400-529 | Glob tool |
| 529-812 | Grep tool |
| 812-886 | Tool dispatching |
| 886-988 | Glob output handling |
| 988-1057 | Task tool description (ob2) |
| 1057-1178 | Tool filtering (w70, Sn) |
| 1178-1243 | Agent entry message (Af2) |
| 1243-1267 | general-purpose agent (o51) |
| 1272-1360 | statusline-setup agent (Gf2) |
| 1366-1413 | Explore agent (xq) |
| 1420-1484 | Plan agent (kWA) |
| 1489-1500 | Built-in agent list (N70) |

### chunks.60.mjs (TodoWrite & claude-code-guide)

| Lines | Content |
|-------|---------|
| 1-500 | Debounce utilities |
| 500-783 | Todo state management |
| 783-897 | claude-code-guide agent (iCB) |
| 897-1000 | Guide system prompt |
| 1000-1124 | Todo helpers |
| 1124-1200 | TodoWrite tool |

### chunks.147.mjs (Hook Execution)

| Lines | Content |
|-------|---------|
| 1-100 | Hook types, constants |
| 100-200 | Command hook execution |
| 200-300 | Prompt hook execution |
| 300-400 | Agent hook execution |
| 400-500 | Callback hook execution |
| 500-600 | Function hook execution |

---

## Alphabetical Function Index

| Function | Readable Name | File | Lines |
|----------|---------------|------|-------|
| `$5` | EDIT_TOOL_NAME | chunks.19.mjs | 449 |
| `$E9` | streamApiCall | chunks.153.mjs | 3-361 |
| `$T` | loadSettings | chunks.158.mjs | 200-250 |
| `$X` | WEBFETCH_TOOL_NAME | chunks.19.mjs | 428 |
| `A6` | TASK_TOOL_NAME | chunks.19.mjs | - |
| `AA` | errorLog | chunks.117.mjs | 300-400 |
| `Af2` | agentEntryMessage | chunks.125.mjs | 1178-1223 |
| `aY` | wrapWithErrorHandling | chunks.107.mjs | 1832-1856 |
| `Ay3` | executeFunctionHook | chunks.147.mjs | 500-600 |
| `b10` | processMcpResult | chunks.131.mjs | 300-400 |
| `b69` | loadSkillFile | chunks.94.mjs | 100-200 |
| `BsA` | InternalApp | chunks.68.mjs | 100-300 |
| `By3` | executeAgentHook | chunks.147.mjs | 300-400 |
| `C9` | BASH_TOOL_NAME | chunks.16.mjs | 1367 |
| `D1A` | connectMcpServer | chunks.131.mjs | 100-200 |
| `d5` | READ_TOOL_NAME | chunks.19.mjs | 499 |
| `DH5` | generateUltraClaudeMd | chunks.107.mjs | 1960-2000 |
| `e1` | getSessionId | chunks.158.mjs | 250-280 |
| `FH5` | criticalSystemReminder | chunks.107.mjs | 378-386 |
| `FU9` | initializeConfig | chunks.158.mjs | 200-300 |
| `GA` | analyticsEvent | chunks.117.mjs | 200-300 |
| `gCB` | getCoreSystemPrompt | chunks.152.mjs | 1-100 |
| `Gf2` | statuslineSetupAgent | chunks.125.mjs | 1272-1360 |
| `HE9` | getMCPToolsPrompt | chunks.107.mjs | 100-200 |
| `hu3` | commandHandler | chunks.158.mjs | 51-150 |
| `iCB` | claudeCodeGuideAgent | chunks.60.mjs | 783-897 |
| `iK` | GLOB_TOOL_NAME | chunks.19.mjs | 2147 |
| `Iy3` | executePromptHook | chunks.147.mjs | 200-300 |
| `JH5` | generateAllAttachments | chunks.107.mjs | 1813-1829 |
| `JS` | NOTEBOOKEDIT_TOOL_NAME | chunks.19.mjs | 2192 |
| `ju3` | runMigrations | chunks.158.mjs | 300-400 |
| `kb3` | convertToSystemMessage | chunks.154.mjs | 3-321 |
| `Kq` | createApiClient | chunks.88.mjs | 3-105 |
| `kWA` | planAgent | chunks.125.mjs | 1420-1484 |
| `M9` | telemetryMarker | chunks.117.mjs | 100-200 |
| `mu3` | mainEntry | chunks.158.mjs | 1-50 |
| `N70` | getBuiltInAgents | chunks.125.mjs | 1489-1493 |
| `o51` | generalPurposeAgent | chunks.125.mjs | 1243-1267 |
| `ob2` | taskToolDescription | chunks.125.mjs | 988-1057 |
| `Oy3` | executeCommandHook | chunks.147.mjs | 100-200 |
| `qH5` | generateNestedMemory | chunks.107.mjs | 1920-1960 |
| `QEB` | TODOWRITE_TOOL_NAME | chunks.60.mjs | 1124 |
| `Qy3` | executeCallbackHook | chunks.147.mjs | 400-500 |
| `R91` | getSummarizationPrompt | chunks.107.mjs | 537-733 |
| `rnA` | getSessionTypeIdentity | chunks.107.mjs | 50-100 |
| `Rw9` | runNonInteractive | chunks.158.mjs | 500-600 |
| `Sn` | resolveAgentTools | chunks.125.mjs | 1100-1150 |
| `Sv3` | aggregateSkills | chunks.94.mjs | 300-400 |
| `t61` | retryWrapper | chunks.121.mjs | 1988-2046 |
| `v10` | batchConnect | chunks.131.mjs | 400-500 |
| `VG` | renderInteractive | chunks.158.mjs | 400-500 |
| `VH5` | generatePlanMode | chunks.107.mjs | 2000-2050 |
| `vH5` | generateTeammateMailbox | chunks.107.mjs | 2100-2150 |
| `VK0` | loadSkillCommands | chunks.94.mjs | 200-300 |
| `w70` | filterToolsForAgent | chunks.125.mjs | 1057-1100 |
| `wH5` | generateChangedFiles | chunks.107.mjs | 1860-1920 |
| `WS` | WEBSEARCH_TOOL_NAME | chunks.19.mjs | 2232 |
| `WVA` | MainInteractiveApp | chunks.158.mjs | 600-900 |
| `wX` | WRITE_TOOL_NAME | chunks.19.mjs | 2176 |
| `xq` | exploreAgent | chunks.125.mjs | 1366-1413 |
| `xY` | GREP_TOOL_NAME | chunks.19.mjs | 2172 |
| `y32` | callMcpTool | chunks.131.mjs | 200-300 |
| `Yu` | stateUpdateCallback | chunks.158.mjs | 700-750 |
| `_H5` | generateTodoReminders | chunks.107.mjs | 2050-2100 |

---

## Functional Module Mapping

### Core Entry & CLI

| File | Primary Function | Key Functions | Lines |
|------|------------------|---------------|-------|
| chunks.158.mjs | **Main Entry Point** | mu3, hu3, VG, Rw9, WVA, f0 | all |
| chunks.155.mjs | **CLI Parsing** | Commander.js setup | 1-500 |

### User Interface (React/Ink.js)

| File | Primary Function | Key Components |
|------|------------------|----------------|
| chunks.67.mjs | **Ink Reconciler** | Custom React reconciler |
| chunks.68.mjs | **InternalApp** | BsA class, provider chain |
| chunks.70-71.mjs | UI Components | Various |
| chunks.120.mjs | Auth UI | Login components |
| chunks.126.mjs | UI Components | Various |
| chunks.130.mjs | UI Components | Various |
| chunks.140.mjs | UI Components | Various |
| chunks.142.mjs | Agent UI | Agent display |

### LLM Core & API

| File | Primary Function | Key Functions |
|------|------------------|---------------|
| chunks.153.mjs | **LLM API Calling** | $E9, stream handling |
| chunks.107.mjs | **System Prompts** | gCB, JH5, R91, attachment generators |
| chunks.152.mjs | **Core Prompts** | Main system instructions |
| chunks.154.mjs | **Message Processing** | kb3, normalization |
| chunks.121.mjs | **Retry Logic** | t61, exponential backoff |

### Tool System

| File | Primary Function | Key Functions |
|------|------------------|---------------|
| chunks.19.mjs | **Tool Constants** | C9, d5, wX, $5, iK, xY, A6 |
| chunks.125.mjs | **Tool Implementation** | Glob, Grep call() methods |
| chunks.146.mjs | **Tool Definitions** | TaskCreate, LSP tools |
| chunks.106.mjs | **Bash Tool** | Command execution |
| chunks.88.mjs | **Read Tool** | File reading |
| chunks.122.mjs | **Write Tool** | File creation |
| chunks.123.mjs | **Edit Tool** | String replacement |
| chunks.60.mjs | **TodoWrite Tool** | Task management |

### SubAgent System

| File | Primary Function | Key Functions |
|------|------------------|---------------|
| chunks.125.mjs | **Built-in Agents** | o51, Gf2, xq, kWA, N70 |
| chunks.60.mjs | **claude-code-guide** | iCB agent |
| chunks.145.mjs | **Agent Spawning** | Task tool dispatch |
| chunks.157.mjs | **Agent Communication** | Message passing |
| chunks.150.mjs | **Agent Management** | Configuration |

### Hooks & Commands

| File | Primary Function | Key Functions |
|------|------------------|---------------|
| chunks.122.mjs | **Hook Schema** | Hook type definitions |
| chunks.147.mjs | **Hook Execution** | Oy3, Iy3, By3, Qy3, Ay3 |
| chunks.121.mjs | **Slash Commands** | Command parsing |
| chunks.143-149.mjs | **Command UI** | Various |

### Skill & Plugin System

| File | Primary Function | Key Functions |
|------|------------------|---------------|
| chunks.94.mjs | **Skill System** | b69, VK0, Sv3 |
| chunks.95.mjs | **Plugin Schema** | Manifest validation |

### MCP Protocol

| File | Primary Function | Key Functions |
|------|------------------|---------------|
| chunks.131.mjs | **MCP Client** | D1A, y32, b10, v10 |
| chunks.150.mjs | **MCP Config** | Server setup |

### Code Indexing

| File | Primary Function | Key Classes |
|------|------------------|-------------|
| chunks.89.mjs | **Tree-sitter WASM** | Parser, Language, Tree, TreeCursor, Node |
| chunks.90.mjs | **Code Analysis** | Update checking |
| chunks.91.mjs | **Syntax Highlighting** | highlight.js integration |

### Telemetry & Logging

| File | Primary Function | Key Functions |
|------|------------------|---------------|
| chunks.117.mjs | **OpenTelemetry** | M9, GA |
| chunks.138.mjs | **Sentry** | Error tracking |
| chunks.57.mjs | **Logging** | AA, console logging |

---

## Dependency Analysis

### Most Common Dependencies

1. **protobufjs** - Used in ALL files (serialization)
2. **react** - Used in ~35 files (UI framework)
3. **sorted-map** - Used in ~25 files (data structures)
4. **highlight.js** - Used in ~8 files (syntax highlighting)
5. **grpc/grpc-js** - Used in ~5 files (communication)
6. **rxjs** - Used in ~4 files (reactive streams)
7. **aws-sdk** - Used in ~4 files (cloud services)
8. **opentelemetry** - Used in ~4 files (telemetry)
9. **msal** - Used in ~4 files (Microsoft auth)
10. **googleapis** - Used in ~3 files (Google services)

### Key Architecture Insights

1. **Modular Chunking**: Code is split into ~80 chunks for code-splitting/lazy loading
2. **Protobuf Everywhere**: All files use protobufjs for serialization
3. **React for UI**: Terminal UI built on React with custom Ink.js reconciler
4. **Multi-Cloud Support**: AWS (Bedrock), Google, and Azure (MSAL) integrations
5. **Observability**: OpenTelemetry + Sentry for comprehensive monitoring
