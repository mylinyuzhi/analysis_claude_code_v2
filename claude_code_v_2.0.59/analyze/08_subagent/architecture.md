# Claude Code v2.0.59 - Subagent Architecture

## Overview

Claude Code implements a sophisticated **subagent system** that allows the main agent to delegate complex, multi-step tasks to specialized sub-agents. This architecture enables parallel task execution, specialized expertise, and efficient handling of complex workflows.

## Core Concepts

### What is a Subagent?

A **subagent** is a specialized, autonomous AI agent that:
- Runs as a subprocess separate from the main conversation
- Has its own set of tools and capabilities
- Executes a specific task independently
- Returns a single final report to the main agent
- Is stateless - cannot receive additional messages after spawning

### Task Tool

The subagent system is accessed through the **Task tool** (internal name: `A6 = "Task"`), which allows the main agent to spawn subagents.

**Location**: `/Users/linyuzhi/codespace/myagent/analyze/cc/analysis_claude_code/claude_code_v_2.0.59/source/chunks.19.mjs` (line 2156)

```javascript
A6 = "Task"  // Task tool name constant
```

## Agent Definition Structure

Each agent is defined with the following properties:

```javascript
{
  agentType: string,          // Unique identifier (e.g., "general-purpose", "Explore")
  whenToUse: string,         // Description of when to use this agent
  tools: Array<string>,      // Tools available to the agent (["*"] = all tools)
  disallowedTools: Array,    // Tools explicitly blocked (optional)
  source: string,            // "built-in", "plugin", "userSettings", etc.
  baseDir: string,           // Base directory for the agent
  model: string,             // Model to use: "sonnet", "haiku", "opus", "inherit"
  color: string,             // UI color for the agent (optional)
  permissionMode: string,    // "dontAsk" or default (optional)
  forkContext: boolean,      // Whether agent can access conversation history (optional)
  getSystemPrompt: function, // Function that returns the system prompt
  criticalSystemReminder_EXPERIMENTAL: string  // Critical reminder (optional)
}
```

### Key Properties

**agentType**
- Unique identifier for the agent
- Can be simple ("Explore") or namespaced ("plugin:my-agent")
- Used to select which agent to spawn

**whenToUse**
- Natural language description of when this agent should be used
- Shown to the main agent to help it decide which agent to use
- Can include proactive usage instructions

**tools**
- Array of tool names the agent can use
- `["*"]` grants access to all available tools
- Specific tools: `["Glob", "Grep", "Read", "Bash"]`

**disallowedTools**
- Tools explicitly blocked for this agent
- Used for read-only agents to prevent modifications
- Example: `[Write, Edit, NotebookEdit, Bash]` for Explore agent

**model**
- `"sonnet"` - Claude Sonnet (default for most agents)
- `"haiku"` - Claude Haiku (faster, for quick tasks)
- `"opus"` - Claude Opus (most capable)
- `"inherit"` - Use same model as parent agent

**forkContext**
- When `true`, agent receives full conversation history before the tool call
- Allows concise prompts that reference earlier context
- When `false`, agent only sees the prompt passed to it

## Agent Spawning Mechanism

### Via Task Tool

The main agent spawns subagents using the Task tool with parameters:

```
Task tool parameters:
- subagent_type: string    // Which agent to spawn (e.g., "Explore")
- prompt: string           // Detailed task description for the agent
- resume: string           // (Optional) ID of existing agent to resume
- background: boolean      // (Optional) Run in background
```

### Task Tool Description (shown to main agent)

**Location**: `/Users/linyuzhi/codespace/myagent/analyze/cc/analysis_claude_code/claude_code_v_2.0.59/source/chunks.125.mjs` (lines 988-1057)

This is the COMPLETE description that the main agent sees when it has access to the Task tool:

```javascript
// ============================================
// ob2 - Generate Task Tool Description
// Location: chunks.125.mjs:988-1057
// ============================================
async function ob2(A) {
  // A = array of available agent definitions

  // Build list of available agents
  let Q = A.map((B) => {
    let G = "";
    if (B?.forkContext) {
      G = "Properties: " + (B?.forkContext ? "access to current context; " : "");
    }
    let Z = B.tools ? B.tools.join(", ") : "All tools";
    return `- ${B.agentType}: ${B.whenToUse} (${G}Tools: ${Z})`
  }).join(`
`);

  return `Launch a new agent to handle complex, multi-step tasks autonomously.

