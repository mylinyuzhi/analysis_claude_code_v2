# Claude Code v2.0.59 - Subagent Communication

## Overview

The Claude Code subagent system implements a **stateless, single-message communication model** between the main agent and subagents. This document details how main agents communicate with subagents, how results are passed back, and special features like background execution and agent resumption.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `agentEntryMessage` (Af2) - Creates entry message for subagents with fork context
- `loadTranscript` (KY1) - Loads previous transcript for agent resume
- `filterUnresolvedToolUses` (sX0) - Filters fork context messages

---

## Communication Model

### Core Principle: Stateless One-Shot Execution

**From chunks.125.mjs lines 1015**:
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
- ❌ No progress updates during execution
- ✅ Single prompt in
- ✅ Single result out
- ✅ Fully autonomous execution

## Main Agent to Subagent Communication

### 1. Task Tool Invocation

The main agent spawns a subagent using the Task tool with parameters:

**Tool Call Structure**:
```javascript
{
  name: "Task",  // A6 constant
  input: {
    subagent_type: string,    // Required: which agent to spawn
    prompt: string,           // Required: detailed task description
    resume: string,           // Optional: ID of existing agent to resume
    background: boolean       // Optional: run in background
  }
}
```

### 2. Task Tool Input Schema

```javascript
// ============================================
// Task Tool Input Schema - Complete Definition
// Location: chunks.145.mjs:1771-1778
// ============================================

// ORIGINAL (for source lookup):
OJ9 = j.object({
  description: j.string().describe("A short (3-5 word) description of the task"),
  prompt: j.string().describe("The task for the agent to perform"),
  subagent_type: j.string().describe("The type of specialized agent to use for this task"),
  model: j.enum(["sonnet", "opus", "haiku"]).optional().describe("Optional model to use for this agent. If not specified, inherits from parent. Prefer haiku for quick, straightforward tasks to minimize cost and latency."),
  resume: j.string().optional().describe("Optional agent ID to resume from. If provided, the agent will continue from the previous execution transcript.")
}), mtZ = OJ9.extend({
  run_in_background: j.boolean().optional().describe("Set to true to run this agent in the background. Use AgentOutputTool to read the output later.")
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
    .describe("Optional model to use for this agent"),
  resume: z.string().optional()
    .describe("Optional agent ID to resume from")
});

const asyncTaskInputSchema = taskInputSchema.extend({
  run_in_background: z.boolean().optional()
    .describe("Set to true to run this agent in the background")
});

// Mapping: OJ9→taskInputSchema, mtZ→asyncTaskInputSchema
```

### 3. Task Tool Output Schema

```javascript
// ============================================
// Task Tool Output Schemas - All Response Types
// Location: chunks.145.mjs:1779-1811
// ============================================

// ORIGINAL (for source lookup):
T_3 = j.object({
  agentId: j.string(),
  content: j.array(j.object({
    type: j.literal("text"),
    text: j.string()
  })),
  totalToolUseCount: j.number(),
  totalDurationMs: j.number(),
  totalTokens: j.number(),
  usage: j.object({
    input_tokens: j.number(),
    output_tokens: j.number(),
    cache_creation_input_tokens: j.number().nullable(),
    cache_read_input_tokens: j.number().nullable(),
    server_tool_use: j.object({
      web_search_requests: j.number(),
      web_fetch_requests: j.number()
    }).nullable(),
    service_tier: j.enum(["standard", "priority", "batch"]).nullable(),
    cache_creation: j.object({
      ephemeral_1h_input_tokens: j.number(),
      ephemeral_5m_input_tokens: j.number()
    }).nullable()
  })
}),
P_3 = T_3.extend({ status: j.literal("completed"), prompt: j.string() }),
j_3 = j.object({
  status: j.literal("async_launched"),
  agentId: j.string(),
  description: j.string(),
  prompt: j.string()
}),
S_3 = j.union([P_3, j_3, eb2])

// READABLE (for understanding):
// Completed task response
const completedOutputSchema = z.object({
  status: z.literal("completed"),
  prompt: z.string(),
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

// Async launched response
const asyncLaunchedOutputSchema = z.object({
  status: z.literal("async_launched"),
  agentId: z.string(),          // Use this to retrieve results later
  description: z.string(),      // Task description
  prompt: z.string()            // Original prompt
});

// Union of all possible responses
const taskOutputSchema = z.union([
  completedOutputSchema,
  asyncLaunchedOutputSchema,
  subAgentEnteredSchema
]);

// Mapping: T_3→baseTaskOutput, P_3→completedOutputSchema, j_3→asyncLaunchedOutputSchema, S_3→taskOutputSchema
```

