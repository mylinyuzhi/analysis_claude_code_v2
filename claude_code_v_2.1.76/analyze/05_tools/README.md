# Module: Tools (05)

## Overview

The Tools module is the core action layer of Claude Code, responsible for defining, discovering, validating, executing, and rendering all tool invocations. It bridges the gap between LLM-generated tool_use blocks and actual system operations (file I/O, command execution, web requests, agent spawning, etc.).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this module:
- `toolDispatcher` (Wi6) - Top-level tool routing - chunks.146.mjs:285
- `toolExecutionPipeline` (fxY) - 8-stage execution pipeline - chunks.146.mjs:442
- `findTool` (dK) - Tool lookup by name/alias - chunks.56.mjs:1592
- `filterToolsByMode` (Xk8) - Mode-aware tool filtering - chunks.93.mjs:1568

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TOOL SYSTEM ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① Tool Registry                                                     │
│     ├─ Built-in tools (Read, Write, Edit, Bash, Grep, Glob, ...)   │
│     ├─ MCP tools (mcp__server__tool)                                │
│     ├─ Dynamic tools (deferred loading)                             │
│     └─ Skill-provided tools                                          │
│                                                                       │
│  ② Tool Discovery                                                    │
│     ├─ getDefaultTools() - Built-in tool set                        │
│     ├─ fetchMcpTools() - MCP tool discovery                         │
│     └─ filterToolsByRules() - Permission filtering                  │
│                                                                       │
│  ③ Execution Pipeline (8 stages)                                    │
│     ├─ Stage 1: Schema validation (Zod safeParse)                   │
│     ├─ Stage 2: Custom validation (validateInput)                   │
│     ├─ Stage 3: Pre-tool hooks (y4q)                                │
│     ├─ Stage 4: Permission check (canUseTool)                       │
│     ├─ Stage 5: Tool execution (tool.call)                          │
│     ├─ Stage 6: Post-tool hooks (k4q)                               │
│     ├─ Stage 7: Post-failure hooks (E4q) - on error only            │
│     └─ Stage 8: Result assembly                                      │
│                                                                       │
│  ④ UI Rendering                                                      │
│     ├─ renderToolUseMessage() - In-progress header                  │
│     ├─ renderToolResultMessage() - Result display                   │
│     ├─ renderToolUseRejectedMessage() - Rejection preview           │
│     └─ renderToolUseErrorMessage() - Error details                  │
│                                                                       │
│  ⑤ Cross-Module Integration                                         │
│     ├─ → 04_system_reminder (attachments)                           │
│     ├─ → 06_mcp (MCP tool delegation)                               │
│     ├─ → 11_hooks (pre/post hooks)                                  │
│     ├─ → 18_sandbox (Bash security)                                 │
│     └─ → 37_permission_policy (tool filtering)                      │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tool Categories

| Category | Tools | Primary Location |
|----------|-------|------------------|
| **File System** | Read, Write, Edit, NotebookEdit | chunks.146.mjs (Read/Write), chunks.134.mjs (Edit) |
| **Search** | Grep, Glob | chunks.139.mjs |
| **Execution** | Bash | chunks.172.mjs |
| **Web** | WebFetch, WebSearch | chunks.139.mjs |
| **Agent** | Agent | chunks.136.mjs |
| **Task Management** | TaskCreate, TaskGet, TaskList, TaskUpdate, TodoWrite | chunks.84.mjs, chunks.144.mjs |
| **Team** | TeamCreate, TeamDelete, SendMessage | chunks.141.mjs |
| **Plan Mode** | EnterPlanMode, ExitPlanMode, AskUserQuestion | chunks.144.mjs, chunks.143.mjs |
| **Skills** | Skill | chunks.137.mjs |
| **Worktree** | EnterWorktree, ExitWorktree | chunks.149.mjs |
| **Cron** | CronCreate, CronDelete, CronList | chunks.89.mjs, chunks.193.mjs |
| **Task Control** | TaskStop, TaskOutput | chunks.143.mjs |

---

## Analysis Documents

### Individual Tools