The ${A6} tool launches specialized agents (subprocesses) that autonomously handle complex tasks. Each agent type has specific capabilities and tools available to it.

Available agent types and the tools they have access to:
${Q}

When using the ${A6} tool, you must specify a subagent_type parameter to select which agent type to use.

When NOT to use the ${A6} tool:
- If you want to read a specific file path, use the ${n8.name} or ${zO.name} tool instead of the ${A6} tool, to find the match more quickly
- If you are searching for a specific class definition like "class Foo", use the ${zO.name} tool instead, to find the match more quickly
- If you are searching for code within a specific file or set of 2-3 files, use the ${n8.name} tool instead of the ${A6} tool, to find the match more quickly
- Other tasks that are not related to the agent descriptions above


Usage notes:
- Launch multiple agents concurrently whenever possible, to maximize performance; to do that, use a single message with multiple tool uses
- When the agent is done, it will return a single message back to you. The result returned by the agent is not visible to the user. To show the user the result, you should send a text message back to the user with a concise summary of the result.
- Each agent invocation is stateless. You will not be able to send additional messages to the agent, nor will the agent be able to communicate with you outside of its final report. Therefore, your prompt should contain a highly detailed task description for the agent to perform autonomously and you should specify exactly what information the agent should return back to you in its final and only message to you.
- Agents with "access to current context" can see the full conversation history before the tool call. When using these agents, you can write concise prompts that reference earlier context (e.g., "investigate the error discussed above") instead of repeating information. The agent will receive all prior messages and understand the context.
- The agent's outputs should generally be trusted
- Clearly tell the agent whether you expect it to write code or just to do research (search, file reads, web fetches, etc.), since it is not aware of the user's intent
- If the agent description mentions that it should be used proactively, then you should try your best to use it without the user having to ask for it first. Use your judgement.
- If the user specifies that they want you to run agents "in parallel", you MUST send a single message with multiple ${jn.name} tool use content blocks. For example, if you need to launch both a code-reviewer agent and a test-runner agent in parallel, send a single message with both tool calls.

Example usage:

<example_agent_descriptions>
"code-reviewer": use this agent after you are done writing a signficant piece of code
"greeting-responder": use this agent when to respond to user greetings with a friendly joke
</example_agent_description>

<example>
user: "Please write a function that checks if a number is prime"
assistant: Sure let me write a function that checks if a number is prime
assistant: First let me use the ${QV.name} tool to write a function that checks if a number is prime
assistant: I'm going to use the ${QV.name} tool to write the following code:
<code>
function isPrime(n) {
  if (n <= 1) return false
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false
  }
  return true
}
</code>
<commentary>
Since a signficant piece of code was written and the task was completed, now use the code-reviewer agent to review the code
</commentary>
assistant: Now let me use the code-reviewer agent to review the code
assistant: Uses the ${jn.name} tool to launch the code-reviewer agent
</example>

<example>
user: "Hello"
<commentary>
Since the user is greeting, use the greeting-responder agent to respond with a friendly joke
</commentary>
assistant: "I'm going to use the ${jn.name} tool to launch the greeting-responder agent"
</example>
`
}
```

**Key Elements:**
1. **Dynamic Agent List**: Shows all available agents with their descriptions and tools
2. **When NOT to use**: Explicitly tells main agent when direct tools are better
3. **Stateless Communication**: Emphasizes one-shot execution model
4. **Context Access**: Explains fork context feature for concise prompts
5. **Parallel Execution**: Instructions for running multiple agents concurrently
6. **Proactive Usage**: Encourages using agents without explicit user request (if agent description says so)
7. **Examples**: Concrete usage examples with code-reviewer and greeting-responder agents

## Agent Lifecycle

```
1. Main Agent Decision
   ↓
   Main agent identifies need for specialized task
   ↓
2. Agent Selection
   ↓
   Main agent reviews available agents via Task tool description
   ↓
3. Agent Spawning
   ↓
   Main agent calls Task tool with:
   - subagent_type: "Explore"
   - prompt: "Detailed task description..."
   ↓
4. Agent Initialization
   ↓
   System creates subprocess with:
   - Agent's system prompt
   - Agent's allowed tools
   - Agent's model
   - Fork context (if enabled)
   ↓
5. Agent Execution
   ↓
   Subagent autonomously:
   - Analyzes the task
   - Uses its tools
   - Performs research/work
   ↓
6. Agent Completion
   ↓
   Subagent generates final report
   ↓
7. Result Return
   ↓
   Final report returned to main agent as tool result
   ↓
8. Main Agent Processing
   ↓
   Main agent:
   - Processes subagent's report
   - Summarizes findings for user
   - Continues conversation
```