### 4. Parameter Details

#### subagent_type (Required)

Specifies which agent to spawn. Must match an available agent's `agentType`:

**Built-in options**:
- `"general-purpose"` - Multi-purpose research agent
- `"Explore"` - Fast codebase exploration
- `"Plan"` - Software architecture planning
- `"statusline-setup"` - Status line configuration
- `"claude-code-guide"` - Documentation help

**Custom options**:
- Plugin agents: `"plugin-name:agent-name"`
- User/project agents: As defined in settings

**Example**:
```javascript
{
  subagent_type: "Explore",
  prompt: "Find all TypeScript files in the src/components directory..."
}
```

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

**From Task tool description (chunks.125.mjs line 1015)**:
```
Your prompt should contain a highly detailed task description for the agent
to perform autonomously and you should specify exactly what information the
agent should return back to you in its final and only message to you.
```

#### resume (Optional)

**From claude-code-guide agent description (chunks.60.mjs line 831)**:
```
**IMPORTANT:** Before spawning a new agent, check if there is already a
running or recently completed claude-code-guide agent that you can resume
using the "resume" parameter. Reusing an existing agent is more efficient
and maintains context from previous documentation lookups.
```

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

**Benefits**:
- Faster (no re-initialization)
- Context retention (for supported agents)
- Resource efficiency

**When to Use**:
- Sequential related queries
- Follow-up questions
- Iterative exploration

#### background (Optional)

Allows running the agent in the background:
- Main agent continues without waiting for result
- Result available later
- Useful for long-running tasks

**Example**:
```javascript
{
  subagent_type: "Explore",
  prompt: "Find all TODO comments in the entire codebase...",
  background: true  // Don't block main agent
}
```

### 3. Fork Context Feature

Agents with `forkContext: true` receive additional information.

#### Fork Context Entry Message Implementation

```javascript
// ============================================
// agentEntryMessage - Creates entry message for fork context
// Location: chunks.125.mjs:1178-1223
// ============================================

// ORIGINAL (for source lookup):
function Af2(A, Q) {
  let B = R0({ content: A }),
    G = Q.message.content.find((W) => {
      if (W.type !== "tool_use" || W.name !== A6) return !1;
      let X = W.input;
      return "prompt" in X && X.prompt === A
    });
  if (!G) return g(`Could not find matching AgentTool tool use for prompt: ${A.slice(0,50)}...`, { level: "error" }), [B];
  let Z = {
      ...Q,
      uuid: pi5(),
      message: { ...Q.message, content: [G] }
    },
    I = `### FORKING CONVERSATION CONTEXT ###
### ENTERING SUB-AGENT ROUTINE ###
Entered sub-agent context

PLEASE NOTE:
- The messages above this point are from the main thread prior to sub-agent execution. They are provided as context only.
- Context messages may include tool_use blocks for tools that are not available in the sub-agent context. You should only use the tools specifically provided to you in the system prompt.
- Only complete the specific sub-agent task you have been assigned below.`,
    Y = { status: "sub_agent_entered", description: "Entered sub-agent context", message: I },
    J = R0({
      content: [{ type: "tool_result", tool_use_id: G.id, content: [{ type: "text", text: I }] }],
      toolUseResult: Y
    });
  return [Z, J, B]
}

// READABLE (for understanding):
function agentEntryMessage(prompt, taskToolUseMessage) {
  // Create user message containing the prompt
  const userMessage = createMetaBlock({ content: prompt });

  // Find the matching Task tool_use block
  const taskToolUse = taskToolUseMessage.message.content.find((block) => {
    if (block.type !== "tool_use" || block.name !== "Task") return false;
    const input = block.input;
    return "prompt" in input && input.prompt === prompt;
  });

  if (!taskToolUse) {
    log(`Could not find matching AgentTool tool use for prompt: ${prompt.slice(0,50)}...`, { level: "error" });
    return [userMessage];  // Fallback without context
  }

  // Create modified assistant message with ONLY the matching tool_use
  const isolatedAssistantMessage = {
    ...taskToolUseMessage,
    uuid: generateUUID(),  // New UUID
    message: {
      ...taskToolUseMessage.message,
      content: [taskToolUse]  // Only this tool_use
    }
  };

  // Entry message text - shown to subagent as context boundary
  const entryText = `### FORKING CONVERSATION CONTEXT ###
