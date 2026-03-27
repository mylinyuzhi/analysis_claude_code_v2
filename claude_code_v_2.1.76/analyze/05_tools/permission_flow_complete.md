# Permission Flow Complete Analysis (Claude Code 2.1.76)

> Complete analysis of the permission decision flow including hook integration, auto-allow rules, and user prompts.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `canUseTool` - Permission decision entry point
- `filterToolsByRules` (hg1) - Apply permission rules from settings
- `executePreToolHooksIterator` (y4q) - Hook-based permission override

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PERMISSION DECISION FLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 1: Hook Override Check                                   │  │
│  │ ├─ PreToolUse hook may set permissionBehavior                 │  │
│  │ ├─ "allow" → Bypass user prompt (if !requiresUserInteraction) │  │
│  │ ├─ "deny" → Return denied immediately                         │  │
│  │ └─ "ask" → Force user prompt even if auto-allow              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼ (if no hook override)                    │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 2: Auto-Allow Rules                                      │  │
│  │ ├─ isConcurrencySafe() + non-destructive context              │  │
│  │ ├─ Tool in allowedTools from settings                         │  │
│  │ ├─ Read-only tools in trusted contexts                        │  │
│  │ └─ Plan mode: Write/Edit to plan file only                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼ (if no auto-allow)                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 3: Permission Rules from Settings                        │  │
│  │ ├─ Apply allow/deny patterns from CLAUDE.md or settings      │  │
│  │ ├─ Check tool name matches pattern                            │  │
│  │ └─ Return matched rule or continue to prompt                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼ (if no rule match)                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 4: User Prompt                                           │  │
│  │ ├─ Show tool name, input preview, risk assessment            │  │
│  │ ├─ User options: Yes always, Yes once, No once, No always    │  │
│  │ ├─ User may edit input (Bash commands)                        │  │
│  │ └─ Decision persisted to settings if "always"                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Permission Decision Algorithm

### Complete Decision Logic

```javascript
// ============================================
// Permission Decision Algorithm (from fxY)
// Location: chunks.146.mjs:589-600
// ============================================

// Hook Override Check
let permissionResult;

if (hookPermissionResult !== undefined && hookPermissionResult.behavior === "allow") {
    if (!tool.requiresUserInteraction?.() && !toolUseContext.requireCanUseTool) {
        // CASE 1: Hook approved + tool doesn't require interaction
        // → BYPASS user prompt
        log(`Hook approved tool use for ${tool.name}, bypassing permission check`);
        permissionResult = hookPermissionResult;
    } else {
        // CASE 2: Hook approved + tool requires interaction
        // → Still need user interaction (e.g., ExitPlanMode)
        log(`Hook approved tool use for ${tool.name}, but canUseTool is required`);
        if (hookPermissionResult.updatedInput) {
            input = hookPermissionResult.updatedInput;
        }
        permissionResult = await canUseTool(tool, input, toolUseContext, assistantMessage, toolUseId);
    }
} else if (hookPermissionResult !== undefined && hookPermissionResult.behavior === "deny") {
    // CASE 3: Hook denied
    // → Return denied immediately
    log(`Hook denied tool use for ${tool.name}`);
    permissionResult = hookPermissionResult;
} else {
    // CASE 4: No hook override or hook asked for user input
    // → Standard permission flow
    let hookAsk = hookPermissionResult?.behavior === "ask" ? hookPermissionResult : undefined;
    if (hookPermissionResult?.behavior === "ask" && hookPermissionResult.updatedInput) {
        input = hookPermissionResult.updatedInput;
    }
    permissionResult = await canUseTool(tool, input, toolUseContext, assistantMessage, toolUseId, hookAsk);
}

// Mapping: permissionResult→V, hookPermissionResult→Z, tool→A, input→X
```

### Key Insight: Hook Priority

The hook's `permissionBehavior` field has **highest priority** in the decision tree:

| Hook Decision | Tool Requires Interaction | Result |
|---------------|---------------------------|--------|
| `allow` | No | **Bypass user prompt** |
| `allow` | Yes | User prompt still shown |
| `deny` | Any | **Immediate denial** |
| `ask` | Any | **Force user prompt** |
| undefined | Any | Standard flow (check rules, then prompt) |

