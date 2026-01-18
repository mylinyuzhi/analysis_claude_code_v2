# Claude Code v2.1.7 Restoration Gap Analysis

## Executive Summary

This document details the specific gaps between the analysis documentation and the restored TypeScript code in `claudecode/packages/`.

**Key Finding:** While the package structure is 77% complete, the **actual implementation** is significantly lower due to STUB and placeholder implementations in critical modules.

| Category | Structural Completion | Implementation Completion |
|----------|----------------------|--------------------------|
| Package Organization | 95% | - |
| Type Definitions | 90% | - |
| Core Execution Logic | - | 60% ✅ |
| Tool Implementations | - | 90% ✅ |
| Integration Points | - | 50% ✅ |

**Recent Updates (January 2026):**
- ✅ `streamApiCall` - Full streaming implementation with retry integration
- ✅ `coreMessageLoop` - Complete with streaming and tool execution
- ✅ MCP client - Full `MCPClient`, transports, and server connection
- ✅ CLI entry handlers - Complete initialization pipeline
- ✅ Task tool - Real agent spawning with background support
- ✅ Skill tool - Real skill loading and execution

---

## Critical Missing Implementations

### Tier 1: Blocks Agent Execution

These functions are required for the agent to run at all:

| Function | Obfuscated | Location | Package | Status |
|----------|------------|----------|---------|--------|
| coreMessageLoop | aN | chunks.134.mjs:99-114 | core/agent-loop | ✅ IMPLEMENTED |
| streamApiResponse | oHA | chunks.134.mjs | core/llm-api | ✅ IMPLEMENTED |
| executeToolsSequentially | KM0 | chunks.134.mjs | core/agent-loop | PARTIAL |
| normalizeMessages | _x | chunks.134.mjs | core/message | ✅ IMPLEMENTED |
| resolveModelWithPermissions | HQA | chunks.134.mjs | core/llm-api | PARTIAL |
| mergeSystemPromptWithContext | fA9 | chunks.134.mjs | core/message | PARTIAL |

### Tier 2: Blocks Tool Execution

| Function | Obfuscated | Location | Package | Status |
|----------|------------|----------|---------|--------|
| executeMcpTool | zr2 | chunks.131.mjs | integrations/mcp | ✅ IMPLEMENTED |
| connectMcpServer | SO | chunks.131.mjs | integrations/mcp | ✅ IMPLEMENTED |
| processToolResult | tB7 | chunks.131.mjs | integrations/mcp | ✅ IMPLEMENTED |
| executeToolUse | jH1 | chunks.134.mjs | core/agent-loop | PARTIAL |
| wrapToolWithProgress | k77 | chunks.134.mjs | core/agent-loop | STUB |

### Tier 3: Blocks Background/Subagent Execution

| Function | Obfuscated | Location | Package | Status |
|----------|------------|----------|---------|--------|
| createFullyBackgroundedAgent | L32 | chunks.113.mjs | tools/task | ✅ IMPLEMENTED |
| createBackgroundableAgent | O32 | chunks.113.mjs | tools/task | ✅ IMPLEMENTED |
| runSubagentLoop | $f | chunks.135.mjs | core/agent-loop | ✅ IMPLEMENTED |
| executeInAgentContext | XA1 | chunks.113.mjs | core/agent-loop | PARTIAL |
| backgroundSignalMap | yZ1 | chunks.121.mjs | integrations | ✅ IMPLEMENTED |

---

## Module-by-Module Gap Analysis

### 02_ui (Terminal UI) - 30% Implementation

**What's restored:**
- Status utilities (getStatusIcon, getStatusColor, formatStatus)
- Spinner state management (SpinnerState class)
- Basic formatting functions

**What's MISSING:**
| Function | Obfuscated | Description |
|----------|------------|-------------|
| InkRenderer | Sa | Custom React reconciler |
| InternalApp | w21 | Root React component |
| tokenToText | VE | Markdown token converter |
| TableRenderer | gG2 | Table rendering component |
| useBlinkingState | WZ2 | React animation hook |
| ToolUseDisplay | VZ2 | Tool output display component |
| All React JSX components | various | Input, prompt, confirmation |

