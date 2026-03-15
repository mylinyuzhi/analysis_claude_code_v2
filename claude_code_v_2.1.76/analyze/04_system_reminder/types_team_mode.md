# System Reminder Types: Team Mode

> **Module**: System Reminders - Team/Swarm Types
> **Version**: Claude Code 2.1.38
> **Source**: `chunks.173.mjs:699-733`, `chunks.142.mjs:2791-2813`

---

## Table of Contents

- [Overview](#overview)
- [teammate_mailbox](#teammate_mailbox)
- [team_context](#team_context)
- [Trigger Conditions](#trigger-conditions)
- [Code Paths](#code-paths)
- [Configuration](#configuration)

---

## Overview

Team mode types are **checked before the main switch statement** in `normalizeAttachmentForAPI` (K2z). They are only processed when `l8()` (isTeamMode) returns `true`, indicating the current agent is part of a team/swarm.

```
┌───────────────────────────────────────────────────────────────┐
│            normalizeAttachmentForAPI (K2z) Entry               │
│                   chunks.173.mjs:698                           │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ↓
                ┌───────────────────────┐
                │   l8() === true ?     │  ← Team mode check
                │   (isTeamMode)        │
                └───────────┬───────────┘
                    │ YES       │ NO
                    ↓           ↓
         ┌──────────────────┐   Skip to main switch
         │ Pre-switch check │
         │ teammate_mailbox │
         │ team_context     │
         └──────────────────┘
```

---

## Trigger Source Summary

Each team mode type has a specific producer function with distinct trigger conditions:

| Type | Producer Function | Location | Key Trigger Logic |
|------|-------------------|----------|-------------------|
| `teammate_mailbox` | `kIY` (getTeammateMailboxAttachment) | chunks.142.mjs:2791-2794 | `l8()` (isTeamMode) returns true |
| `team_context` | `LIY` (getTeamContextAttachment) | chunks.142.mjs:2796-2813 | `i3()` (teamName) && `ID()` (agentId) |

### Team Mode Detection

```javascript
// Location: chunks.142.mjs:2797-2800
let teamName = getTeamName();      // i3()
let agentId = getAgentId();        // ID()
let agentName = getAgentName();    // g5()

if (!teamName || !agentId) return [];
```

### Skip Condition for team_context

The `team_context` type has a skip condition to avoid redundant attachments:

```javascript
// Location: chunks.142.mjs:2801
// Skip if conversation already has assistant messages
if (messages.some(msg => msg.type === "assistant")) return [];
```

This ensures team context is only attached at the beginning of a conversation.

### Team Resource Paths

```javascript
// Location: chunks.142.mjs:2802-2804
let teamsBaseDir = getTeamsBaseDirectory();  // O8()
let teamConfigPath = `${teamsBaseDir}/teams/${teamName}/config.json`;
let taskListPath = `${teamsBaseDir}/tasks/${teamName}/`;
```

---

## teammate_mailbox

### What It Does

Delivers messages from other teammates in the swarm to the current agent. This enables inter-agent communication in team/swarm mode.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Team mode active | `l8()` returns `true` |
| Has unread messages | Agent's mailbox contains messages from teammates |
| Session memory type | Not `"session_memory"` (excluded to avoid duplicate messages) |

### Source Code

#### Producer Function

```javascript
// ============================================
// getTeammateMailboxAttachment - Produce teammate mailbox attachment
// Location: chunks.142.mjs:2791-2794
// ============================================

// ORIGINAL (for source lookup):
async function kIY(A) {
    if (!l8()) return [];
    return []
}

// READABLE (for understanding):
async function getTeammateMailboxAttachment(sessionContext) {
    if (!isTeamMode()) return [];
    // Currently returns empty - mailbox retrieval is handled elsewhere
    return [];
}

// Mapping: kIY→getTeammateMailboxAttachment, A→sessionContext, l8→isTeamMode
```

**Note:** The producer function currently returns an empty array. Actual mailbox message retrieval is handled through a different mechanism (TeammateTool).

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - teammate_mailbox case
// Location: chunks.173.mjs:700-703
// ============================================

// ORIGINAL (for source lookup):
if (A.type === "teammate_mailbox") return [c6({
    content: Uzz().formatTeammateMessages(A.messages),
    isMeta: !0
})];

// READABLE (for understanding):
if (attachment.type === "teammate_mailbox") {
    return [createUserMessage({
        content: formatTeammateMessages(attachment.messages),
        isMeta: true
    })];
}

// Mapping: A→attachment, c6→createUserMessage, Uzz→getTeammateMessageFormatter
```

### Output Format

The message is formatted by `Uzz().formatTeammateMessages()`. The output is a user message with `isMeta: true`.

**Example structure:**
```
<system-reminder>
[Formatted teammate messages here]
</system-reminder>
```

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Empty mailbox | No attachment produced |
| Non-team mode | Skipped entirely |
| Session memory mode | Excluded to prevent duplicate messages |

---

## team_context

### What It Does

Provides the current agent with its team identity, name, and resource paths. This establishes the agent's role within the team and tells it where to find team configuration and task lists.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Team mode active | `l8()` returns `true` |
| First assistant message | Only produced when `messages.some((O) => O.type === "assistant")` is `false` |
| Team context exists | `i3()` (teamName) and `ID()` (agentId) are not null |

### Source Code

#### Producer Function

```javascript
// ============================================
// getTeamContextAttachment - Produce team context attachment
// Location: chunks.142.mjs:2796-2813
// ============================================

// ORIGINAL (for source lookup):
function LIY(A) {
    let q = i3(),
        K = ID(),
        Y = g5();
    if (!q || !K) return [];
    if (A.some((O) => O.type === "assistant")) return [];
    let w = O8(),
        H = `${w}/teams/${q}/config.json`,
        $ = `${w}/tasks/${q}/`;
    return [{
        type: "team_context",
        agentId: K,
        agentName: Y || K,
        teamName: q,
        teamConfigPath: H,
        taskListPath: $
    }]
}

// READABLE (for understanding):
function getTeamContextAttachment(messages) {
    let teamName = getCurrentTeamName();
    let agentId = getCurrentAgentId();
    let agentName = getCurrentAgentName();

    // Require team name and agent ID
    if (!teamName || !agentId) return [];

    // Only send at conversation start (before first assistant message)
    if (messages.some((msg) => msg.type === "assistant")) return [];

    let basePath = getTeamDataPath();
    let teamConfigPath = `${basePath}/teams/${teamName}/config.json`;
    let taskListPath = `${basePath}/tasks/${teamName}/`;

    return [{
        type: "team_context",
        agentId: agentId,
        agentName: agentName || agentId,
        teamName: teamName,
        teamConfigPath: teamConfigPath,
        taskListPath: taskListPath
    }];
}

// Mapping: LIY→getTeamContextAttachment, A→messages, q→teamName, K→agentId, Y→agentName, w→basePath, H→teamConfigPath, $→taskListPath, i3→getCurrentTeamName, ID→getCurrentAgentId, g5→getCurrentAgentName, O8→getTeamDataPath
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - team_context case
// Location: chunks.173.mjs:704-732
// ============================================

// ORIGINAL (for source lookup):
if (A.type === "team_context") return [c6({
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
  "operation": "write",
  "target_agent_id": "team-lead",
  "value": "Your message here"
}
\`\`\`
</system-reminder>`,
    isMeta: !0
})]

// READABLE (for understanding):
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
  "operation": "write",
  "target_agent_id": "team-lead",
  "value": "Your message here"
}
\`\`\`
</system-reminder>`,
        isMeta: true
    })];
}

