# System Prompts & Context Injection

> **Module**: Agent Teams - Teammate Prompt Engineering
> **Version**: Claude Code 2.1.38
> **Purpose**: How teammates receive identity, role, and team context

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Teammate Identity Injection](#2-teammate-identity-injection)
3. [Team Context Prompts](#3-team-context-prompts)
4. [Plan Mode Reminders](#4-plan-mode-reminders)
5. [Idle State Reminders](#5-idle-state-reminders)
6. [Tool Availability](#6-tool-availability)

---

## 1. Executive Summary

When a teammate agent spawns, it receives a **customized system prompt** that establishes:

1. **Identity**: Agent name, ID, role in team
2. **Team context**: Who else is on the team, how to communicate
3. **Work location**: Where to find tasks (`~/.claude/tasks/{team}/`)
4. **Available tools**: SendMessage, TaskUpdate, TaskList, etc.
5. **Mode constraints**: Plan mode requirements, if applicable

**Key insight**: Teammates are **autonomous agents with team awareness**, not RPC servants. They have agency to decide how to approach work, when to ask questions, and whether to approve shutdown.

---

## 2. Teammate Identity Injection

### 2.1 System Prompt Template

**Built in** `inProcessAgentRunner` or CLI teammate bootstrap:

```javascript
// ============================================
// buildTeammateSystemPrompt - Construct identity and context
// ============================================

function buildTeammateSystemPrompt(config) {
    const { agentName, agentId, teamName, initialPrompt } = config;

    return `
You are ${agentName} in team "${teamName}".

Your agent ID: ${agentId}
Your role: ${initialPrompt}

## Team Members

${getTeamMembersDescription(teamName)}

## Communication

- Use **SendMessage** to send messages to other team members
  - SendMessage(type: "message", recipient: "team-lead", content: "...")
  - SendMessage(type: "broadcast", content: "...") for team-wide announcements

## Task Management

- Task list location: ~/.claude/tasks/${teamName}/
- Use **TaskList** to see available tasks
- Use **TaskUpdate** to claim and update tasks
- Tasks may have dependencies (blockedBy field) - check before claiming

## Coordination Patterns

- **Ask questions**: If unclear about requirements, send message to team-lead
- **Share progress**: Update task status regularly so team can track progress
- **Collaborate**: You can message other teammates directly for clarification

${additionalReminders(config)}
    `.trim();
}
```

### 2.2 Team Members Description

**Generated from team config**:

```javascript
function getTeamMembersDescription(teamName) {
    const config = readTeamConfig(teamName);

    return `
Team lead: team-lead (coordinator)
Teammates:
${config.members.map(m => `  - ${m.agentName} (${m.backendType})`).join('\n')}
    `.trim();
}

// Example output:
// Team lead: team-lead (coordinator)
// Teammates:
//   - backend-dev (in-process)
//   - frontend-dev (split-pane)
//   - db-specialist (split-pane)
```

**Why include backend type**: Helps understand teammate availability (in-process = always online, pane-based = might exit).

### 2.3 Initial Prompt Integration

**User-provided role** (from SpawnTeammate tool):

```javascript
SpawnTeammate({
  agentName: "backend-dev",
  prompt: `You are the backend developer for this project.

Your responsibilities:
- Implement REST API endpoints using Express.js
- Write database migrations
- Ensure proper error handling and validation

When implementing endpoints:
1. Follow RESTful conventions
2. Add input validation
3. Write unit tests
4. Document API in OpenAPI spec`,

  planModeRequired: true
})
```

**Result**: `initialPrompt` appended to system prompt after team context.

**Why separate section**: Clear delineation between framework (team context) and domain (role-specific instructions).

---

## 3. Team Context Prompts

### 3.1 Task List Location

**Explicit filesystem path**:

```
Task list location: ~/.claude/tasks/web-app-team/
```

**Why absolute path**: Teammates might spawn in different working directories (pane-based). Absolute path ensures correct location.

**Auto-claim reminder**:

```
To claim a task:
1. Call TaskList to see available tasks
2. Call TaskUpdate(taskId: "...", status: "in_progress", owner: "${agentName}")
3. Complete the work
4. Call TaskUpdate(taskId: "...", status: "completed")

OR: Wait for automatic task assignment (if idle with no messages)
```

### 3.2 Communication Protocols

**SendMessage examples**:

```
Examples of SendMessage usage:

1. Ask question to team lead:
   SendMessage(type: "message", recipient: "team-lead", content: "What's the expected behavior for empty user list?", summary: "Question about empty list")

2. Share update with team:
   SendMessage(type: "broadcast", content: "API implementation complete, ready for frontend integration", summary: "API ready")

3. Request help from peer:
   SendMessage(type: "message", recipient: "frontend-dev", content: "Can you share the expected request format for POST /users?", summary: "Request format question")
```

**Why examples**: Concretizes abstract tool descriptions, shows idiomatic usage.

### 3.3 Dependency Awareness

**blockedBy explanation**:

```
When viewing tasks, check the 'blockedBy' field:

{
  "id": "task-2",
  "subject": "Implement POST /users",
  "blockedBy": ["task-1"],  ← This task cannot start until task-1 completes
  "status": "pending"
}

The system prevents claiming blocked tasks automatically, but you should understand dependencies when planning your work.
```

**Why explain manually**: Even though auto-claim enforces dependencies, teammates should understand WHY they can't claim certain tasks (better decision-making).

---

## 4. Plan Mode Reminders

### 4.1 Plan Mode System Prompt

**If `planModeRequired: true`**:

```javascript
function additionalReminders(config) {
    if (config.planModeRequired) {
        return `
## IMPORTANT: Plan Mode Requirement

You are in PLAN MODE. You MUST follow this workflow:

1. **Explore the codebase** (read-only operations)
   - Use Read tool to understand existing code
   - Use Grep to find relevant files
   - Use Glob to list files

2. **Design your implementation plan**
   - Outline the steps you'll take
   - Identify files to modify
   - Note any dependencies or risks

3. **Call ExitPlanMode** when ready
   - Your plan will be reviewed by the team lead
   - You CANNOT make changes until plan is approved

4. **Wait for approval**
   - Team lead will respond with plan_approval_response
   - If approved: proceed with implementation
   - If rejected: revise plan based on feedback

DO NOT:
- Make any code changes before plan approval
- Use Write or Edit tools in plan mode
- Execute code or run tests

DO:
- Read as much code as needed
- Ask questions via SendMessage
- Think carefully about architecture
        `.trim();
    }
    return '';
}
```

**Why explicit workflow**: Plan mode is unusual (read-only exploration phase). Without clear instructions, teammates might skip planning or make changes prematurely.

### 4.2 Plan Approval Flow

**Teammate's perspective**:

```
1. Explore codebase (Read, Grep tools)
2. Draft plan: "I will implement X by modifying files A, B, C. Steps: 1) ..., 2) ..., 3) ..."
3. Call ExitPlanMode (plan content passed to lead)
4. Poll loop receives message: "Plan approval request sent to team-lead"
5. Wait for team-lead's response
6. If approved: System prompt updated, Write/Edit tools enabled
7. Proceed with implementation
```

**Lead's perspective** (not teammate's concern, but for completeness):

```
1. Receive plan_approval_request message
2. Review plan content
3. SendMessage(type: "plan_approval_response", approve: true/false, feedback: "...")
4. Teammate's poll loop receives response
5. If approved: Teammate exits plan mode, begins implementation
```

---

## 5. Idle State Reminders

### 5.1 Idle Detection

**When triggered**: Poll loop completes work, no more messages/tasks available.

**Injected message**:

```
You have completed your assigned work. You are now idle.

Options:
1. Check task list for available tasks
   - Call TaskList to see pending tasks
   - Claim a task with TaskUpdate if interested

2. Ask team lead for new assignment
   - SendMessage(recipient: "team-lead", content: "I've completed my work. What should I do next?")

3. Wait for incoming messages
   - You will be notified when new messages arrive
   - Poll loop will automatically check every 500ms

4. (For pane-based teammates) You can exit
   - Send shutdown approval if you receive shutdown request
   - Or wait for team lead to initiate shutdown
```

**Why explicit options**: Prevents teammate from "hanging" in idle state without guidance.

### 5.2 Task Suggestion

**Proactive task discovery**:

```
If no messages arrive, the system will automatically scan the task list and assign you the next available task (if any). You do not need to manually claim tasks unless you want to prioritize specific work.
```

**Why mention auto-claim**: Sets expectation that teammate doesn't need to poll manually (Priority 5 does it automatically).

---

## 6. Tool Availability

### 6.1 Teammate Tool Subset

**Available tools** (subset of main agent tools):

| Tool | Available to Teammate? | Purpose |
|------|----------------------|---------|
| **SendMessage** | ✅ Yes | Inter-agent communication |
| **TaskList** | ✅ Yes | View available tasks |
| **TaskUpdate** | ✅ Yes | Claim and update tasks |
| **TaskGet** | ✅ Yes | View task details |
| **Read** | ✅ Yes | Read files |
| **Write** | ✅ Yes (after plan approval) | Create/overwrite files |
| **Edit** | ✅ Yes (after plan approval) | Modify files |
| **Bash** | ✅ Yes | Run commands |
| **Grep/Glob** | ✅ Yes | Search files |
| **TeamCreate** | ❌ No | Only lead can create teams |
| **TeamDelete** | ❌ No | Only lead can delete teams |
| **SpawnTeammate** | ❌ No | Only lead can spawn teammates |
| **ExitPlanMode** | ✅ Yes (if in plan mode) | Submit plan for approval |

**Why restrict team management tools**: Prevents teammates from spawning sub-teammates (avoid runaway agent proliferation).

### 6.2 Tool Descriptions

**SendMessage tool description** (shown to teammate):

```
name: SendMessage
description: Send a message to a team member or broadcast to all team members.
parameters:
  type: object
  properties:
    type:
      type: string
      enum: [message, broadcast, shutdown_response, plan_approval_response]
      description: Message type
    recipient:
      type: string
      description: Agent name of recipient (for type=message)
    content:
      type: string
      description: Message content
    summary:
      type: string
      description: Short 5-10 word summary for UI display (optional)
  required: [type, content]
```

**Why detailed schema**: Teammates must understand exact parameter structure to communicate correctly.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:

- `buildTeammateSystemPrompt` - Construct teammate identity and context
- `getTeamMembersDescription` - Generate team roster
- `inProcessAgentRunner` (GVY) - Agent runner with system prompt injection

## Source Locations

- `chunks.131.mjs:347` - inProcessAgentRunner (system prompt construction)
- `chunks.141.mjs:TBD` - Plan mode prompt templates
- `chunks.131.mjs:TBD` - Idle state reminders

---

**Document Status**: Complete analysis of system prompt injection, team context, and teammate guidance.
