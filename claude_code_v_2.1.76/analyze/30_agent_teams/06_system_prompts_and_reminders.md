# System Prompts & Context Injection

> **Module**: Agent Teams - Teammate Prompt Engineering
> **Version**: Claude Code 2.1.76
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

### 3.4 Team Context System Reminder (Attachment)

**Implementation** - How team context is injected via the attachment system:

```javascript
// ============================================
// normalizeAttachmentForAPI - Team context attachment to system reminder
// Location: chunks.174.mjs:3-37
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (E7()) {
        if (A.type === "teammate_mailbox") return [p1({
            content: Kzz().formatTeammateMessages(A.messages),
            isMeta: !0
        })];
        if (A.type === "team_context") return [p1({
            content: `<system-reminder>
# Team Coordination

You are a teammate in team "${A.teamName}".

**Your Identity:**
- Name: ${A.agentName}

**Team Resources:**
- Team config: ${A.teamConfigPath}
- Task list: ${A.taskListPath}

**Team Leader:** The team lead's name is "team-lead". Send updates and completion notifications to them.

Read the team config to discover your teammates' names. Check the task list periodically. Create new tasks when work should be divided. Mark tasks resolved when complete.

**IMPORTANT:** Always refer to teammates by their NAME (e.g., "team-lead", "analyzer", "researcher"), never by UUID. When messaging, use the name directly:

\`\`\`json
{
  "to": "team-lead",
  "message": "Your message here",
  "summary": "Brief 5-10 word preview"
}
\`\`\`
</system-reminder>`,
            isMeta: !0
        })]
    }
    // ... other attachment types handled in switch statement
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Only process team context if agent teams feature is enabled
    if (!isAgentTeamsEnabled()) {
        // Fall through to standard attachment handling
    }

    // Handle teammate mailbox (inter-agent messages)
    if (attachment.type === "teammate_mailbox") {
        return [createUserMessage({
            content: formatTeammateMessages(attachment.messages),
            isMeta: true  // Not shown in chat UI, only in API context
        })];
    }

    // Handle team context (identity injection)
    if (attachment.type === "team_context") {
        return [createUserMessage({
            content: `<system-reminder>
# Team Coordination

You are a teammate in team "${attachment.teamName}".

**Your Identity:**
- Name: ${attachment.agentName}

**Team Resources:**
- Team config: ${attachment.teamConfigPath}
- Task list: ${attachment.taskListPath}

**Team Leader:** The team lead's name is "team-lead". Send updates and completion notifications to them.

Read the team config to discover your teammates' names. Check the task list periodically. Create new tasks when work should be divided. Mark tasks resolved when complete.

**IMPORTANT:** Always refer to teammates by their NAME (e.g., "team-lead", "analyzer", "researcher"), never by UUID. When messaging, use the name directly:

\`\`\`json
{
  "to": "team-lead",
  "message": "Your message here",
  "summary": "Brief 5-10 word preview"
}
\`\`\`
</system-reminder>`,
            isMeta: true
        })];
    }

    // ... handle other attachment types
}

// Mapping: Ui8→normalizeAttachmentForAPI, E7→isAgentTeamsEnabled, p1→createUserMessage
```

**Why isMeta: true**:

- **Hidden from chat UI**: Team context appears in LLM context but not in conversation history
- **Sent to API**: Included in `messages` array sent to Claude
- **Token-efficient**: Meta messages are preferentially stripped during compaction

**Attachment lifecycle**:

```
Team spawn (TeamCreate tool)
  ↓
getTeamContextAttachment() produces attachment object:
  {
    type: "team_context",
    teamName: "web-app-team",
    agentName: "backend-dev",
    teamConfigPath: "~/.claude/teams/web-app-team.json",
    taskListPath: "~/.claude/tasks/web-app-team/"
  }
  ↓
assembleAllAttachments() includes in attachment list
  ↓
normalizeAttachmentForAPI() transforms to system-reminder message
  ↓
Sent to LLM API as user message with isMeta: true
```

### 3.5 Teammate Mailbox Attachment

**How incoming messages become system reminders**:

```javascript
// ============================================
// getTeammateMailboxAttachment - Produce mailbox attachment
// Location: chunks.147.mjs
// ============================================

// Called during attachment assembly for each agent loop iteration
async function getTeammateMailboxAttachment(agentName, teamName) {
    const messages = await readUnreadMessages(agentName, teamName);

    if (messages.length === 0) {
        return null;  // No unread messages
    }

    return {
        type: "teammate_mailbox",
        messages: messages.map(msg => ({
            from: msg.from,
            text: msg.text,
            timestamp: msg.timestamp
        }))
    };
}
```

**Normalization flow**:

```
getTeammateMailboxAttachment()
  ↓
Returns { type: "teammate_mailbox", messages: [...] }
  ↓
normalizeAttachmentForAPI() checks type
  ↓
