# Claude Code v2.0.59 - Workflow Analysis (Part 2: Subsystem Workflows)

> **Split Documentation:**
> - **Part 1:** [workflow_main.md](./workflow_main.md) - Lifecycle, Startup, Initialization, Mode Selection, Main Loop
> - **Part 2 (this file):** Subsystem Workflows, Summary, Timing, Error Handling

> **Symbol References:**
> - [symbol_index_core.md](./symbol_index_core.md) - Core execution modules
> - [symbol_index_infra.md](./symbol_index_infra.md) - Infrastructure modules

---

## Subsystem Workflows

This section details the internal workflows of key subsystems.

### Compact Workflow (Module 07)

**Purpose:** Manage conversation context when approaching token limits.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPACT WORKFLOW                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Token Check (after each turn)                                          │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────┐                                                   │
│  │ currentTokens >  │──No──► Continue normally                         │
│  │ threshold * 0.8? │                                                   │
│  └────────┬─────────┘                                                   │
│           │ Yes                                                         │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │ Micro-Compact    │──Success──► Context reduced, continue            │
│  │ Si() - No API    │                                                   │
│  └────────┬─────────┘                                                   │
│           │ Insufficient                                                │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │ PreCompact Hooks │                                                   │
│  │ qa("PreCompact") │                                                   │
│  └────────┬─────────┘                                                   │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │ Full Compact     │                                                   │
│  │ j91() - LLM API  │                                                   │
│  │ Summarize history│                                                   │
│  └────────┬─────────┘                                                   │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │ Context Restore  │                                                   │
│  │ - Recent files   │                                                   │
│  │ - Todo list      │                                                   │
│  │ - Plan context   │                                                   │
│  └────────┬─────────┘                                                   │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │ SessionStart     │                                                   │
│  │ Hooks            │                                                   │
│  └──────────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Functions:**
- `sI2` (autoCompactDispatcher) - Entry point, routes to micro or full
- `Si` (microCompact) - Fast local compaction, no API call
- `j91` (fullCompact) - LLM-based summarization

**Code Snippet - Two-Tier Decision:**
```javascript
// ============================================
// autoCompactDispatcher - Compact routing logic
// Location: chunks.107.mjs:1707-1731
// ============================================

// ORIGINAL:
async function sI2(A, Q, B) {
  if (Y0(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 };
  let I = tk(A);
  if (I < U1A * .8) return { wasCompacted: !1 };
  // Try micro-compact first
  let E = await Si(A, Q);
  if (E.wasCompacted) return E;
  // Fall back to full compact
  return await j91(A, Q, B);
}

// READABLE:
async function autoCompactDispatcher(messages, sessionContext, memoryType) {
  if (parseBoolean(process.env.DISABLE_COMPACT)) {
    return { wasCompacted: false };
  }

  let currentTokens = countTokens(messages);
  // Check 80% threshold - leave buffer for next message
  if (currentTokens < TOKEN_LIMIT * 0.8) {
    return { wasCompacted: false };
  }

  // Try micro-compact first (fast, no API)
  let microResult = await microCompact(messages, sessionContext);
  if (microResult.wasCompacted) return microResult;

  // Fall back to full compact (uses LLM for summarization)
  return await fullCompact(messages, sessionContext, memoryType);
}
```

---

### Plan Mode Workflow (Module 12)

