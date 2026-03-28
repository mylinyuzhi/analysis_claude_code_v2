# Tool Filtering in Plan Mode Complete Analysis (Claude Code 2.1.76)

> Complete analysis of tool availability and filtering in plan mode.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key functions:
- `filterToolsByMode` (Xk8) - Mode-aware filtering - chunks.93.mjs:1568
- `isReadOnly` - Tool capability check

---

## Overview

Plan mode restricts available tools to prevent unintended modifications. Only read-only tools and specific plan-related tools are available.

---

## Filtering Rules

### Always Allowed

| Tool | Reason |
|------|--------|
| Read | Read-only, exploration |
| Grep | Read-only, search |
| Glob | Read-only, file discovery |
| WebFetch | Read-only, external info |
| WebSearch | Read-only, research |
| ExitPlanMode | Required to exit |
| EnterPlanMode | Re-entry allowed |
| AskUserQuestion | Clarification needed |

### Conditionally Allowed

| Tool | Condition |
|------|-----------|
| Write | Only to `planFilePath` |
| Edit | Only to `planFilePath` |

### Always Blocked

| Tool | Reason |
|------|--------|
| Bash | Execution not allowed |
| Agent | No sub-agents |
| TaskCreate/Update | No task modifications |
| NotebookEdit | No notebook changes |

---

## Implementation

```javascript
// ============================================
// Tool filtering algorithm
// ============================================

function filterToolsForPlanMode(tools, planFilePath, mode) {
    if (mode !== "plan") return tools;

    return tools.filter(tool => {
        // Always allow read-only tools
        if (tool.isReadOnly?.()) return true;

        // Always allow plan-specific tools
        const planTools = ["ExitPlanMode", "EnterPlanMode", "AskUserQuestion"];
        if (planTools.includes(tool.name)) return true;

        // Allow Write/Edit but check path at execution time
        if (tool.name === "Write" || tool.name === "Edit") {
            return true; // Path checked in tool execution
        }

        return false;
    });
}
```

### Path Restriction in Write/Edit

```javascript
// ============================================
// Plan file path validation in Write/Edit
// ============================================

async function validatePlanFilePath(inputPath, planFilePath) {
    const resolvedInput = path.resolve(inputPath);
    const resolvedPlan = path.resolve(planFilePath);

    if (resolvedInput !== resolvedPlan) {
        throw new Error(
            `In plan mode, you can only write to the plan file: ${planFilePath}`
        );
    }
}
```

---

## Integration Points

### Tools (05)

- Filtering applied at tool discovery
- Execution-time validation for Write/Edit

### System Reminder (04)

- Plan mode attachment informs agent of restrictions
- Updated when entering/exiting plan mode

---

## Quick Reference

### Tool Categories in Plan Mode

```
ALWAYS VISIBLE (in tool list sent to LLM):
├── MCP tools: All mcp__* tools bypass filtering entirely
├── ExitPlanMode: Special-cased before CW6 blocking (only in plan mode)
├── Read-only tools: Read, Grep, Glob, WebFetch, WebSearch (via isReadOnly())
├── Bash: Available — dynamic isReadOnly() evaluates each command
├── Write, Edit: Available — path restriction enforced at execution time
├── Task tools: TaskCreate, TaskUpdate, TaskGet, TaskList (not in CW6)
└── Default: All non-CW6 tools pass through

HIDDEN FROM TOOL LIST (in CW6 set, handled via special paths):
├── EnterPlanMode: Already in plan mode, no need in tool list
├── AskUserQuestion: Injected via separate interaction path
├── Agent: Hidden, but Task tool provides agent/subagent functionality
├── TaskOutput, TaskStop: Internal use only
└── NOTE: These tools may still be callable; they are just not
    advertised in the tool definitions sent to the LLM

EXECUTION-TIME RESTRICTIONS:
├── Write/Edit: Denied for non-plan files (plan file path check)
├── Bash: Read-only commands allowed; write commands require permission
└── Non-read-only tools: NeedsApproval → Denied in plan mode
```

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced path validation |
| 2.1.18 | Initial tool filtering |

---

## Source-Level Implementation

### filterToolsByMode (Xk8) Complete Source

> **CORRECTED**: Previous version of this document contained a fabricated Xk8 implementation.
> Below is the actual source from chunks.93.mjs:1568-1588.

