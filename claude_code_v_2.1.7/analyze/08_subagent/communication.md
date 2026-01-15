# Claude Code v2.1.7 - Subagent Communication

## Overview

The Claude Code subagent system implements a **stateless, single-message communication model** between the main agent and subagents. This document details how main agents communicate with subagents, how results are passed back, and special features like background execution and agent resumption.

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

Key functions in this document:
- `prepareForkMessages` (I52) - Creates entry message for subagents with fork context
- `loadTranscript` (bD1) - Loads previous transcript for agent resume
- `runAgentLoop` ($f) - Main agent execution loop

---

## Communication Model

### Core Principle: Stateless One-Shot Execution

**From Task tool description**:
```
Each agent invocation is stateless. You will not be able to send additional
messages to the agent, nor will the agent be able to communicate with you
outside of its final report. Therefore, your prompt should contain a highly
detailed task description for the agent to perform autonomously and you should
specify exactly what information the agent should return back to you in its
final and only message to you.
```

This design means:
- ❌ No back-and-forth conversation
- ❌ No clarifying questions from subagent
- ❌ No progress updates during execution (unless background)
- ✅ Single prompt in
- ✅ Single result out
- ✅ Fully autonomous execution

---

## Main Agent to Subagent Communication

### 1. Task Tool Invocation

The main agent spawns a subagent using the Task tool with parameters:

**Tool Call Structure**:
```javascript
{
  name: "Task",  // f3 constant
  input: {
    subagent_type: string,    // Required: which agent to spawn
    prompt: string,           // Required: detailed task description
    description: string,      // Required: short 3-5 word description
    model: string,            // Optional: "sonnet", "opus", or "haiku"
    resume: string,           // Optional: ID of existing agent to resume
    run_in_background: boolean, // Optional: run in background
    max_turns: number         // Optional: limit API round-trips (NEW in 2.1.7)
  }
}
```

### 2. Task Tool Input Schema

```javascript
// ============================================
// Task Tool Input Schema - Complete Definition
// Location: chunks.113.mjs:30-38
// ============================================

// ORIGINAL (for source lookup):
uP2 = m.object({
  description: m.string().describe("A short (3-5 word) description of the task"),
  prompt: m.string().describe("The task for the agent to perform"),
  subagent_type: m.string().describe("The type of specialized agent to use for this task"),
  model: m.enum(["sonnet", "opus", "haiku"]).optional()
    .describe("Optional model to use for this agent. If not specified, inherits from parent. Prefer haiku for quick, straightforward tasks to minimize cost and latency."),
  resume: m.string().optional()
    .describe("Optional agent ID to resume from. If provided, the agent will continue from the previous execution transcript."),
  run_in_background: m.boolean().optional()
    .describe("Set to true to run this agent in the background. The tool result will include an output_file path."),
  max_turns: m.number().int().positive().optional()
    .describe("Maximum number of agentic turns (API round-trips) before stopping. Used internally for warmup.")
})

// READABLE (for understanding):
const taskInputSchema = z.object({
  description: z.string()
    .describe("A short (3-5 word) description of the task"),
  prompt: z.string()
    .describe("The task for the agent to perform"),
  subagent_type: z.string()
    .describe("The type of specialized agent to use for this task"),
  model: z.enum(["sonnet", "opus", "haiku"]).optional()
    .describe("Optional model to use"),
  resume: z.string().optional()
    .describe("Optional agent ID to resume from"),
  run_in_background: z.boolean().optional()
    .describe("Set to true to run in background"),
  max_turns: z.number().int().positive().optional()  // NEW in 2.1.7
    .describe("Maximum number of agentic turns")
});

// Mapping: uP2→taskInputSchema
```

### 3. Task Tool Output Schema