## Agent Types by Source

### Built-in Agents
Source: `"built-in"`
- Shipped with Claude Code
- Always available
- Cannot be modified by user
- Examples: general-purpose, Explore, Plan, statusline-setup, claude-code-guide

### Plugin Agents
Source: `"plugin"`
- Loaded from installed plugins
- Defined in markdown files with frontmatter
- Located in plugin's `agentsPath` directory
- Namespaced with plugin name (e.g., "plugin-name:agent-name")

### User Settings Agents
Source: `"userSettings"`
- Defined in `~/.claude/settings.json`
- Global across all projects
- User-specific customization

### Project Settings Agents
Source: `"projectSettings"`
- Defined in `.claude/settings.json` in project
- Project-specific agents
- Override user settings

### Policy Settings Agents
Source: `"policySettings"`
- Enterprise/organization policy agents
- Highest priority
- Cannot be overridden by user

### Flag Settings Agents
Source: `"flagSettings"`
- Feature flag controlled agents
- Experimental features

## Agent Priority and Deduplication

When multiple agent definitions exist with the same `agentType`, they are deduplicated with this priority order:

```
1. built-in         (lowest priority)
2. plugin
3. userSettings
4. projectSettings
5. flagSettings
6. policySettings   (highest priority)
```

**Implementation**: `/Users/linyuzhi/codespace/myagent/analyze/cc/analysis_claude_code/claude_code_v_2.0.59/source/chunks.125.mjs` (lines 1629-1639)

```javascript
function ky(A) {
  let Q = A.filter((X) => X.source === "built-in"),
    B = A.filter((X) => X.source === "plugin"),
    G = A.filter((X) => X.source === "userSettings"),
    Z = A.filter((X) => X.source === "projectSettings"),
    I = A.filter((X) => X.source === "policySettings"),
    Y = A.filter((X) => X.source === "flagSettings"),
    J = [Q, B, G, Z, Y, I],  // Priority order
    W = new Map;
  for (let X of J)
    for (let V of X) W.set(V.agentType, V);  // Later sources override earlier
  // ...
}
```

## Tool Filtering for Subagents

Subagents have restricted tool access compared to the main agent.

**Location**: `/Users/linyuzhi/codespace/myagent/analyze/cc/analysis_claude_code/claude_code_v_2.0.59/source/chunks.125.mjs` (lines 1116-1176)

### w70 - Filter Tools for Subagent

```javascript
// ============================================
// w70 - Filter Tools Available to Subagent
// Location: chunks.125.mjs:1116-1128
// ============================================
function w70({
  tools: A,            // All available tools
  isBuiltIn: Q,        // Is this a built-in agent?
  isAsync: B = !1      // Is this an async/background agent?
}) {
  return A.filter((G) => {
    // Special case: Allow MCP tools if env var is set
    if (process.env.CLAUDE_CODE_ALLOW_MCP_TOOLS_FOR_SUBAGENTS &&
        G.name.startsWith("mcp__")) {
      return !0;  // Allow
    }

    // Block tools in CTA set (always blocked for all subagents)
    if (CTA.has(G.name)) return !1;

    // Non-built-in agents: block tools in Qf2 set
    if (!Q && Qf2.has(G.name)) return !1;

    // Async agents: only allow tools in Bf2 set
    if (B && !Bf2.has(G.name)) return !1;

    return !0;  // Allow by default
  })
}
```

**Tool Restriction Sets:**
- **CTA**: Tools always blocked for ALL subagents (not shown in code, but referenced)
- **Qf2**: Tools blocked for non-built-in (plugin/user) agents
- **Bf2**: Allowlist for async/background agents (only these tools allowed)

**Filtering Rules:**
1. MCP tools: Blocked by default, allowed if `CLAUDE_CODE_ALLOW_MCP_TOOLS_FOR_SUBAGENTS` env var is set
2. CTA tools: Always blocked for all subagents
3. Qf2 tools: Blocked for plugin/user agents, allowed for built-in agents
4. Bf2 allowlist: For async agents, ONLY Bf2 tools are allowed (all others blocked)
5. Default: Allow tool if none of the above blocks it

