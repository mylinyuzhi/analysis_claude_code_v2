# Plan Mode - Tools Filtering Analysis (Claude Code 2.1.76)

> Complete reverse engineering of how plan mode restricts tool usage to read-only operations.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools section

Key functions in this document:
- `isReadOnly()` - Tool method that determines read-only status
- `hmA` (chunks.172.mjs:1884) - `matchesAlwaysAllowRule` - Rule matching for tools
- `Of6` (chunks.150.mjs:881) - `evaluateBashCommandReadiness` - Bash command read-only check
- `Pf6` (chunks.169.mjs:2014) - `containsGitCommand` - Git command detection
- `a2` (chunks.42.mjs:1637) - `applyPermissionAction` - Permission context updates
- `tzz` (chunks.173.mjs:611) - `buildAllowedToolsList` - Allowed tools for plan mode
- `ehA` (chunks.151.mjs:149) - `getPromptSuggestionBlocker` - Suppresses suggestions in plan mode

---

## 1. Overview: Read-Only Enforcement Architecture

Plan mode enforces read-only operations through multiple layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Plan Mode Read-Only Enforcement              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 1: Tool-Level isReadOnly() Method                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Each tool declares if it's read-only via isReadOnly(input)  ││
│  │ Returns true → Tool can execute in plan mode                ││
│  │ Returns false → Tool blocked (unless plan file exception)   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Layer 2: Permission Check Flow                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ checkPermissions() → mode check → rule matching             ││
│  │ plan mode + isBypassPermissionsModeAvailable → auto-allow   ││
│  │ Otherwise → rule-based decision                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Layer 3: Bash Command Filtering                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Of6() evaluates if command is safe to run read-only         ││
│  │ Uses Sd1 regex to detect git commands                       ││
│  │ Compound commands with git require extra checks             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Tool `isReadOnly()` Method Analysis

Every tool has an `isReadOnly()` method that determines if the current operation is read-only.

### Declaration Pattern

```javascript
// ============================================
// Tool isReadOnly() declaration pattern
// Location: Various chunks (see below)
// ============================================

// READABLE (for understanding):
const ToolDefinition = {
    name: "ToolName",
    // ... other properties ...

    isReadOnly(input) {
        // Default: return false (not read-only)
        // Override: return true (always read-only)
        // Dynamic: inspect input to determine
        return false; // or true, or conditional logic
    },

    isConcurrencySafe(input) {
        // Often mirrors isReadOnly
        return this.isReadOnly(input);
    }
};
```

### Tools with `isReadOnly() = true`

| Tool | File:Line | Notes |
|------|-----------|-------|
| Glob (Jq) | chunks.76.mjs:1178 | File pattern matching |
| Grep (Jz) | chunks.76.mjs:1519 | Content search |
| Read (s9) | chunks.146.mjs:1789 | File reading |
| WebFetch | chunks.139.mjs:1297 | URL fetching |
| WebSearch | chunks.139.mjs:2303 | Web search |
| AskUserQuestion | chunks.139.mjs:2927 | User interaction |
| TaskList | chunks.139.mjs:1935 | Task listing |
| Agent (Explore) | chunks.140.mjs:723,955,1134,1362 | Subagent for exploration |
| MCP Tools | chunks.145.mjs:2355 | Uses `readOnlyHint` from annotations |

### Tools with `isReadOnly() = false`

| Tool | File:Line | Notes |
|------|-----------|-------|
| Bash | chunks.170.mjs:634-636 | Dynamic check via `Of6()` |
| Write | chunks.134.mjs:2152 | File writing |
| Edit | chunks.134.mjs:2645 | File editing |
| NotebookEdit | chunks.139.mjs:1553 | Jupyter editing |
| ExitPlanMode | chunks.139.mjs:2665 | Mode transition (special handling) |

### Dynamic `isReadOnly()` - Bash Tool

