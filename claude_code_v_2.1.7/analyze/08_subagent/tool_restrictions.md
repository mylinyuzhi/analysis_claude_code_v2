# Subagent Tool Restrictions (Claude Code 2.1.7)

> **Related:** [architecture.md](./architecture.md) | [execution.md](./execution.md)

---

## Overview

Claude Code implements a **multi-layer tool filtering system** for subagents to ensure:
1. **Safety** - Prevent dangerous recursive operations
2. **Isolation** - Keep subagents focused on their purpose
3. **Read-only enforcement** - For exploration-only agents

---

## Tool Restriction Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tool Request from Subagent                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: System-Wide Blocked Tools                             │
│  ├─ Task (f3)          → Prevent recursive agent spawning       │
│  ├─ EnterPlanMode (I8) → Plan mode is main-agent only          │
│  ├─ ExitPlanMode (CY1) → Plan mode is main-agent only          │
│  ├─ AskUserQuestion (BY) → User interaction blocked            │
│  └─ KillShell (tq)      → Task management blocked              │
│                                                                  │
│  Layer 2: Agent-Specific disallowedTools                        │
│  └─ Defined per agent in agent definition                       │
│                                                                  │
│  Layer 3: Agent-Specific tools Allowlist                        │
│  └─ ["*"] = all tools, or specific list                        │
│                                                                  │
│  Layer 4: Permission Mode                                        │
│  └─ "dontAsk" = auto-approve, default = ask user               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## System-Wide Blocked Tools

These tools are **ALWAYS blocked** for subagents regardless of configuration:

| Tool | Obfuscated | Reason |
|------|------------|--------|
| Task | f3 | Prevents recursive agent spawning |
| EnterPlanMode | I8 | Plan mode is main-agent only |
| ExitPlanMode | CY1 | Plan mode is main-agent only |
| AskUserQuestion | BY | Subagents can't interact with user |
| KillShell | tq | Task management is main-agent only |

### Code Reference

```javascript
// ============================================
// Disallowed tools for Explore/Plan agents
// Location: chunks.93.mjs:222, 292
// ============================================

// ORIGINAL (for source lookup):
// For Explore agent:
disallowedTools: [f3, CY1, I8, BY, tq]

// For Plan agent (same list):
disallowedTools: [f3, CY1, I8, BY, tq]

// READABLE (for understanding):
disallowedTools: [
  TASK_TOOL_NAME,           // "Task" - no recursive spawning
  EXIT_PLAN_MODE_NAME,      // "ExitPlanMode" - no plan mode
  ENTER_PLAN_MODE_NAME,     // "EnterPlanMode" - no plan mode
  ASKUSER_NAME,             // "AskUserQuestion" - no user interaction
  KILLSHELL_NAME            // "KillShell" - no task management
]

// Mapping: f3→TASK_TOOL_NAME, CY1→EXIT_PLAN_MODE_NAME, I8→ENTER_PLAN_MODE_NAME, BY→ASKUSER_NAME, tq→KILLSHELL_NAME
```

---

## Agent-Specific Tool Configurations

### Bash Agent

```javascript
// Location: chunks.93.mjs:22
tools: [X9]  // Only Bash tool
```

| Allowed | Blocked |
|---------|---------|
| Bash | Everything else |

**Rationale:** Highly focused agent for command execution only.

---

### general-purpose Agent

```javascript
// Location: chunks.93.mjs:36
tools: ["*"]  // All tools
```

| Allowed | Blocked |
|---------|---------|
| All tools | (system-wide blocks still apply) |

**Rationale:** Full capability for complex multi-step tasks.

---

### statusline-setup Agent

```javascript
// Location: chunks.93.mjs:64
tools: ["Read", "Edit"]
```

| Allowed | Blocked |
|---------|---------|
| Read, Edit | All others |

**Rationale:** Only needs to read shell config and edit settings.json.

---

### Explore Agent

```javascript
// Location: chunks.93.mjs:222
disallowedTools: [f3, CY1, I8, BY, tq]
// No tools array → defaults to all available minus disallowed
```

