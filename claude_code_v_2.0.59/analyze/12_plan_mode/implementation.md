# Plan Mode Implementation

## Overview

Plan Mode is a read-only exploration and planning phase in Claude Code where the assistant focuses on understanding the codebase and designing implementation strategies before writing code. It provides a structured workflow for complex tasks requiring upfront planning.

## Plan Mode Workflow

### Phase 1: Entering Plan Mode

Plan mode is entered via the **EnterPlanMode** tool.

**From chunks.130.mjs:2370-2398:**
```javascript
async call(A, Q) {
  let B = e1();
  if (Q.agentId !== B) throw Error("EnterPlanMode tool cannot be used in agent contexts");
  return {
    data: {
      message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
    }
  }
},

mapToolResultToToolResultBlockParam({
  message: A
}, Q) {
  return {
    type: "tool_result",
    content: `${A}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
    tool_use_id: Q
  }
}
```

**Key Properties:**
- **Read-only**: Tool is marked as `isReadOnly() { return !0 }`
- **Main thread only**: Cannot be used in agent contexts (subagents)
- **Permission required**: Uses `checkPermissions` with "ask" behavior
- **Mode transition**: Sets session mode to "plan"

### Phase 2: User Confirmation

**From chunks.130.mjs:2401-2449:**
```javascript
function Dd2({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B
}) {
  function G(Z) {
    if (Z === "yes") Q(), A.onAllow({}, [{
      type: "setMode",
      mode: "plan",
      destination: "session"
    }]);
    else Q(), B(), A.onReject()
  }

  return C$.default.createElement(uJ, {
    color: "planMode",
    title: "Enter plan mode?"
  }, /* UI elements */
    C$.default.createElement($, null, "Claude wants to enter plan mode to explore and design an implementation approach."),
    C$.default.createElement($, {
      dimColor: !0
    }, "In plan mode, Claude will:"),
    C$.default.createElement($, {
      dimColor: !0
    }, " · Explore the codebase thoroughly"),
    C$.default.createElement($, {
      dimColor: !0
    }, " · Identify existing patterns"),
    C$.default.createElement($, {
      dimColor: !0
    }, " · Design an implementation strategy"),
    C$.default.createElement($, {
      dimColor: !0
    }, " · Present a plan for your approval"),
    C$.default.createElement($, {
      dimColor: !0
    }, "No code changes will be made until you approve the plan.")
  )
}
```

**Confirmation UI:**
- Displays reason for entering plan mode
- Shows what Claude will do in plan mode
- User chooses: "Yes, enter plan mode" or "No, start implementing now"
- On approval, session mode is set to "plan"

### Phase 3: Planning Activities

During plan mode, Claude operates with restrictions:

**Plan Agent System Prompt (chunks.125.mjs:1425-1474):**
```javascript
ii5 = `You are a software architect and planning specialist for Claude Code. Your role is to explore the codebase and design implementation plans.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to explore the codebase and design implementation plans. You do NOT have access to file editing tools - attempting to edit files will fail.

## Your Process

1. **Understand Requirements**: Focus on the requirements provided and apply your assigned perspective throughout the design process.

2. **Explore Thoroughly**:
   - Read any files provided to you in the initial prompt
   - Find existing patterns and conventions using ${iK}, ${xY}, and ${d5}
   - Understand the current architecture
   - Identify similar features as reference
   - Trace through relevant code paths
   - Use ${C9} ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
   - NEVER use ${C9} for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification

3. **Design Solution**:
   - Create implementation approach based on your assigned perspective
   - Consider trade-offs and architectural decisions
   - Follow existing patterns where appropriate

4. **Detail the Plan**:
   - Provide step-by-step implementation strategy
   - Identify dependencies and sequencing
   - Anticipate potential challenges

## Required Output

End your response with:

### Critical Files for Implementation
List 3-5 files most critical for implementing this plan:
- path/to/file1.ts - [Brief reason: e.g., "Core logic to modify"]
- path/to/file2.ts - [Brief reason: e.g., "Interfaces to implement"]
- path/to/file3.ts - [Brief reason: e.g., "Pattern to follow"]

REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files. You do NOT have access to file editing tools.`
```

**Disallowed Tools in Plan Mode:**
```javascript
disallowedTools: [A6, P51, $5, wX, JS]
// A6 = Write
// P51 = Edit
// $5 = NotebookEdit
// wX = (likely another write tool)
// JS = (likely another write tool)
```

**Allowed Activities:**
- Read files (Read tool)
- Search code (Grep tool)
- Find files (Glob tool)
- Read-only Bash commands (ls, cat, git status, git diff, etc.)
- Ask user questions (AskUserQuestion tool)

### Phase 4: Exiting Plan Mode

Plan mode is exited via the **ExitPlanMode** tool.

**From chunks.130.mjs:1700-1731:**
```javascript
TXZ = `Use this tool when you are in plan mode and have finished presenting your plan and are ready to code. This will prompt the user to exit plan mode.

IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Handling Ambiguity in Plans
Before using this tool, ensure your plan is clear and unambiguous. If there are multiple valid approaches or unclear requirements:
1. Use the ${pJ} tool to clarify with the user
2. Ask about specific implementation choices (e.g., architectural patterns, which library to use)
3. Clarify any assumptions that could affect the implementation
4. Only proceed with ExitPlanMode after resolving ambiguities

## Examples

1. Initial task: "Search for and understand the implementation of vim mode in the codebase" - Do not use the exit plan mode tool because you are not planning the implementation steps of a task.
2. Initial task: "Help me implement yank mode for vim" - Use the exit plan mode tool after you have finished planning the implementation steps of the task.
3. Initial task: "Add a new feature to handle user authentication" - If unsure about auth method (OAuth, JWT, etc.), use ${pJ} first, then use exit plan mode tool after clarifying the approach.
`

