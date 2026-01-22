# Claude Code v2.1.7 Source Restoration Status

## Overview

This document tracks the restoration status of Claude Code source code from obfuscated JavaScript chunks to TypeScript.

**Overall Status: 45% Complete** (Structure: 77%, Implementation: 45%)

| Category | Modules | Status |
|----------|---------|--------|
| Complete (100%) | 4 | 13% |
| Mostly Complete (70-99%) | 6 | 20% |
| Partial (30-69%) | 10 | 33% |
| Stub/Placeholder | 6 | 20% |
| Needs Investigation | 4 | 14% |

> **Note:** Many modules marked "complete" have STUB implementations. See `GAP_ANALYSIS.md` for details.

---

## Module-by-Module Comparison

### 00_overview - Symbol Index & File Mapping
- **Target**: Reference documentation only
- **Status**: N/A (not code)
- **Files**: `symbol_index_*.md`, `file_index.md`

### 01_cli - Command Line Interface
- **Target**: `packages/cli/`
- **Status**: ✅ Mostly Complete (~95%) - Fully aligned with Source
- **Implemented**:
  - Mode detection logic (detectExecutionMode) ✅
  - Option definitions (40+ CLI options) ✅
  - Version fast path ✅
  - `mainEntry` (D_7) handler with mode switching ✅
  - 10-phase initialization pipeline (zI9) fully aligned ✅
  - Network infrastructure (mTLS, Proxy, Undici) fully aligned ✅
  - Session management (continue/resume/teleport) logic ✅
  - Commander.js full integration ✅
- **Remaining**:
  - React UI rendering (MainInteractiveApp) - Mostly complete in entry.ts but relies on `packages/ui`
- **Mode Handlers Status**: Most modes are now fully implemented or correctly delegate to specialized handlers.

### 02_ui - Terminal User Interface
- **Target**: `packages/ui/`
- **Status**: ⚠️ Partial (~40%)
- **Restored**:
  - `src/markdown/renderer.ts` - Markdown rendering
  - `src/components/spinner.ts` - Loading spinner
  - `src/components/status.ts` - Status display
- **Missing**:
  - React component tree
  - Ink terminal renderer integration
  - Interactive input components
  - Color theme management

### 03_llm_core - LLM API Integration
- **Target**: `packages/core/llm-api/`
- **Status**: ⚠️ Partial (~60%)
- **Restored**:
  - `src/llm-api/client.ts` - API client
  - `src/llm-api/retry.ts` - Retry logic (v51)
  - `src/llm-api/streaming.ts` - Stream handling
  - `src/llm-api/types.ts` - API types
- **Missing**:
  - `streamApiCall` full implementation
  - Response aggregation logic
  - Prompt caching integration
- **Key Symbols**:
  - `v51` → retryGenerator (chunks.85.mjs)
  - `streamApiResponse` (chunks.153.mjs)

### 04_system_reminder - System Prompt Building
- **Target**: `packages/core/message/`
- **Status**: ⚠️ Partial (~50%)
- **Restored**:
  - `src/message/factory.ts` - Message creation
  - `src/message/normalization.ts` - API normalization
- **Missing**:
  - System prompt constants
  - XML formatting utilities
  - Reminder injection logic

### 05_tools - Built-in Tools
- **Target**: `packages/tools/` + `packages/core/tools/`
- **Status**: ⚠️ Mostly (~80%) - 8 tools real, 2 tools STUBBED
- **Fully Implemented** (8 tools):
  - `bash.ts` - Shell execution (X9) ✅
  - `read.ts` - File reading (z3) ✅
  - `write.ts` - File writing (BY) ✅
  - `edit.ts` - File editing (I8) ✅
  - `glob.ts` - Pattern matching (lI) ✅
  - `grep.ts` - Content search (DI) ✅
  - `todo-write.ts` - Todo management (Bm) ✅
  - `web-fetch.ts` - URL fetching (cI) ✅