| Allowed | Blocked |
|---------|---------|
| Glob, Grep, Read, Bash (read-only) | Task, EnterPlanMode, ExitPlanMode, AskUserQuestion, KillShell, Write, Edit, NotebookEdit |

**Additional enforcement via `criticalSystemReminder_EXPERIMENTAL`:**
```
"CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
```

**Rationale:** Fast exploration without modification capability. Uses critical system reminder as extra guard.

---

### Plan Agent

```javascript
// Location: chunks.93.mjs:292-293
disallowedTools: [f3, CY1, I8, BY, tq]
tools: MS.tools  // Same as Explore
```

| Allowed | Blocked |
|---------|---------|
| Same as Explore | Same as Explore |

**Rationale:** Planning is read-only; shares tool restrictions with Explore.

---

### claude-code-guide Agent

```javascript
// Location: chunks.93.mjs:385
tools: [lI, DI, z3, cI, aR]
```

| Allowed | Blocked |
|---------|---------|
| Glob, Grep, Read, WebFetch, WebSearch | All others |

**Additional: `permissionMode: "dontAsk"`** - No permission prompts for these tools.

**Rationale:** Documentation lookup needs file and web access, but no modification capability.

---

## Tool Restriction Summary Table

| Agent | Model | Tools Allowed | Tools Blocked | Permission Mode |
|-------|-------|---------------|---------------|-----------------|
| Bash | inherit | Bash only | All others | default |
| general-purpose | (default) | All* | System blocks | default |
| statusline-setup | sonnet | Read, Edit | All others | default |
| Explore | haiku | Glob, Grep, Read, Bash | Write, Edit, Task, etc. | default |
| Plan | inherit | Same as Explore | Same as Explore | default |
| claude-code-guide | haiku | Glob, Grep, Read, WebFetch, WebSearch | All others | dontAsk |

*System-wide blocks (Task, EnterPlanMode, ExitPlanMode, AskUserQuestion, KillShell) always apply.

---

## Read-Only Enforcement

For Explore and Plan agents, read-only is enforced through **multiple layers**:

### Layer 1: disallowedTools
Explicitly blocks write-capable tools:
- Write, Edit, NotebookEdit (implicitly via not including them)

### Layer 2: System Prompt Instructions
```
=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY exploration task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
...
```

### Layer 3: Critical System Reminder
```javascript
criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
```

**Why multiple layers?**
- Instructions alone may not prevent all attempts
- Critical reminder provides last-line defense
- Defense in depth against unintended modifications

---

## Permission Mode

| Mode | Behavior |
|------|----------|
| `default` | User prompted for tool permissions |
| `"dontAsk"` | Auto-approve all tool uses |

**Currently only claude-code-guide uses `dontAsk`:**
- This agent only fetches documentation
- No security concerns with auto-approving Glob/Grep/Read/WebFetch/WebSearch

---

## Tool Resolution Pipeline

When a subagent requests to use a tool:

```
1. Check system-wide blocks
   └─ If tool in [Task, EnterPlanMode, ExitPlanMode, AskUserQuestion, KillShell]
      → BLOCK

2. Check agent's disallowedTools
   └─ If tool in agent.disallowedTools
      → BLOCK

3. Check agent's tools allowlist
   └─ If agent.tools === ["*"]
      → ALLOW (all tools)
   └─ If tool in agent.tools
      → ALLOW
   └─ Else
      → BLOCK

4. Check permission mode
   └─ If agent.permissionMode === "dontAsk"
      → AUTO-APPROVE
   └─ Else
      → PROMPT USER (for external operations)
```

---

## Related Symbols

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

Key symbols in this document:
- `TASK_TOOL_NAME` (f3) - Task tool name constant
- `EXIT_PLAN_MODE_NAME` (CY1) - ExitPlanMode constant
- `ENTER_PLAN_MODE_NAME` (I8) - EnterPlanMode constant
- `ASKUSER_NAME` (BY) - AskUserQuestion constant
- `KILLSHELL_NAME` (tq) - KillShell constant

---

## See Also

- [architecture.md](./architecture.md) - Agent definitions
- [execution.md](./execution.md) - Execution flow
- [Permissions](../18_sandbox/) - Permission system details