am2 = `Use this tool when you are in plan mode and have finished writing your plan to the plan file and are ready for user approval.

## How This Tool Works
- You should have already written your plan to the plan file specified in the plan mode system message
- This tool will prompt the user to review and approve your plan
- If approved, you'll exit plan mode and begin implementation

## When to Use This Tool
IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Handling Ambiguity in Plans
Before using this tool, ensure your plan is clear and unambiguous. If there are multiple valid approaches or unclear requirements:
1. Use the ${pJ} tool to clarify with the user
2. Ask about specific implementation choices (e.g., architectural patterns, which library to use)
...`
```

**Two Variants of ExitPlanMode:**
1. **Simple variant (TXZ)**: Present plan inline and exit
2. **File-based variant (am2)**: Write plan to file first, then exit

## Plan File Handling

### Plan File Location

Plans are stored in `.claude/plans/` directory:

**From chunks.107.mjs:1282-1290:**
```javascript
function XQ0(A) {
  let Q = xU(A);
  if (!Q) return null;
  let B = yU(A);
  return l9({
    type: "plan_file_reference",
    planFilePath: B,
    planContent: Q
  })
}
```

**Plan File Structure:**
```
.claude/
└── plans/
    ├── plan-[session-id].md
    └── ...
```

### Plan File in Compaction

Plans are preserved during conversation compaction:

**From chunks.107.mjs:1282-1291:**
```javascript
function XQ0(A) {
  let Q = xU(A);  // Get plan content for agent/session
  if (!Q) return null;
  let B = yU(A);  // Get plan file path
  return l9({
    type: "plan_file_reference",
    planFilePath: B,
    planContent: Q
  })
}

// Called during compaction (line 1200)
let T = XQ0(Q.agentId);
if (T) N.push(T);
```

Plans are attached to the conversation after compaction to maintain context.

## Integration with Explore and Plan Agents

### Explore Agent

**From chunks.125.mjs:1404-1413:**
```javascript
xq = {
  agentType: "Explore",
  whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.',
  disallowedTools: [A6, P51, $5, wX, JS],  // No write tools
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",
  getSystemPrompt: () => li5,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}
```

**Purpose**: Fast codebase exploration for plan mode
- Uses Haiku model for speed
- Read-only tools (Grep, Glob, Read, Bash)
- Optimized for parallel tool usage
- Lightweight for quick searches

### Plan Agent

**From chunks.125.mjs:1474-1484:**
```javascript
kWA = {
  agentType: "Plan",
  whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
  disallowedTools: [A6, P51, $5, wX, JS],  // No write tools
  source: "built-in",
  tools: xq.tools,  // Same tools as Explore agent
  baseDir: "built-in",
  model: "inherit",  // Uses session model (often Sonnet)
  getSystemPrompt: () => ii5,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}
```

**Purpose**: Software architecture and planning
- Inherits session model (usually more capable than Haiku)
- Same read-only tool restrictions as Explore
- Structured planning system prompt
- Outputs critical files list

### Agent Coordination

**From chunks.153.mjs (environment variables):**
```javascript
if (process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT) {
  let B = parseInt(process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT, 10);
  // Configure number of Plan agents
}

