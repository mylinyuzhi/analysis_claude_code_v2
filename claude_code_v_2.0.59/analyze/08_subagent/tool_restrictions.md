# Tool Restrictions for Subagents

## Overview

Claude Code implements a **three-tier tool restriction system** to control what tools subagents can access. This ensures security, isolation, and appropriate capabilities for different agent contexts.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `filterToolsForSubagent` (w70) - Core filtering function
- `resolveAgentTools` (Sn) - Tool resolution with filtering

---

## Tool Restriction Sets

**Location**: `chunks.146.mjs:949`

### CTA - ALWAYS_BLOCKED_TOOLS

Tools that are **ALWAYS blocked for ALL subagents**, regardless of source (built-in, plugin, user).

```javascript
// ============================================
// ALWAYS_BLOCKED_TOOLS - Tools blocked for all subagents
// Location: chunks.146.mjs:949
// ============================================

// ORIGINAL (for source lookup):
CTA = new Set([gq.name, A71, A6, pJ, DY1, ...[]])

// READABLE (for understanding):
ALWAYS_BLOCKED_TOOLS = new Set([
  "ExitPlanMode",     // gq.name - Subagents cannot exit plan mode
  "EnterPlanMode",    // A71 - Subagents cannot enter plan mode
  "Task",             // A6 - Subagents cannot spawn other subagents
  "AskUserQuestion",  // pJ - Subagents cannot directly ask user questions
  "KillShell"         // DY1 - Subagents cannot kill background shells
])

// Mapping: gq→ExitPlanMode, A71→EnterPlanMode, A6→Task, pJ→AskUserQuestion, DY1→KillShell
```

**Why These Are Blocked:**

| Tool | Reason |
|------|--------|
| `ExitPlanMode` | Plan mode is main agent's responsibility |
| `EnterPlanMode` | Plan mode can only be entered by main agent |
| `Task` | Prevents subagent recursion/spawning chains |
| `AskUserQuestion` | User interaction must go through main agent |
| `KillShell` | Shell lifecycle managed by main agent only |

---

### Qf2 - NON_BUILTIN_BLOCKED_TOOLS

Tools blocked for **non-built-in agents** (plugin, user settings, project settings).

```javascript
// ============================================
// NON_BUILTIN_BLOCKED_TOOLS - Additional blocks for non-built-in agents
// Location: chunks.146.mjs:949
// ============================================

// ORIGINAL (for source lookup):
Qf2 = new Set([...CTA])

// READABLE (for understanding):
NON_BUILTIN_BLOCKED_TOOLS = new Set([
  ...ALWAYS_BLOCKED_TOOLS  // Same as CTA - no additional restrictions
])
```

**Key Insight**: Currently, `Qf2` is identical to `CTA`. This means:
- Non-built-in agents have the **same blocked tools** as built-in agents
- The separation exists for **future extensibility** (Anthropic could add more restrictions for non-built-in agents)

---

### Bf2 - ASYNC_ALLOWED_TOOLS

Tools **ALLOWED for async/background agents**. This is an **allowlist** - only these tools can be used.

```javascript
// ============================================
// ASYNC_ALLOWED_TOOLS - Allowlist for background agents
// Location: chunks.146.mjs:949
// ============================================

// ORIGINAL (for source lookup):
Bf2 = new Set([n8.name, ZSA.name, BY.name, Py.name, nV.name, zO.name, C9, lD.name, QV.name, kP.name])

// READABLE (for understanding):
ASYNC_ALLOWED_TOOLS = new Set([
  "Read",           // n8.name - File reading
  "WebSearch",      // ZSA.name - Web search
  "TodoWrite",      // BY.name - Todo list management
  "Grep",           // Py.name - Content search
  "WebFetch",       // nV.name - URL fetching
  "Glob",           // zO.name - File pattern matching
  "Bash",           // C9 - Shell commands
  "Edit",           // lD.name - File editing
  "Write",          // QV.name - File writing
  "NotebookEdit"    // kP.name - Jupyter notebook editing
])

// Mapping: n8→Read, ZSA→WebSearch, BY→TodoWrite, Py→Grep, nV→WebFetch,
//          zO→Glob, C9→Bash, lD→Edit, QV→Write, kP→NotebookEdit
```