### Sn - Resolve Agent's Tool Set

```javascript
// ============================================
// Sn - Resolve Tools for Agent Definition
// Location: chunks.125.mjs:1130-1176
// ============================================
function Sn(A, Q, B = !1) {
  // A = agent definition
  // Q = all available tools
  // B = is async agent?

  let {
    tools: G,              // Agent's requested tools (from definition)
    disallowedTools: Z,    // Agent's disallowed tools
    source: I              // Agent source (built-in, plugin, etc.)
  } = A;

  // Filter available tools for subagent context
  let Y = w70({
    tools: Q,
    isBuiltIn: I === "built-in",
    isAsync: B
  });

  // Build set of disallowed tool names
  let J = new Set(Z?.map((C) => {
    let { toolName: E } = nN(C);
    return E
  }) ?? []);

  // Remove disallowed tools
  let W = Y.filter((C) => !J.has(C.name));

  // Wildcard case: agent wants all available tools
  if (G === void 0 || G.length === 1 && G[0] === "*") {
    return {
      hasWildcard: !0,
      validTools: [],
      invalidTools: [],
      resolvedTools: W  // All tools (minus disallowed)
    };
  }

  // Build map of available tools by name
  let V = new Map;
  for (let C of W) {
    V.set(C.name, C);
  }

  let F = [],      // Valid tool names requested by agent
      K = [],      // Invalid tool names (not available)
      D = [],      // Resolved tool objects
      H = new Set; // Track added tools

  // Resolve each requested tool
  for (let C of G) {
    let { toolName: E } = nN(C);

    // Special case: Task tool (allow but don't resolve)
    if (E === A6) {
      F.push(C);
      continue
    }

    let U = V.get(E);
    if (U) {
      // Tool is available
      F.push(C);
      if (!H.has(U)) {
        D.push(U);
        H.add(U);
      }
    } else {
      // Tool not available
      K.push(C)
    }
  }

  return {
    hasWildcard: !1,
    validTools: F,        // Valid tool names
    invalidTools: K,      // Invalid tool names
    resolvedTools: D      // Actual tool objects to provide
  };
}
```

**Resolution Process:**
1. Filter all available tools using `w70()` based on agent source and async status
2. Build disallowed tools set from agent definition
3. Remove disallowed tools from available set
4. If agent requests wildcard `["*"]`, return all remaining tools
5. Otherwise, resolve each requested tool by name
6. Special handling for Task tool (A6) - allowed but not resolved to object
7. Return valid tools, invalid tools, and resolved tool objects

## Agent Communication Model

### Stateless Design

Key principle: **Agents are stateless subprocess invocations**

- Agent receives a single prompt
- Agent executes autonomously
- Agent returns a single final report
- No back-and-forth communication
- No ability to ask clarifying questions

### Agent Entry Message

**Location**: chunks.125.mjs:1178-1223

When a subagent is spawned, it receives an entry message that prepends the conversation context:

```javascript
// ============================================
// Af2 - Create Subagent Entry Message
// Location: chunks.125.mjs:1178-1223
// ============================================
function Af2(A, Q) {
  // A = mainThreadMessages (conversation before tool call)
  // Q = toolUse (the Task tool use block)

  let B = R0({
    content: [],
    role: "user"
  });

  // Count main thread messages
  let G = A.length,
      Z = [],
      I = ``;

  // Build context explanation
  if (G > 0) {
    I = `Context: The ${G} message${G > 1 ? "s" : ""} above ${G > 1 ? "are" : "is"} from the parent thread prior to your sub-agent launch. They are provided as context only.`;
  }

  // Build subagent entry message
  I = `${I}

Entered sub-agent context

PLEASE NOTE:
- The messages above this point are from the main thread prior to sub-agent execution. They are provided as context only.
- Context messages may include tool_use blocks for tools that are not available in the sub-agent context. You should only use the tools specifically provided to you in the system prompt.
- Only complete the specific sub-agent task you have been assigned below.`;

  let Y = {
    status: "sub_agent_entered",
    description: "Entered sub-agent context",
    message: I
  };

  // Create tool result message
  let J = R0({
    content: [{
      type: "tool_result",
      tool_use_id: Q.id,
      content: [{
        type: "text",
        text: I
      }]
    }],
    toolUseResult: Y
  });

  return [Z, J, B]
}
```