if (process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT) {
  let A = parseInt(process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT, 10);
  // Configure number of Explore agents
}
```

Multiple agents can be launched in parallel for planning:
- Multiple Explore agents for comprehensive codebase scanning
- Multiple Plan agents for considering different architectural approaches
- Environment variables control agent parallelism

**From chunks.153.mjs:2923:**
```
- **Default**: Launch at least 1 Plan agent for most tasks - it helps validate your understanding and consider alternatives
```

## Restrictions During Plan Mode

### Tool Restrictions

**Disallowed Tools:**
- `Write` - Cannot create files
- `Edit` - Cannot modify files
- `NotebookEdit` - Cannot edit notebooks
- Git operations (add, commit, push)
- Package managers (npm install, pip install)
- File operations (mkdir, touch, rm, cp, mv)

**Allowed Tools:**
- `Read` - Read file contents
- `Grep` - Search code
- `Glob` - Find files by pattern
- `Bash` - Read-only commands only (ls, cat, git status, git diff, git log, find, head, tail)
- `AskUserQuestion` - Clarify requirements
- `Task` - Spawn subagents (with same restrictions)

### Bash Command Restrictions

**From chunks.125.mjs:1451-1452:**
```
- Use ${C9} ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
- NEVER use ${C9} for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification
```

Bash tool is available but restricted to read-only operations.

## Plan Mode State Management

### Mode Setting

**From chunks.130.mjs:2407-2410:**
```javascript
if (Z === "yes") Q(), A.onAllow({}, [{
  type: "setMode",
  mode: "plan",
  destination: "session"
}]);
```

Mode is set at session level using state management actions.

### Mode Checking

Plan mode state is stored in session and can be checked to determine available tools and behaviors.

## Plan File Management

### PreCompact Hook for Plan Preservation

**From chunks.147.mjs:600-629:**
```javascript
// ============================================
// FQ0 - Execute PreCompact hooks
// Location: chunks.147.mjs:600
// ============================================
async function FQ0(compactInput, signal, timeoutMs = ZN) {
  let hookInput = {
      ...tE(undefined),
      hook_event_name: "PreCompact",
      trigger: compactInput.trigger,
      custom_instructions: compactInput.customInstructions
    },
    results = await kV0({
      hookInput,
      matchQuery: compactInput.trigger,
      signal,
      timeoutMs
    });

  if (results.length === 0) return {};

  // Collect successful outputs for custom instructions
  let newInstructions = results
      .filter((r) => r.succeeded && r.output.trim().length > 0)
      .map((r) => r.output.trim()),
    displayMessages = [];

  // Build display messages
  for (let result of results) {
    if (result.succeeded) {
      if (result.output.trim()) {
        displayMessages.push(
          `PreCompact [${result.command}] completed successfully: ${result.output.trim()}`
        );
      } else {
        displayMessages.push(`PreCompact [${result.command}] completed successfully`);
      }
    } else if (result.output.trim()) {
      displayMessages.push(`PreCompact [${result.command}] failed: ${result.output.trim()}`);
    } else {
      displayMessages.push(`PreCompact [${result.command}] failed`);
    }
  }

  return {
    newCustomInstructions: newInstructions.length > 0 ? newInstructions.join('\n\n') : undefined,
    userDisplayMessage: displayMessages.length > 0 ? displayMessages.join('\n') : undefined
  };
}
```

**PreCompact Hook Purpose:**
- Executed before context compaction
- Can inject custom instructions to preserve important context
- Returns new custom instructions and display messages
- Used to maintain plan context across compaction

## Configuration Options

### Environment Variables

```bash
# Control number of Plan agents spawned
CLAUDE_CODE_PLAN_V2_AGENT_COUNT=3

# Control number of Explore agents spawned
CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT=5
```

### Agent Configuration

Plan and Explore agents can be customized through agent definitions:

```markdown
---
name: custom-plan
type: Plan
model: claude-sonnet-4-5-20250929
tools: ["Read", "Grep", "Glob", "Bash", "AskUserQuestion"]
---

Custom planning system prompt...
```

## Summary

Plan Mode provides a structured workflow for complex implementation tasks:

1. **Entry**: EnterPlanMode tool with user confirmation
2. **Exploration**: Read-only codebase analysis using Explore agents
3. **Planning**: Architectural design using Plan agents
4. **Documentation**: Plan written to `.claude/plans/` directory
5. **Exit**: ExitPlanMode tool presents plan for user approval
6. **Implementation**: On approval, exit plan mode and begin coding

**Key Benefits:**
- Forces upfront thinking before code changes
- Prevents premature implementation
- Encourages exploration of existing patterns
- Supports parallel exploration via multiple agents
- Maintains plan context through conversation compaction
- Clear separation between planning and implementation phases