**Purpose:** Enable structured planning before implementation.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PLAN MODE STATE MACHINE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  User Request              ┌─────────────┐                              │
│       │                    │   NORMAL    │◄──────────────────┐          │
│       ▼                    │    MODE     │                   │          │
│  ┌─────────────┐           └──────┬──────┘                   │          │
│  │EnterPlanMode│                  │                          │          │
│  │   cTA()     │──────────────────┘                          │          │
│  └─────────────┘                                             │          │
│       │                                                      │          │
│       ▼                                                      │          │
│  ┌─────────────────────────────────────────────────┐         │          │
│  │                  PLAN MODE                       │         │          │
│  │  ┌─────────────────────────────────────────────┐│         │          │
│  │  │ Exploration Phase                           ││         │          │
│  │  │ - Spawn Explore agents (xq)                 ││         │          │
│  │  │ - Read files, search code                   ││         │          │
│  │  │ - Gather context                            ││         │          │
│  │  └─────────────────────────────────────────────┘│         │          │
│  │                      │                          │         │          │
│  │                      ▼                          │         │          │
│  │  ┌─────────────────────────────────────────────┐│         │          │
│  │  │ Planning Phase                              ││         │          │
│  │  │ - Spawn Plan agents (kWA)                   ││         │          │
│  │  │ - Write plan to file                        ││         │          │
│  │  │ - Design implementation approach            ││         │          │
│  │  └─────────────────────────────────────────────┘│         │          │
│  └─────────────────────────────────────────────────┘         │          │
│       │                                                      │          │
│       ▼                                                      │          │
│  ┌─────────────┐                                             │          │
│  │ExitPlanMode │                                             │          │
│  │   gq()      │─────────────────────────────────────────────┘          │
│  └─────────────┘                                                        │
│       │                                                                 │
│       ▼                                                                 │
│  ┌─────────────┐                                                        │
│  │User Approval│───No──► Back to Plan Mode                             │
│  └──────┬──────┘                                                        │
│         │ Yes                                                           │
│         ▼                                                               │
│  ┌─────────────┐                                                        │
│  │Implementation│                                                       │
│  │   Phase     │                                                        │
│  └─────────────┘                                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Functions:**
- `cTA` (EnterPlanModeTool) - Transition to plan mode
- `gq` (ExitPlanModeTool) - Exit plan mode with approval
- `xq` (ExploreAgent) - Codebase exploration agent
- `kWA` (PlanAgent) - Implementation planning agent

---

### Hook Workflow (Module 11)

**Purpose:** Execute custom scripts at lifecycle events.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           HOOK EXECUTION FLOW                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Event Trigger (12 types)                                               │
│  ├── PreToolUse      ├── PostToolUse     ├── Notification              │
│  ├── Stop            ├── SubagentStop    ├── PreCompact                │
│  ├── UserPromptSubmit├── SessionStart    └── (4 more)                  │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────┐                                                   │
│  │  qa() - Execute  │                                                   │
│  │  Hook Handler    │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │ Pattern Matching │                                                   │
│  │ tk3()            │                                                   │
│  │ - Exact: "Write" │                                                   │
│  │ - Pipe: "A|B|C"  │                                                   │
│  │ - Regex: /pat/   │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │ Spawn Process    │                                                   │
│  │ ek3()            │                                                   │
│  │ 60s timeout      │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│     ┌─────┴─────┐                                                       │
│     ▼           ▼                                                       │
│  ┌──────┐   ┌──────┐                                                    │
│  │stdout│   │stderr│                                                    │
│  │→block│   │→allow│                                                    │
│  └──────┘   └──────┘                                                    │
│     │                                                                   │
│     ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ Result Processing                                            │       │
│  │ - continue: Proceed with operation                           │       │
│  │ - block: Halt operation with reason                          │       │
│  │ - modify: Change tool input (PreToolUse only)                │       │
│  └──────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
```

**Hook Configuration Example:**
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "node /path/to/validator.js"
      }]
    }]
  }
}
```

---

### Tool Execution Workflow (Module 05)