```javascript
// ============================================
// Bash.isReadOnly - Dynamic read-only check
// Location: chunks.170.mjs:634-636
// ============================================

// ORIGINAL (for source lookup):
isReadOnly(A) {
    let q = Pf6(A.command);
    return Of6(A, q).behavior === "allow"
}

// READABLE (for understanding):
isReadOnly(input) {
    // Pf6: Check if command contains git operations
    let containsGitCommand = containsGitCommand(input.command);

    // Of6: Evaluate if command is safe to run read-only
    let evaluation = evaluateBashCommandReadiness(input, containsGitCommand);

    // If behavior is "allow", command is read-only
    return evaluation.behavior === "allow";
}

// Mapping: Pf6→containsGitCommand, Of6→evaluateBashCommandReadiness, q→containsGitCommand
```

---

## 3. Bash Command Read-Only Evaluation (`Of6`)

```javascript
// ============================================
// Of6 - evaluateBashCommandReadiness
// Location: chunks.150.mjs:881-920
// ============================================

// ORIGINAL (for source lookup):
function Of6(A, q) {
    let {
        command: K
    } = A;
    if (!pz(K, (H) => `$${H}`).success) return {
        behavior: "passthrough",
        message: "Command cannot be parsed, requires further permission checks"
    };
    if (lm(K).behavior !== "passthrough") return {
        behavior: "passthrough",
        message: "Command is not read-only, requires further permission checks"
    };
    if ($f6(K)) return {
        behavior: "ask",
        message: "Command contains Windows UNC path that could be vulnerable to WebDAV attacks"
    };
    let z = vcY(K);
    if (q && z) return {
        behavior: "passthrough",
        message: "Compound commands with cd and git require permission checks for enhanced security"
    };
    return {
        behavior: "allow",
        decisionReason: {
            type: "other",
            reason: "Read-only command is allowed"
        }
    }
}

// READABLE (for understanding):
function evaluateBashCommandReadiness(input, containsGitCommand) {
    let { command } = input;

    // Step 1: Check if command is parseable
    if (!isParseable(command)) {
        return {
            behavior: "passthrough",
            message: "Command cannot be parsed, requires further permission checks"
        };
    }

    // Step 2: Check if command is inherently read-only
    // lm() checks against a list of known read-only commands
    if (!isReadOnlyCommand(command)) {
        return {
            behavior: "passthrough",
            message: "Command is not read-only, requires further permission checks"
        };
    }

    // Step 3: Security check - Windows UNC path vulnerability
    if (containsWindowsUNCPath(command)) {
        return {
            behavior: "ask",
            message: "Command contains Windows UNC path that could be vulnerable to WebDAV attacks"
        };
    }

    // Step 4: Compound command with cd and git
    let containsCd = hasCdCommand(command);
    if (containsGitCommand && containsCd) {
        return {
            behavior: "passthrough",
            message: "Compound commands with cd and git require permission checks"
        };
    }

    // All checks passed - command is read-only
    return {
        behavior: "allow",
        decisionReason: {
            type: "other",
            reason: "Read-only command is allowed"
        }
    };
}

// Mapping: Of6→evaluateBashCommandReadiness, pz→isParseable, lm→isReadOnlyCommand,
//          $f6→containsWindowsUNCPath, vcY→hasCdCommand, q→containsGitCommand
```

### Git Command Detection (`Pf6`)

```javascript
// ============================================
// Pf6 - containsGitCommand
// Location: chunks.169.mjs:2014-2018
// ============================================

// ORIGINAL (for source lookup):
function Pf6(A) {
    return AD(A).some((K) => {
        let Y = K.trim();
        return Sd1.test(Y)
    })
}

// READABLE (for understanding):
function containsGitCommand(command) {
    // AD() splits command into individual commands (handles ; && || chains)
    let commands = splitCommandChain(command);

    // Sd1 is a regex that matches git commands
    return commands.some((cmd) => {
        let trimmed = cmd.trim();
        return GIT_COMMAND_REGEX.test(trimmed);
    });
}

// Mapping: Pf6→containsGitCommand, AD→splitCommandChain, Sd1→GIT_COMMAND_REGEX
```

---

## 4. Permission Check Flow in Plan Mode

When a tool is called in plan mode, the permission system follows this flow:

```javascript
// ============================================
// Permission check flow - Plan mode handling
// Location: chunks.172.mjs:2000-2018
// ============================================

// ORIGINAL (for source lookup):
if (z = await K.getAppState(), z.toolPermissionContext.mode === "bypassPermissions" ||
    z.toolPermissionContext.mode === "plan" && z.toolPermissionContext.isBypassPermissionsModeAvailable) return {
    behavior: "allow",
    updatedInput: t_q($, q),
    decisionReason: {
        type: "mode",
        mode: z.toolPermissionContext.mode
    }
};
let _ = hmA(z.toolPermissionContext, A);
if (_) return {
    behavior: "allow",
    updatedInput: t_q($, q),
    decisionReason: {
        type: "rule",
        rule: _
    }
};

// READABLE (for understanding):
async function checkToolPermissions(tool, input, context) {
    let appState = await context.getAppState();
    let mode = appState.toolPermissionContext.mode;

    // Special case: bypassPermissions mode OR plan mode with enterprise bypass
    if (mode === "bypassPermissions" ||
        (mode === "plan" && appState.toolPermissionContext.isBypassPermissionsModeAvailable)) {
        return {
            behavior: "allow",
            updatedInput: input,
            decisionReason: { type: "mode", mode: mode }
        };
    }

    // Check always-allow rules
    let matchingRule = matchesAlwaysAllowRule(appState.toolPermissionContext, tool);
    if (matchingRule) {
        return {
            behavior: "allow",
            updatedInput: input,
            decisionReason: { type: "rule", rule: matchingRule }
        };
    }

    // Continue with normal permission flow...
}

// Mapping: hmA→matchesAlwaysAllowRule, z→appState, _→matchingRule
```

### Rule Matching (`hmA`)

```javascript
// ============================================
// hmA - matchesAlwaysAllowRule
// Location: chunks.172.mjs:1884-1886
// ============================================

// ORIGINAL (for source lookup):
function hmA(A, q) {
    return dD1(A).find((K) => BmA(q, K)) || null
}

// READABLE (for understanding):
function matchesAlwaysAllowRule(permissionContext, tool) {
    // dD1() extracts all "allow" rules from the context
    let allowRules = extractAllowRules(permissionContext);

    // BmA() checks if a rule matches the tool
    return allowRules.find((rule) => ruleMatchesTool(tool, rule)) || null;
}

// Mapping: hmA→matchesAlwaysAllowRule, dD1→extractAllowRules, BmA→ruleMatchesTool
```

---

## 5. Bash Permission Flow in Plan Mode

```javascript
// ============================================
// Bash tool permission flow in plan mode
// Location: chunks.172.mjs:1690-1711
// ============================================

// ORIGINAL (for source lookup):
let _ = D6q(A, q);
if (_.behavior !== "passthrough") return _;
let J = m_q(A, q);
if (J.behavior !== "passthrough") return J;
if (qq.isReadOnly(A)) return {
    behavior: "allow",
    updatedInput: A,
    decisionReason: {
        type: "other",
        reason: "Read-only command is allowed"
    }
};

// READABLE (for understanding):
async function checkBashPermissions(input, context) {
    // Step 1: Check deny rules first
    let denyResult = checkDenyRules(input, context);
    if (denyResult.behavior !== "passthrough") return denyResult;

    // Step 2: Check ask rules
    let askResult = checkAskRules(input, context);
    if (askResult.behavior !== "passthrough") return askResult;

    // Step 3: Check if command is read-only
    // qq is the Bash tool object
    if (BashTool.isReadOnly(input)) {
        return {
            behavior: "allow",
            updatedInput: input,
            decisionReason: {
                type: "other",
                reason: "Read-only command is allowed"
            }
        };
    }

    // Command requires approval
    return {
        behavior: "passthrough",
        message: "This command requires approval",
        decisionReason: { type: "other", reason: "This command requires approval" }
    };
}

// Mapping: D6q→checkDenyRules, m_q→checkAskRules, qq→BashTool
```

---

## 6. Allowed Tools List for Plan Mode (`tzz`)

The `tzz` function generates the list of tools advertised to the LLM during plan mode:

```javascript
// ============================================
// tzz - buildAllowedToolsList
// Location: chunks.173.mjs:611-617
// ============================================

// ORIGINAL (for source lookup):
function tzz() {
    let A = [Jq, Jz, s9],
        {
            allowedTools: q
        } = sz();
    return (q && q.length > 0 ? A.filter((Y) => q.includes(Y)) : A).join(", ")
}

// READABLE (for understanding):
function buildAllowedToolsList() {
    // Default allowed tools: Glob, Grep, Read
    let defaultTools = [Glob, Grep, Read];

    // sz() returns agent/teammate configuration
    let { allowedTools } = getAgentConfig();

    // If allowedTools is specified, filter to only those
    if (allowedTools && allowedTools.length > 0) {
        return defaultTools
            .filter((tool) => allowedTools.includes(tool))
            .join(", ");
    }

    // Otherwise return all three default tools
    return defaultTools.join(", ");
}

// Mapping: tzz→buildAllowedToolsList, Jq→Glob, Jz→Grep, s9→Read, sz→getAgentConfig
```

### Default Allowed Tools

| Tool | Constant | Purpose |
|------|----------|---------|
| Glob | Jq | File pattern matching - find files |
| Grep | Jz | Content search - find code patterns |
| Read | s9 | File reading - understand code |

### Agent Configuration Override

In swarm configurations, `allowedTools` can restrict which of the three read-only tools are available:

```json
{
  "tools": ["Glob", "Grep"],
  "disallowedTools": []
}
```

If `allowedTools: ["Glob", "Grep"]`, only those two are available (Read is excluded).

---

## 7. Write/Edit Tool Blocking

Write and Edit tools are blocked in plan mode with one exception: **the plan file**.

### Plan File Exception

The plan file (at `~/.claude/plans/{slug}.md`, where slug uses `{adjective}-{action}-{noun}` pattern via `Rj1/getPlanFileSlug` at chunks.88.mjs:78, path via `uW/getPlanFilePath` at chunks.88.mjs:120) is the **only file** that can be edited in plan mode.

### How the Exception Works (checkPermissions-level bypass)

The exception is **not** enforced at the tool `call()` level — it operates at the `checkPermissions()` level. The Write/Edit tool's `checkPermissions()` (chunks.146.mjs:118-120) calls `checkEditPermissions` (`N51`/`Xz6`), which is `checkEditPermissions(FileWriteTool, input, appState.toolPermissionContext)` (also documented in `16_file_system/overview.md`). For plan file paths, `checkEditPermissions` returns `{behavior: "allow"}`. The permission orchestrator (`BYz`) short-circuits on "allow" — the plan mode restriction (which would deny non-read-only tools) **never evaluates**.

**3-step bypass path:**

1. **Write/Edit `checkPermissions()`** → calls `checkEditPermissions(tool, input, permContext)`
2. **`checkEditPermissions`** detects plan file path → returns `{behavior: "allow"}`
3. **Orchestrator (`BYz`)** receives "allow" → returns immediately → **mode check SKIPPED**

The plan file path is obtained via `uW(agentId)` which returns `~/.claude/plans/{slug}.md`.

---

## 8. MCP Tool Read-Only Detection

MCP tools use the `readOnlyHint` annotation from the MCP protocol:

```javascript
// ============================================
// MCP tool isReadOnly - Uses readOnlyHint
// Location: chunks.145.mjs:2355-2357
// ============================================

// ORIGINAL (for source lookup):
isReadOnly() {
    return z.annotations?.readOnlyHint ?? !1
}

// READABLE (for understanding):
isReadOnly() {
    // z is the MCP tool definition
    // Check if the tool declares itself as read-only via annotations
    return toolDefinition.annotations?.readOnlyHint ?? false;
}
```

This allows MCP servers to declare which tools are safe for plan mode.

---

## 9. Prompt Suggestion Blocking

While in plan mode, inline prompt suggestions are suppressed:

```javascript
// ============================================
// ehA - getPromptSuggestionBlocker
// Location: chunks.151.mjs:149 (referenced in implementation.md)
// ============================================

// READABLE (for understanding):
function getPromptSuggestionBlocker(appState) {
    if (!appState.promptSuggestionEnabled) return "disabled";
    if (appState.pendingWorkerRequest || appState.pendingSandboxRequest) return "pending_permission";
    if (appState.elicitation.queue.length > 0) return "elicitation_active";
    if (appState.toolPermissionContext.mode === "plan") return "plan_mode";  // ← plan mode blocks
    if (rateLimiter.status !== "allowed") return "rate_limit";
    return null;  // null = suggestions enabled
}
```