---

## Auto-Allow Rules

### 1. Concurrency-Safe Tools

Tools that implement `isConcurrencySafe()` returning `true` are auto-allowed in certain contexts:

```javascript
// Tools with isConcurrencySafe() = true
// These are safe to run in parallel without user confirmation

// Example from tool definition:
{
  name: "Read",
  isConcurrencySafe() { return true; },
  isReadOnly() { return true; }
}
```

**When auto-allowed:**
- Agent is in non-interactive session mode
- Tool is read-only and non-destructive
- Tool is in the `ASYNC_ALLOWED_TOOLS` set

### 2. Allowed Tools List

Tools in the user's `allowedTools` settings are auto-allowed:

```javascript
// From settings.json or CLAUDE.md
{
  "permissions": {
    "allow": ["Read", "Grep", "Glob", "WebSearch"]
  }
}
```

### 3. Plan Mode Special Rules

In plan mode, Write and Edit tools are only allowed for the plan file:

```javascript
// Tool filtering in plan mode
function filterToolsForPlanMode(tools, planFilePath) {
  return tools.filter(tool => {
    // Always allow read-only tools
    if (tool.isReadOnly?.()) return true;

    // Allow ExitPlanMode, EnterPlanMode, AskUserQuestion
    if (["ExitPlanMode", "EnterPlanMode", "AskUserQuestion"].includes(tool.name)) {
      return true;
    }

    // Allow Write/Edit only to plan file
    if (tool.name === "Write" || tool.name === "Edit") {
      // Path checked at execution time
      return true;
    }

    return false;
  });
}
```

### 4. Permission Rules from Settings

```javascript
// Permission rule matching
function filterToolsByRules(tools, permissionRules, context) {
  return tools.filter(tool => {
    for (const rule of permissionRules) {
      if (matchesToolPattern(tool.name, rule.pattern)) {
        if (rule.behavior === "allow") return true;
        if (rule.behavior === "deny") return false;
      }
    }
    // No rule matched → fall through to user prompt
    return true;
  });
}

// Tool pattern matching
function matchesToolPattern(toolName, pattern) {
  if (pattern === "*") return true;
  if (pattern.endsWith("*")) {
    return toolName.startsWith(pattern.slice(0, -1));
  }
  return toolName === pattern;
}
```

---

## User Prompt Dialog

### Dialog Components

```
┌─────────────────────────────────────────────────────────────────┐
│  🔧 Tool Permission Request                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Tool: Bash                                                       │
│                                                                   │
│  Command:                                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ npm install --save-dev typescript                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Description: Install TypeScript as dev dependency              │
│                                                                   │
│  ⚠️ This command will:                                           │
│     • Install packages (may modify package.json)                │
│     • Run with network access                                    │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  Options:                                                         │
│                                                                   │
│  [1] Yes, always for this tool                                   │
│  [2] Yes, this time only                                         │
│  [3] No, this time only                                          │
│  [4] No, always for this tool                                    │
│                                                                   │
│  [Tab] Edit command before running                               │
│  [Esc] Cancel                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Decision Persistence

```javascript
// User decision handling
async function handleUserDecision(decision, toolName, settings) {
  switch (decision) {
    case "always":
      // Add to allowed tools in settings
      settings.permissions.allow.push(toolName);
      await saveSettings(settings);
      return { behavior: "allow" };

    case "once":
      // One-time approval
      return { behavior: "allow", oneTime: true };

    case "deny-once":
      // One-time denial
      return { behavior: "deny", oneTime: true };

    case "deny-always":
      // Add to denied tools in settings
      settings.permissions.deny.push(toolName);
      await saveSettings(settings);
      return { behavior: "deny" };
  }
}
```

---

## Input Editing During Permission

### Bash Command Editing

When the user presses Tab during the permission dialog, they can edit the command:

```javascript
// Edit mode activation
if (userPressedTab && tool.name === "Bash") {
  const editedCommand = await showCommandEditor(input.command);

  if (editedCommand !== null) {
    return {
      behavior: "allow",
      updatedInput: { ...input, command: editedCommand },
      userModified: true
    };
  }
}
```

### User Modified Flag

The `userModified` flag is passed to `tool.call()` to inform the tool that the user edited the input:

```javascript
// In tool execution
await tool.call(input, {
  ...toolUseContext,
  userModified: permissionResult.userModified ?? false
}, canUseTool, assistantMessage, progressCallback);
```

This enables tools to adjust behavior based on whether the user reviewed/modified the input.

---

## Permission Result Types

### TypeScript Interface

```typescript
interface PermissionResult {
  // Decision
  behavior: "allow" | "deny" | "ask";