**Purpose:** Execute tools with concurrency optimization.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       TOOL EXECUTION PIPELINE                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  tool_use blocks from API                                               │
│  [tool1, tool2, tool3, ...]                                             │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ Concurrency Grouping - mk3()                                 │       │
│  │ O(1) single pass: Group consecutive safe tools               │       │
│  │                                                              │       │
│  │ Safe tools: Read, Glob, Grep, WebFetch, WebSearch           │       │
│  │ Non-safe: Write, Edit, Bash(write), NotebookEdit            │       │
│  │                                                              │       │
│  │ Example: [Read, Glob, Write, Read, Glob]                    │       │
│  │ Groups:  [Read, Glob] → [Write] → [Read, Glob]              │       │
│  │          ─────┬─────    ───┬───   ─────┬─────               │       │
│  │          Parallel       Serial     Parallel                 │       │
│  └──────────────────────────────────────────────────────────────┘       │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ Permission Check - Per Tool                                  │       │
│  │                                                              │       │
│  │ ┌────────────┐    ┌────────────┐    ┌────────────┐          │       │
│  │ │ Allowed?   │─No→│ Permission │─No→│ Return     │          │       │
│  │ │ Pre-grant? │    │  Prompt    │    │  Error     │          │       │
│  │ └─────┬──────┘    └─────┬──────┘    └────────────┘          │       │
│  │       │Yes              │Yes                                 │       │
│  │       └────────┬────────┘                                    │       │
│  │                ▼                                             │       │
│  │ ┌────────────────────────────────────────────────────────┐  │       │
│  │ │ PreToolUse Hooks                                       │  │       │
│  │ │ qa("PreToolUse", {tool, input})                        │  │       │
│  │ │ - May block or modify input                            │  │       │
│  │ └────────────────────────────────────────────────────────┘  │       │
│  └──────────────────────────────────────────────────────────────┘       │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ Tool Execution - EV0()                                       │       │
│  │                                                              │       │
│  │ Parallel group: Promise.all([tool1(), tool2(), ...])        │       │
│  │ Serial tool: await tool()                                    │       │
│  │                                                              │       │
│  │ For file-modifying tools:                                    │       │
│  │ - Sandbox wrapper ($44) if enabled                           │       │
│  │ - macOS: sandbox-exec (Tm0)                                  │       │
│  │ - Linux: bwrap (qm0)                                         │       │
│  └──────────────────────────────────────────────────────────────┘       │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ PostToolUse Hooks                                            │       │
│  │ qa("PostToolUse", {tool, input, result})                     │       │
│  └──────────────────────────────────────────────────────────────┘       │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ Context Modifiers                                            │       │
│  │ - File tracking updates                                      │       │
│  │ - Todo list updates                                          │       │
│  │ - Git status refresh                                         │       │
│  └──────────────────────────────────────────────────────────────┘       │
│         │                                                               │
│         ▼                                                               │
│  Return tool_result to API                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

**Code Snippet - Concurrency Grouping:**
```javascript
// ============================================
// mk3 - Tool Concurrency Grouping Algorithm
// Location: chunks.135.mjs:500-550
// ============================================

// READABLE:
function groupToolsForConcurrency(toolUseBlocks) {
  const groups = [];
  let currentGroup = [];
  let currentGroupIsSafe = true;

  for (const block of toolUseBlocks) {
    const isSafe = isToolSafeForParallel(block.name);

    if (currentGroup.length === 0) {
      // Start new group
      currentGroup.push(block);
      currentGroupIsSafe = isSafe;
    } else if (isSafe && currentGroupIsSafe) {
      // Add to existing safe group (parallel execution)
      currentGroup.push(block);
    } else {
      // Flush current group, start new one
      groups.push({
        tools: currentGroup,
        parallel: currentGroupIsSafe && currentGroup.length > 1
      });
      currentGroup = [block];
      currentGroupIsSafe = isSafe;
    }
  }

  // Flush final group
  if (currentGroup.length > 0) {
    groups.push({
      tools: currentGroup,
      parallel: currentGroupIsSafe && currentGroup.length > 1
    });
  }

  return groups;
}

function isToolSafeForParallel(toolName) {
  const SAFE_TOOLS = ['Read', 'Glob', 'Grep', 'WebFetch', 'WebSearch'];
  return SAFE_TOOLS.includes(toolName);
}
```

---

### Slash Command Workflow (Module 09)

**Purpose:** Process `/command` inputs from users.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      SLASH COMMAND PIPELINE                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  User Input: "/review-pr 123"                                           │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────┐                                                   │
│  │ Parse Command    │                                                   │
│  │ _P2()            │                                                   │
│  │ - Extract name   │                                                   │
│  │ - Extract args   │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │ Resolve Command  │                                                   │
│  │ 3 sources:       │                                                   │
│  │ - Built-in       │                                                   │
│  │ - .claude/cmds/  │                                                   │
│  │ - MCP servers    │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│     ┌─────┴─────┬─────────┬─────────┐                                   │
│     ▼           ▼         ▼         ▼                                   │
│  ┌──────┐  ┌────────┐ ┌───────┐ ┌──────┐                               │
│  │Built-│  │ Local  │ │  MCP  │ │ Not  │                               │
│  │  in  │  │ .md    │ │Command│ │Found │                               │
│  └──┬───┘  └───┬────┘ └───┬───┘ └──┬───┘                               │
│     │          │          │        │                                    │
│     ▼          ▼          ▼        ▼                                    │
│  Execute   Expand      Call MCP  Error                                  │
│  directly  template    server    message                                │
│     │          │          │                                             │
│     └──────────┴──────────┘                                             │
│                │                                                        │
│                ▼                                                        │
│  ┌──────────────────┐                                                   │
│  │ Serial Queue     │                                                   │
│  │ nf5()            │                                                   │
│  │ One at a time    │                                                   │
│  └──────────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Built-in Commands:**
| Command | Description |
|---------|-------------|
| `/help` | Show help information |
| `/clear` | Clear conversation |
| `/compact` | Manually trigger compaction |
| `/cost` | Show token/cost usage |
| `/doctor` | Run health diagnostics |
| `/init` | Initialize CLAUDE.md |
| `/memory` | Manage memory files |
| `/permissions` | View/modify permissions |
| `/status` | Show session status |

