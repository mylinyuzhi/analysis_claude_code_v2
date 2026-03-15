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

## Architecture Rationale

### Three-Layer Dispatch Design

**What it does:** The tool pipeline separates concerns across three distinct layers, each with a different responsibility:

**How it works:**

**Layer 1 — `Wi6` (toolDispatcher):** Single entry point from the agent loop. Its job is narrow: abort check, MCP routing decision, and wrapping execution errors into `tool_result` format so the agent loop always receives a well-formed message regardless of what happens downstream.

**Layer 2 — `ZxY` (toolExecutionOrchestrator):** Wraps `fxY` with a `Pi6` (AsyncQueue). This layer converts `fxY`'s synchronous return into a queued async structure. The agent loop can interleave progress events with tool results in streaming mode without blocking — tools can emit intermediate progress while still executing.

**Why the queue wrapper exists:** Without `ZxY`, the agent loop would have to wait for `fxY` to fully complete before receiving any output. With the queue, `fxY` enqueues progress messages mid-execution and the caller drains them as they arrive, enabling responsive streaming UX for long-running tools (Bash, subagent execution).

**Layer 3 — `fxY` (toolExecutionPipeline):** Sequential 8-stage validation and execution. By making this a pure function with no knowledge of the queue or agent loop, it's independently testable and its stages are cleanly separable.

**Why this approach:**
- Failure isolation: Layer 1 catches errors from Layers 2 and 3 without crashing the loop
- Streaming composability: Layer 2's queue enables progress without changing Layer 3's interface
- Stage clarity: Layer 3's linear 8-stage model is easier to trace than a single monolithic function

---

## Tool Type Taxonomy

Four categories of tools enter the pipeline, with different routing in `Wi6`:

| Tool Category | Examples | Detection | Notes |
|---------------|----------|-----------|-------|
| **Native tools** | Read, Write, Edit, Bash, Grep, Glob | Defined in session tool set | Always available; no special routing |
| **MCP tools** | `mcp__server__toolname` | `p94` (parseMcpToolName) + `GX` (isDeferredOrMcpTool) | Registered via MCP server; naming convention enforced |
| **Deferred tools** | MCP tools not loaded at start | `GX` `.shouldDefer` flag | Require `ToolSearch` invocation before use; schema loaded on demand |
| **Synthetic tools** | SkillTool, ToolSearch | Tool name match (`NJ`, `dM`) | Bridge tools: SkillTool wraps slash commands; ToolSearch loads deferred schemas |

**MCP naming convention:** `mcp__<serverName>__<toolName>`. The `p94` function checks for the `mcp__` prefix and returns `{ parts, full, isMcp }`. The `GX` function checks `.isMcp === true`, `.shouldDefer`, or a feature flag.

---

## Cross-Module Flow Map

```
09_slash_command/handleSlashInput (Mb4)
  └─→ executeCommand (ifY)
        ├─→ handlePromptCommand (Wb4) [inline skills]     ─┐
        └─→ handleForkedCommand (cfY) [forked skills]      │
                                                            │ model generates tool calls
                                                            ▼
05_tools/SkillTool.call() ─────────────────────────────→ tool_use in LLM response
                                                            │
03_llm_core/Agent Loop ─────────────────────────────────→ Wi6 (toolDispatcher)
  chunks.146.mjs:285                                        │
                                                            ▼
                                                        ZxY (toolExecutionOrchestrator)
                                                          chunks.146.mjs:391
                                                            │ AsyncQueue (Pi6) wrapper
                                                            ▼
                                                        fxY (toolExecutionPipeline)
                                                          chunks.146.mjs:442
                                                         ├── 1. Schema validate (Zod safeParse)
                                                         ├── 2. Custom validate (tool.validateInput)
                                                         ├── 3. Pre-hooks (y4q) ──→ 04_system_reminder
                                                         │        LF8 (executePreToolHooks)
                                                         ├── 4. canUseTool permission check
                                                         ├── 5. Alias mapping
                                                         ├── 6. tool.call() execute
                                                         ├── 7. Post-hooks (k4q) ──→ 04_system_reminder
                                                         │        RF8 (executePostToolHooks)
                                                         └── 8. Result assembly + telemetry
                                                                  │
                                                                  ▼
                                                     tool_result message → agent loop
                                                                  │
                                                     07_compact ←─┤ readFileState reset on compaction
                                                                   │ deferred tool schemas preserved (v2.1.76)
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document (verified locations):
- `toolDispatcher` (Wi6) — entry point from agent loop, chunks.146.mjs:285
- `toolExecutionOrchestrator` (ZxY) — AsyncQueue wrapper for streaming, chunks.146.mjs:391
- `toolExecutionPipeline` (fxY) — 8-stage sequential pipeline, chunks.146.mjs:442
- `executePreToolHooksIterator` (y4q) — pre-tool hook iterator, chunks.146.mjs:74
- `executePostToolHooksIterator` (k4q) — post-tool hook iterator, chunks.145.mjs:3107
- `parseMcpToolName` (p94) — MCP tool naming detection, chunks.90.mjs:2355
- `isDeferredOrMcpTool` (GX) — deferred/MCP routing check, chunks.90.mjs:2260

---

## Files in This Module

### Pipeline & Architecture

| File | Description |
|------|-------------|
| [tool_execution_pipeline.md](tool_execution_pipeline.md) | **Primary reference.** Complete 8-stage pipeline: dispatch, validation, pre-hooks, permission, execution, post-hooks, result formatting, telemetry. Deep analysis with source code. |
| [cross_system_integration.md](cross_system_integration.md) | **Cross-module integration.** Three flows: slash commands → tools, tool execution → system-reminder attachments, compaction boundary tool state invariants. Uses only verified symbols. |
| [tool_reminder_integration.md](tool_reminder_integration.md) | How tools produce attachment messages (system-reminder hooks, progress, structured output). Message ordering and hook result types. |
| [tool_coordination.md](tool_coordination.md) | Cross-tool state sharing: `readFileState` cache, mode restrictions, subagent context inheritance. |
| [compaction_tool_state.md](compaction_tool_state.md) | How compaction affects tool state; `readFileState` reset after compaction; Edit validation failures and self-correction. Deferred tool schema preservation (v2.1.76). |
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
1. This file (overview) — architecture rationale and flow map
2. [tool_execution_pipeline.md](tool_execution_pipeline.md) — full pipeline with code
3. [tool_reminder_integration.md](tool_reminder_integration.md) — attachments and progress
4. [tool_coordination.md](tool_coordination.md) — cross-tool state
5. [cross_system_integration.md](cross_system_integration.md) — slash commands, attachments, compaction flows

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