### ENTERING SUB-AGENT ROUTINE ###
Entered sub-agent context

PLEASE NOTE:
- The messages above this point are from the main thread prior to sub-agent execution. They are provided as context only.
- Context messages may include tool_use blocks for tools that are not available in the sub-agent context. You should only use the tools specifically provided to you in the system prompt.
- Only complete the specific sub-agent task you have been assigned below.`;

  // Create tool_result message as boundary
  const entryResult = createMetaBlock({
    content: [{
      type: "tool_result",
      tool_use_id: taskToolUse.id,
      content: [{ type: "text", text: entryText }]
    }],
    toolUseResult: {
      status: "sub_agent_entered",
      description: "Entered sub-agent context",
      message: entryText
    }
  });

  // Return: [isolated assistant msg, entry boundary, user prompt]
  return [isolatedAssistantMessage, entryResult, userMessage];
}

// Mapping: Af2→agentEntryMessage, A→prompt, Q→taskToolUseMessage, G→taskToolUse, I→entryText
```

**Entry Message Structure (what subagent sees):**
```
[Fork context messages from main conversation]
          ↓
[Isolated assistant message with ONLY this Task tool_use]
          ↓
### FORKING CONVERSATION CONTEXT ###
### ENTERING SUB-AGENT ROUTINE ###
Entered sub-agent context

PLEASE NOTE:
- The messages above this point are from the main thread prior to sub-agent execution. They are provided as context only.
- Context messages may include tool_use blocks for tools that are not available in the sub-agent context. You should only use the tools specifically provided to you in the system prompt.
- Only complete the specific sub-agent task you have been assigned below.
          ↓
[User message containing the task prompt]
```

---

**From Task tool description (chunks.125.mjs line 1016)**:
```
Agents with "access to current context" can see the full conversation
history before the tool call. When using these agents, you can write
concise prompts that reference earlier context (e.g., "investigate the
error discussed above") instead of repeating information. The agent will
receive all prior messages and understand the context.
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

**Example with fork context**:
```javascript
{
  subagent_type: "custom-debugger",  // Assuming forkContext: true
  prompt: "Investigate the error the user mentioned"  // References conversation
}
```

## Subagent to Main Agent Communication

### 1. Final Report

The subagent communicates ONLY through its final message:

**From Task tool description (chunks.125.mjs line 1014)**:
```
When the agent is done, it will return a single message back to you.
The result returned by the agent is not visible to the user. To show
the user the result, you should send a text message back to the user
with a concise summary of the result.
```

**Key Points**:
- ✅ Single final message
- ✅ Contains all findings/results
- ❌ Not visible to user directly
- ❌ Main agent must summarize for user

### 2. Result Structure

The Task tool returns a tool result containing the subagent's final message:

**Conceptual Structure**:
```javascript
{
  type: "tool_result",
  tool_use_id: "toolu_xyz",
  content: [
    {
      type: "text",
      text: "... subagent's final report ..."
    }
  ]
}
```

The text contains everything the subagent wants to communicate.

### 3. Main Agent Processing

After receiving the result, the main agent must:

1. **Process the report**: Understand what the subagent found
2. **Summarize for user**: Create user-facing message
3. **Take action**: Use findings to continue task

**Example Flow**:

```
User: "Find all the authentication files"

Main Agent → Task tool:
  subagent_type: "Explore"
  prompt: "Find all files related to authentication..."

Subagent executes → Returns final report:
  "I found 5 authentication-related files:
   - src/auth/AuthProvider.tsx - Main auth context
   - src/auth/login.ts - Login logic
   - src/auth/jwt.ts - JWT token handling
   ..."

