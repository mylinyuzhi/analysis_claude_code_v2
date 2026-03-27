# Tool Permission Flow (Claude Code 2.1.76)

> Complete analysis of how tool permissions are evaluated, including auto-allow rules, user prompts, and hook integration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `canUseTool` - Permission evaluation entry point
- `filterToolsByRules` (hg1) - Apply permission rules - chunks.141.mjs:1469
- `checkReadPermissions` (ro/gt) - File read permission check
- `checkEditPermissions` (Xz6/N51) - File edit permission check

---

## Architecture Overview

```
Tool execution request
  │
  ├─→ Pre-tool hooks (y4q)
  │     └─→ Hook can provide permissionBehavior override
  │           ├─ "allow" → Skip user prompt, auto-allow
  │           ├─ "ask" → Force user prompt
  │           └─ "deny" → Block execution
  │
  ├─→ Auto-allow check
  │     ├─→ isConcurrencySafe() = true → Auto-allow
  │     ├─→ Read-only tools in non-destructive mode → Auto-allow
  │     ├─→ Tool in allowedTools set → Auto-allow
  │     └─→ Permission rules match → Auto-allow
  │
  ├─→ Auto-deny check
  │     └─→ Tool in deniedTools set → Deny
  │
  └─→ If no auto-decision: Prompt user
        ├─→ "Yes, always" → Add to allowed, execute
        ├─→ "Yes, this time" → Execute once
        ├─→ "No, this time" → Deny once
        └─→ "No, always" → Add to denied
```

---

## Permission Decision Flow

### Stage 1: Hook Override

Pre-tool hooks can provide a `permissionBehavior` that bypasses normal permission logic:

```javascript
// In executePreToolHooksIterator (y4q)
for await (let hookResult of LF8(toolName, input, ...)) {
  if (hookResult.permissionBehavior === "allow") {
    // Hook says allow - skip user prompt
    permissionDecision = { allowed: true, source: "hook" };
    break;
  }
  if (hookResult.permissionBehavior === "deny") {
    // Hook says deny - block immediately
    permissionDecision = { allowed: false, source: "hook" };
    break;
  }
  if (hookResult.permissionBehavior === "ask") {
    // Hook wants user to be asked (even if auto-allow would apply)
    forceUserPrompt = true;
  }
}
```

**Key insight:** Hooks have the highest priority in permission decisions. A hook returning `permissionBehavior: "allow"` will bypass all permission checks, including the user prompt.

### Stage 2: Auto-Allow Rules

If no hook override, check auto-allow conditions:

```javascript
function checkAutoAllow(tool, input, context) {
  // 1. Concurrency-safe tools are always allowed
  if (tool.isConcurrencySafe?.()) {
    return { allowed: true, reason: "concurrency_safe" };
  }

  // 2. Read-only tools in non-destructive contexts
  if (tool.isReadOnly?.() && !context.isDestructiveContext) {
    return { allowed: true, reason: "read_only" };
  }

  // 3. Tool in allowedTools set from settings
  if (context.allowedTools?.has(tool.name)) {
    return { allowed: true, reason: "allowed_list" };
  }

  // 4. Permission rules allow this tool+input combination
  const rulesResult = checkPermissionRules(tool, input, context);
  if (rulesResult.allowed) {
    return { allowed: true, reason: "rules_match" };
  }

  return { allowed: false };  // No auto-allow matched
}
```

### Stage 3: Permission Rules

Permission rules are loaded from settings and provide fine-grained control:

```javascript
// Permission rules structure
{
  "allowedTools": ["Read", "Grep", "Glob"],
  "deniedTools": ["Bash"],
  "rules": [
    {
      "tool": "Bash",
      "parameters": { "command": "git status" },
      "decision": "allow"
    },
    {
      "tool": "Write",
      "parameters": { "file_path": "/safe/dir/*" },
      "decision": "allow"
    }
  ]
}
```

**Rule matching algorithm:**