  // For denial
  message?: string;
  contentBlocks?: ContentBlock[];

  // For input modification
  updatedInput?: Record<string, unknown>;
  userModified?: boolean;

  // Tracking
  decisionReason?: {
    type: "hook" | "config" | "user" | "auto";
    hookName?: string;
    rulePattern?: string;
    userDecision?: "always" | "once" | "deny-once" | "deny-always";
    reason?: string;
  };
}
```

### Decision Reason Types

| Type | Description | Example |
|------|-------------|---------|
| `hook` | PreToolUse hook decided | `PreToolUse:Bash` hook denied |
| `config` | Settings rule matched | `allowedTools` contains tool name |
| `user` | User responded to prompt | User selected "Yes, always" |
| `auto` | Auto-allow rule applied | Tool is concurrency-safe |

---

## Cross-Feature Integration

### Permission ↔ Hooks (11)

PreToolUse hooks can override permission decisions:

```javascript
// Hook with permission override
{
  event: "PreToolUse",
  handler: async (context) => {
    // CI/CD pipeline - auto-approve safe operations
    if (process.env.CI && context.toolName === "Bash") {
      if (context.input.command.startsWith("npm test")) {
        return { permissionBehavior: "allow" };
      }
    }

    // Security review - force user prompt for dangerous commands
    if (context.toolName === "Bash" && context.input.command.includes("rm -rf")) {
      return { permissionBehavior: "ask" };
    }
  }
}
```

### Permission ↔ Plan Mode (12)

Plan mode enforces strict tool filtering:

```javascript
// In plan mode, these tools are available:
const PLAN_MODE_TOOLS = [
  "Read", "Grep", "Glob", "WebFetch", "WebSearch",  // Read-only
  "EnterPlanMode", "ExitPlanMode", "AskUserQuestion",  // Plan-specific
  "Write", "Edit"  // Only to plan file path
];
```

### Permission ↔ Sandbox (18)

The Bash tool integrates sandbox checks with permission:

```javascript
// Bash tool permission flow
async function checkBashPermissions(command, context) {
  // 1. Sandbox validation
  const sandboxResult = validateBashCommand(command);
  if (sandboxResult.blocked) {
    return {
      behavior: "deny",
      message: `Sandbox violation: ${sandboxResult.reason}`
    };
  }

  // 2. Standard permission flow
  return await canUseTool(BashTool, { command }, context);
}
```

---

## Telemetry Events

| Event | When Fired | Data |
|-------|------------|------|
| `tengu_tool_use_can_use_tool_allowed` | Permission granted | toolName, decision source |
| `tengu_tool_use_can_use_tool_rejected` | Permission denied | toolName, decision source |
| `tool_decision` | User makes decision | decision, source, tool_name |

---

## Security Considerations

### Hook Bypass Restrictions

Even if a hook returns `permissionBehavior: "allow"`, the permission check still runs if:

1. `tool.requiresUserInteraction()` returns `true`
   - ExitPlanMode requires explicit user approval
   - This prevents hooks from silently approving critical operations

2. `toolUseContext.requireCanUseTool` is `true`
   - Set by certain execution contexts that require explicit permission

### Input Validation Before Permission

Schema validation happens **before** the permission check:

```
Schema Validation → Custom Validation → Pre-tool Hooks → Permission Check → Tool Execution
                      ↑                    ↑                  ↑
                   Fails here           Fails here         Fails here
                   (no hooks run)       (hooks can deny)   (user can deny)
```

This ensures malformed inputs are rejected before the user is even prompted.

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Structured output support, hook bypass restrictions |
| 2.1.72 | Hook permission behavior override |
| 2.1.32 | Permission rules from CLAUDE.md |
| 2.1.18 | Sandbox integration for Bash tool |