**Async Agent Tool Summary:**

| Category | Allowed Tools | NOT Allowed |
|----------|--------------|-------------|
| File Reading | Read, Glob, Grep | - |
| File Writing | Write, Edit, NotebookEdit | - |
| Web | WebSearch, WebFetch | - |
| Execution | Bash | - |
| Planning | TodoWrite | Task, AskUserQuestion |
| Plan Mode | - | EnterPlanMode, ExitPlanMode |

---

## Filtering Logic

### w70 - filterToolsForSubagent

This function applies all three restriction sets based on agent context.

```javascript
// ============================================
// filterToolsForSubagent - Core tool filtering function
// Location: chunks.125.mjs:1116-1128
// ============================================

// ORIGINAL (for source lookup):
function w70({
  tools: A,
  isBuiltIn: Q,
  isAsync: B = !1
}) {
  return A.filter((G) => {
    if (process.env.CLAUDE_CODE_ALLOW_MCP_TOOLS_FOR_SUBAGENTS && G.name.startsWith("mcp__")) return !0;
    if (CTA.has(G.name)) return !1;
    if (!Q && Qf2.has(G.name)) return !1;
    if (B && !Bf2.has(G.name)) return !1;
    return !0
  })
}

// READABLE (for understanding):
function filterToolsForSubagent({
  tools: allTools,
  isBuiltIn: isBuiltInAgent,
  isAsync: isAsyncAgent = false
}) {
  return allTools.filter((tool) => {
    // Rule 1: MCP tools - allow if env var is set
    if (process.env.CLAUDE_CODE_ALLOW_MCP_TOOLS_FOR_SUBAGENTS
        && tool.name.startsWith("mcp__")) {
      return true;  // ALLOW
    }

    // Rule 2: Always-blocked tools - block for ALL subagents
    if (ALWAYS_BLOCKED_TOOLS.has(tool.name)) {
      return false;  // BLOCK
    }

    // Rule 3: Non-built-in blocked - block for plugin/user agents
    if (!isBuiltInAgent && NON_BUILTIN_BLOCKED_TOOLS.has(tool.name)) {
      return false;  // BLOCK
    }

    // Rule 4: Async allowlist - only allow Bf2 tools for async agents
    if (isAsyncAgent && !ASYNC_ALLOWED_TOOLS.has(tool.name)) {
      return false;  // BLOCK
    }

    // Default: Allow
    return true;
  });
}

// Mapping: w70→filterToolsForSubagent, A→allTools, Q→isBuiltInAgent, B→isAsyncAgent, G→tool
```

### Decision Flow Diagram

```
Tool to Check
     │
     ▼
┌────────────────────────────────────────────────┐
│ Is MCP tool && CLAUDE_CODE_ALLOW_MCP_TOOLS...? │
└────────────────────────────────────────────────┘
     │ Yes → ALLOW
     │ No ↓
     ▼
┌────────────────────────────────────┐
│ Is in ALWAYS_BLOCKED_TOOLS (CTA)? │
└────────────────────────────────────┘
     │ Yes → BLOCK
     │ No ↓
     ▼
┌─────────────────────────────────────────────────────────────┐
│ Is non-built-in agent && in NON_BUILTIN_BLOCKED (Qf2)?     │
└─────────────────────────────────────────────────────────────┘
     │ Yes → BLOCK
     │ No ↓
     ▼
┌───────────────────────────────────────────────────────────┐
│ Is async agent && NOT in ASYNC_ALLOWED_TOOLS (Bf2)?      │
└───────────────────────────────────────────────────────────┘
     │ Yes → BLOCK
     │ No ↓
     ▼
   ALLOW
```

---

### Sn - resolveAgentTools

This function resolves the complete tool set for an agent, combining filtering with agent-specific disallowed tools.