- **STUB Implementations** (2 tools):
  - `task.ts` - Subagent execution (f3) ⚠️ Returns mock, no agent spawning
  - `skill.ts` - Skill invocation (kF) ⚠️ Returns dummy, no skill loading
- **Core Tool Framework**:
  - `packages/core/src/tools/base-tool.ts` ✅
  - `packages/core/src/tools/registry.ts` ✅
  - `packages/core/src/tools/types.ts` ✅

### 06_mcp - Model Context Protocol
- **Target**: `packages/integrations/mcp/`
- **Status**: ⚠️ Partial (~10%) - Types exist, execution is STUB
- **Key Files**:
  - `src/mcp/config.ts` - Server configuration ⚠️ Partial
  - `src/mcp/discovery.ts` - Server discovery ⚠️ STUB
  - `src/mcp/execution.ts` - Tool execution ⚠️ STUB (TODO comments)
  - `src/mcp/autosearch.ts` - Auto-search (2.1.7) ⚠️ Partial
- **Key Symbols** (MISSING/STUB):
  - `cEA` → loadAllMcpConfig - STUB (TODO)
  - `SO` → connectMcpServer - MISSING
  - `PG1` → MCPClient class - MISSING
  - All transport layers (KX0, rG1, kX0, JZ1) - MISSING
- **What's actually implemented**: Type definitions only

### 07_compact - Context Compaction
- **Target**: `packages/features/compact/`
- **Status**: ⚠️ Partial (~50%) - Structure complete, LLM integration STUBBED
- **Key Files**:
  - `src/compact/dispatcher.ts` - Auto-compact (sI2) ✅ Real
  - `src/compact/micro-compact.ts` - Tier 1 compact ✅ Real
  - `src/compact/full-compact.ts` - Tier 2 compact ⚠️ STUB (generateConversationSummary returns mock)
  - `src/compact/context-restore.ts` - File restoration ⚠️ STUB (5 functions return empty)
- **Missing Implementation**:
  - `generateConversationSummary()` - returns mock data, no LLM call
  - `getTodoItems()`, `getInvokedSkills()`, `getActiveTaskStatuses()` - return empty arrays

### 08_subagent - Agent Execution
- **Target**: `packages/core/agent-loop/`
- **Status**: ⚠️ Partial (~20%) - Structure exists, core loop is STUB
- **Key Files**:
  - `src/agent-loop/core-message-loop.ts` - Main loop (aN) ⚠️ STUB (returns placeholder)
  - `src/agent-loop/streaming-tool-executor.ts` - Tool execution (_H1) ⚠️ Partial
  - `src/agent-loop/subagent-loop.ts` - Subagent loop (v19) ⚠️ Partial
- **Key Symbols**:
  - `aN` → coreMessageLoop (chunks.134.mjs) - **STUB**
  - `v19` → sdkAgentLoopGenerator (chunks.135.mjs) - partial
  - `_H1` → StreamingToolExecutor (chunks.133.mjs) - partial
- **CRITICAL Missing**:
  - `streamApiResponse` (oHA) - LLM API streaming
  - `executeToolsSequentially` (KM0) - Tool execution
  - `normalizeMessages` (_x) - Message normalization

### 09_slash_command - Slash Commands
- **Target**: `packages/features/slash-commands/`
- **Status**: ⚠️ Partial (~60%)
- **Restored**:
  - `src/slash-commands/types.ts` - Command types
  - `src/slash-commands/parser.ts` - Command parsing
- **Missing**:
  - Built-in command handlers
  - Command registry

### 10_skill - Skill System
- **Target**: `packages/features/skills/` + `packages/plugin/`
- **Status**: ⚠️ Partial (~50%) - Missing orchestration
- **Implemented**:
  - `src/skills/types.ts` - Type definitions ✅
  - `src/skills/parser.ts` - SKILL.md frontmatter parsing ✅
  - `src/skills/registry.ts` - Directory scanning ✅