Returns [createUserMessage({
    content: formatTeammateMessages(attachment.messages),
    isMeta: true
})]
  ↓
Becomes system-reminder in LLM context
```

**Why separate from team_context**:

| Attachment Type | Purpose | When Produced |
|-----------------|---------|---------------|
| **team_context** | Identity + team resources (static) | Once at spawn, refreshed per turn |
| **teammate_mailbox** | Incoming messages (dynamic) | Each poll cycle with unread messages |

**Cross-reference**: See [04_system_reminder/](../04_system_reminder/) for the full attachment system architecture.

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

## 7. Cross-Reference: 04_system_reminder Integration

### 7.1 Attachment System Integration

The team context and teammate mailbox attachments are processed through the centralized attachment system documented in [04_system_reminder/](../04_system_reminder/).

**Integration flow:**

```
┌──────────────────────────────────────────────────────────────────┐
│                    Attachment Production                          │
│                    chunks.147.mjs                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  assembleAllAttachments(_uY)                                      │
│       │                                                           │
│       ├─→ getTeamContextAttachment(AmY)                           │
│       │     • Produces: { type: "team_context", ... }            │
│       │     • Trigger: isTeamMode() && !hasAssistantMessages()   │
│       │                                                           │
│       └─→ getTeammateMailboxAttachment(euY)                       │
│             • Produces: { type: "teammate_mailbox", messages: [] }│
│             • Trigger: isTeamMode() && hasUnreadMessages()        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                    Attachment Normalization                        │
│                    chunks.174.mjs:3-37                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  normalizeAttachmentForAPI(Ui8)                                   │
│       │                                                           │
│       ├─→ if (type === "teammate_mailbox")                        │
│       │     └─→ formatTeammateMessages() → system-reminder       │
│       │                                                           │
│       └─→ if (type === "team_context")                            │
│             └─→ inject identity + resources → system-reminder    │
│                                                                   │
│  All output: { role: "user", content: "...", isMeta: true }      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                    LLM API Message Array                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  messages: [                                                      │
│    { role: "user", content: "<system-reminder>Team...</>",       │
│      isMeta: true },                                              │
│    { role: "user", content: "Actual user message..." },          │
│    ...                                                            │
│  ]                                                                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 7.2 Key Symbol Cross-Reference

| 30_agent_teams Symbol | 04_system_reminder Symbol | Purpose |
|-----------------------|---------------------------|---------|
| `normalizeAttachmentForAPI` (Ui8) | Same | Entry point for all attachment normalization |
| `isAgentTeamsEnabled` (E7) | Same | Feature flag check for team mode |
| `createUserMessage` (p1) | `createUserMessage` (c6) | Message factory with isMeta support |
| `formatTeammateMessages` | `formatTeammateMessages` | Message formatting utility |

### 7.3 isMeta Flag Behavior

The `isMeta: true` flag has critical implications:

| Aspect | Behavior |
|--------|----------|
| **UI visibility** | Not shown in TUI chat history |
| **API context** | Sent to LLM in messages array |
| **Compaction** | Preferentially stripped during token management |
| **Caching** | Eligible for ephemeral cache control |

**Why isMeta for team context:**

Team context is "hidden context" that informs the LLM without cluttering the visible conversation. This enables:
1. **Clean UI**: User doesn't see repeated identity injection
2. **Token efficiency**: Can be stripped during compaction if needed
3. **Context persistence**: Maintained across conversation turns

### 7.4 Related Documents

- **[types_team_mode.md](../04_system_reminder/types_team_mode.md)** - Detailed team mode attachment types
- **[implementation_details.md](../04_system_reminder/implementation_details.md)** - Core attachment system implementation
- **[attachment_producers.md](../04_system_reminder/attachment_producers.md)** - All attachment producer functions

---

## 8. Deep Algorithm Analysis

### 8.1 normalizeAttachmentForAPI - Team Context Processing

**What it does:** Transforms team context and mailbox attachments into system-reminder format for LLM context injection.

**How it works (step-by-step):**

```javascript
// ============================================
// normalizeAttachmentForAPI - Team context attachment conversion
// Location: chunks.174.mjs:3-37
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (E7()) {
        if (A.type === "teammate_mailbox") return [p1({
            content: Kzz().formatTeammateMessages(A.messages),
            isMeta: !0
        })];
        if (A.type === "team_context") return [p1({
            content: `<system-reminder>
# Team Coordination

You are a teammate in team "${A.teamName}".

**Your Identity:**
- Name: ${A.agentName}

**Team Resources:**
- Team config: ${A.teamConfigPath}
- Task list: ${A.taskListPath}

**Team Leader:** The team lead's name is "team-lead". Send updates and completion notifications to them.

Read the team config to discover your teammates' names. Check the task list periodically. Create new tasks when work should be divided. Mark tasks resolved when complete.

**IMPORTANT:** Always refer to teammates by their NAME (e.g., "team-lead", "analyzer", "researcher"), never by UUID. When messaging, use the name directly:

\`\`\`json
{
  "to": "team-lead",
  "message": "Your message here",
  "summary": "Brief 5-10 word preview"
}
\`\`\`
</system-reminder>`,
            isMeta: !0
        })]
    }
    // ... other attachment types
}

// Mapping: Ui8→normalizeAttachmentForAPI, E7→isAgentTeamsEnabled, p1→createUserMessage,
//          A→attachment, Kzz→formatTeammateMessages
```

**Why this approach:**

1. **Feature flag check first (`E7()`)**: Only processes team attachments if agent teams is enabled, avoiding unnecessary work
2. **Type-based dispatch**: Different handling for `teammate_mailbox` vs `team_context` types
3. **isMeta: true**: Marks message as hidden from UI but visible to LLM - critical for clean UX
4. **Name-based messaging**: Enforces name-based addressing instead of UUIDs for better human readability

**Key insight:** The template string interpolation injects the agent's specific identity and resources into the system prompt, making each teammate's context unique while using the same code path.

### 8.2 Attachment Assembly Flow

**Complete flow from spawn to LLM context:**

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. Teammate Spawn (chunks.135.mjs:985)                          │
│    spawnInProcessTeammate() creates teammate with:              │
│    - agentId, agentName, teamName                               │
│    - Registers in teamConfig                                    │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│ 2. Agent Loop Start (chunks.134.mjs:1571)                       │
│    inProcessAgentRunner() calls attachment producers            │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│ 3. Attachment Production (chunks.147.mjs)                       │
│    assembleAllAttachments() calls:                              │
│    - getTeamContextAttachment() → { type: "team_context", ... } │
│    - getTeammateMailboxAttachment() → { type: "teammate_mailbox"│
│                                         messages: [...] }       │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│ 4. Attachment Normalization (chunks.174.mjs:3)                  │
│    normalizeAttachmentForAPI() transforms to:                   │
│    { role: "user", content: "<system-reminder>...",            │
│      isMeta: true }                                             │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│ 5. LLM API Call (chunks.169.mjs)                                │
│    Message array includes team context as hidden context        │
└──────────────────────────────────────────────────────────────────┘
```

**Performance characteristics:**
- Team context attachment: ~1-2ms (string interpolation)
- Mailbox read: ~1-5ms (filesystem read with lock)
- Total overhead per turn: ~5-10ms

### 8.3 isMeta Flag Behavior

**Critical implications for team context:**

| Aspect | isMeta: true | isMeta: false |
|--------|-------------|---------------|
| **UI visibility** | Hidden from TUI chat | Shown in chat history |
| **API context** | Sent to LLM in messages array | Sent to LLM in messages array |
| **Compaction priority** | Preferentially stripped first | Preserved longer |
| **Token accounting** | Not counted in visible tokens | Counted normally |

**Why preferential compaction matters:**

During token management (when context exceeds limits), `isMeta: true` messages are the first to be removed. This ensures:
1. User-visible conversation is preserved
2. Team context may need re-injection if stripped
3. Re-injection happens automatically on next turn via attachment system

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:

- `buildTeammateSystemPrompt` - Construct teammate identity and context
- `getTeamMembersDescription` - Generate team roster
- `inProcessAgentRunner` (XNY) - Agent runner with system prompt injection @ chunks.134.mjs:1571
- `normalizeAttachmentForAPI` (Ui8) - Team context attachment conversion @ chunks.174.mjs:3
- `isAgentTeamsEnabled` (E7) - Feature flag check for team mode @ chunks.50.mjs:2543
- `getTeamContextAttachment` (AmY) - Produce team context attachment @ chunks.147.mjs
- `getTeammateMailboxAttachment` (euY) - Produce mailbox attachment @ chunks.147.mjs
- `createUserMessage` (p1) - Message factory with isMeta support @ chunks.173.mjs:1378

## Cross-References

- **[04_system_reminder/](../04_system_reminder/)** - Full attachment system architecture, how `team_context` and `teammate_mailbox` attachments become system-reminders
- **[pane_backend_executor.md](./pane_backend_executor.md)** - Agent runner lifecycle (XNY)
- **[01_complete_chain_analysis.md](./01_complete_chain_analysis.md)** - Team creation and spawning chain

## Source Locations

- `chunks.134.mjs:1571` - inProcessAgentRunner (XNY)
- `chunks.174.mjs:3` - normalizeAttachmentForAPI (Ui8)
- `chunks.173.mjs:531` - Plan mode prompt templates (buildPlanModeReminder)
- `chunks.175.mjs:2594` - TaskCompleted hook (executeTaskCompletedHooks)
- `chunks.147.mjs` - Teammate mailbox attachment assembly
- `chunks.50.mjs:2543` - isAgentTeamsEnabled (E7)

---

**Document Status**: Complete analysis of system prompt injection, team context, and teammate guidance with deep algorithm analysis.
