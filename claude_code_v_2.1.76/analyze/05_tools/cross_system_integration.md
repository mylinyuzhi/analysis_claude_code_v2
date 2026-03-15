# Cross-System Integration: Tools ↔ Reminders ↔ Compact ↔ Slash Commands (Claude Code 2.1.76)

> Architectural analysis of the three major integration points where the tool system connects to external subsystems. All symbols in this document are verified against source code.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document (verified locations):

Flow A — Slash Commands → Tools:
- `toolDispatcher` (Wi6) — chunks.146.mjs:285
- `toolExecutionPipeline` (fxY) — chunks.146.mjs:442
- `handleSlashInput` (Mb4) — chunks.130.mjs:1506
- `parseSlashCommand` (Db4) — chunks.130.mjs:1344

Flow B — Tool Execution → Attachment → System Reminder:
- `executePreToolHooksIterator` (y4q) — chunks.146.mjs:74
- `executePostToolHooksIterator` (k4q) — chunks.145.mjs:3107
- `bashProgressHandler` (ZhA) — chunks.150.mjs:2332

Flow C — Compaction Boundary and Tool State:
- `parseMcpToolName` (p94) — chunks.90.mjs:2355
- `isDeferredOrMcpTool` (GX) — chunks.90.mjs:2260

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CONNECTED SUBSYSTEMS                             │
│                                                                      │
│  09_slash_command ──────┐                                            │
│  (Mb4 handleSlashInput) │  Flow A:                                   │
│                         ├─→ Both paths converge on Wb4              │
│  05_tools/SkillTool ────┘  (handlePromptCommand)                    │
│                                  │                                   │
│                                  ▼                                   │
│  03_llm_core/Agent Loop ─→ Wi6 → ZxY → fxY (8-stage pipeline)       │
│                                  │                                   │
│                         Flow B:  ├─→ y4q/k4q hooks                  │
│                                  │     └─→ attachment messages       │
│                                  │           └─→ 04_system_reminder  │
│                                  │                                   │
│                         Flow C:  └─→ readFileState (empty post-compact)
│                                        deferredToolSchemas (preserved)
│                                        └─→ 07_compact               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Flow A: Slash Commands → Tool Invocation

### Two Paths to the Same Handler

Slash command execution has two convergent paths depending on whether the skill is user-invoked or model-invoked.

**Path 1 — User-invoked (direct):**

```
User types /skill-name
  → handleSlashInput (Mb4) [chunks.130.mjs:1506]
      → parseSlashCommand (Db4) [chunks.130.mjs:1344]
      → executeCommand (ifY)
          → if inline skill: handlePromptCommand (Wb4) [inline execution]
          → if forked skill: handleForkedCommand (cfY) [separate process]
              → model generates tool calls within the prompt
              → standard Wi6 pipeline
```

**Path 2 — Model-invoked (via SkillTool):**

```
Model generates: tool_use { name: "Skill", input: { skill: "skill-name" } }
  → toolDispatcher (Wi6) [chunks.146.mjs:285]
      → toolExecutionOrchestrator (ZxY) [chunks.146.mjs:391]
          → toolExecutionPipeline (fxY) [chunks.146.mjs:442]
              Stage 1: Schema validation
              Stage 2: validateInput check
              Stage 3: Pre-hooks (y4q → LF8)
              Stage 4: canUseTool permission check
              Stage 5: Alias mapping
              Stage 6: SkillTool.call()
                          → handlePromptCommandFromTool (Pb4)
                              → handlePromptCommand (Wb4)  ← SAME HANDLER AS PATH 1
              Stage 7: Post-hooks (k4q → RF8)
              Stage 8: Result assembly
```

**Convergence diagram:**

```
Path 1 (user types /skill):    handleSlashInput (Mb4) ─────────────┐
                                                                      ▼
                                                             handlePromptCommand (Wb4)
                                                                      ▲
Path 2 (model calls Skill{}):  Wi6 → fxY → SkillTool.call() ────────┘
```

### The Security Asymmetry

**Key insight:** The SkillTool bridge is why model-invoked skills are safer than user-invoked ones.