```javascript
// ============================================
// Task Tool Output Schemas - All Response Types
// Location: chunks.113.mjs:40-73
// ============================================

// ORIGINAL (for source lookup):
Bf5 = m.object({
  agentId: m.string(),
  content: m.array(m.object({
    type: m.literal("text"),
    text: m.string()
  })),
  totalToolUseCount: m.number(),
  totalDurationMs: m.number(),
  totalTokens: m.number(),
  usage: m.object({
    input_tokens: m.number(),
    output_tokens: m.number(),
    cache_creation_input_tokens: m.number().nullable(),
    cache_read_input_tokens: m.number().nullable(),
    server_tool_use: m.object({
      web_search_requests: m.number(),
      web_fetch_requests: m.number()
    }).nullable(),
    service_tier: m.enum(["standard", "priority", "batch"]).nullable(),
    cache_creation: m.object({
      ephemeral_1h_input_tokens: m.number(),
      ephemeral_5m_input_tokens: m.number()
    }).nullable()
  })
}),
Gf5 = Bf5.extend({ status: m.literal("completed"), prompt: m.string() }),
Zf5 = m.object({
  status: m.literal("async_launched"),
  agentId: m.string().describe("The ID of the async agent"),
  description: m.string().describe("The description of the task"),
  prompt: m.string().describe("The prompt for the agent"),
  outputFile: m.string().describe("Path to the output file for checking agent progress")  // NEW in 2.1.7
}),
Yf5 = m.union([Gf5, Zf5, X52])

// READABLE (for understanding):
// Base output schema
const baseOutputSchema = z.object({
  agentId: z.string(),
  content: z.array(z.object({
    type: z.literal("text"),
    text: z.string()
  })),
  totalToolUseCount: z.number(),
  totalDurationMs: z.number(),
  totalTokens: z.number(),
  usage: z.object({ /* detailed token usage */ })
});

// Completed task response
const completedOutputSchema = baseOutputSchema.extend({
  status: z.literal("completed"),
  prompt: z.string()
});

// Async launched response (NEW: includes outputFile)
const asyncLaunchedOutputSchema = z.object({
  status: z.literal("async_launched"),
  agentId: z.string(),
  description: z.string(),
  prompt: z.string(),
  outputFile: z.string()  // NEW in 2.1.7
});

// Union of all possible responses
const taskOutputSchema = z.union([
  completedOutputSchema,
  asyncLaunchedOutputSchema,
  subAgentEnteredSchema
]);

// Mapping: Bf5→baseOutputSchema, Gf5→completedOutputSchema, Zf5→asyncLaunchedOutputSchema, Yf5→taskOutputSchema
```

### 4. Parameter Details

#### subagent_type (Required)

Specifies which agent to spawn. Must match an available agent's `agentType`:

**Built-in options (v2.1.7)**:
- `"Bash"` - Command execution specialist (NEW)
- `"general-purpose"` - Multi-purpose research agent
- `"Explore"` - Fast codebase exploration
- `"Plan"` - Software architecture planning
- `"statusline-setup"` - Status line configuration
- `"claude-code-guide"` - Documentation help

**Custom options**:
- Plugin agents: `"plugin-name:agent-name"`
- User/project agents: As defined in settings

#### prompt (Required)

The detailed task description for the subagent. This is the ONLY information the subagent receives (unless forkContext is enabled).

**Best Practices for Prompts**:

1. **Be Comprehensive**: Include all context the agent needs
2. **Be Specific**: Clearly state what information to return
3. **Be Directive**: Tell agent exactly what to do
4. **Anticipate Needs**: Provide information the agent might need

**Bad Prompt** (too vague):
```
"Look at the authentication code"
```

**Good Prompt** (detailed, specific):
```
Find all authentication-related files in this codebase. Specifically:
1. Search for files containing "auth", "login", "session", "token"
2. Read the main authentication module and identify the auth strategy
3. List all API endpoints that require authentication
4. Return a summary including:
   - Auth strategy used (JWT, OAuth, session-based, etc.)
   - Main auth files and their purposes
   - List of protected endpoints
   - Any security concerns you notice
```

#### resume (Optional)

Allows reusing an existing agent session:
- More efficient than spawning new agent
- Agent maintains context from previous lookups
- Identified by agent ID

**Example**:
```javascript
{
  subagent_type: "claude-code-guide",
  prompt: "Now explain how to configure MCP servers",
  resume: "agent-abc123"  // Reuse previous agent instance
}
```

#### run_in_background (Optional)