```javascript
// ============================================
// resolveAgentTools - Complete tool resolution
// Location: chunks.125.mjs:1130-1176
// ============================================

// ORIGINAL (for source lookup):
function Sn(A, Q, B = !1) {
  let {
    tools: G,
    disallowedTools: Z,
    source: I
  } = A, Y = w70({
    tools: Q,
    isBuiltIn: I === "built-in",
    isAsync: B
  }), J = new Set(Z?.map((C) => {
    let { toolName: E } = nN(C);
    return E
  }) ?? []), W = Y.filter((C) => !J.has(C.name));
  if (G === void 0 || G.length === 1 && G[0] === "*") return {
    hasWildcard: !0,
    validTools: [],
    invalidTools: [],
    resolvedTools: W
  };
  // ... (specific tool resolution logic)
}

// READABLE (for understanding):
function resolveAgentTools(agentDefinition, allAvailableTools, isAsyncAgent = false) {
  const {
    tools: requestedTools,      // Agent's requested tools from definition
    disallowedTools: blocked,   // Agent-specific blocked tools
    source: agentSource         // "built-in", "plugin", "userSettings", etc.
  } = agentDefinition;

  // Step 1: Apply system-wide filters (CTA, Qf2, Bf2)
  const filteredTools = filterToolsForSubagent({
    tools: allAvailableTools,
    isBuiltIn: agentSource === "built-in",
    isAsync: isAsyncAgent
  });

  // Step 2: Build set of agent-specific disallowed tool names
  const disallowedSet = new Set(
    blocked?.map(item => parseToolName(item).toolName) ?? []
  );

  // Step 3: Remove disallowed tools from filtered set
  const availableTools = filteredTools.filter(
    tool => !disallowedSet.has(tool.name)
  );

  // Step 4: Handle wildcard case (tools: ["*"])
  if (requestedTools === undefined ||
      (requestedTools.length === 1 && requestedTools[0] === "*")) {
    return {
      hasWildcard: true,
      validTools: [],
      invalidTools: [],
      resolvedTools: availableTools  // All available tools
    };
  }

  // Step 5: Resolve specific requested tools
  // ... (specific tool name resolution logic)

  return {
    hasWildcard: false,
    validTools: validToolNames,
    invalidTools: invalidToolNames,
    resolvedTools: resolvedToolObjects
  };
}

// Mapping: Sn→resolveAgentTools, A→agentDefinition, Q→allAvailableTools, B→isAsyncAgent,
//          G→requestedTools, Z→blocked, I→agentSource, Y→filteredTools, J→disallowedSet
```

---

## Tool Resolution Pipeline

```
┌───────────────────────────────────────────────────────────────┐
│              All Available Tools (from main agent)            │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ Step 1: Apply w70() - System-wide filtering                   │
│   - Remove CTA tools (always blocked)                         │
│   - Remove Qf2 tools (if non-built-in)                        │
│   - Apply Bf2 allowlist (if async agent)                      │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ Step 2: Remove agent-specific disallowedTools                 │
│   - Defined in agent definition                               │
│   - Example: Explore agent blocks Write, Edit, Bash           │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ Step 3: Resolve requested tools                               │
│   - If tools: ["*"] → return all remaining                    │
│   - If specific tools → validate & resolve                    │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│              Final Resolved Tools for Subagent                │
└───────────────────────────────────────────────────────────────┘
```

---

## Agent-Specific Tool Restrictions

### Built-in Agent Examples

| Agent | tools | disallowedTools | Effective Tools |
|-------|-------|-----------------|-----------------|
| general-purpose | `["*"]` | `[]` | All (minus CTA) |
| Explore | `["*"]` | `[Write, Edit, NotebookEdit, Bash]` | Read-only tools |
| Plan | `["*"]` | `[TodoWrite]` | All except TodoWrite |
| statusline-setup | `[Read, Edit]` | `[]` | Read, Edit only |
| claude-code-guide | `[Glob, Grep, Read, WebFetch, WebSearch]` | `[]` | Specified 5 tools |

### Tool Matrix by Agent Type