| Document | Tool | Description |
|----------|------|-------------|
| [read_tool.md](read_tool.md) | Read | File reading with encoding detection, PDF/image/notebook support |
| [write_tool.md](write_tool.md) | Write | File writing with overwrite protection and LSP integration |
| [edit_tool.md](edit_tool.md) | Edit | Surgical string replacement in files |
| [bash_tool.md](bash_tool.md) | Bash | Shell command execution with sandbox support |
| [grep_glob_tools.md](grep_glob_tools.md) | Grep, Glob | File content search and filename pattern matching |
| [web_tools.md](web_tools.md) | WebFetch, WebSearch | URL fetching and web search capabilities |
| [agent_tool.md](agent_tool.md) | Agent | Sub-agent spawning with background support |
| [task_management_tools.md](task_management_tools.md) | TaskCreate/Get/List/Update | Structured task tracking |
| [team_tools.md](team_tools.md) | TeamCreate, TeamDelete, SendMessage | Agent team/swarm coordination |
| [plan_mode_tools.md](plan_mode_tools.md) | EnterPlanMode, ExitPlanMode, AskUserQuestion | Planning workflow |
| [skill_toolsearch_tools.md](skill_toolsearch_tools.md) | Skill, ToolSearch | Slash command execution |
| [worktree_tools.md](worktree_tools.md) | EnterWorktree, ExitWorktree | Git worktree isolation |
| [cron_tools.md](cron_tools.md) | CronCreate, CronDelete, CronList | Recurring task scheduling |

### Core Infrastructure

| Document | Description |
|----------|-------------|
| [tools_complete_source_restoration_v3.md](tools_complete_source_restoration_v3.md) | **v3** - Complete source restoration with 8-stage pipeline |
| [tools_source_restoration_final.md](tools_source_restoration_final.md) | **FINAL** - Complete source restoration with all algorithms |
| [tools_complete_source_restoration_v2.md](tools_complete_source_restoration_v2.md) | **v2** - Complete source restoration with ORIGINAL/READABLE code |
| [tool_execution_pipeline_complete.md](tool_execution_pipeline_complete.md) | **NEW** - Complete 8-stage pipeline with ORIGINAL/READABLE code |
| [tool_dispatcher_source_restoration.md](tool_dispatcher_source_restoration.md) | Complete source-level restoration with ORIGINAL/READABLE code |
| [tool_dispatcher_complete.md](tool_dispatcher_complete.md) | Complete source-level analysis of dispatch flow |
| [permission_flow_complete.md](permission_flow_complete.md) | Permission decision algorithm with hook integration |
| [permission_decision_algorithm.md](permission_decision_algorithm.md) | **NEW** - Deep dive into permission logic |
| [tool_registry_complete.md](tool_registry_complete.md) | **NEW** - Master index with validation status |
| [tool_registry.md](tool_registry.md) | Master index of all built-in tools |
| [tool_execution_pipeline.md](tool_execution_pipeline.md) | Complete dispatch lifecycle |
| [tool_discovery.md](tool_discovery.md) | Tool lookup and registration |
| [tool_coordination.md](tool_coordination.md) | Cross-tool coordination patterns |
| [dynamic_tools.md](dynamic_tools.md) | MCP and deferred tools |
| [security_validation.md](security_validation.md) | Bash security checks reference |
| [tool_schemas.md](tool_schemas.md) | Input/output schema patterns |
| [tool_interface_patterns.md](tool_interface_patterns.md) | Tool interface patterns |

### UI & Integration

| Document | Description |
|----------|-------------|
| [tool_ui_interaction_complete.md](tool_ui_interaction_complete.md) | Complete UI rendering, modal priority, React components |
| [tool_permission_ui_complete.md](tool_permission_ui_complete.md) | **NEW** - Permission dialog rendering, hook integration |
| [tool_progress_tracking_complete.md](tool_progress_tracking_complete.md) | **NEW** - Progress callbacks, AsyncQueue, streaming updates |
| [permission_flow_complete.md](permission_flow_complete.md) | Permission decision algorithm with hook integration |
| [cross_system_integration_v3.md](cross_system_integration_v3.md) | Tools ↔ System Reminder integration with hook attachments |
| [ui_rendering.md](ui_rendering.md) | UI rendering infrastructure |
| [tool_reminder_integration.md](tool_reminder_integration.md) | Tool-to-reminder connections |
| [cross_system_integration.md](cross_system_integration.md) | Integration with slash commands, reminders, compaction |