| Path | Goes through fxY? | Permission check? | Pre-hooks? |
|------|--------------------|-------------------|------------|
| User types `/dangerous-skill` | **No** — bypasses pipeline | **No** | **No** |
| Model calls `Skill { skill: "dangerous-skill" }` | **Yes** — full 8-stage | **Yes** (Stage 4) | **Yes** (Stage 3) |

A user typing a slash command invokes it directly, bypassing the `canUseTool` permission gating and hook processing entirely. A model calling `Skill { ... }` goes through the complete tool execution pipeline. This means:

- Hooks configured for `PreToolUse:Skill` fire for model-invoked skills but NOT for user-typed slash commands
- Permission rules apply to model-invoked skills but NOT to user-typed slash commands
- This is intentional: the user directly typing a command is an explicit user action that already has implicit authorization

---

## Flow B: Tool Execution → Attachment → System Reminder

### Mechanism Overview

During `fxY` execution, tools yield progress and result messages. The pre/post hook iterators (`y4q`, `k4q`) also emit attachment messages. All are collected and normalized by `K2z` (normalizeAttachmentForAPI), then injected as user-role messages with `isMeta: true` before the next LLM request.

```
fxY yields: [tool_result, ...preHookMessages, ...postHookMessages]
                                    │
                                    ▼
K2z (normalizeAttachmentForAPI) wraps each in <system-reminder> tags
                                    │
                                    ▼
Injected as user-role messages with isMeta: true
                                    │
                                    ▼
LLM receives context before generating next response
```

### Why User-Role with isMeta

System prompts are aggressively cached in Claude's prompt cache. Injecting tool context into cached system prompts would bust the cache on every turn, dramatically increasing latency and cost.

Using user-role messages with `isMeta: true` preserves cache efficiency while still delivering context to the model. The `isMeta` flag signals to the UI and serialization layers that these are internal system messages, not user-generated content.

### Complete Attachment Type Mapping

| Triggering Event | Attachment Type | Generator |
|-----------------|-----------------|-----------|
| Tool progress during execution | `progress` | Tool's `onProgress` callback |
| Bash in remote/container | `tool_progress` | `bashProgressHandler` (ZhA) |
| PreToolUse hook — context | `hook_additional_context` | `y4q` emitting `additionalContexts` |
| PreToolUse hook — blocking | `hook_blocking_error` | `y4q` emitting `blockingError` |
| PreToolUse hook — cancelled | `hook_cancelled` | `y4q` on abort signal |
| Permission decision (hook source) | `hook_permission_decision` | `fxY` stage 4 |
| PostToolUse hook — stop | `hook_stopped_continuation` | `k4q` emitting `preventContinuation` |
| PostToolUse MCP hook — replace | *(in-place replacement)* | `k4q` replaces `tool_result` |
| Background task status change | `task_status` | `vIY` (getUnifiedTasksAttachment) on next turn |
| Tool result with structured output | `structured_output` | `fxY` stage 8 |

### Bash Progress Throttling

The `bashProgressHandler` (ZhA) only emits progress in remote/container environments (not local sessions where the terminal shows progress directly). It throttles emissions to at most once per `RcY` interval, and uses an LRU cache (`dU1`) bounded to `LcY` entries to prevent memory leaks from tracking many concurrent tool use IDs.

---

## Flow C: Compaction Boundary and Tool State Invariants

### Complete State Timeline

```
Turn N (pre-compaction):
  readFileState Map = {
    "src/foo.ts": { content: "...", timestamp: 1234567890 },
    "src/bar.ts": { content: "...", timestamp: 1234567891 }
  }
  loaded deferred tools = [ mcp__server__tool_a, mcp__server__tool_b ]
  sessionState.deferredToolSchemas = {
    "mcp__server__tool_a": zodSchema_a,
    "mcp__server__tool_b": zodSchema_b
  }

── COMPACTION FIRES ──────────────────────────────────────────────────
  autoCompactDispatcher orchestrates:
    1. State collection → todos, plan, tasks, skills, recent files
       preserved as state-preservation attachments
    2. Schema serialization → deferredToolSchemas written to sessionState
    3. LLM summarization → message history → compact summary
    4. Message reconstruction → summary + state attachments → new messages

Turn N+1 (post-compaction):

  readFileState Map = {}  ← EMPTY (intentional reset)
    Effect: Edit tool will fail with "File has not been read yet"
    LLM path: LLM sees file content as state-preservation attachment
    Recovery: LLM re-issues Read tool call → cache rebuilds → Edit succeeds

  loaded deferred tools:
    schemas RESTORED from sessionState.deferredToolSchemas
    Effect: ToolSearch-loaded tools remain fully functional
    No re-invocation of ToolSearch required

  LLM working memory:
    RESTORED via state-preservation attachments (files, todos, plan, tasks)
    BUT: this is the LLM's view — NOT the tool runtime's view
```