```javascript
function checkPermissionRules(tool, input, context) {
  const rules = getPermissionRules();  // tU

  for (const rule of rules) {
    if (rule.tool !== tool.name) continue;

    // Check parameter patterns
    if (rule.parameters) {
      const matches = matchParameters(input, rule.parameters);
      if (matches) {
        return { allowed: rule.decision === "allow" };
      }
    } else {
      // Rule applies to all invocations of this tool
      return { allowed: rule.decision === "allow" };
    }
  }

  return { allowed: false };  // No rule matched
}
```

### Stage 4: User Prompt

If no auto-decision, prompt the user:

```javascript
// User prompt options
const PROMPT_OPTIONS = [
  { label: "Yes, always", action: "allow_always" },
  { label: "Yes, this time", action: "allow_once" },
  { label: "No, this time", action: "deny_once" },
  { label: "No, always", action: "deny_always" }
];
```

**Prompt flow:**

```
┌─────────────────────────────────────────────────────────────┐
│ Permission Request                                           │
│                                                              │
│ Tool: Bash                                                   │
│ Input: command="rm -rf /tmp/build"                          │
│                                                              │
│ This command will delete files in /tmp/build                │
│                                                              │
│ ┌─────────────────┐ ┌─────────────────┐                     │
│ │ Yes, always     │ │ Yes, this time  │                     │
│ └─────────────────┘ └─────────────────┘                     │
│ ┌─────────────────┐ ┌─────────────────┐                     │
│ │ No, this time   │ │ No, always      │                     │
│ └─────────────────┘ └─────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tool-Specific Permission Logic

### Bash Tool Permissions

Bash has the most complex permission logic due to security concerns:

```javascript
// Bash permission flow
async function checkBashPermissions(command, context) {
  // 1. Security validation
  const securityResult = validateBashCommandSync(command);  // Rp6
  if (securityResult.blocked) {
    return { allowed: false, reason: securityResult.reason };
  }

  // 2. Check if in allowed commands list
  if (context.allowedBashCommands?.some(pattern => matchPattern(command, pattern))) {
    return { allowed: true, reason: "allowed_command" };
  }

  // 3. Check sandbox restrictions
  if (context.sandboxMode && !isSandboxSafe(command)) {
    return { allowed: false, reason: "sandbox_violation" };
  }

  // 4. Fall through to user prompt
  return { allowed: false, needsPrompt: true };
}
```

### File Tool Permissions

Read/Write/Edit tools check file path permissions:

```javascript
// File permission patterns
const PERMISSION_PATTERNS = {
  read: {
    allowed: ["**/*"],  // Read allowed everywhere by default
    denied: [".env", ".credentials", "**/secrets/**"]
  },
  write: {
    allowed: ["./**"],  // Write allowed in current directory tree
    denied: ["**/.git/**"]
  }
};

