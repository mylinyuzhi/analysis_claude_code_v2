# Hooks System Extension (2.1.7)

> **Key Changes from 2.0.59:**
> - Added `once: true` configuration (2.1.0)
> - Added frontmatter hooks in skills/agents (2.1.0)
> - Timeout increased from 60s to 10 minutes (2.1.3)

---

## Overview

The hooks system allows custom commands to run before/after tool executions.
Version 2.1.x extends this with one-time hooks and skill/agent frontmatter integration.

---

## Hook Types

### 1. Command Hook (Shell)

```javascript
// ============================================
// commandHookSchema - Shell command hook type
// Location: chunks.90.mjs:1878-1884
// ============================================

// ORIGINAL (for source lookup):
S75 = m.object({
  type: m.literal("command").describe("Bash command hook type"),
  command: m.string().describe("Shell command to execute"),
  timeout: m.number().positive().optional().describe("Timeout in seconds for this specific command"),
  statusMessage: m.string().optional().describe("Custom status message to display in spinner while hook runs"),
  once: m.boolean().optional().describe("If true, hook runs once and is removed after execution")
})

// READABLE (for understanding):
commandHookSchema = zod.object({
  type: zod.literal("command").describe("Bash command hook type"),
  command: zod.string().describe("Shell command to execute"),
  timeout: zod.number().positive().optional().describe("Timeout in seconds"),
  statusMessage: zod.string().optional().describe("Custom spinner message"),
  once: zod.boolean().optional().describe("If true, runs once then removed")
})

// Mapping: S75→commandHookSchema, m→zod
```

### 2. Prompt Hook (LLM)

```javascript
// ============================================
// promptHookSchema - LLM prompt hook type
// Location: chunks.90.mjs:1884-1891
// ============================================

// ORIGINAL (for source lookup):
x75 = m.object({
  type: m.literal("prompt").describe("LLM prompt hook type"),
  prompt: m.string().describe("Prompt to evaluate with LLM. Use $ARGUMENTS placeholder for hook input JSON."),
  timeout: m.number().positive().optional().describe("Timeout in seconds for this specific prompt evaluation"),
  model: m.string().optional().describe('Model to use for this prompt hook (e.g., "claude-sonnet-4-5-20250929"). If not specified, uses the default small fast model.'),
  statusMessage: m.string().optional().describe("Custom status message to display in spinner while hook runs"),
  once: m.boolean().optional().describe("If true, hook runs once and is removed after execution")
})

// READABLE (for understanding):
promptHookSchema = zod.object({
  type: zod.literal("prompt").describe("LLM prompt hook type"),
  prompt: zod.string().describe("Prompt with $ARGUMENTS placeholder"),
  timeout: zod.number().positive().optional(),
  model: zod.string().optional().describe("Model override"),
  statusMessage: zod.string().optional(),
  once: zod.boolean().optional()
})

// Mapping: x75→promptHookSchema
```

### 3. Agent Hook (Agentic Verifier)

```javascript
// ============================================
// agentHookSchema - Agentic verifier hook type
// Location: chunks.90.mjs:1891-1898
// ============================================

// ORIGINAL (for source lookup):
y75 = m.object({
  type: m.literal("agent").describe("Agentic verifier hook type"),
  prompt: m.string().transform((A) => (Q) => A).describe('Prompt describing what to verify (e.g. "Verify that unit tests ran and passed."). Use $ARGUMENTS placeholder for hook input JSON.'),
  timeout: m.number().positive().optional().describe("Timeout in seconds for agent execution (default 60)"),
  model: m.string().optional().describe('Model to use for this agent hook (e.g., "claude-sonnet-4-5-20250929"). If not specified, uses Haiku.'),
  statusMessage: m.string().optional().describe("Custom status message to display in spinner while hook runs"),
  once: m.boolean().optional().describe("If true, hook runs once and is removed after execution")
})

// READABLE (for understanding):
agentHookSchema = zod.object({
  type: zod.literal("agent").describe("Agentic verifier hook type"),
  prompt: zod.string().transform(createPromptFunction).describe("Verification prompt"),
  timeout: zod.number().positive().optional().describe("Timeout (default 60s)"),
  model: zod.string().optional().describe("Model (default: Haiku)"),
  statusMessage: zod.string().optional(),
  once: zod.boolean().optional()
})

// Mapping: y75→agentHookSchema
```