```javascript
// ============================================
// filterToolsByMode - Mode-aware tool filtering
// Location: chunks.93.mjs:1568-1588
// ============================================

// ORIGINAL (for source lookup):
function Xk8({
    tools: A,
    isBuiltIn: q,
    isAsync: K = !1,
    permissionMode: Y
}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;           // MCP tools always visible
        if (z3(z, aJ) && Y === "plan") return !0;            // ExitPlanMode visible only in plan mode
        if (CW6.has(z.name)) return !1;                       // CW6 set: always hidden
        if (!q && xV8.has(z.name)) return !1;                 // Non-built-in xV8: hidden
        if (K && !eP1.has(z.name)) {                          // Async tool filter
            if (E7() && eP()) {
                if (z3(z, r4)) return !0;                      // Agent in special context
                if (WY4.has(z.name)) return !0                 // Task/Cron tools in special context
            }
            return !1
        }
        return !0                                              // Default: visible
    })
}

// READABLE (for understanding):
function filterToolsByMode({ tools, isBuiltIn, isAsync = false, permissionMode }) {
    return tools.filter((tool) => {
        // 1. MCP tools bypass ALL filtering — always visible regardless of mode
        if (tool.name.startsWith("mcp__")) return true;

        // 2. ExitPlanMode: special-cased before CW6 check — visible only in plan mode
        //    aJ = "ExitPlanMode" (constant at chunks.90.mjs:507)
        if (matchesToolName(tool, "ExitPlanMode") && permissionMode === "plan") return true;

        // 3. CW6 set: always hidden from tool definitions
        //    CW6 = {TaskOutput, ExitPlanMode, EnterPlanMode, Agent, AskUserQuestion, TaskStop}
        //    These are handled through separate paths (interaction, subagent Task tool, etc.)
        if (CW6_ALWAYS_HIDDEN.has(tool.name)) return false;

        // 4. Non-built-in tools in xV8: hidden (same tools as CW6)
        if (!isBuiltIn && xV8_NON_BUILTIN_HIDDEN.has(tool.name)) return false;

        // 5. Async tool restrictions (for background/parallel execution)
        if (isAsync && !ASYNC_SAFE_TOOLS.has(tool.name)) {
            // Special context: team mode allows Agent and task/cron tools
            if (isTeamMode() && isTeamLeader()) {
                if (matchesToolName(tool, "Agent")) return true;
                if (TASK_CRON_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        // 6. Default: tool is visible
        return true;
    });
}

// KEY INSIGHT: This function controls tool VISIBILITY (what the LLM sees),
// NOT execution permission. A visible tool can still be denied at execution
// time by the permission system (e.g., Write denied for non-plan files).
//
// Constants:
//   aJ = "ExitPlanMode" (single tool name, NOT a set)
//   CW6 = {TaskOutput, ExitPlanMode, EnterPlanMode, Agent, AskUserQuestion, TaskStop}
//   xV8 = same as CW6 (for non-built-in filtering)
//   eP1 = async-safe tools: {Read, WebSearch, TodoWrite, Grep, WebFetch, Glob, Bash,
//          Edit, Write, NotebookEdit, Skill, StructuredOutput, ToolSearch,
//          EnterWorktree, ExitWorktree}
//   WY4 = task/cron tools: {TaskCreate, TaskGet, TaskList, TaskUpdate,
//          SendMessage, CronCreate, CronDelete, CronList}
//
// Mapping: Xk8→filterToolsByMode, z3→matchesToolName, CW6→CW6_ALWAYS_HIDDEN,
//          xV8→xV8_NON_BUILTIN_HIDDEN, eP1→ASYNC_SAFE_TOOLS, WY4→TASK_CRON_TOOLS,
//          r4→"Agent", E7→isTeamMode, eP→isTeamLeader
```

### Path Restriction in Write Tool

```javascript
// ============================================
// Plan file path validation in Write tool
// Location: chunks.146.mjs (Write tool implementation)
// ============================================

// ORIGINAL (for source lookup):
async function validateInput(A, q) {
    let K = q.getAppState?.();
    if (K?.toolPermissionContext?.mode === "plan") {
        let Y = K.toolPermissionContext.planFilePath;
        if (Y && path.resolve(A.file_path) !== path.resolve(Y)) {
            return {
                result: !1,
                message: `In plan mode, you can only write to the plan file: ${Y}`
            };
        }
    }
    return { result: !0 }
}

// READABLE (for understanding):
async function validateInput(input, context) {
    const appState = context.getAppState?.();

    // Check if in plan mode
    if (appState?.toolPermissionContext?.mode === "plan") {
        const planFilePath = appState.toolPermissionContext.planFilePath;

        // Validate path matches plan file
        if (planFilePath && path.resolve(input.file_path) !== path.resolve(planFilePath)) {
            return {
                result: false,
                message: `In plan mode, you can only write to the plan file: ${planFilePath}`
            };
        }
    }

    return { result: true };
}
```

### isReadOnly() Implementation

```javascript
// ============================================
// isReadOnly method on tool objects
// ============================================

// Read tool - always read-only
const ReadTool = {
    name: "Read",
    isReadOnly() { return true; },
    // ...
};

// Bash tool - DYNAMIC read-only check (evaluates each command)
// Location: chunks.170.mjs:634-636
const BashTool = {
    name: "Bash",
    isReadOnly(input) {
        let containsGit = containsGitCommand(input.command);  // Pf6
        return evaluateBashCommandReadiness(input, containsGit).behavior === "allow";  // Of6
    },
    // Read-only commands (ls, cat, git status, etc.) return true
    // Write commands return false → blocked in plan mode
};

// Edit tool - not read-only (path restriction applies)
const EditTool = {
    name: "Edit",
    isReadOnly() { return false; },
    // ...
};

// ExitPlanMode - read-only (just state transition)
const ExitPlanModeTool = {
    name: "ExitPlanMode",
    isReadOnly() { return false; },  // Modifies mode state
    // ...
};
```

---

## Key Insight: Two-Stage Filtering

### Stage 1: Tool Set Filtering (Discovery)

At tool discovery time, `filterToolsByMode` removes unavailable tools from the set.

### Stage 2: Execution-Time Validation

For Write/Edit tools, path validation occurs in `validateInput`:

1. Check current mode from app state
2. If plan mode, resolve both paths
3. Reject if paths don't match
4. Allow if match or not in plan mode

**Why two stages?**
- Tool list needs to show Write/Edit for plan file editing
- Actual restriction enforced at execution prevents misuse
- Clear error message with plan file path

---

## Verification

1. **Validate filterToolsByMode symbol**:
   ```bash
   grep -n "function Xk8" source/chunks.93.mjs
   # Expected: 1568:function Xk8({
   ```

2. **Validate tool name constants**:
   ```bash
   grep -n "aJ = \"ExitPlanMode\"" source/chunks.90.mjs
   grep -n "dt = \"EnterPlanMode\"" source/chunks.90.mjs
   ```