```
                    │ general │ Explore │ Plan │ statusline │ claude-guide │
────────────────────┼─────────┼─────────┼──────┼────────────┼──────────────┤
Read                │    ✅    │    ✅    │  ✅  │     ✅     │      ✅      │
Write               │    ✅    │    ❌    │  ✅  │     ❌     │      ❌      │
Edit                │    ✅    │    ❌    │  ✅  │     ✅     │      ❌      │
Bash                │    ✅    │    ❌    │  ✅  │     ❌     │      ❌      │
Glob                │    ✅    │    ✅    │  ✅  │     ❌     │      ✅      │
Grep                │    ✅    │    ✅    │  ✅  │     ❌     │      ✅      │
WebFetch            │    ✅    │    ✅    │  ✅  │     ❌     │      ✅      │
WebSearch           │    ✅    │    ✅    │  ✅  │     ❌     │      ✅      │
TodoWrite           │    ✅    │    ❌    │  ❌  │     ❌     │      ❌      │
NotebookEdit        │    ✅    │    ❌    │  ✅  │     ❌     │      ❌      │
Task                │    ❌    │    ❌    │  ❌  │     ❌     │      ❌      │
AskUserQuestion     │    ❌    │    ❌    │  ❌  │     ❌     │      ❌      │
EnterPlanMode       │    ❌    │    ❌    │  ❌  │     ❌     │      ❌      │
ExitPlanMode        │    ❌    │    ❌    │  ❌  │     ❌     │      ❌      │
KillShell           │    ❌    │    ❌    │  ❌  │     ❌     │      ❌      │
```

---

## MCP Tools Special Handling

MCP (Model Context Protocol) tools are blocked by default for subagents, but can be enabled via environment variable:

```javascript
// MCP tool handling in w70()
if (process.env.CLAUDE_CODE_ALLOW_MCP_TOOLS_FOR_SUBAGENTS
    && tool.name.startsWith("mcp__")) {
  return true;  // Allow MCP tools
}
```

**Key Points:**
- MCP tools have names starting with `mcp__`
- By default: **BLOCKED** for all subagents
- With `CLAUDE_CODE_ALLOW_MCP_TOOLS_FOR_SUBAGENTS=true`: **ALLOWED**
- This check runs **before** CTA filtering (MCP tools bypass normal restrictions when env var is set)

---

## Async vs Sync Agent Differences

| Aspect | Sync Agent | Async/Background Agent |
|--------|------------|------------------------|
| Tool filtering | CTA + Qf2 only | CTA + Qf2 + Bf2 allowlist |
| Allowed tools | All except CTA/Qf2 | Only Bf2 tools |
| User interaction | Not allowed (CTA) | Not allowed (CTA) |
| Recursion | Not allowed (CTA) | Not allowed (CTA) |
| File operations | Allowed | Allowed (in Bf2) |
| Web operations | Allowed | Allowed (in Bf2) |

**Why Async Has Stricter Restrictions:**
- Async agents run in background without real-time supervision
- Restricting to Bf2 tools ensures predictable behavior
- Main agent can still use AgentOutputTool to retrieve results

---

## Design Rationale

### Why Block Task Tool?

**What it does:** Prevents subagents from spawning other subagents.

**How it works:**
1. Task tool (A6) is added to CTA set
2. `filterToolsForSubagent` (w70) removes it from all subagent tool lists
3. Any attempt to use Task in a subagent will fail

**Why this approach:**
- **Infinite recursion prevention**: Without this block, a subagent could spawn another, which spawns another → stack overflow or resource exhaustion
- **Predictable resource usage**: Main agent controls all parallelism; no hidden agent spawning
- **Simpler mental model**: Users/developers know exactly how many agents are running

**Alternatives considered:**
1. *Depth limiting* (allow 2-3 levels): Adds complexity, hard to debug, unclear benefit
2. *Rate limiting*: Doesn't prevent eventual exhaustion, adds latency
3. *Total block* (chosen): Simple, safe, no edge cases

**Trade-offs:**
- ❌ Subagents can't delegate subtasks
- ✅ No risk of runaway agent spawning
- ✅ Easier to reason about system behavior

**Key insight:** The stateless, one-shot design of subagents means delegation isn't needed - the main agent should break down complex tasks before spawning.

---

### Why Block AskUserQuestion?

**What it does:** Prevents subagents from directly asking users questions.

**How it works:**
1. AskUserQuestion (pJ) added to CTA set
2. Subagent cannot pause and wait for user input
3. All user interaction flows through main agent