---

### Skill Workflow (Module 10)

**Purpose:** Load and execute specialized capabilities.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SKILL LOADING FLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Skill Request                                                          │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ 3-Tier Loading System                                        │       │
│  │                                                              │       │
│  │  Tier 1: Built-in Skills                                    │       │
│  │  └── Bundled with Claude Code                               │       │
│  │      Examples: pdf, xlsx, image-analysis                    │       │
│  │                                                              │       │
│  │  Tier 2: Local Skills                                       │       │
│  │  └── .claude/skills/ directory                              │       │
│  │      User-defined skill files                               │       │
│  │                                                              │       │
│  │  Tier 3: MCP Skills                                         │       │
│  │  └── Via MCP resource:// protocol                           │       │
│  │      Remote skill definitions                               │       │
│  └──────────────────────────────────────────────────────────────┘       │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────┐                                                   │
│  │ XK0() - Load     │                                                   │
│  │ Skill Content    │                                                   │
│  │ - Parse manifest │                                                   │
│  │ - Load prompts   │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │ Token Budget     │                                                   │
│  │ OWA() - Truncate │                                                   │
│  │ if exceeds limit │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │ ln() - SkillTool │                                                   │
│  │ Inject into      │                                                   │
│  │ conversation     │                                                   │
│  └──────────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Subagent Workflow (Module 08)

**Purpose:** Spawn autonomous subprocess agents.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SUBAGENT EXECUTION                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Main Agent                                                             │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────┐                                                   │
│  │ jn() - TaskTool  │                                                   │
│  │ Parameters:      │                                                   │
│  │ - prompt         │                                                   │
│  │ - subagent_type  │                                                   │
│  │ - model (opt)    │                                                   │
│  │ - background     │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│           ▼                                                             │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ Agent Type Resolution                                        │       │
│  │                                                              │       │
│  │ Built-in types:                                              │       │
│  │ - "general-purpose": Full tool access                       │       │
│  │ - "Explore": Read-only, codebase search                     │       │
│  │ - "Plan": Architecture planning                             │       │
│  │ - "claude-code-guide": Documentation lookup                 │       │
│  │                                                              │       │
│  │ Custom types: Loaded from agents definitions                │       │
│  └──────────────────────────────────────────────────────────────┘       │
│           │                                                             │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │ XY1() - Execute  │                                                   │
│  │ Subagent         │                                                   │
│  │ - Fork context   │                                                   │
│  │ - Isolated state │                                                   │
│  │ - Own token pool │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│     ┌─────┴─────┐                                                       │
│     ▼           ▼                                                       │
│  ┌──────┐   ┌──────────┐                                               │
│  │ Sync │   │Background│                                               │
│  │ Wait │   │ Continue │                                               │
│  └──┬───┘   └────┬─────┘                                               │
│     │            │                                                      │
│     │            ▼                                                      │
│     │     ┌────────────────┐                                           │
│     │     │AgentOutputTool │                                           │
│     │     │Retrieve later  │                                           │
│     │     └────────────────┘                                           │
│     │                                                                   │
│     ▼                                                                   │
│  Return result to main agent                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

**Subagent Characteristics:**
- **Stateless:** Each invocation is independent
- **Isolated:** Own conversation context
- **Forked:** Inherits parent's context at spawn time
- **Limited:** Restricted tool access based on type

---

### LLM API Workflow (Module 03)