- **MISSING** (Critical):
  - `getSkills` (Wz7) - Main orchestrator loading from 3 sources
  - `getBundledSkills` (kZ9) - Bundled skills registry
  - `W0` memoization pattern - Used throughout analysis
- **Plugin Integration**: Handled in plugin package (95% complete)

### 11_hook - Hook System
- **Target**: `packages/features/hooks/`
- **Status**: ✅ Complete (~98%) - Nearly production-ready
- **Fully Implemented** (3,053 lines):
  - `src/hooks/types.ts` - All 12 event types ✅
  - `src/hooks/execution.ts` - REPL/non-REPL execution ✅
  - `src/hooks/triggers.ts` - All 12 event triggers ✅
  - `src/hooks/aggregation.ts` - Priority-based aggregation ✅
  - `src/hooks/state.ts` - Session hook management ✅
  - `src/hooks/skill-hooks.ts` - Skill frontmatter hooks ✅
- **Minor Stubs**:
  - `isAllowManagedHooksOnly()` returns hardcoded false
  - Prompt/Agent hook execution need LLM integration

### 12_plan_mode - Plan Mode
- **Target**: `packages/features/plan-mode/`
- **Status**: ✅ Complete
- **Key Files**:
  - `src/plan-mode/slug-generator.ts` - Slug generation (Z12)
  - `src/plan-mode/plan-file.ts` - Plan file management
  - `src/plan-mode/state.ts` - Plan state
  - `src/plan-mode/enter-plan-mode.ts`
  - `src/plan-mode/exit-plan-mode.ts`
- **Key Symbols**:
  - `Z12` → generatePlanSlug (chunks.86.mjs)

### 13_todo_list - Todo Management
- **Target**: `packages/tools/todo-write.ts`
- **Status**: ⚠️ Partial (~50%)
- **Restored**:
  - TodoWrite tool implementation
- **Missing**:
  - Todo list state management
  - Persistence layer
  - Reminder generation

### 14_code_indexing - Code Indexing
- **Target**: `packages/platform/` (partially)
- **Status**: ⚠️ Partial (~50%)
- **Notes**:
  - Tree-sitter integration partially in shell-parser
  - Code symbol extraction not fully restored

### 15_state_management - Session State
- **Target**: `packages/shared/state/` + `packages/core/state/`
- **Status**: ⚠️ Split: Global 95% / Persistence 0%
- **Fully Implemented**:
  - `shared/src/state/global-state.ts` - Global state (g0) ✅ 95%
    - All getters/setters (session ID, CWD, cost, model usage)
    - Plan mode flags, teleport info, hooks registry
  - `core/src/state/context.ts` - React App context ✅ 100%
    - createDefaultAppState (HzA), AppStateProvider, useAppState
    - All 23 main state sections
- **NOT Implemented** (Session Persistence):
  - parseSessionLogFile (Mp) - .jsonl parsing
  - loadSessionIndex (LP0) / writeSessionIndex ($P0)
  - loadOrRestoreSession (Zt) - Session restore
  - persistSessionToRemote (mu2) - Remote persistence
  - resumeTeleportSession (Yt) - Teleport functionality

### 16_file_system - File Operations
- **Target**: `packages/platform/fs/`
- **Status**: ⚠️ Partial (~40%)
- **Notes**:
  - Basic file operations in tools
  - DirectoryWalker class (JEB) not fully restored
  - Extension filter database not present

### 17_telemetry - OpenTelemetry
- **Target**: `packages/platform/telemetry/`
- **Status**: ⚠️ Needs Investigation
- **Present**:
  - `src/telemetry/types.ts`
  - `src/telemetry/constants.ts`
  - `src/telemetry/core.ts`
- **Notes**:
  - OpenTelemetry constants in chunks.100.mjs
  - May use npm package directly