### The Two-Layer Context Model

This is the central conceptual bridge between `05_tools` and `07_compact`:

**Layer 1 — LLM context:** What the model "remembers" — restored via state-preservation attachments injected into the compacted message array. The LLM can see file contents, the todo list, the plan.

**Layer 2 — Tool runtime state:** What tools can do — `readFileState` cache is NOT restored even though the LLM sees file content as an attachment.

A developer debugging "why does Edit fail after compaction?" must understand that:
> The LLM *knowing* the file contents (Layer 1) does NOT mean the Edit tool *considers* the file "read" (Layer 2).

These are separate systems with different restoration contracts, by design.

### Why the Asymmetry Between readFileState and Deferred Schemas

| State | Restored? | Reason |
|-------|-----------|--------|
| `readFileState` (file cache) | **No** | Files on disk may have changed. Restoring stale timestamps would let Edit overwrite a file based on outdated content — a data loss risk. |
| Deferred tool schemas | **Yes** | Tool schemas are immutable definitions. `mcp__server__tool_a` has the same schema after compaction as before. Restoring is safe and necessary to avoid spurious validation failures. |

The restoration contract matches the mutability of the underlying data:
- Mutable real-world state (file content) → must be verified fresh
- Immutable definitions (tool schemas) → can be safely restored from cache

### MCP Tool Name Detection Post-Compaction

Post-compaction schema restoration uses `p94` (parseMcpToolName) to identify which tools need schema reattachment:

```javascript
// ============================================
// parseMcpToolName - MCP naming convention detection
// Location: chunks.90.mjs:2355
// ============================================

// ORIGINAL (for source lookup):
// function p94(A) { ... checks for "mcp__" prefix ... }

// READABLE (for understanding):
function parseMcpToolName(toolName) {
    const MCP_PREFIX = "mcp__";
    if (!toolName.startsWith(MCP_PREFIX)) {
        return { isMcp: false };
    }
    const withoutPrefix = toolName.slice(MCP_PREFIX.length);
    const separatorIndex = withoutPrefix.indexOf("__");
    if (separatorIndex === -1) {
        return { isMcp: false };
    }
    return {
        isMcp: true,
        parts: {
            serverName: withoutPrefix.slice(0, separatorIndex),
            toolName: withoutPrefix.slice(separatorIndex + 2)
        },
        full: toolName
    };
}

// Mapping: p94→parseMcpToolName, A→toolName
```

The `GX` (isDeferredOrMcpTool) function extends this check to include the `shouldDefer` flag and a feature flag override, routing deferred tools to the lazy-loading code path.

---

## Reading Order

### "I want to understand how slash commands become tool calls"

1. This document — Flow A (Slash Commands → Tool Invocation)
2. [skill_tool_pipeline_bridge.md](skill_tool_pipeline_bridge.md) — SkillTool's role in detail
3. [../09_slash_command/](../09_slash_command/) — slash command parsing and routing

### "I want to understand how tool output becomes system-reminder content"

1. This document — Flow B (Tool Execution → Attachment → System Reminder)
2. [tool_reminder_integration.md](tool_reminder_integration.md) — full attachment mechanics with code
3. [../04_system_reminder/attachment_producers.md](../04_system_reminder/attachment_producers.md) — all 40+ producers

### "I want to understand what happens to tool state at compaction"

1. This document — Flow C (Compaction Boundary)
2. [compaction_tool_state.md](compaction_tool_state.md) — readFileState and deferred schema preservation
3. [../07_compact/state_preservation.md](../07_compact/state_preservation.md) — complete state preservation