**Entry Message Structure:**
1. **Context Count**: Shows how many messages from main thread are included
2. **Boundary Marker**: "Entered sub-agent context" clearly marks where subagent starts
3. **Important Notes**:
   - Main thread messages are context only
   - May see tool uses for tools not available to subagent
   - Focus only on assigned task
4. **Tool Result**: Formatted as tool_result for the Task tool use

**Example Entry Message:**
```
Context: The 12 messages above are from the parent thread prior to your sub-agent launch. They are provided as context only.

Entered sub-agent context

PLEASE NOTE:
- The messages above this point are from the main thread prior to sub-agent execution. They are provided as context only.
- Context messages may include tool_use blocks for tools that are not available in the sub-agent context. You should only use the tools specifically provided to you in the system prompt.
- Only complete the specific sub-agent task you have been assigned below.
```

### Implications for Prompt Design

The main agent must:
- Provide complete, detailed task descriptions
- Specify exactly what information to return
- Include all necessary context in the initial prompt
- Anticipate what the agent will need

### Fork Context Feature

For agents with `forkContext: true`:
- Agent receives full conversation history before the tool call
- Allows concise prompts referencing earlier discussion
- Example: "investigate the error discussed above" works

Without fork context:
- Agent only sees the prompt text
- All context must be included in prompt
- More verbose but more isolated

## Parallel Agent Execution

The system supports running multiple agents concurrently:

**From Task tool description**:
```
Launch multiple agents concurrently whenever possible, to maximize performance;
to do that, use a single message with multiple tool uses
```

Example:
```
Main agent sends single message with:
- Task(subagent_type: "Explore", prompt: "Find all TypeScript files...")
- Task(subagent_type: "Plan", prompt: "Design the refactoring strategy...")
```

Both agents run in parallel, returning results independently.

## Agent Colors

Agents can have UI colors for visual distinction:

**Allowed colors** (lines 1089-1098):
```javascript
j0A = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"]

HTA = {
  red: "red_FOR_SUBAGENTS_ONLY",
  blue: "blue_FOR_SUBAGENTS_ONLY",
  green: "green_FOR_SUBAGENTS_ONLY",
  yellow: "yellow_FOR_SUBAGENTS_ONLY",
  purple: "purple_FOR_SUBAGENTS_ONLY",
  orange: "orange_FOR_SUBAGENTS_ONLY",
  pink: "pink_FOR_SUBAGENTS_ONLY",
  cyan: "cyan_FOR_SUBAGENTS_ONLY"
}
```

## Key Architecture Files

1. **chunks.125.mjs** - Agent definitions and management
   - Lines 988-1057: Task tool description generator
   - Lines 1244-1266: general-purpose agent
   - Lines 1272-1360: statusline-setup agent
   - Lines 1366-1413: Explore agent
   - Lines 1420-1484: Plan agent
   - Lines 1489-1493: Built-in agents list

2. **chunks.60.mjs** - claude-code-guide agent
   - Lines 778-897: Agent definition

3. **chunks.145.mjs** - Agent spawning logic
   - Agent execution and subprocess management

4. **chunks.150.mjs** - Agent management
   - Session handling and lifecycle

## Design Rationale

### Why Subagents?

1. **Specialization**: Different agents for different tasks (exploration vs planning vs setup)
2. **Isolation**: Subagents run in separate process, preventing main conversation pollution
3. **Parallelism**: Multiple agents can run concurrently
4. **Model Selection**: Use fast models (Haiku) for simple tasks, powerful models (Opus) for complex ones
5. **Tool Restriction**: Limit dangerous operations (read-only agents can't modify files)
6. **Context Control**: Choose whether agent sees conversation history

### Stateless vs Stateful

The stateless design is intentional:
- **Simpler**: No session management complexity
- **Faster**: One-shot execution, no waiting for back-and-forth
- **Safer**: Limited scope prevents runaway processes
- **Clearer**: Main agent knows exactly what it asked for

Trade-off: Main agent must provide complete prompts upfront.

## Summary

The Claude Code subagent architecture provides:
- ✅ Specialized agents for different task types
- ✅ Flexible tool access control
- ✅ Multiple model support
- ✅ Parallel execution capability
- ✅ Extensibility via plugins
- ✅ Clear communication model (stateless, single result)
- ✅ Context control (fork context optional)
- ✅ Visual distinction (colors)
- ✅ Priority-based configuration

This architecture enables the main agent to delegate complex work efficiently while maintaining control and safety.
