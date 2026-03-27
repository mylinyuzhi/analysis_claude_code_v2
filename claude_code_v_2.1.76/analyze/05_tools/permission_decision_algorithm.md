# Permission Decision Algorithm (Claude Code 2.1.76)

> Complete source-level analysis of the tool permission decision flow, including hook overrides, rule matching, and user interaction patterns.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks section)

Key functions in this document:
- `canUseTool` - Permission decision function
- `filterToolsByRules` - Rule-based filtering
- `checkAutoAllowRules` - Automatic permission checks
- `promptUserForToolPermission` - User interaction for permission

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│               PERMISSION DECISION ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Permission Decision Flow:                                           │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 1: Hook Override Check                                   │  │
│  │                                                                 │  │
│  │ PreToolUse hook returns:                                       │  │
│  │ ├─ { behavior: "allow" } → BYPASS all further checks           │  │
│  │ ├─ { behavior: "deny" } → DENY immediately                     │  │
│  │ ├─ { behavior: "ask" } → PROMPT user with hook context         │  │
│  │ └─ undefined → Continue to Stage 2                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 2: Auto-Allow Rules                                      │  │
│  │                                                                 │  │
│  │ Check if tool auto-allowed:                                    │  │
│  │ ├─ isReadOnly() && !requiresUserInteraction()                  │  │
│  │ ├─ Tool in allowedTools set from previous "always" decision    │  │
│  │ ├─ isConcurrencySafe() for concurrent execution                │  │
│  │ └─ Tool matches allowed permission rules                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 3: Permission Rules Matching                             │  │
│  │                                                                 │  │
│  │ Check permission rules from settings:                           │  │
│  │ ├─ Local settings (.claude/settings.json)                      │  │
│  │ ├─ Global settings (~/.claude/settings.json)                   │  │
│  │ └─ Rule matching: allow/deny patterns                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Stage 4: User Prompt                                           │  │
│  │                                                                 │  │
│  │ If no auto-allow or rule match:                                │  │
│  │ ┌─────────────────────────────────────────────────────────┐    │  │
│  │ │ Allow [tool_name]?                                       │    │  │
│  │ │                                                          │    │  │
│  │ │ [Yes, always]  [Yes, this time]                         │    │  │
│  │ │ [No, this time]  [No, always]                           │    │  │
│  │ └─────────────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. Hook Override Logic

### PreToolUse Hook Permission Result

**What it does:**
Hooks can override the normal permission flow by returning a permission decision.

**How it works:**
The `hookPermissionResult` from PreToolUse hooks can have three behaviors:

| Behavior | Effect | When Used |
|----------|--------|-----------|
| `allow` | Bypass permission check | Hook validated the action |
| `deny` | Block execution immediately | Hook detected unsafe operation |
| `ask` | Show prompt with hook context | Hook wants user confirmation |

### Hook Override in Execution Pipeline

```javascript
// ============================================
// Hook permission override in toolExecutionPipeline (fxY)
// Location: chunks.146.mjs:442-900+
// ============================================

// READABLE (for understanding):
async function toolExecutionPipeline(tool, toolUseId, input, context, canUseTool, ...) {
    // ... validation and pre-tool hooks ...

    // === STAGE 4: Permission Check ===
    let permissionDecision;

    // Check if hook provided permission override
    if (hookPermissionResult !== undefined) {
        if (hookPermissionResult.behavior === "allow" &&
            !tool.requiresUserInteraction?.() &&
            !context.requireCanUseTool) {
            // Hook approved - bypass permission check
            console.log(`Hook approved tool use for ${tool.name}, bypassing permission check`);
            permissionDecision = hookPermissionResult;
        } else if (hookPermissionResult.behavior === "deny") {
            // Hook denied - block immediately
            console.log(`Hook denied tool use for ${tool.name}`);
            permissionDecision = hookPermissionResult;
        } else if (hookPermissionResult.behavior === "ask") {
            // Hook wants user confirmation with extra context
            permissionDecision = await canUseTool(
                tool,
                validatedInput,
                context,
                assistantMessage,
                toolUseId,
                hookPermissionResult  // Pass hook context to prompt
            );
        } else {
            // No hook override, proceed to normal check
            permissionDecision = await canUseTool(tool, validatedInput, context, assistantMessage, toolUseId);
        }
    } else {
        // No hook result, proceed to normal check
        permissionDecision = await canUseTool(tool, validatedInput, context, assistantMessage, toolUseId);
    }

    if (permissionDecision.behavior !== "allow") {
        // Permission denied
        emitTelemetry("tengu_tool_use_can_use_tool_rejected", { /* ... */ });
        return [createDeniedToolResult(toolUseId, permissionDecision.message)];
    }

    // ... continue with execution ...
}
```

---

## 2. Auto-Allow Rules

### Conditions for Auto-Allow