Allows running the agent in the background:
- Main agent continues without waiting for result
- Result available later via TaskOutput tool or output file
- Useful for long-running tasks

#### max_turns (Optional, NEW in 2.1.7)

Limits the number of API round-trips:
- Used internally for warmup scenarios
- Prevents runaway agents
- Integer, must be positive

---

## Fork Context Feature

Agents with `forkContext: true` receive additional conversation history.

### Fork Context Message Preparation

```javascript
// ============================================
// prepareForkMessages - Creates fork context messages
// Location: chunks.113.mjs:138
// ============================================

// ORIGINAL (for source lookup):
let _ = z?.forkContext ? I52(A, D) : [H0({ content: A })];

// READABLE (for understanding):
let promptMessages = agentDefinition?.forkContext
  ? prepareForkMessages(prompt, toolUseMessage)
  : [createMetaBlock({ content: prompt })];

// If forkContext is true:
//   - Full conversation history is included
//   - Agent can reference "the error above"
// If forkContext is false (default):
//   - Only the prompt string is passed
//   - Agent has no conversation context

// Mapping: I52→prepareForkMessages, H0→createMetaBlock
```

**Without fork context** (default):
- Agent only sees the `prompt` parameter
- No conversation history
- Must include all context in prompt

**With fork context** (`forkContext: true`):
- Agent sees full conversation before tool call
- Can reference earlier discussion
- Allows concise prompts

**Example without fork context**:
```javascript
{
  subagent_type: "Explore",
  prompt: `The user reported error "TypeError: Cannot read property 'map' of undefined"
           in the ProductList component. Find the ProductList component and identify
           where this error might occur...`
}
```

**Example with fork context** (for custom agents):
```javascript
{
  subagent_type: "custom-debugger",  // Assuming forkContext: true
  prompt: "Investigate the error the user mentioned"  // References conversation
}
```

**Note**: None of the built-in agents use `forkContext: true`. This feature is for custom agents.

---

## Subagent to Main Agent Communication

### 1. Final Report

The subagent communicates ONLY through its final message:

**Key Points**:
- ✅ Single final message
- ✅ Contains all findings/results
- ❌ Not visible to user directly
- ❌ Main agent must summarize for user

### 2. Result Structure

The Task tool returns a tool result containing the subagent's final message:

**Completed Task**:
```javascript
{
  status: "completed",
  prompt: "original prompt...",
  agentId: "agent-xyz",
  content: [{ type: "text", text: "... subagent's final report ..." }],
  totalToolUseCount: 5,
  totalDurationMs: 12345,
  totalTokens: 5000,
  usage: { /* detailed usage */ }
}
```

**Async Launched** (background):
```javascript
{
  status: "async_launched",
  agentId: "agent-xyz",
  description: "Find auth files",
  prompt: "original prompt...",
  outputFile: "/path/to/output.md"  // NEW in 2.1.7
}
```

### 3. Main Agent Processing

After receiving the result, the main agent must:

1. **Process the report**: Understand what the subagent found
2. **Summarize for user**: Create user-facing message
3. **Take action**: Use findings to continue task

---

## Parallel Agent Execution

### Concurrent Spawning

The main agent can spawn multiple agents in parallel:

**Single Message, Multiple Tool Calls**:
```javascript
// Main agent sends ONE message with MULTIPLE tool uses:
{
  role: "assistant",
  content: [
    {
      type: "tool_use",
      name: "Task",
      input: {
        subagent_type: "Explore",
        description: "Find auth files",
        prompt: "Find authentication files..."
      }
    },
    {
      type: "tool_use",
      name: "Task",
      input: {
        subagent_type: "Explore",
        description: "Find DB files",
        prompt: "Find database migration files..."
      }
    }
  ]
}
```

Both agents run **concurrently**, returning results independently.

### Benefits of Parallel Execution

- ⚡ Faster overall completion
- 🔄 Independent tasks can progress simultaneously
- 💰 More efficient resource usage

### When to Use Parallel Execution

**Good candidates for parallel execution**:
- Independent searches (auth files + database files)
- Different analyses (code review + test coverage)
- Multiple planning perspectives
- Separate research tasks