### 18_sandbox - Security Sandbox
- **Target**: `packages/platform/sandbox/`
- **Status**: ✅ Complete
- **Key Files**:
  - `src/sandbox/config.ts` - Sandbox configuration
  - `src/sandbox/manager.ts` - Sandbox manager
  - `src/sandbox/dependencies.ts` - Dependency tracking
  - `src/sandbox/violation-store.ts` - Violation storage

### 19_think_level - Extended Thinking
- **Target**: `packages/features/thinking/`
- **Status**: ✅ Complete
- **Key Files**:
  - `src/thinking/types.ts` - Thinking types
  - `src/thinking/config.ts` - Think level config
  - `src/thinking/processor.ts` - Token processing

### 20_sdk - SDK Transport
- **Target**: `packages/sdk/`
- **Status**: ✅ Complete
- **Key Files**:
  - `src/transport/stdio.ts` - STDIO transport
  - `src/transport/websocket.ts` - WebSocket transport
  - `src/protocol/messages.ts` - Message protocol
- **Key Symbols**:
  - `wmA` → StdioSDKTransport
  - `Vy0` → WebSocketSDKTransport

### 21_steering - Output Steering
- **Target**: `packages/core/` (embedded)
- **Status**: ⚠️ Needs Investigation
- **Notes**:
  - Likely integrated into agent loop
  - May be in system prompt generation

### 22_ide_integration - IDE Support
- **Target**: `packages/integrations/ide/`
- **Status**: ✅ Complete
- **Key Files**:
  - `src/ide/detection.ts` - IDE detection
  - `src/ide/connection.ts` - Connection management
  - `src/ide/config.ts` - IDE configuration
- **Key Symbols**:
  - `VW9` → IDE component handler (chunks.151.mjs)

### 23_prompt_cache - Prompt Caching
- **Target**: `packages/core/llm-api/`
- **Status**: ⚠️ Needs Investigation
- **Notes**:
  - Anthropic API feature
  - May be abstracted into API client

### 24_auth - Authentication
- **Target**: `packages/platform/auth/`
- **Status**: ✅ Complete
- **Key Files**:
  - `src/auth/api-key.ts` - API key management
  - `src/auth/oauth.ts` - OAuth flow
  - `src/auth/constants.ts` - Auth constants
- **Key Symbols**:
  - `C9A` → Azure service class (chunks.82.mjs)
  - `PG1` → Azure SDK (chunks.89.mjs)

### 25_plugin - Plugin System
- **Target**: `packages/plugin/`
- **Status**: ✅ Complete
- **Key Files**:
  - `src/loader.ts` - Plugin loading (DG)
  - `src/schemas.ts` - Plugin schemas
  - `src/types.ts` - Plugin types
- **Key Symbols**:
  - `DG` → discoverPluginsAndHooks
  - `tw0` → getPluginSkills
  - `al5` → aggregateHooksFromAllSources

### 26_background_agents - Background Tasks
- **Target**: `packages/integrations/background-agents/`
- **Status**: ✅ Complete
- **Key Files**:
  - `src/background-agents/registry.ts` - Task registry
  - `src/background-agents/transcript.ts` - Transcript storage
- **Key Symbols**:
  - `f09` → processBackgroundAgentResult (chunks.136.mjs)
  - `_Z7` → aggregateResults

### 27_lsp_integration - Language Server
- **Target**: `packages/integrations/lsp-server/`
- **Status**: ⚠️ Needs Investigation
- **Present**:
  - `src/lsp-server/types.ts`
  - `src/lsp-server/manager.ts`
- **Notes**:
  - LSP manager from chunks.142.mjs
  - Operations from chunks.143.mjs

### 28_browser_control - Chrome Control
- **Target**: `packages/integrations/chrome/`
- **Status**: ⚠️ Needs Investigation
- **Present**:
  - `src/chrome/socket-client.ts` - Socket client (AZ9)
  - `src/chrome/tools.ts` - MCP tools (Pe)