Main Agent → User:
  "I found the authentication code. The codebase uses JWT tokens
   for authentication. The main files are:
   - AuthProvider.tsx - manages auth state
   - login.ts - handles login flow
   ..."
```

## Parallel Agent Execution

### Concurrent Spawning

**From Task tool description (chunks.125.mjs line 1013)**:
```
Launch multiple agents concurrently whenever possible, to maximize performance;
to do that, use a single message with multiple tool uses
```

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
        prompt: "Find authentication files..."
      }
    },
    {
      type: "tool_use",
      name: "Task",
      input: {
        subagent_type: "Explore",
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

**From Task tool description (chunks.125.mjs line 1020)**:
```
If the user specifies that they want you to run agents "in parallel", you MUST
send a single message with multiple [Task tool] tool use content blocks. For
example, if you need to launch both a code-reviewer agent and a test-runner
agent in parallel, send a single message with both tool calls.
```

**Good candidates for parallel execution**:
- Independent searches (auth files + database files)
- Different analyses (code review + test coverage)
- Multiple planning perspectives
- Separate research tasks

**Poor candidates** (sequential dependency):
- Plan architecture → Implement plan
- Find file → Read file → Analyze content
- Tasks where later task needs earlier task's results

## Agent Resume Functionality

### Purpose

Agent resumption allows reusing an existing agent instance for follow-up queries.

### Resume Transcript Loading Implementation

```javascript
// ============================================
// loadTranscript - Load previous transcript for resume
// Location: chunks.154.mjs:1243-1267
// ============================================

// ORIGINAL (for source lookup):
async function KY1(A) {
  let Q = DVA(A),          // Get transcript file path for agentId
    B = RA();               // fs module
  try {
    B.statSync(Q)           // Check if file exists
  } catch {
    return null             // No transcript found
  }
  try {
    let {
      messages: G
    } = await jVA(Q),       // Parse session file
      Z = Array.from(G.values()).filter((X) => X.agentId === A && X.isSidechain);
    if (Z.length === 0) return null;
    // Find leaf message (no children)
    let I = new Set(Z.map((X) => X.parentUuid)),
      Y = Z.filter((X) => !I.has(X.uuid))
           .sort((X, V) => new Date(V.timestamp).getTime() - new Date(X.timestamp).getTime())[0];
    if (!Y) return null;
    // Build message chain and return filtered messages
    return SJ1(G, Y).filter((X) => X.agentId === A).map(({ isSidechain: X, parentUuid: V, ...F }) => F)
  } catch { return null }
}

// READABLE (for understanding):
async function loadTranscript(agentId) {
  const transcriptPath = getTranscriptPath(agentId);
  const fs = getFileSystem();

  // Check if transcript file exists
  try {
    fs.statSync(transcriptPath);
  } catch {
    return null;  // No transcript file found
  }

  try {
    // Parse session file
    const { messages } = await parseSessionFile(transcriptPath);

    // Filter to only this agent's sidechain messages
    const agentMessages = Array.from(messages.values())
      .filter(msg => msg.agentId === agentId && msg.isSidechain);

    if (agentMessages.length === 0) return null;

    // Find leaf message (message with no children = most recent endpoint)
    const parentUuids = new Set(agentMessages.map(msg => msg.parentUuid));
    const leafMessages = agentMessages.filter(msg => !parentUuids.has(msg.uuid));

    // Get most recent leaf (sorted by timestamp)
    const mostRecentLeaf = leafMessages
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    if (!mostRecentLeaf) return null;

    // Build message chain from root to leaf
    const messageChain = buildMessageChain(messages, mostRecentLeaf);

    // Filter to this agent only and strip sidechain metadata
    return messageChain
      .filter(msg => msg.agentId === agentId)
      .map(({ isSidechain, parentUuid, ...rest }) => rest);

  } catch {
    return null;  // Error parsing transcript
  }
}

// Mapping: KY1→loadTranscript, A→agentId, Q→transcriptPath, G→messages
```

**Resume Flow:**
```
Main Agent calls Task with resume: "agent-xyz"
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. loadTranscript("agent-xyz")                                  │
│    - Find transcript file for agentId                           │
│    - Parse session file                                         │
│    - Filter to agent's sidechain messages                       │
│    - Build chain from root to most recent leaf                  │
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