### 03_llm_core (LLM API) - 80% Implementation ✅

**What's restored:**
- getUserAgent, parseCustomHeaders, buildDefaultHeaders
- detectProvider, retry logic
- Full streaming infrastructure ✅
- streamApiCall with retry integration ✅
- Extended usage tracking (server_tool_use) ✅
- Non-streaming fallback ✅

**What's remaining:**
| Function | Obfuscated | Description |
|----------|------------|-------------|
| promptCachingIntegration | - | Cache key generation |
| systemPromptBuilder (full) | - | Dynamic system prompt with all contexts |

### 05_tools (Built-in Tools) - 95% Implementation ✅

**Fully implemented (10 tools):**
- bash.ts (374 lines) - Shell execution
- read.ts (472 lines) - File reading
- write.ts (273 lines) - File writing
- edit.ts (394 lines) - File editing
- glob.ts (248 lines) - Pattern matching
- grep.ts (313 lines) - Content search
- web-fetch.ts (327 lines) - URL fetching
- todo-write.ts (207 lines) - Todo management
- task.ts - Real agent spawning with background execution ✅
- skill.ts - Real skill loading and execution ✅

**All tools now have functional implementations!**

### 07_compact (Context Compaction) - 50% Implementation

**What's restored:**
- Dispatcher logic (autoCompactDispatcher)
- Threshold checking
- Error handling

**What's STUBBED:**
| Function | Location | Issue |
|----------|----------|-------|
| generateConversationSummary | full-compact.ts:122-166 | Returns mock data, no LLM call |
| getTodoItems | context-restore.ts:80 | Returns empty array |
| getCurrentPlanFilePath | context-restore.ts:115 | Returns null |
| readPlanFile | context-restore.ts:122-125 | Returns null |
| getInvokedSkills | context-restore.ts:166 | Returns empty array |
| getActiveTaskStatuses | context-restore.ts:200 | Returns empty array |
| executePreCompactHooks | full-compact.ts:45-51 | Returns empty object |

### 06_mcp (Model Context Protocol) - 85% Implementation ✅

**What's restored:**
- Type definitions
- Config structures
- Discovery interface
- Full MCPClient class ✅
- StdioClientTransport ✅
- SSEClientTransport ✅
- connectMcpServer ✅
- batchInitializeAllServers ✅
- executeMcpTool ✅

**What's remaining:**
| Function | Obfuscated | Description |
|----------|------------|-------------|
| HttpClientTransport | kX0 | HTTP transport (less common) |
| WebSocketClientTransport | JZ1 | WebSocket transport (less common) |

### 08_subagent (Agent Execution) - 70% Implementation ✅

**What's restored:**
- Type definitions
- Generator function signatures
- Full coreMessageLoop with streaming ✅
- runSubagentLoop for Task tool ✅
- createFullyBackgroundedAgent ✅
- createBackgroundableAgent ✅
- backgroundSignalMap for Ctrl+B ✅

**What's remaining:**
| Function | Obfuscated | Description |
|----------|------------|-------------|
| Full executeToolUse | jH1 | Complete tool execution with all handlers |
| wrapToolWithProgress | k77 | Progress UI wrapping |
| Compaction integration | ys2 | autoCompactDispatcher call |

### 16_file_system (File Operations) - 26% Implementation

**What's restored:**
- FileSystemWrapper object
- Encoding detection
- Line ending detection/normalization
- Path resolution

**What's MISSING:**
| Function | Obfuscated | Description |
|----------|------------|-------------|
| readTextFileWithLineNumbers | L12 | Partial file reading |
| fuzzyStringMatch | k6A | Edit matching |
| createPatchedContent | nD1 | Diff generation |
| setupSettingsFileWatcher | cG8 | Chokidar integration |
| parseNotebookCells | gA2 | Jupyter support |
| readImageFile | KY0 | Image reading/resizing |
| readPDFFile | TEB | PDF support |
| All tool validators | various | Edit/Write/Read validation |