function checkFilePermission(tool, filePath, context) {
  const patterns = PERMISSION_PATTERNS[tool.name];

  // Check deny patterns first
  for (const denyPattern of patterns.denied) {
    if (matchPattern(filePath, denyPattern)) {
      return { allowed: false, reason: "denied_pattern" };
    }
  }

  // Check allow patterns
  for (const allowPattern of patterns.allowed) {
    if (matchPattern(filePath, allowPattern)) {
      return { allowed: true, reason: "allowed_pattern" };
    }
  }

  return { allowed: false, needsPrompt: true };
}
```

### MCP Tool Permissions

MCP tools use annotations for permission hints:

```javascript
function checkMcpPermissions(tool, input, context) {
  // Check MCP tool annotations
  const annotations = tool.annotations || {};

  // readOnlyHint: Tool doesn't modify state
  if (annotations.readOnlyHint) {
    return { allowed: true, reason: "mcp_read_only" };
  }

  // destructiveHint: Tool may cause irreversible changes
  if (annotations.destructiveHint && !context.allowDestructive) {
    return { allowed: false, needsPrompt: true };
  }

  // openWorldHint: Tool interacts with external systems
  if (annotations.openWorldHint) {
    // May require additional confirmation
    return { allowed: false, needsPrompt: true, reason: "external_access" };
  }

  return { allowed: false, needsPrompt: true };
}
```

---

## Permission Context Modes

### Default Mode

Normal permission checking with user prompts.

### Plan Mode

In plan mode, only read-only tools and plan file writes are allowed:

```javascript
function filterToolsForPlanMode(tools, planFilePath) {
  return tools.filter(tool => {
    if (tool.isReadOnly?.()) return true;
    if (tool.name === "ExitPlanMode") return true;
    if (tool.name === "AskUserQuestion") return true;
    // Write/Edit checked at execution time against planFilePath
    return false;
  });
}
```

### Accept Edits Mode

Auto-accept all Edit/Write operations:

```javascript
if (context.mode === "acceptEdits") {
  if (tool.name === "Edit" || tool.name === "Write") {
    return { allowed: true, reason: "accept_edits_mode" };
  }
}
```

### Bypass Permissions Mode

Skip all permission checks (use with caution):

```javascript
if (context.mode === "bypassPermissions") {
  return { allowed: true, reason: "bypass_mode" };
}
```

---

## Permission State Persistence

### Session-Level Persistence

```javascript
// Permission decisions stored in session state
{
  toolPermissionContext: {
    mode: "default",
    allowedTools: new Set(["Read", "Grep", "Glob"]),
    deniedTools: new Set(),
    decisions: [
      { tool: "Bash", input: { command: "git status" }, decision: "allow" }
    ]
  }
}
```

### Settings-Level Persistence

```javascript
// ~/.claude/settings.json
{
  "allowedTools": ["Read", "Write", "Edit", "Bash"],
  "deniedTools": [],
  "rules": [
    { "tool": "Bash", "command": "npm *", "decision": "allow" }
  ]
}
```

---

## Integration with Hooks

### PreToolUse Hook Permission Override

Hooks can override permission decisions:

```javascript
// Hook configuration
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": { "toolName": "Bash" },
        "hooks": ["./check-safe-commands.sh"]
      }
    ]
  }
}
```

**Hook result that affects permissions:**

```javascript
// Hook stdout parsed for permission override
{
  "permissionBehavior": "allow",  // or "deny" or "ask"
  "reason": "Command verified safe"
}
```

### Permission Decision Recording

After permission is decided, it's recorded for telemetry:

```javascript
function recordPermissionDecision(tool, input, decision) {
  reportPermissionDecision({  // mMA
    toolName: tool.name,
    decision: decision.allowed ? "allowed" : "denied",
    source: decision.source,  // "hook", "auto", "user"
    reason: decision.reason,
    timestamp: Date.now()
  });
}
```

---

## UI Components

### Permission Dialog

Rendered when user confirmation is needed:

```javascript
// Permission dialog component
function PermissionDialog({ tool, input, onDecision }) {
  const summary = tool.getToolUseSummary?.(input);

  return (
    <Box flexDirection="column">
      <Text bold>Permission Request</Text>
      <Text>Tool: {tool.userFacingName()}</Text>
      <Text>Details: {summary}</Text>

      <Box flexDirection="row">
        <Button onPress={() => onDecision("allow_always")}>
          Yes, always
        </Button>
        <Button onPress={() => onDecision("allow_once")}>
          Yes, this time
        </Button>
        <Button onPress={() => onDecision("deny_once")}>
          No, this time
        </Button>
        <Button onPress={() => onDecision("deny_always")}>
          No, always
        </Button>
      </Box>
    </Box>
  );
}
```

---

## Quick Reference

### Permission Decision Sources

| Source | Priority | Description |
|--------|----------|-------------|
| Hook override | 1 (highest) | Pre-tool hook provides explicit decision |
| Auto-deny | 2 | Tool in denied set or security violation |
| Auto-allow | 3 | Tool in allowed set or is read-only |
| User prompt | 4 (lowest) | Ask user for decision |

### Tool Annotation Effects

| Annotation | Permission Effect |
|------------|-------------------|
| `readOnlyHint: true` | Auto-allow in most contexts |
| `destructiveHint: true` | Require explicit confirmation |
| `openWorldHint: true` | Flag for external access review |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced MCP tool annotation support |
| 2.1.32 | Team mode permission context |
| 2.1.18 | Hook permission override support |