**From claude-code-guide (chunks.60.mjs line 831)**:
```
**IMPORTANT:** Before spawning a new agent, check if there is already a
running or recently completed claude-code-guide agent that you can resume
using the "resume" parameter. Reusing an existing agent is more efficient
and maintains context from previous documentation lookups.
```

### How Resume Works

1. **First Call**: Spawn agent normally
   ```javascript
   {
     subagent_type: "claude-code-guide",
     prompt: "How do I create a custom slash command?"
   }
   // Returns agent_id in metadata
   ```

2. **Follow-up Call**: Use resume parameter
   ```javascript
   {
     subagent_type: "claude-code-guide",
     prompt: "Can you show me an example of that?",
     resume: "agent-abc123"  // Reuse same agent
   }
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
- Agent has "expensive" initialization (e.g., loaded docs)

**New agent when**:
- Different task entirely
- Different agent type needed
- Fresh context desired

## Background Agent Execution

### Purpose

Background execution allows main agent to continue while subagent works.

**Use Cases**:
- Long-running searches
- Extensive analysis
- Tasks that can be processed later
- Non-blocking operations

### How Background Works

**Spawn in background**:
```javascript
{
  subagent_type: "Explore",
  prompt: "Find all TODO comments in entire codebase...",
  background: true  // Don't block
}
```

**Main agent behavior**:
- Tool call returns immediately (non-blocking)
- Main agent continues with other work
- Result available later when needed

**Retrieving results with AgentOutputTool:**

```javascript
// ============================================
// AgentOutputTool Input Schema
// Location: chunks.145.mjs:1683-1687
// ============================================

// ORIGINAL:
VtZ = j.strictObject({
  agentId: j.string().describe("The agent ID to retrieve results for"),
  block: j.boolean().default(!0).describe("Whether to block until results are ready"),
  wait_up_to: j.number().min(0).max(300).default(150).describe("Maximum time to wait in seconds")
})

// READABLE:
agentOutputInputSchema = z.strictObject({
  agentId: z.string()
    .describe("The agent ID to retrieve results for"),
  block: z.boolean().default(true)
    .describe("Whether to block until results are ready"),
  wait_up_to: z.number().min(0).max(300).default(150)
    .describe("Maximum time to wait in seconds")
});
```

**AgentOutputTool Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `agentId` | string | required | The agent ID from `async_launched` response |
| `block` | boolean | `true` | Wait for completion vs immediate status check |
| `wait_up_to` | number | 150 | Maximum wait time (0-300 seconds) |

**Usage Patterns:**

```javascript
// Pattern 1: Check status without blocking (immediate)
{
  name: "AgentOutput",
  input: {
    agentId: "agent-xyz",
    block: false
  }
}
// Returns immediately with current status