---

## once: true Configuration

**Purpose:** Run a hook exactly once, then automatically remove it.

**Use Cases:**
1. One-time setup tasks
2. First-run initialization
3. Temporary validation before deployment

**Behavior:**
- Hook executes normally on first trigger
- After successful execution, hook is removed from registry
- Subsequent matches won't trigger the hook

---

## Hook Matcher Schema

```javascript
// ============================================
// hookMatcherSchema - Defines hook triggering conditions
// Location: chunks.90.mjs:1898-1901
// ============================================

// ORIGINAL:
k75 = m.object({
  matcher: m.string().optional().describe('String pattern to match (e.g. tool names like "Write")'),
  hooks: m.array(v75).describe("List of hooks to execute when the matcher matches")
})

// READABLE:
hookMatcherSchema = zod.object({
  matcher: zod.string().optional().describe('Pattern to match (e.g. "Write")'),
  hooks: zod.array(hookTypeUnion).describe("Hooks to execute on match")
})

// Mapping: k75→hookMatcherSchema, v75→hookTypeUnion
```

---

## Skill/Agent Frontmatter Hooks (2.1.0)

Skills and agents can now define hooks in their frontmatter:

```yaml
---
name: my-skill
hooks:
  PreToolUse:
    - matcher: "Write"
      hooks:
        - type: command
          command: "npm run lint"
          once: true
---
```

### Registration

```javascript
// ============================================
// registerSkillFrontmatterHooks - Registers hooks from skill frontmatter
// Location: chunks.113.mjs:913
// ============================================

// ORIGINAL (context):
if (D?.type === "prompt" && D.hooks) {
  let _ = q0();
  OD1(B.setAppState, _, D.hooks, X)
}

// READABLE:
if (skillDefinition?.type === "prompt" && skillDefinition.hooks) {
  let hookContext = getHookContext();
  registerSkillFrontmatterHooks(toolUseContext.setAppState, hookContext, skillDefinition.hooks, skillName);
}

// Mapping: OD1→registerSkillFrontmatterHooks, D→skillDefinition, q0→getHookContext, X→skillName
```

---

## Timeout Changes

| Version | Tool Hook Timeout |
|---------|-------------------|
| 2.0.59 | 60 seconds |
| 2.1.3+ | **10 minutes** |

**Why the change:**
- Long-running verification tasks (test suites)
- Complex agent hooks needing more time
- Build processes that exceeded 60s limit

---

## Event Types

Hooks can be registered for these event types:

| Event | Trigger |
|-------|---------|
| PreToolUse | Before a tool executes |
| PostToolUse | After tool completes successfully |
| PostToolUseFailure | After tool fails |
| Stop | When agent stops |
| SessionStart | When session begins |
| SessionEnd | When session ends |
| UserPromptSubmit | When user submits prompt |
| Notification | When notification is sent |
| PreCompact | Before context compaction |
| PermissionRequest | When permission is requested |
| SubagentStart | When sub-agent starts |

---

## Related Symbols

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

Key schemas in this document:
- `commandHookSchema` (S75) - Shell command hook
- `promptHookSchema` (x75) - LLM prompt hook
- `agentHookSchema` (y75) - Agent verifier hook
- `hookMatcherSchema` (k75) - Hook triggering pattern
- `registerSkillFrontmatterHooks` (OD1) - Frontmatter hook registration

---

## See Also

- [../26_background_agents/](../26_background_agents/) - Background task hooks
- [../10_skill/](../10_skill/) - Skill system with frontmatter hooks