// Mapping: A→attachment, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
# Team Coordination

You are a teammate in team "my-team".

**Your Identity:**
- Name: researcher

**Team Resources:**
- Team config: ~/.claude/teams/my-team/config.json
- Task list: ~/.claude/tasks/my-team/

**Team Leader:** The team lead's name is "team-lead". Send updates and completion notifications to them.

Read the team config to discover your teammates' names. Check the task list periodically. Create new tasks when work should be divided. Mark tasks resolved when complete.

**IMPORTANT:** Always refer to teammates by their NAME (e.g., "team-lead", "analyzer", "researcher"), never by UUID. When messaging, use the name directly:

```json
{
  "operation": "write",
  "target_agent_id": "team-lead",
  "value": "Your message here"
}
```
</system-reminder>
```

### Key Insights

1. **One-time injection**: The team context is only sent once at the beginning of the conversation (before the first assistant message).

2. **Identity establishment**: The reminder tells the agent its own name, which is critical for proper team communication.

3. **Resource discovery**: Paths to team config and task list enable the agent to discover teammates and coordinate work.

4. **Communication protocol**: The JSON example shows the expected format for inter-agent messaging via TeammateTool.

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Missing team name or agent ID | Returns empty array, no reminder |
| After first assistant message | No reminder (already established identity) |
| Non-team mode | Skipped by pre-switch check |

---

## Trigger Conditions

### Team Mode Detection

```javascript
// ============================================
// isTeamMode - Check if agent is in team/swarm mode
// Location: chunks.142.mjs (referenced)
// ============================================