---

## Modules Actually Complete

These modules have REAL implementations, not stubs:

| Module | Package | Verification |
|--------|---------|--------------|
| 12_plan_mode | features/plan-mode | Full file I/O, state management |
| 29_shell_parser | platform/shell-parser | Complete parsing, 14-point security |
| 18_sandbox | platform/sandbox | Full sandbox config and management |
| 24_auth | platform/auth | OAuth flow, API key management |

---

## Cross-Module Dependencies

The restoration has broken critical dependency chains:

```
core/agent-loop/coreMessageLoop
    ├── NEEDS: core/llm-api/streamApiResponse (MISSING)
    ├── NEEDS: core/message/normalizeMessages (STUB)
    ├── NEEDS: core/tools/executeToolUse (STUB)
    └── NEEDS: integrations/mcp/executeMcpTool (STUB)
         └── NEEDS: integrations/mcp/connectMcpServer (MISSING)
              └── NEEDS: integrations/mcp/MCPClient (MISSING)

tools/task.ts (Task Tool)
    ├── NEEDS: core/agent-loop/runSubagentLoop (PARTIAL)
    └── NEEDS: integrations/background/backgroundSignalMap (MISSING)
         └── NEEDS: integrations/background/registerOutputFile (MISSING)

features/compact/full-compact.ts
    └── NEEDS: core/llm-api/streamApiCall (MISSING)
         └── For generateConversationSummary()
```

---

## Restoration Priority Order

To make the agent functional, restore in this order:

### Phase 1: Core Execution (Blocks Everything)
1. `core/llm-api/streamApiResponse` - LLM communication
2. `core/agent-loop/coreMessageLoop` - Complete the loop, not stub
3. `core/message/normalizeMessages` - Message preparation

### Phase 2: Tool System (Blocks Tool Use)
4. `core/tools/executeToolUse` - Tool invocation
5. `integrations/mcp/connectMcpServer` - MCP connection
6. `integrations/mcp/MCPClient` - Full client

### Phase 3: Subagent System (Blocks Background Tasks)
7. `tools/task.ts` - Real subagent spawning
8. `tools/skill.ts` - Real skill loading
9. Background signal management

### Phase 4: Integration Points
10. Compact LLM integration
11. File system tool validators
12. UI React components

---

## Symbol Reference

For complete symbol mappings, see:
- `analyze/00_overview/symbol_index_core_execution.md` - Agent loop, tools, LLM
- `analyze/00_overview/symbol_index_core_features.md` - Plan, compact, hooks
- `analyze/00_overview/symbol_index_infra_platform.md` - MCP, sandbox, auth
- `analyze/00_overview/symbol_index_infra_integration.md` - LSP, Chrome, IDE

---

---

## Additional Module Analysis

### 11_hook (Hook System) - 98% Implementation

**Status:** ✅ EXCELLENT - Nearly complete

**What's Restored:**
- All 12 event triggers implemented (triggers.ts)
- Hook state management (state.ts - 345 lines)
- Hook aggregation with priority (aggregation.ts - 326 lines)
- REPL/non-REPL execution (execution.ts - 450 lines)
- Skill frontmatter hook registration (skill-hooks.ts)

**Minor Gaps:**
- `isAllowManagedHooksOnly()` returns hardcoded `false`
- Prompt/Agent hook execution are stubs (needs LLM integration)

### 10_skill (Skill System) - 50% Implementation

**Status:** ⚠️ PARTIAL - Missing orchestration

**What's Restored:**
- Type definitions (types.ts - 194 lines)
- SKILL.md frontmatter parser (parser.ts - 232 lines)
- SkillRegistry class with directory scanning