### Cross-Module Integration

| Document | Description |
|----------|-------------|
| [cross_module_integration_complete.md](cross_module_integration_complete.md) | **COMPLETE** - Full cross-module integration with source restoration |
| [../00_overview/cross_module_integration_complete_v3.md](../00_overview/cross_module_integration_complete_v3.md) | Complete cross-module integration for all 4 modules |
| [../00_overview/ui_interaction_complete_v2.md](../00_overview/ui_interaction_complete_v2.md) | UI components for Tools, MCP, Plan Mode, Task System |

---

## Key Algorithms

### Tool Dispatch Algorithm

```
tool_use block received from LLM
  │
  ├─→ Lookup tool by name in session tool set
  │     └─→ If not found, check alias registry (ng())
  │
  ├─→ If tool not found: Return error tool_result
  │
  ├─→ If abort signal: Return cancelled tool_result
  │
  └─→ Execute 8-stage pipeline (fxY)
        │
        ├─→ Stage 1-2: Validate input
        ├─→ Stage 3: Run pre-hooks
        ├─→ Stage 4: Check permissions
        ├─→ Stage 5: Call tool
        ├─→ Stage 6: Run post-hooks
        └─→ Stage 7-8: Format result
```

### Permission Flow Algorithm

```
canUseTool(toolName, input, context)
  │
  ├─→ Check if hook provided permission override
  │     └─→ If "allow": Skip user prompt
  │     └─→ If "deny": Return denied
  │
  ├─→ Check auto-allow rules
  │     ├─→ Read-only tools in non-destructive contexts
  │     ├─→ Tools with allowedTools permission
  │     └─→ Tools with isConcurrencySafe() = true
  │
  ├─→ Check permission rules from settings
  │     └─→ Apply allow/deny patterns
  │
  └─→ If no auto-allow: Prompt user
        ├─→ "Yes, always" → Add to allowed
        ├─→ "Yes, this time" → Allow once
        ├─→ "No, this time" → Deny once
        └─→ "No, always" → Add to denied
```

---

## Cross-Module Integration

### Tools ↔ System Reminder (04)

Tool execution generates attachments that become system reminders:
- `progress` - Tool progress updates
- `hook_additional_context` - Pre-hook context
- `hook_blocking_error` - Hook denial
- `task_status` - Background task changes

See [tool_reminder_integration.md](tool_reminder_integration.md) for full analysis.

### Tools ↔ MCP (06)

MCP tools are discovered and registered dynamically:
- `fetchMcpTools` (JE) discovers tools via `tools/list`
- MCP tools are prefixed with `mcp__serverName__toolName`
- MCP tool execution routes through `callMcpTool` (pC)

### Tools ↔ Hooks (11)

Pre and post hooks intercept tool execution:
- PreToolUse: Can block, modify input, or bypass permission
- PostToolUse: Can modify output or prevent continuation
- PostToolUseFailure: Handles tool execution errors

### Tools ↔ Sandbox (18)

Bash tool integrates with sandbox for security:
- Path restrictions
- Command validation
- Sandboxed execution mode

---

## Quick Reference

### Tool Name Constants

```javascript
TOOL_NAME_READ = "Read"           // s7
TOOL_NAME_WRITE = "Write"         // _K
TOOL_NAME_EDIT = "Edit"           // R4
TOOL_NAME_BASH = "Bash"           // Q7
TOOL_NAME_GREP = "Grep"           // N9
TOOL_NAME_GLOB = "Glob"           // qz
TOOL_NAME_AGENT = "Agent"         // r4
TOOL_NAME_SKILL = "Skill"         // oH
```

### Tool Filtering Sets

```javascript
EXCLUDED_TOOLS = new Set(["TaskOutput", "ExitPlanMode", "EnterPlanMode", "Agent", "AskUserQuestion", "TaskStop"])
ASYNC_ALLOWED_TOOLS = new Set(["Read", "WebSearch", "Grep", "WebFetch", "Glob", "TodoWrite", "Edit", "Write", ...])
BACKGROUND_AGENT_TOOLS = new Set(["TaskCreate", "TaskGet", "TaskList", "TaskUpdate", "SendMessage", ...])
```

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Added Cron tools, worktree isolation for Agent tool |
| 2.1.72 | Per-invocation model selection for Agent tool |
| 2.1.71 | Loop/Cron system integration |
| 2.1.32 | Agent teams, auto memory integration |
| 2.1.18 | Keybindings system |

