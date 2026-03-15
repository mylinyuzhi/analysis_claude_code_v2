# 05_tools Module Index (Claude Code 2.1.76)

> Module guide and reading order for the tool system analysis documents. For the complete pipeline deep-dive, start with [tool_execution_pipeline.md](tool_execution_pipeline.md).

---

## Module Overview

The tool system handles everything from tool registration through execution, permission checking, and result formatting. Tools are the primary mechanism through which the LLM interacts with the user's environment.

```
┌──────────────────────────────────────────────────────────────────┐
│                      TOOL EXECUTION PIPELINE                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  LLM Response (tool_use)                                          │
│     │                                                              │
│     ▼                                                              │
│  [1] Wi6 (toolDispatcher) → Tool registry lookup                  │
│     │                                                              │
│     ▼                                                              │
│  [2] ZxY (toolExecutionOrchestrator) → Async queue wrapper        │
│     │                                                              │
│     ▼                                                              │
│  [3] fxY (toolExecutionPipeline)                                  │
│     ├── Schema validation (Zod safeParse)                         │
│     ├── Custom validateInput                                       │
│     ├── Pre-tool hooks (y4q → LF8)                                │
│     ├── Permission check (canUseTool)                             │
│     ├── tool.call() execution                                     │
│     ├── Post-tool hooks (k4q → RF8)                               │
│     └── Result formatting + telemetry                             │
│     │                                                              │
│     ▼                                                              │
│  Return to agent loop as tool_result message                      │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Files in This Module

### Pipeline & Architecture

| File | Description |
|------|-------------|
| [tool_execution_pipeline.md](tool_execution_pipeline.md) | **Primary reference.** Complete 8-stage pipeline: dispatch, validation, pre-hooks, permission, execution, post-hooks, result formatting, telemetry. Deep analysis with source code. |
| [tool_reminder_integration.md](tool_reminder_integration.md) | How tools produce attachment messages (system-reminder hooks, progress, structured output). Message ordering and hook result types. |
| [tool_coordination.md](tool_coordination.md) | Cross-tool state sharing: `readFileState` cache, mode restrictions, subagent context inheritance. |
| [compaction_tool_state.md](compaction_tool_state.md) | How compaction affects tool state; `readFileState` reset after compaction; Edit validation failures and self-correction. |
| [skill_tool_pipeline_bridge.md](skill_tool_pipeline_bridge.md) | Skill tool's place in the pipeline; inline vs. forked execution paths; permission auto-allow logic. |

### Tool Registry & Discovery

| File | Description |
|------|-------------|
| [tool_registry.md](tool_registry.md) | Tool registration system, how tools are assembled into session tool sets. |
| [tool_discovery.md](tool_discovery.md) | Dynamic tool loading, MCP tool discovery, skill-provided tools. |
| [dynamic_tools.md](dynamic_tools.md) | Deferred/dynamic tool sets and the `ToolSearch` tool for lazy loading. |
| [tool_schemas.md](tool_schemas.md) | Zod schema patterns, input/output schema conventions. |
| [tool_interface_patterns.md](tool_interface_patterns.md) | Common patterns in tool object definitions (call, validateInput, checkPermissions, etc.). |

### Individual Tool Analysis

| File | Description |
|------|-------------|
| [read_tool.md](read_tool.md) | File reading, PDF support, image handling, `readFileState` population. |
| [edit_tool.md](edit_tool.md) | String replacement editing, diff generation, concurrent edit protection. |
| [write_tool.md](write_tool.md) | File writing, encoding detection, line ending preservation. |
| [bash_tool.md](bash_tool.md) | Command execution, security validation, progress streaming, sandbox integration. |
| [grep_glob_tools.md](grep_glob_tools.md) | Grep and Glob tools, regex patterns, file system traversal. |
| [web_tools.md](web_tools.md) | WebFetch and WebSearch tools, URL handling. |
| [agent_tool.md](agent_tool.md) | Task/Agent tool for spawning subagents. |
| [task_management_tools.md](task_management_tools.md) | TaskCreate, TaskGet, TaskList, TaskUpdate, TaskOutput, TaskStop. |
| [plan_mode_tools.md](plan_mode_tools.md) | EnterPlanMode, ExitPlanMode tools. |
| [worktree_tools.md](worktree_tools.md) | Git worktree tools (v2.1.76). |
| [cron_tools.md](cron_tools.md) | CronCreate, CronDelete, CronList tools (v2.1.76). |
| [team_tools.md](team_tools.md) | TeamCreate, TeamDelete, SendMessage for agent teams. |
| [skill_toolsearch_tools.md](skill_toolsearch_tools.md) | Skill tool and ToolSearch tool. |

### Security & Permissions

| File | Description |
|------|-------------|
| [security_validation.md](security_validation.md) | Tool-level security checks, Bash security validation chain. |
| [ui_rendering.md](ui_rendering.md) | How tool use/result messages are rendered in the terminal UI. |

---

## Reading Order by Use Case

### "I want to understand how tool execution works end-to-end"
1. This file (overview)
2. [tool_execution_pipeline.md](tool_execution_pipeline.md) — full pipeline with code
3. [tool_reminder_integration.md](tool_reminder_integration.md) — attachments and progress
4. [tool_coordination.md](tool_coordination.md) — cross-tool state

### "I'm debugging a tool permission issue"
1. [tool_execution_pipeline.md](tool_execution_pipeline.md) — Permission Check section
2. [tool_coordination.md](tool_coordination.md) — Mode-Based Tool Restrictions
3. [security_validation.md](security_validation.md) — security-layer rejections

### "I want to understand how hooks interact with tools"
1. [tool_execution_pipeline.md](tool_execution_pipeline.md) — Hook Execution Generators section
2. [tool_reminder_integration.md](tool_reminder_integration.md) — Hook Result Types table
3. Cross-reference: [11_hooks/](../11_hooks/)

### "Edit is failing after compaction"
1. [compaction_tool_state.md](compaction_tool_state.md) — readFileState lifecycle
2. [tool_coordination.md](tool_coordination.md) — Read→Edit/Write Coordination
3. Cross-reference: [07_compact/state_preservation.md](../07_compact/state_preservation.md)

### "I want to understand the Skill tool"
1. [skill_tool_pipeline_bridge.md](skill_tool_pipeline_bridge.md) — pipeline integration
2. [skill_toolsearch_tools.md](skill_toolsearch_tools.md) — skill tool surface
3. Cross-reference: [10_skill_system/](../10_skill_system/)

### "I need to understand a specific tool (Read/Edit/Bash/etc.)"
Go directly to the relevant individual tool file listed in the table above.