- **Missing**:
  - Native host server (QI9)
  - Browser extension integration

### 29_shell_parser - Shell Parsing
- **Target**: `packages/platform/shell-parser/`
- **Status**: ✅ Complete
- **Key Files**:
  - `src/shell-parser/parser.ts` - Command parser (cK1)
  - `src/shell-parser/security.ts` - Security checks (Mf)
  - `src/shell-parser/tokenizer.ts` - Tokenization
  - `src/shell-parser/constants.ts` - Patterns
- **Key Symbols**:
  - `cK1` → shellCommandParser
  - `Mf` → shellOperatorChecker
  - `Fb5` → extractCwdReset

---

## Package Summary

| Package | Files | Description | Structure | Implementation |
|---------|-------|-------------|-----------|----------------|
| `@claudecode/shared` | 8 | Global state, types, constants | ✅ 100% | ✅ 90% |
| `@claudecode/core` | 23 | Agent loop, tools, LLM API | ✅ 100% | ⚠️ 25% (STUB) |
| `@claudecode/tools` | 13 | Built-in tool implementations | ✅ 100% | ⚠️ 80% |
| `@claudecode/features` | 37 | Compact, hooks, plan-mode, skills | ✅ 95% | ⚠️ 60% |
| `@claudecode/platform` | 22 | Auth, sandbox, shell-parser | ✅ 90% | ✅ 80% |
| `@claudecode/integrations` | 31 | MCP, IDE, Chrome, background | ⚠️ 70% | ⚠️ 15% (STUB) |
| `@claudecode/sdk` | 8 | Transport layer, protocol | ✅ 100% | ✅ 85% |
| `@claudecode/plugin` | 4 | Plugin loading, schemas | ⚠️ 60% | ⚠️ 40% |
| `@claudecode/ui` | 8 | Terminal components, markdown | ⚠️ 70% | ⚠️ 30% |
| `@claudecode/cli` | 5 | Entry point, commands | ⚠️ 80% | ⚠️ 50% |
| **Total** | **161** | | **~85%** | **~45%** |

> **Key Insight:** Package structure is mostly complete, but core execution paths have STUB implementations that prevent the agent from running.

---

## Key Gaps to Address

### CRITICAL (Blocks Agent Execution)
1. **coreMessageLoop (aN)** - `packages/core/agent-loop/` - Returns placeholder, no LLM call
2. **streamApiResponse (oHA)** - `packages/core/llm-api/` - Missing entirely
3. **executeMcpTool (zr2)** - `packages/integrations/mcp/` - STUB with TODOs
4. **MCPClient (PG1)** - `packages/integrations/mcp/` - Missing entirely
5. **Task/Skill tools** - `packages/tools/` - Return mock responses

### High Priority
6. **DirectoryWalker (JEB)** - `packages/platform/fs/` - Used by Glob tool
7. **generateConversationSummary** - `packages/features/compact/` - Returns mock data
8. **React/Ink UI** - `packages/ui/` - Interactive terminal components

### Medium Priority
9. **LSP Server** - `packages/integrations/lsp-server/` - Operations
10. **Chrome Native Host** - `packages/integrations/chrome/` - QI9
11. **Session Persistence** - `packages/core/state/` or `packages/platform/`

### Low Priority
12. **Telemetry Details** - OTEL integration specifics
13. **Plugin Marketplace** - Discovery/installation

> **See [GAP_ANALYSIS.md](./GAP_ANALYSIS.md) for detailed function-by-function gap analysis**

---

## Source Reference

- **Analysis Docs**: `analyze/` (30 modules)
- **Symbol Index**: `analyze/00_overview/symbol_index_*.md` (16,225 symbols)
- **Source Chunks**: `source/chunks.*.mjs` (157 files, ~483K lines)
- **Restored Code**: `claudecode/packages/` (161 files, ~55K lines)