**Why this approach:**
- **Single point of contact**: User only interacts with main agent
- **No deadlocks**: Subagent can't block waiting for user who doesn't know to respond
- **Clear responsibility**: Main agent summarizes subagent findings, decides what to ask user

**Alternatives considered:**
1. *Forward questions to main agent*: Complex message routing, delays execution
2. *Allow with timeout*: User might miss the question, confusing UX
3. *Total block* (chosen): Forces subagents to be autonomous

**Trade-offs:**
- ❌ Subagents must be fully specified upfront
- ❌ Can't get clarification mid-task
- ✅ Predictable execution time
- ✅ User not overwhelmed by multiple question sources

**Key insight:** The prompt must be complete because subagents cannot ask for clarification - this forces better prompt engineering from the main agent.

---

### Why Block Plan Mode Tools?

**What it does:** Prevents subagents from entering or exiting plan mode.

**How it works:**
1. EnterPlanMode (A71) and ExitPlanMode (gq) in CTA set
2. Additionally, EnterPlanMode has explicit agentId check (chunks.130.mjs:2372)
3. Double protection: both tool filtering AND runtime check

**Why this approach:**
- **Plan mode is session-scoped**: Plan file tied to main session, not subagent
- **Mode consistency**: Only one entity should control conversation mode
- **Clear ownership**: Main agent owns the planning process

**Why double protection (CTA + agentId check):**
- CTA prevents the tool from appearing in subagent's toolset
- agentId check is defense-in-depth in case CTA is bypassed
- Shows this is a critical security boundary

---

### Why Separate Built-in vs Non-built-in (Qf2)?

**What it does:** Allows different trust levels for built-in vs plugin/user agents.

**How it works:**
1. Qf2 currently equals CTA (same restrictions)
2. Non-built-in agents checked against Qf2
3. Built-in agents skip Qf2 check (only CTA applies)

**Why this approach:**
- **Future extensibility**: Can add restrictions for untrusted agents later
- **Trust hierarchy**: Anthropic-shipped agents are more vetted
- **Gradual rollout**: Can tighten non-built-in restrictions without breaking built-ins

**Current state (Qf2 = CTA):**
- No practical difference today
- Architecture ready for future differentiation

**Potential future uses:**
- Block dangerous Bash patterns for plugin agents
- Require explicit file path approval for user agents
- Limit token budgets for non-built-in agents

---

### Why Async Allowlist (Bf2)?

**What it does:** Restricts background agents to a safe subset of tools.

**How it works:**
1. Bf2 defines an allowlist (not blocklist)
2. Only tools IN Bf2 are allowed for async agents
3. This is stricter than sync agents (which use blocklist approach)

**Why allowlist vs blocklist:**
- **Allowlist is safer**: New tools are blocked by default
- **Predictable behavior**: Background agents have known capabilities
- **Easier auditing**: Can list exactly what background agents can do

**Why these specific tools in Bf2:**
| Tool | Why Allowed |
|------|-------------|
| Read, Glob, Grep | Read-only file access - safe |
| Write, Edit | File modification - needed for useful work |
| Bash | Shell commands - needed but monitored |
| WebSearch, WebFetch | Network access - useful for research |
| TodoWrite | Task tracking - helps coordinate work |
| NotebookEdit | Jupyter support - specialized but safe |

**Trade-offs:**
- ❌ Background agents can't use every tool
- ✅ Predictable, auditable capabilities
- ✅ New tools won't accidentally work in background

**Key insight:** Background agents run without supervision, so they get fewer tools. The allowlist approach means security improves as new tools are added (they're blocked by default).

---

## Summary

| Set | Purpose | Applied When |
|-----|---------|--------------|
| CTA | Always-blocked tools | ALL subagents |
| Qf2 | Non-built-in blocked | Plugin, user, project agents |
| Bf2 | Async allowlist | Background/async agents only |

**Key Takeaways:**
- Subagents CANNOT spawn other subagents (Task blocked)
- Subagents CANNOT interact with users directly (AskUserQuestion blocked)
- Subagents CANNOT control plan mode (EnterPlanMode, ExitPlanMode blocked)
- Async agents have the most restricted tool set (Bf2 allowlist)
- MCP tools require explicit environment variable to enable