```javascript
// ============================================
// Auto-allow rule checking
// ============================================

function checkAutoAllowRules(tool, input, context) {
    // Rule 1: Read-only tools that don't require user interaction
    if (tool.isReadOnly?.() && !tool.requiresUserInteraction?.()) {
        return {
            allowed: true,
            reason: "read_only_tool"
        };
    }

    // Rule 2: Tool in allowed set from previous "always" decision
    if (context.toolPermissionContext.allowedTools?.has(tool.name)) {
        return {
            allowed: true,
            reason: "previously_allowed"
        };
    }

    // Rule 3: Concurrency-safe tools in safe contexts
    if (tool.isConcurrencySafe?.() && !context.hasDestructiveContext) {
        return {
            allowed: true,
            reason: "concurrency_safe"
        };
    }

    // Rule 4: Tools with specific allowed patterns
    const ruleMatch = matchPermissionRules(tool.name, input, context.permissionRules);
    if (ruleMatch?.behavior === "allow") {
        return {
            allowed: true,
            reason: "rule_match",
            rule: ruleMatch
        };
    }

    // No auto-allow rule matched
    return {
        allowed: false,
        reason: null
    };
}
```

### Tool Methods for Permission

| Method | Return Type | Purpose |
|--------|-------------|---------|
| `isReadOnly()` | boolean | Tool doesn't modify state |
| `isConcurrencySafe()` | boolean | Safe for concurrent execution |
| `requiresUserInteraction()` | boolean | Always needs user confirmation |

---

## 3. Permission Rules Matching

### Rule Structure

```javascript
// Permission rule schema
{
    type: "permission_rule",
    ruleContent: {
        toolName: "Bash",
        commandPattern: "git *",  // Optional: specific input pattern
        behavior: "allow" | "deny"
    },
    destination: "localSettings" | "globalSettings"
}
```

### Rule Matching Algorithm

```javascript
// ============================================
// Permission rules matching
// ============================================

function matchPermissionRules(toolName, input, permissionRules) {
    if (!permissionRules || permissionRules.length === 0) {
        return null;
    }

    for (const rule of permissionRules) {
        // Check tool name match
        if (rule.toolName !== toolName && rule.toolName !== "*") {
            continue;
        }

        // Check input pattern (if specified)
        if (rule.inputPattern) {
            const matches = matchInputPattern(input, rule.inputPattern);
            if (!matches) {
                continue;
            }
        }

        // Rule matches
        return {
            behavior: rule.behavior,
            rule: rule
        };
    }

    // No matching rule
    return null;
}

function matchInputPattern(input, pattern) {
    // Convert pattern to regex
    const regexPattern = pattern
        .replace(/\*/g, ".*")
        .replace(/\?/g, ".");

    const regex = new RegExp(`^${regexPattern}$`);

    // Check relevant input fields
    if (input.command && regex.test(input.command)) {
        return true;
    }
    if (input.file_path && regex.test(input.file_path)) {
        return true;
    }

    return false;
}
```

### Rule Priority

```
Priority (highest to lowest):
1. Hook deny (cannot be overridden)
2. Hook allow (can be overridden by requiresUserInteraction)
3. Permission rule deny
4. Permission rule allow
5. Auto-allow rules
6. User prompt
```

---

## 4. User Prompt Flow

### Prompt Dialog Rendering

```javascript
// ============================================
// Tool permission prompt dialog
// Location: chunks.196.mjs (ToolPermissionModal)
// ============================================

// READABLE (for understanding):
function renderToolPermissionPrompt({ toolName, input, hookContext, onDecision }) {
    const toolDisplayName = getToolDisplayName(toolName);

    // Build prompt message
    let message = `Allow ${toolDisplayName}?`;

    if (hookContext?.message) {
        // Include hook context if available
        message = `${message}\n${hookContext.message}`;
    }

    // Show input preview
    const inputPreview = formatInputPreview(toolName, input);

    return (
        <Box flexDirection="column">
            <Text bold>{message}</Text>

            {/* Input preview */}
            {inputPreview && (
                <Box marginTop={1}>
                    <Text dimColor>{inputPreview}</Text>
                </Box>
            )}

            {/* Options */}
            <Box marginTop={1} flexDirection="column">
                <Button onPress={() => onDecision("always")}>
                    <Text color="green">✓ Yes, always</Text>
                </Button>
                <Button onPress={() => onDecision("once")}>
                    <Text color="blue">✓ Yes, this time</Text>
                </Button>
                <Button onPress={() => onDecision("deny_once")}>
                    <Text color="yellow">✗ No, this time</Text>
                </Button>
                <Button onPress={() => onDecision("deny_always")}>
                    <Text color="red">✗ No, always</Text>
                </Button>
            </Box>
        </Box>
    );
}
```

### Decision Handling