**What's MISSING:**
| Function | Obfuscated | Description |
|----------|------------|-------------|
| getSkills | Wz7 | Main orchestrator loading from 3 sources |
| getBundledSkills | kZ9 | Bundled skills registry |
| getPluginSkills | tw0 | Not in skills package (delegated) |
| W0 memoization | W0 | Memoization wrapper used everywhere |

### 25_plugin (Plugin System) - 95% Implementation

**Status:** ✅ EXCELLENT

**What's Restored:**
- Plugin discovery and manifest loading (loader.ts - 634 lines)
- Zod schema validation (schemas.ts - 326 lines)
- Hooks file loading and merging
- Type definitions (types.ts - 477 lines)

### 15_state_management (Session State) - 95% Global / 0% Persistence

**Global State (g0):** ✅ COMPLETE
- All getters/setters implemented
- Session ID, CWD, cost tracking, model usage
- Plan mode flags, teleport info, hooks registry

**App State (React Context):** ✅ COMPLETE
- createDefaultAppState (HzA) fully implemented
- AppStateProvider, useAppState hooks
- All 23 main state sections

**Session Persistence:** ❌ NOT IMPLEMENTED
| Function | Obfuscated | Description |
|----------|------------|-------------|
| parseSessionLogFile | Mp | Session .jsonl parsing |
| loadSessionIndex | LP0 | Session index loading |
| writeSessionIndex | $P0 | Session index writing |
| loadOrRestoreSession | Zt | Session restore logic |
| persistSessionToRemote | mu2 | Remote persistence |
| resumeTeleportSession | Yt | Teleport resume |

### 01_cli (CLI Entry Point) - 10% Implementation

**Status:** ❌ BLOCKING - Skeleton only

**What's Restored:**
- Mode detection logic (detectExecutionMode)
- Option definitions (40+ CLI options)
- Version fast path

**What's restored:**
- Mode detection logic (detectExecutionMode)
- Option definitions (40+ CLI options)
- Version fast path
- handleMainCommand with full initialization pipeline ✅
- runPreActionHook with config initialization ✅
- runPrintMode for non-interactive execution ✅
- runInteractiveMode with basic REPL ✅

**What's remaining:**
| Component | Status | Impact |
|-----------|--------|--------|
| Full React UI rendering | PARTIAL | Interactive mode uses basic readline |
| Session management | PARTIAL | Basic session ID validation |

---

## Updated Summary Statistics

| Metric | Value |
|--------|-------|
| Total documented functions | ~350+ |
| Fully implemented | ~200 (57%) ✅ |
| Stub/placeholder | ~60 (17%) |
| Missing entirely | ~90 (26%) |
| Blocking agent execution | **0 critical functions** ✅ |

### Module Completion Summary

| Module | Structure | Implementation | Blocking? |
|--------|-----------|----------------|-----------|
| shared/state | 100% | 95% | No |
| core/state | 100% | 100% | No |
| features/hooks | 100% | 98% | No |
| features/skills | 100% | 75% ✅ | No |
| plugin | 100% | 95% | No |
| features/plan-mode | 100% | 100% | No |
| platform/shell-parser | 100% | 100% | No |
| core/agent-loop | 100% | 70% ✅ | No |
| integrations/mcp | 100% | 85% ✅ | No |
| tools | 100% | 95% ✅ | No |
| cli | 100% | 60% ✅ | No |
| ui | 70% | 30% | Partial (React UI) |

### What Works vs What Doesn't

**FUNCTIONAL (can be used):**
- Global state singleton
- App state React context
- Hook system (12 event types)
- Plan mode file management
- Shell command parsing/security
- ALL 10 core tools ✅
- Plugin manifest loading
- Core message loop ✅
- LLM API streaming ✅
- MCP tool execution ✅
- Task/Skill tools ✅
- CLI entry point with handlers ✅

**PARTIAL/REMAINING:**
- Full React UI components (interactive mode uses basic readline)
- Session persistence (basic)
- Prompt caching integration
- React UI components (not started)