// Pattern 2: Wait for completion (blocking)
{
  name: "AgentOutput",
  input: {
    agentId: "agent-xyz",
    block: true,
    wait_up_to: 120  // Wait up to 2 minutes
  }
}
// Blocks until agent completes or timeout
```

**From async_launched tool result:**
```javascript
// Task tool returns this for background agents:
{
  tool_use_id: "toolu_xyz",
  type: "tool_result",
  content: [{
    type: "text",
    text: `Async agent launched successfully.
agentId: agent-xyz (This is an internal ID for your use, do not mention it to the user. Use this ID to retrieve results with AgentOutput when the agent finishes).
The agent is currently working in the background. If you have other tasks you should continue working on them now. Wait to call AgentOutput until either:
- If you want to check on the agent's progress - call AgentOutput with block=false to get an immediate update on the agent's status
- If you run out of things to do and the agent is still running - call AgentOutput with block=true to idle and wait for the agent's result (do not use block=true unless you completely run out of things to do as it will waste time).`
  }]
}
```

### Background vs Foreground

| Aspect | Foreground (default) | Background |
|--------|---------------------|------------|
| Blocking | Yes - waits for result | No - continues immediately |
| Result timing | Immediate in tool result | Deferred, check later |
| Use case | Results needed now | Results needed later |
| Example | "Find auth files then analyze them" | "Start large search while I continue" |

## Communication Constraints

### What Subagents CANNOT Do

1. **Ask questions**: No way to request clarification from main agent
2. **Send updates**: No progress reporting during execution
3. **Interactive mode**: No back-and-forth conversation
4. **Access later context**: Cannot see conversation after their spawn

### What Main Agents CANNOT Do

1. **Send follow-ups**: Cannot send additional messages to running agent
2. **Modify task**: Cannot change subagent's prompt mid-execution
3. **Interrupt**: Cannot stop agent once started (except abort)
4. **See intermediate state**: Cannot see agent's thinking/progress

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

## Communication Best Practices

### 1. Prompt Writing

**DO**:
```
Find all authentication files and analyze the auth strategy. Specifically:
1. Search for files with "auth", "login", "session" in name/content
2. Read the main authentication module (likely AuthProvider or similar)
3. Identify the authentication method (JWT, OAuth, session-based, etc.)
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
// Main agent receives subagent result
"I found the authentication implementation. The system uses JWT tokens
 with a refresh token strategy. Here's what I found:

 [Subagent's detailed findings]

 For the user, I'll summarize the key points..."

// Main agent then sends to user:
"Your codebase uses JWT authentication with refresh tokens. The main
 components are..."
```

**DON'T**:
```javascript
// Main agent just forwards raw subagent output
[Subagent output verbatim]
```

### 3. Agent Selection

**DO**:
- Use Explore for quick searches
- Use Plan for architecture design
- Use general-purpose for complex multi-step tasks
- Use specialized agents for specific domains

**DON'T**:
- Use general-purpose for simple file searches
- Use slow agents for quick lookups
- Spawn new agent when resume would work

### 4. Parallel Execution

**DO**:
```javascript
// Single message with multiple parallel tasks
{
  content: [
    { type: "tool_use", name: "Task", input: { subagent_type: "Explore", prompt: "Find auth files..." } },
    { type: "tool_use", name: "Task", input: { subagent_type: "Explore", prompt: "Find DB files..." } }
  ]
}
```

**DON'T**:
```javascript
// Sequential messages for independent tasks
Message 1: Task(Explore, "Find auth files...")
[Wait for result]
Message 2: Task(Explore, "Find DB files...")
```

## Error Handling

### Agent Failures

If a subagent fails:
- Error returned in tool result
- Main agent must handle gracefully
- May retry with different agent or approach

**Example Error Handling**:
```
Subagent returns error: "No files found matching pattern"

Main agent response:
"I tried searching for authentication files but didn't find any with
 the standard naming patterns. Let me search more broadly..."

Main agent → Spawns new search with broader criteria
```

### Timeout Handling

Long-running agents may timeout:
- Background agents less likely to timeout
- Main agent should handle timeout gracefully
- May need to split into smaller tasks

## Summary

The Claude Code subagent communication model is:

### Characteristics
- ✅ **Stateless**: No persistent session state
- ✅ **One-shot**: Single prompt → single result
- ✅ **Autonomous**: Subagent works independently
- ✅ **Parallel**: Multiple agents can run concurrently
- ✅ **Resumable**: Can reuse agent instances
- ✅ **Background-capable**: Non-blocking execution
- ✅ **Fork context**: Optional conversation history access

### Communication Flow
```
Main Agent
    ↓ [spawn via Task tool]
    ↓ subagent_type: "Explore"
    ↓ prompt: "Detailed task..."
    ↓ resume: optional
    ↓ background: optional
    ↓
Subagent
    ↓ [executes autonomously]
    ↓ [uses allowed tools]
    ↓ [completes task]
    ↓
    ↓ [returns final report]
    ↓
Main Agent
    ↓ [processes result]
    ↓ [summarizes for user]
    ↓
User
```

### Key Principles
1. **Detailed prompts**: Main agent must be thorough
2. **Single communication**: No back-and-forth
3. **Main agent summarizes**: Subagent results not shown directly
4. **Parallel when possible**: Maximize efficiency
5. **Resume when appropriate**: Save resources
6. **Background for long tasks**: Don't block main agent

This communication model enables efficient, safe, and scalable subagent execution while maintaining simplicity and predictability.