**Poor candidates** (sequential dependency):
- Plan architecture → Implement plan
- Find file → Read file → Analyze content
- Tasks where later task needs earlier task's results

---

## Agent Resume Functionality

### Purpose

Agent resumption allows reusing an existing agent instance for follow-up queries.

### How Resume Works

```javascript
// ============================================
// Resume Transcript Loading
// Location: chunks.113.mjs:122-124
// ============================================

// ORIGINAL (for source lookup):
if (Z) {
  let b = await bD1(iz(Z));
  if (!b) throw Error(`No transcript found for agent ID: ${Z}`);
  O = b
}

// READABLE (for understanding):
if (resume) {
  const transcript = await loadTranscript(getTranscriptPath(resume));
  if (!transcript) {
    throw new Error(`No transcript found for agent ID: ${resume}`);
  }
  resumeMessages = transcript;
}

// Mapping: bD1→loadTranscript, iz→getTranscriptPath
```

### Resume Flow

```
Main Agent calls Task with resume: "agent-xyz"
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. loadTranscript("agent-xyz")                                  │
│    - Find transcript file for agentId                           │
│    - Parse session file                                         │
│    - Build message chain from root to most recent leaf          │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Prepend to prompt messages                                   │
│    promptMessages = [...resumeTranscript, ...newPromptMessages] │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Agent continues with full context                            │
│    - Sees previous conversation                                 │
│    - Continues from where it left off                           │
└─────────────────────────────────────────────────────────────────┘
```

### Benefits of Resume

- ✅ **Efficiency**: No re-initialization overhead
- ✅ **Context**: Agent remembers previous queries
- ✅ **Speed**: Faster than spawning new agent
- ✅ **Cost**: Lower token usage

### When to Resume vs New Agent

**Resume when**:
- Follow-up question to same agent type
- Related queries in sequence
- Agent has "expensive" initialization

**New agent when**:
- Different task entirely
- Different agent type needed
- Fresh context desired

---

## Background Agent Execution

### Purpose

Background execution allows main agent to continue while subagent works.

### Background vs Foreground

| Aspect | Foreground (default) | Background |
|--------|---------------------|------------|
| Blocking | Yes - waits for result | No - continues immediately |
| Result timing | Immediate in tool result | Deferred, check later |
| Output access | In tool result | Via `outputFile` or TaskOutput |
| Use case | Results needed now | Results needed later |

### Output File (NEW in 2.1.7)

Background agents now return an `outputFile` path:

```javascript
{
  status: "async_launched",
  agentId: "agent-xyz",
  description: "Find auth files",
  prompt: "...",
  outputFile: "/Users/user/.claude/projects/.../output-agent-xyz.md"
}
```

Main agent can check progress via:
- `Read` tool: `Read { file_path: outputFile }`
- `Bash` tool: `tail -f outputFile`
- `TaskOutput` tool (for completion)

### Retrieving Results with TaskOutput

```javascript
// TaskOutput tool parameters
{
  task_id: string,     // The agent ID
  block: boolean,      // Wait for completion (default: true)
  timeout: number      // Max wait time in ms (default: 30000)
}
```

**Usage Patterns**:

```javascript
// Check status without blocking
TaskOutput { task_id: "agent-xyz", block: false }

// Wait for completion
TaskOutput { task_id: "agent-xyz", block: true, timeout: 60000 }
```

---

## Communication Constraints

### What Subagents CANNOT Do

1. **Ask questions**: No way to request clarification from main agent
2. **Send updates**: No progress reporting during execution (except background output file)
3. **Interactive mode**: No back-and-forth conversation
4. **Access later context**: Cannot see conversation after their spawn

### What Main Agents CANNOT Do

1. **Send follow-ups**: Cannot send additional messages to running agent
2. **Modify task**: Cannot change subagent's prompt mid-execution
3. **Interrupt**: Cannot stop agent once started (except abort/kill)
4. **See intermediate state**: Cannot see agent's thinking (except background output)

### Design Implications

**For Main Agent**:
- Must provide complete, detailed prompts
- Must anticipate what subagent will need
- Must summarize results for user
- Should use parallel spawning when possible