**Why**: Plan mode is a structured workflow. Inline suggestions would distract from the deliberate planning flow.

---

## 10. Complete Permission Decision Flow

```
Tool Called
    │
    ├─ Step 1: Parse input schema
    │
    ├─ Step 2: Call checkPermissions()
    │   │
    │   ├─ Step 2b: Write/Edit plan file bypass
    │   │   ├─ checkEditPermissions(tool, input, permContext)
    │   │   │   ├─ If path matches plan file → Return { behavior: "allow" }
    │   │   │   │   └─ Orchestrator short-circuits → mode check SKIPPED
    │   │   │   └─ Otherwise → passthrough to normal flow
    │   │
    │   ├─ If requiresUserInteraction() && behavior="ask" → Return ask
    │   │
    │   ├─ If mode === "bypassPermissions" → Return allow
    │   │
    │   ├─ If mode === "plan" && isBypassPermissionsModeAvailable → Return allow
    │   │
    │   ├─ Check always-allow rules (hmA)
    │   │   └─ If match found → Return allow
    │   │
    │   └─ Continue to step 3
    │
    ├─ Step 3: Bash-specific flow (if Bash tool)
    │   │
    │   ├─ Check deny rules → Return deny if match
    │   ├─ Check ask rules → Return ask if match
    │   ├─ Call isReadOnly(input)
    │   │   └─ Of6() evaluation
    │   │       ├─ Parse check
    │   │       ├─ Read-only command check (lm)
    │   │       ├─ UNC path check
    │   │       └─ Compound command check
    │   │
    │   └─ If isReadOnly → Return allow
    │
    └─ Step 4: Default behavior
        └─ Return "ask" for user approval
```

---

## 11. Swarm Teammate Tool Restrictions

In swarm configurations, teammates with `plan_mode_required: true` have additional tool restrictions:

### Agent Configuration

```javascript
// ============================================
// Agent/teammate configuration parsing
// Location: chunks.91.mjs:48-61
// ============================================

// READABLE (for understanding):
function parseAgentConfig(agentType, configYaml) {
    let parsed = yaml.parse(configYaml);
    let tools = parseTools(parsed.tools);

    // Add memory tools if memory is enabled
    if (isAutoMemoryEnabled() && parsed.memory && tools !== undefined) {
        let toolSet = new Set(tools);
        // Always add memory tools
        for (let tool of [MemoryRead, MemoryWrite, Glob]) {
            if (!toolSet.has(tool)) tools = [...tools, tool];
        }
    }

    let disallowedTools = parsed.disallowedTools !== undefined
        ? parseTools(parsed.disallowedTools)
        : undefined;

    return {
        agentType: agentType,
        whenToUse: parsed.description,
        prompt: parsed.prompt,
        tools: tools,
        disallowedTools: disallowedTools
    };
}
```

### Teammate Plan Mode

When a teammate is in plan mode with `plan_mode_required: true`:

1. Tool calls go through the same `isReadOnly()` checks
2. ExitPlanMode sends approval request to team leader (not user)
3. The teammate can only use tools allowed by their `tools` config
4. If `disallowedTools` is set, those are explicitly blocked

---

## Summary: Read-Only Enforcement Layers

| Layer | Mechanism | Implementation |
|-------|-----------|----------------|
| Tool Declaration | `isReadOnly()` method | Returns true/false for each tool |
| Bash Commands | `Of6()` evaluation | Checks command parseability, read-only status, security |
| Git Detection | `Pf6()` + `Sd1` regex | Identifies git commands for special handling |
| Permission Rules | `hmA()` rule matching | Always-allow rules can override mode restrictions |
| Plan File Exception | Tool `checkPermissions` → `checkEditPermissions` → orchestrator short-circuit | Write/Edit allowed only for plan file path |
| MCP Tools | `readOnlyHint` annotation | Protocol-level read-only declaration |
| Suggestions | `ehA()` blocker | Suppresses inline suggestions in plan mode |