**Purpose:** Handle Claude API calls with streaming and retry.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     5-PHASE API EXECUTION                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Phase 1: Request Preparation                                           │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ - Build messages array with cache_control                    │       │
│  │ - System prompts: ALL get ephemeral cache_control            │       │
│  │ - User messages: Last 3 have NO cache_control                │       │
│  │ - Earlier messages: GET ephemeral cache_control              │       │
│  └──────────────────────────────────────────────────────────────┘       │
│         │                                                               │
│         ▼                                                               │
│  Phase 2: API Call                                                      │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ $E9() - streamApiCall                                        │       │
│  │ - POST to /v1/messages                                       │       │
│  │ - stream: true                                               │       │
│  │ - Handle SSE events                                          │       │
│  └──────────────────────────────────────────────────────────────┘       │
│         │                                                               │
│         ▼                                                               │
│  Phase 3: Stream Processing                                             │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ Event types:                                                 │       │
│  │ - message_start: Initialize response                         │       │
│  │ - content_block_start: New content block                     │       │
│  │ - content_block_delta: Streaming text/thinking               │       │
│  │ - content_block_stop: Block complete                         │       │
│  │ - message_delta: Usage stats                                 │       │
│  │ - message_stop: Response complete                            │       │
│  └──────────────────────────────────────────────────────────────┘       │
│         │                                                               │
│         ▼                                                               │
│  Phase 4: Error Handling                                                │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ t61() - Retry with exponential backoff                       │       │
│  │                                                              │       │
│  │ Retry Conditions:                                            │       │
│  │ - 429 (Rate limit): Wait Retry-After header                 │       │
│  │ - 500-599: Server error, exponential backoff                │       │
│  │ - 529 (Overloaded): Extended wait                           │       │
│  │ - Network errors: Retry with backoff                        │       │
│  │                                                              │       │
│  │ Backoff: min(initial * 2^attempt, maxDelay)                 │       │
│  │ Default: 1s, 2s, 4s, 8s, ... up to 60s                      │       │
│  │ Max attempts: 5 (configurable)                              │       │
│  └──────────────────────────────────────────────────────────────┘       │
│         │                                                               │
│         ▼                                                               │
│  Phase 5: Response Integration                                          │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ - Add assistant message to conversation                      │       │
│  │ - Process tool_use blocks                                    │       │
│  │ - Update token counters                                      │       │
│  │ - Trigger post-response hooks                                │       │
│  └──────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
```

**Code Snippet - Retry Logic:**
```javascript
// ============================================
// t61 - Exponential Backoff Retry
// Location: chunks.135.mjs:200-250
// ============================================