**For Subagent**:
- Must work autonomously
- Must include everything in final report
- Cannot assume additional context will arrive
- Should be thorough in single response

---

## Communication Best Practices

### 1. Prompt Writing

**DO**:
```
Find all authentication files and analyze the auth strategy. Specifically:
1. Search for files with "auth", "login", "session" in name/content
2. Read the main authentication module
3. Identify the authentication method (JWT, OAuth, etc.)
4. List all protected API routes
5. Return:
   - Auth strategy summary
   - Main files and their roles
   - Protected endpoints
   - Any security concerns
```

**DON'T**:
```
Look at auth stuff
```

### 2. Result Processing

**DO**:
```javascript
// Main agent processes result and summarizes for user
"I found the authentication implementation. The system uses JWT tokens
 with a refresh token strategy. Here's what I found:
 [Key points from subagent's detailed findings]"
```

**DON'T**:
```javascript
// Just forward raw subagent output verbatim
[Entire subagent output dumped to user]
```

### 3. Agent Selection

| Task | Recommended Agent |
|------|-------------------|
| Single command execution | Bash tool (not agent) |
| Multi-step command sequence | **Bash agent** |
| Quick file search | **Explore** |
| Complex research | **general-purpose** |
| Architecture planning | **Plan** |
| Documentation questions | **claude-code-guide** |
| Status line config | **statusline-setup** |

### 4. Parallel Execution

**DO**: Single message with multiple parallel tasks
```javascript
{
  content: [
    { type: "tool_use", name: "Task", input: { subagent_type: "Explore", prompt: "Find auth files..." } },
    { type: "tool_use", name: "Task", input: { subagent_type: "Explore", prompt: "Find DB files..." } }
  ]
}
```

**DON'T**: Sequential messages for independent tasks
```javascript
Message 1: Task(Explore, "Find auth files...")
[Wait for result]
Message 2: Task(Explore, "Find DB files...")
```

---

## Summary

### Communication Flow

```
Main Agent
    ↓ [spawn via Task tool]
    ↓ subagent_type: "Explore"
    ↓ prompt: "Detailed task..."
    ↓ resume: optional
    ↓ run_in_background: optional
    ↓ max_turns: optional (NEW)
    ↓
Subagent
    ↓ [executes autonomously]
    ↓ [uses allowed tools]
    ↓ [completes task]
    ↓
    ↓ [returns final report]
    ↓ (or outputFile for background)
    ↓
Main Agent
    ↓ [processes result]
    ↓ [summarizes for user]
    ↓
User
```

### Key Characteristics

- ✅ **Stateless**: No persistent session state
- ✅ **One-shot**: Single prompt → single result
- ✅ **Autonomous**: Subagent works independently
- ✅ **Parallel**: Multiple agents can run concurrently
- ✅ **Resumable**: Can reuse agent instances
- ✅ **Background-capable**: Non-blocking execution
- ✅ **Fork context**: Optional conversation history access
- ✅ **Output file**: Progress tracking for background agents (NEW)

### Key Principles

1. **Detailed prompts**: Main agent must be thorough
2. **Single communication**: No back-and-forth
3. **Main agent summarizes**: Subagent results not shown directly
4. **Parallel when possible**: Maximize efficiency
5. **Resume when appropriate**: Save resources
6. **Background for long tasks**: Don't block main agent

---

## Related Symbols

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

Key symbols in this document:
- `f3` (TASK_TOOL_NAME) - Task tool name constant
- `uP2` (taskInputSchema) - Task tool input schema
- `Yf5` (taskOutputSchema) - Task tool output schema
- `I52` (prepareForkMessages) - Fork context message preparation
- `bD1` (loadTranscript) - Load transcript for resume
- `$f` (runAgentLoop) - Main agent execution loop
- `L32` (createFullyBackgroundedAgent) - Create background agent
- `aY` (formatOutputPath) - Format output file path

---

## See Also

- [architecture.md](./architecture.md) - Agent system architecture
- [execution.md](./execution.md) - Execution flow and patterns
- [builtin_agents.md](./builtin_agents.md) - Built-in agent details
- [error_handling.md](./error_handling.md) - Error handling patterns
