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
ALLOWED:
├── Read-only: Read, Grep, Glob, WebFetch, WebSearch
├── Plan-specific: ExitPlanMode, EnterPlanMode, AskUserQuestion
└── Restricted: Write, Edit (plan file only)

BLOCKED:
├── Execution: Bash, Agent
├── Tasks: TaskCreate, TaskUpdate
└── Other: All modification tools
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

```javascript
// ============================================
// filterToolsByMode - Mode-aware tool filtering
// Location: chunks.93.mjs:1568-1620
// ============================================

// ORIGINAL (for source lookup):
function Xk8({ toolPermissionContext: A, tools: q, planFilePath: K }) {
    let Y = A.mode;
    if (Y === "plan") return q.filter((z) =>
        z.isReadOnly?.() ||
        z.name === "ExitPlanMode" ||
        z.name === "EnterPlanMode" ||
        z.name === "AskUserQuestion" ||
        z.name === "Write" ||
        z.name === "Edit"
    );
    if (Y === "delegate") return q.filter((z) =>
        !EXCLUDED_TOOLS.has(z.name)
    );
    return q
}

// READABLE (for understanding):
function filterToolsByMode({ toolPermissionContext, tools, planFilePath }) {
    const mode = toolPermissionContext.mode;

    // Plan mode: restrict to read-only + plan-specific tools
    if (mode === "plan") {
        return tools.filter((tool) => {
            // Always allow read-only tools (Read, Grep, Glob, WebFetch, WebSearch)
            if (tool.isReadOnly?.()) return true;

            // Always allow plan mode control tools
            if (tool.name === "ExitPlanMode") return true;  // Required to exit
            if (tool.name === "EnterPlanMode") return true;  // Re-entry allowed
            if (tool.name === "AskUserQuestion") return true;  // For clarification

            // Allow Write/Edit - path restriction enforced at execution time
            if (tool.name === "Write" || tool.name === "Edit") return true;

            // Block all other tools
            return false;
        });
    }

    // Delegate mode: exclude tools not allowed for teammates
    if (mode === "delegate") {
        return tools.filter((tool) => {
            return !EXCLUDED_TOOLS.has(tool.name);
        });
    }

    // Default mode: all tools available
    return tools;
}

// Mapping: Xk8→filterToolsByMode, A→toolPermissionContext, q→tools, K→planFilePath, Y→mode
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

// Bash tool - never read-only (modifies system state)
const BashTool = {
    name: "Bash",
    isReadOnly() { return false; },
    // ...
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