// The l8() function checks whether the current session is running
// in team/swarm mode. This gates all team-specific reminders.
```

### Condition Summary

| Type | Team Mode Required | Other Conditions |
|------|-------------------|------------------|
| `teammate_mailbox` | Yes | Has unread messages, not session_memory mode |
| `team_context` | Yes | No previous assistant messages, has teamName + agentId |

---

## Code Paths

### Attachment Production Path

```
assembleAttachments (phY)
    │
    ├── User-dependent producers (J)
    │   └── (none for team types)
    │
    ├── Always-computed producers (X)
    │   └── [...l8() ? [
    │           ...w === "session_memory" ? [] : [gw("teammate_mailbox", ...)],
    │           gw("team_context", ...)
    │       ] : []]
    │
    └── Main-agent-only producers (D)
        └── (none for team types)
```

### Normalization Path

```
normalizeAttachmentForAPI (K2z)
    │
    ├── Pre-switch check
    │   │
    │   ├── if (l8()) {              // Team mode check
    │   │     if (type === "teammate_mailbox") → [c6(...)]
    │   │     if (type === "team_context") → [c6(...)]
    │   │ }
    │   │
    │   └── (falls through to main switch if not team type)
    │
    └── Main switch statement
        └── (team types handled above)
```

---

## Configuration

### Constants

No specific constants for team mode reminders. Configuration is derived from:

| Setting | Source |
|---------|--------|
| Team name | `i3()` - getCurrentTeamName() |
| Agent ID | `ID()` - getCurrentAgentId() |
| Agent name | `g5()` - getCurrentAgentName() |
| Base path | `O8()` - getTeamDataPath() |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | Disables all attachment production |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions in this document:

- `getTeammateMailboxAttachment` (kIY) - Teammate mailbox producer, `chunks.142.mjs:2791-2794`
- `getTeamContextAttachment` (LIY) - Team context producer, `chunks.142.mjs:2796-2813`
- `normalizeAttachmentForAPI` (K2z) - Main dispatcher, `chunks.173.mjs:698-1131`
- `isTeamMode` (l8) - Team mode check
- `getCurrentTeamName` (i3) - Get team name
- `getCurrentAgentId` (ID) - Get agent ID
- `getCurrentAgentName` (g5) - Get agent display name
- `getTeamDataPath` (O8) - Get team data directory path
- `createUserMessage` (c6) - Message factory

---

## Related Documents

- [README.md](./README.md) - Documentation index
- [implementation_details.md](./implementation_details.md) - Core implementation
- [attachment_producers.md](./attachment_producers.md) - Producer functions
- [types_mode_control.md](./types_mode_control.md) - Delegate mode types