// READABLE:
async function retryWithBackoff(apiCall, options = {}) {
  const {
    maxRetries = 5,
    initialDelay = 1000,
    maxDelay = 60000,
    retryableErrors = [429, 500, 502, 503, 504, 529]
  } = options;

  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await apiCall();
    } catch (error) {
      attempt++;

      if (!isRetryable(error, retryableErrors) || attempt >= maxRetries) {
        throw error;
      }

      // Calculate delay with exponential backoff
      let delay = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay);

      // Use Retry-After header if present (for 429)
      if (error.status === 429 && error.headers?.['retry-after']) {
        delay = parseInt(error.headers['retry-after']) * 1000;
      }

      // Add jitter to prevent thundering herd
      delay = delay * (0.5 + Math.random() * 0.5);

      await sleep(delay);
    }
  }
}
```

---

### Todo System Workflow (Module 13)

**Purpose:** Enforce task tracking throughout conversation.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     TODO ENFORCEMENT STRATEGY                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  5-Layer Enforcement:                                                   │
│                                                                         │
│  Layer 1: System Prompt Injection                                       │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ "You have access to the TodoWrite tool..."                   │       │
│  │ "Use these tools VERY frequently..."                         │       │
│  │ Instructs model to proactively use todos                     │       │
│  └──────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  Layer 2: Context Modifier                                              │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ _H5() - Inject current todos into context                    │       │
│  │ After every message, todos are re-injected                   │       │
│  │ Model always sees current todo state                         │       │
│  └──────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  Layer 3: Hidden Reminder System                                        │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ Nh() - Add <system-reminder> tags                            │       │
│  │ "Your todo list has changed..."                              │       │
│  │ "Continue with tasks if applicable"                          │       │
│  │ Hidden from user display, visible to model                   │       │
│  └──────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  Layer 4: Tool Definition Emphasis                                      │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ BY() - TodoWriteTool definition                              │       │
│  │ Long description with examples and use cases                 │       │
│  │ Detailed parameter descriptions                              │       │
│  └──────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  Layer 5: Post-Completion Reminders                                     │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ After tool results, inject reminder                          │       │
│  │ "Mark todos as completed immediately"                        │       │
│  │ "Don't batch completions"                                    │       │
│  └──────────────────────────────────────────────────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### MCP Integration Workflow (Module 06)

**Purpose:** Connect and communicate with MCP servers.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     MCP CLIENT LIFECYCLE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Startup                                                                │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────┐                                                   │
│  │ $21() - Init     │                                                   │
│  │ MCP Manager      │                                                   │
│  │ - Read configs   │                                                   │
│  │ - Parse servers  │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│           ▼                                                             │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ D1A() - Batch Connection                                     │       │
│  │                                                              │       │
│  │ For each server in parallel:                                 │       │
│  │ ┌────────────────────────────────────────────────────────┐  │       │
│  │ │ 1. Spawn process (stdio) or connect (SSE)              │  │       │
│  │ │ 2. Initialize MCP client                               │  │       │
│  │ │ 3. Call tools/list to enumerate tools                  │  │       │
│  │ │ 4. Call resources/list to enumerate resources          │  │       │
│  │ │ 5. Register tools with prefix: mcp__serverName__tool   │  │       │
│  │ └────────────────────────────────────────────────────────┘  │       │
│  │                                                              │       │
│  │ Timeout: 30s per server                                     │       │
│  │ Failure: Log warning, continue with remaining servers       │       │
│  └──────────────────────────────────────────────────────────────┘       │
│           │                                                             │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │ Ready for calls  │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│           ▼                                                             │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ y32() - Tool Invocation                                      │       │
│  │                                                              │       │
│  │ 1. Parse tool name: mcp__serverName__toolName               │       │
│  │ 2. Route to correct MCP client                              │       │
│  │ 3. Call tools/call with input                               │       │
│  │ 4. Handle response (text, image, resource)                  │       │
│  │ 5. Apply token-based truncation if needed                   │       │
│  └──────────────────────────────────────────────────────────────┘       │
│           │                                                             │
│           ▼                                                             │
│  Shutdown                                                               │
│  ┌──────────────────┐                                                   │
│  │ Close all clients│                                                   │
│  │ Kill processes   │                                                   │
│  └──────────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Sandbox Execution Workflow (Module 18)

**Purpose:** Isolate tool execution for security.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     SANDBOX ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Tool Execution Request                                                 │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────┐                                                   │
│  │ $44() - Init     │                                                   │
│  │ Sandbox Check    │                                                   │
│  │ - Enabled?       │                                                   │
│  │ - Platform?      │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│     ┌─────┴─────┬─────────────┐                                         │
│     ▼           ▼             ▼                                         │
│  ┌──────┐   ┌──────┐     ┌──────────┐                                  │
│  │macOS │   │Linux │     │ Disabled │                                  │
│  │      │   │      │     │          │                                  │
│  └──┬───┘   └──┬───┘     └────┬─────┘                                  │
│     │          │              │                                         │
│     ▼          ▼              ▼                                         │
│  ┌──────────────────┐  ┌──────────────────┐  Direct execution          │
│  │ Tm0() - Seatbelt │  │ qm0() - bwrap    │                            │
│  │                  │  │                  │                            │
│  │ sandbox-exec     │  │ bubblewrap       │                            │
│  │ with profile:    │  │ with:            │                            │
│  │ - allow-read     │  │ - bind mounts    │                            │
│  │ - deny-write     │  │ - ro-bind /      │                            │
│  │   (except dirs)  │  │ - bind allowed   │                            │
│  │ - deny-network   │  │ - seccomp        │                            │
│  │   (optional)     │  │ - unshare-net    │                            │
│  └──────────────────┘  └──────────────────┘                            │
│           │                    │                                        │
│           └────────┬───────────┘                                        │
│                    ▼                                                    │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ Sandboxed Process Execution                                  │       │
│  │                                                              │       │
│  │ Allowed:                                                     │       │
│  │ - Read from anywhere                                         │       │
│  │ - Write to allowed directories only                         │       │
│  │ - Execute whitelisted binaries                              │       │
│  │                                                              │       │
│  │ Denied:                                                      │       │
│  │ - Write to system directories                               │       │
│  │ - Network access (if sandbox strict)                        │       │
│  │ - Access to sensitive paths (~/.ssh, etc.)                  │       │
│  └──────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Telemetry Workflow (Module 17)

**Purpose:** Track events and metrics for observability.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     MULTI-DESTINATION TELEMETRY                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Event Source                                                           │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ Event Types (429+ defined)                                   │       │
│  │                                                              │       │
│  │ Categories:                                                  │       │
│  │ - CLI events: cli_*, tengu_*                                │       │
│  │ - Tool events: tool_use, tool_result                        │       │
│  │ - API events: api_call, api_error                           │       │
│  │ - Session events: session_start, session_end                │       │
│  │ - Performance: latency, token_usage                         │       │
│  └──────────────────────────────────────────────────────────────┘       │
│         │                                                               │
│         ▼                                                               │
│  ┌──────────────────┐                                                   │
│  │ Event Dispatch   │                                                   │
│  │                  │                                                   │
│  │ GA() - Analytics │                                                   │
│  │ eu() - Track     │                                                   │
│  │ M9() - Marker    │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│     ┌─────┴─────┬─────────────┬─────────────┐                           │
│     ▼           ▼             ▼             ▼                           │
│  ┌──────┐   ┌──────┐     ┌──────┐     ┌──────────┐                     │
│  │Sentry│   │Segment│    │Statsig│    │ Datadog  │                     │
│  │      │   │       │    │       │    │(internal)│                     │
│  └──────┘   └───────┘    └───────┘    └──────────┘                     │
│                                                                         │
│  Batching: Events queued, flushed periodically                         │
│  Sampling: Not all events sent (configurable)                          │
│  Privacy: PII stripped before sending                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Summary of Key Workflows

### 1. Startup → Interactive Mode
```
mu3() → hu3() → preAction hooks → parse CLI →
load MCP → load plugins → VG(WVA) → render UI →
user input loop → shutdown
```

### 2. Startup → Non-Interactive Mode
```
mu3() → hu3() → preAction hooks → parse CLI →
load MCP → Rw9() → process stdin → agentic loop →
stream stdout → shutdown
```

### 3. Tool Execution Flow
```
User message → Claude API → tool_use block →
permission check → execute tool → tool_result →
continue turn → final response
```

### 4. Session Resume Flow
```
--continue flag → load last session → restore messages →
restore file history → render UI with history →
continue from last state
```

## Timing and Performance Notes

**Initialization Phases:**
- Fast path (version): <10ms
- Full initialization: 100-500ms
  - Config loading: 20-50ms
  - MCP client initialization: 50-200ms
  - Plugin loading: 30-100ms
  - Ink.js setup: 20-50ms

**Main Loop:**
- API call latency: 200-2000ms
- Tool execution: varies (1ms-10s)
- Render update: 1-5ms

**Shutdown:**
- Graceful shutdown: 50-200ms
- Force shutdown: <50ms

## Configuration Flow

```
Command Line Args (highest priority)
      │
      ▼
Environment Variables
      │
      ▼
Local Config (.claude/config.json)
      │
      ▼
Project Config (.mcp.json)
      │
      ▼
User Config (~/.config/claude/settings.json)
      │
      ▼
Default Values (lowest priority)
```

## Error Handling

**Error Propagation:**
```
Error occurs
      │
      ▼
Component error boundary (React)
      │
      ├─► Recoverable → Display error in UI
      │
      └─► Fatal → handleExit()
                      │
                      ├─► Cleanup
                      ├─► Log error
                      └─► Exit with code
```

**Non-Interactive Error Handling:**
```
Error occurs
      │
      ▼
Stream error event to stdout
      │
      {
        "type": "error",
        "error": "...",
        "code": "..."
      }
      │
      ▼
Exit with non-zero code
```

This comprehensive workflow documentation covers the complete lifecycle of Claude Code from startup to shutdown, detailing both interactive and non-interactive execution paths with code examples and explanations.

---

> **Back to Part 1:** [workflow_main.md](./workflow_main.md) for Lifecycle, Startup, Initialization, and Mode Selection.