```javascript
// ============================================
// Permission decision handling
// ============================================

function handlePermissionDecision(toolName, decision, context) {
    switch (decision) {
        case "always":
            // Add to allowed tools set
            context.toolPermissionContext.allowedTools.add(toolName);
            savePermissionDecision(toolName, "allow");
            return { behavior: "allow" };

        case "once":
            // Allow this time only
            return { behavior: "allow" };

        case "deny_once":
            // Deny this time only
            return { behavior: "deny", message: "User denied permission" };

        case "deny_always":
            // Add to denied tools set
            context.toolPermissionContext.deniedTools.add(toolName);
            savePermissionDecision(toolName, "deny");
            return { behavior: "deny", message: "User denied permission" };
    }
}
```

---

## 5. Complete Permission Decision Flow

### Decision Tree

```
canUseTool(tool, input, context)
  │
  ├─→ Check hook override
  │     ├─ behavior = "allow" → ALLOW
  │     ├─ behavior = "deny" → DENY
  │     └─ behavior = "ask" or undefined → Continue
  │
  ├─→ Check in denied set
  │     └─ Tool in deniedTools → DENY
  │
  ├─→ Check in allowed set
  │     └─ Tool in allowedTools → ALLOW
  │
  ├─→ Check auto-allow rules
  │     ├─ isReadOnly() && !requiresUserInteraction() → ALLOW
  │     ├─ isConcurrencySafe() → ALLOW
  │     └─ No match → Continue
  │
  ├─→ Check permission rules
  │     ├─ Rule with "allow" → ALLOW
  │     ├─ Rule with "deny" → DENY
  │     └─ No matching rule → Continue
  │
  └─→ Prompt user
        ├─ "Yes, always" → ALLOW + save
        ├─ "Yes, this time" → ALLOW
        ├─ "No, this time" → DENY
        └─ "No, always" → DENY + save
```

---

## 6. Special Cases

### requiresUserInteraction() Tools

Some tools always require user confirmation, regardless of other rules:

```javascript
// Tools that always require interaction
const INTERACTION_REQUIRED_TOOLS = new Set([
    "ExitPlanMode",   // Plan approval
    "AskUserQuestion", // Already asking user
    "Skill"           // Slash commands
]);

function requiresUserInteraction(tool) {
    // Tool explicitly requires it
    if (tool.requiresUserInteraction?.()) {
        return true;
    }

    // Known tools that always need interaction
    if (INTERACTION_REQUIRED_TOOLS.has(tool.name)) {
        return true;
    }

    return false;
}
```

### Swarm Mode Permission Bypass

In swarm mode, teammates have different permission handling:

```javascript
// ============================================
// Swarm mode permission handling
// ============================================

function canUseToolInSwarm(tool, input, context) {
    // Teammate agents use team-lead delegated permissions
    if (isTeammateAgent()) {
        // Check team permission rules
        const teamRules = getTeamPermissionRules();

        if (teamRules.allowedTools?.includes(tool.name)) {
            return { behavior: "allow" };
        }

        // Deny - teammates can't prompt user
        return { behavior: "deny", message: "Tool not allowed in team context" };
    }

    // Team lead uses normal permission flow
    return canUseTool(tool, input, context);
}
```

---

## Cross-Module Integration

### Permission ↔ Hooks (11)

- PreToolUse hooks can override permission decisions
- Hook result includes `hookPermissionResult` field
- Blocking errors from hooks prevent tool execution

### Permission ↔ Tools (05)

- `canUseTool` called in tool execution pipeline (Stage 4)
- Tool methods `isReadOnly()`, `requiresUserInteraction()` affect decisions
- Permission results affect tool availability

### Permission ↔ System Reminder (04)

- Permission decisions generate attachments
- `permission_decision` attachment type for LLM context
- Hook context included in reminders

### Permission ↔ UI (02)

- Permission dialogs rendered via modal system
- Modal priority: `tool-permission` is priority 3
- Decision updates app state

---

## Quick Reference

### Permission Sources Priority

| Source | Priority | Can Override |
|--------|----------|--------------|
| Hook (deny) | 1 (highest) | All |
| Hook (allow) | 2 | User prompts if no `requiresUserInteraction` |
| User decision | 3 | Previous decisions, auto-allow |
| Permission rules | 4 | Auto-allow |
| Auto-allow | 5 (lowest) | None |

### Decision Behaviors

| Behavior | Continue? | Save? |
|----------|-----------|-------|
| `allow` | Yes | No |
| `allow_always` | Yes | Yes (to allowedTools) |
| `deny` | No | No |
| `deny_always` | No | Yes (to deniedTools) |

### Tool Permission Methods

```javascript
// Tool interface for permission
interface Tool {
    name: string;
    isReadOnly(): boolean;
    isConcurrencySafe(): boolean;
    requiresUserInteraction(): boolean;
    checkPermissions(input): Promise<PermissionResult>;
}
```

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Swarm mode permission handling, hook integration |
| 2.1.72 | Permission rule matching improvements |
| 2.1.32 | Team permission delegation |
| 2.1.18 | Hook-based permission override |