---

## Symbol Validation Status

**Last validated:** 2026-03-27

All symbols in this module have been cross-validated against source code.

### Validation Reports
- [symbol_validation_report.md](symbol_validation_report.md) - Complete symbol validation
- [tools_complete_source_restoration.md](tools_complete_source_restoration.md) - Full source restoration with algorithms

### Key Validated Symbols

| Symbol | Validated Location | Status |
|--------|-------------------|--------|
| Wi6 (toolDispatcher) | chunks.146.mjs:285 | ✅ Correct |
| fxY (toolExecutionPipeline) | chunks.146.mjs:442 | ✅ Correct |
| ZxY (toolExecutionOrchestrator) | chunks.146.mjs:391 | ✅ Correct |
| dK (findTool) | chunks.56.mjs:1592 | ✅ Correct |
| y4q (executePreToolHooks) | chunks.146.mjs:74 | ✅ Correct |
| k4q (executePostToolHooks) | chunks.146.mjs:* | ✅ Correct |
| E4q (executePostToolFailureHooks) | chunks.146.mjs:* | ✅ Correct |
| Pi6 (AsyncQueue) | chunks.*.mjs | ✅ Correct |

---

## Cross-Module Integration

### Tools ↔ System Reminder (04)

Tool execution generates the following attachment types:
- `progress` - Tool progress updates (streaming)
- `hook_additional_context` - Pre-hook context injection
- `hook_blocking_error` - Hook denial message
- `task_status` - Background task changes
- `permission_decision` - Permission flow results
- `hook_stopped_continuation` - Hook stopped execution
- `structured_output` - Tool returned structured data

**Key Integration Points:**
- `p1` (createUserMessage) creates messages with `isMeta: true` for system reminders
- `f4` (createAttachmentMessage) wraps tool-specific attachments
- Progress callbacks stream via `C4q` (createProgressMessage)

### Tools ↔ MCP (06)

MCP tools are discovered and registered dynamically:
- `fetchMcpTools` (JE) discovers tools via `tools/list`
- MCP tools are prefixed with `mcp__serverName__toolName`
- MCP tool execution routes through `callMcpTool` (pC)
- Session recovery via `McpSessionLostError` (qn8)
- Tool annotations map to tool methods:
  - `readOnlyHint` → `isReadOnly()`
  - `destructiveHint` → `isDestructive()`
  - `openWorldHint` → `isOpenWorld()`

### Tools ↔ Hooks (11)

Pre and post hooks intercept tool execution:
- **PreToolUse**: Can block, modify input, bypass permission, stop execution
- **PostToolUse**: Can modify output, add attachments
- **PostToolUseFailure**: Handles tool execution errors

Hook event types:
- `hookPermissionResult` - Hook provided permission decision
- `hookUpdatedInput` - Hook modified tool input
- `preventContinuation` - Hook wants to stop after tool
- `stopReason` - Custom stop message
- `additionalContext` - Extra context to inject
- `stop` - Immediate stop requested

### Tools ↔ Sandbox (18)

Bash tool integrates with sandbox for security:
- Path restrictions via `generateSeatbeltProfile` (xb3)
- Command validation via `isCommandSandboxed` (Ti)
- Exclusion pattern matching via `isCommandInExcludedList` (yYz)
- Network permission control via `checkNetworkPermission` (nZ7)

### Tools ↔ Plan Mode (12)

Plan mode restricts available tools:
- Only `isReadOnly()` tools allowed
- `Write`/`Edit` allowed only to plan file path
- `ExitPlanMode` is the only programmatic exit
- `AskUserQuestion` allowed for clarification

### Tools ↔ Task System (13)

Task tools integrate with task management:
- `TaskCreate`, `TaskGet`, `TaskList`, `TaskUpdate` tools
- `TodoWrite` tool for simple todo mode
- Task operations use file locking for concurrency
- `claimTask` with agent busy validation
- `unassignTeammateTasks` on agent shutdown