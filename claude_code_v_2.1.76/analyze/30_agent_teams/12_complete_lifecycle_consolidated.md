# Complete Agent Team Lifecycle - Consolidated Analysis

> **Module**: Agent Teams - Complete Lifecycle Flow
> **Version**: Claude Code 2.1.76
> **Purpose**: Comprehensive end-to-end tracing of team lifecycle from creation to cleanup, synthesizing all analysis documents

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Phase 1: Team Creation](#2-phase-1-team-creation)
3. [Phase 2: Teammate Spawning](#3-phase-2-teammate-spawning)
4. [Phase 3: Task Distribution](#4-phase-3-task-distribution)
5. [Phase 4: Plan Mode Workflow](#5-phase-4-plan-mode-workflow)
6. [Phase 5: Message-Based Coordination](#6-phase-5-message-based-coordination)
7. [Phase 6: Task Execution](#7-phase-6-task-execution)
8. [Phase 7: Error Recovery](#8-phase-7-error-recovery)
9. [Phase 8: Graceful Shutdown](#9-phase-8-graceful-shutdown)
10. [Phase 9: Cleanup & Deletion](#10-phase-9-cleanup--deletion)
11. [Complete Flow Diagram](#11-complete-flow-diagram)
12. [State Transition Matrix](#12-state-transition-matrix)

---

## 1. Executive Summary

This document provides a **complete end-to-end trace** of the agent team lifecycle, synthesizing insights from all 17+ analysis documents. The lifecycle spans **9 distinct phases** from initial team creation through final cleanup.

**Complete Lifecycle Phases**:

```
Phase 1: Team Creation
   ↓
Phase 2: Teammate Spawning (In-Process / Split-Pane / Separate Window)
   ↓
Phase 3: Task Distribution (Auto-claim or Manual Assignment)
   ↓
Phase 4: Plan Mode Workflow (If plan_mode_required: true)
   ├─→ Plan Submission → Lead Review → Approval/Rejection
   └─→ Plan Revision Cycle (if rejected)
   ↓
Phase 5: Message-Based Coordination (Mailbox + Direct Messages)
   ↓
Phase 6: Task Execution (Tool calls, File edits, Agent loop)
   ├─→ Task Dependencies (Blocked tasks wait)
   └─→ Task Completion (Unblocks dependent tasks)
   ↓
Phase 7: Error Recovery (Retry, Rollback, Manual Intervention)
   ↓
Phase 8: Graceful Shutdown (Request/Approval Protocol)
   ↓
Phase 9: Cleanup & Deletion (Team directory, Tasks, Mailboxes)
```

**Total Duration** (typical team):
- Creation: ~1 second
- Spawning: 0.1s (in-process) or 1-2s (pane)
- Task execution: Minutes to hours
- Shutdown: 1-5 seconds
- Cleanup: ~1 second

**Key Architectural Decisions**:
1. **Filesystem-backed persistence**: All coordination state in `~/.claude/` directories
2. **Stateless teammates**: Ephemeral agents (no checkpoint/restore on restart)
3. **Poll-based messaging**: 500ms mailbox polling (no push notifications)
4. **File locking for atomicity**: Task claiming and message delivery use proper-lockfile
5. **No automatic recovery**: Crash requires manual team recreation

**Reference Documents**: This consolidated analysis synthesizes:
- [01_complete_chain_analysis.md](./01_complete_chain_analysis.md) - Original flow analysis
- [02_spawn_mechanisms_deep_dive.md](./02_spawn_mechanisms_deep_dive.md) - Spawning details
- [03_mailbox_and_locking.md](./03_mailbox_and_locking.md) - Messaging infrastructure
- [04_polling_priorities.md](./04_polling_priorities.md) - Poll loop behavior
- [07_plan_mode_team_integration.md](./07_plan_mode_team_integration.md) - Plan approval workflow
- [08_task_dependency_resolution.md](./08_task_dependency_resolution.md) - Task claiming algorithms
- [09_telemetry_monitoring.md](./09_telemetry_monitoring.md) - Logging and metrics
- [10_session_memory_persistence.md](./10_session_memory_persistence.md) - Storage and recovery
- [11_storage_cleanup_management.md](./11_storage_cleanup_management.md) - Cleanup procedures

---

## 2. Phase 1: Team Creation

### 2.1 Trigger: User Request or LLM Decision

**User input**:
```
User: "Create a team called 'web-app-team' to build a full-stack application"
```

**LLM reasoning**:
```
1. Recognizes task requires multiple skill domains (frontend, backend, database)
2. Has access to TeamCreate tool in available tools list
3. Decides autonomous team creation is appropriate
4. Generates TeamCreate tool call
```

**Tool call**:
```json
{
  "tool_name": "TeamCreate",
  "parameters": {
    "name": "web-app-team",
    "description": "Team to build full-stack web application with React frontend and Node.js backend"
  }
}
```

### 2.2 Team Config File Creation

**Step 1: Validate team name**
```javascript
// Sanitize team name (remove invalid characters)
let sanitizedName = sanitizeTeamName("web-app-team");  // "web-app-team"

// Check for existing team
let configPath = getTeamConfigPath(sanitizedName);
if (fileExists(configPath)) {
  throw Error(`Team "${sanitizedName}" already exists`);
}
```

**Step 2: Create team directory structure**
```bash
mkdir -p ~/.claude/teams/web-app-team/
mkdir -p ~/.claude/teams/web-app-team/mailboxes/team-lead/
```

**Step 3: Write initial team config**
```json
// File: ~/.claude/teams/web-app-team/team.json
{
  "name": "web-app-team",
  "description": "Team to build full-stack web application with React frontend and Node.js backend",
  "createdAt": "2025-01-15T14:00:00.000Z",
  "members": [
    {
      "name": "team-lead",
      "type": "lead",
      "mode": "delegate",
      "active": true,
      "color": "#6366f1"
    }
  ]
}
```

**Step 4: Update AppState**
```javascript
setAppState((state) => ({
  ...state,
  teamContext: {
    teamName: "web-app-team",
    isLead: true,
    memberColor: "#6366f1"
  }
}));
```

**Result**: Team created, lead established, ready for teammate spawning.

**Timing**: ~100-200ms (filesystem I/O + AppState update)

### 2.3 System Prompt Injection

**Team lead receives updated system prompt** with team management instructions:

```markdown
# Team Management (You are the Team Lead)

You are the team lead for "web-app-team". You coordinate teammates and manage tasks.

## Available Tools:
- TeamCreate - Create teammates (already done)
- SendMessage - Send messages to teammates
- TaskCreate/TaskUpdate - Manage shared task list
- ApproveTeammatePlan - Approve teammate plans (if plan_mode_required)
- RejectTeammatePlan - Reject teammate plans with feedback

## Workflow:
1. Break down work into tasks (TaskCreate)
2. Spawn teammates to work on tasks
3. Coordinate via SendMessage
4. Monitor progress and unblock teammates
5. Gracefully shutdown when done (SendMessage with type: shutdown_request)
```

**Why system prompt injection**:
- **Context awareness**: LLM knows it's a team lead
- **Tool discovery**: Learns about team management tools
- **Workflow guidance**: Understands coordination patterns

---

## 3. Phase 2: Teammate Spawning

### 3.1 Spawn Decision & Mode Selection

**LLM decides to spawn teammate**:
```
Team Lead: "I need a researcher to analyze authentication libraries"
[Generates tool call to spawn teammate]
```

**Spawn mode selection** (automatic based on environment):

```
if (isInProcessEnabled() && userPreference !== "always-pane") {
  spawnMode = "in-process";  // ← Default for speed
} else if (isInsideTmux() || isInsideIterm2()) {
  spawnMode = "split-pane";  // ← Terminal multiplexer available
} else {
  spawnMode = "separate-window";  // ← Fallback (opens new terminal)
}
```

**Permission mode selection**:
```json
{
  "name": "researcher",
  "mode": "plan",  // ← Requires plan approval before executing
  "task_id": "3",
  "description": "Research authentication libraries and recommend one"
}
```

### 3.2 In-Process Teammate Spawn

**What happens** (for `mode: "in-process"`):

**Step 1: Generate agent ID**
```javascript
let agentId = `researcher@web-app-team`;  // Format: {name}@{teamName}
```

**Step 2: Create teammate identity**
```javascript
let identity = {
  agentId: "researcher@web-app-team",
  agentName: "researcher",
  teamName: "web-app-team",
  parentSessionId: getCurrentSessionId(),
  planModeRequired: mode === "plan",  // true
  color: assignColor(),  // "#8b5cf6"
  isTeamLead: false,
  agentType: "teammate"
};
```

**Step 3: Register in AppState.tasks**
```javascript
setAppState((state) => ({
  ...state,
  tasks: {
    ...state.tasks,
    "researcher@web-app-team": {
      type: "in_process_teammate",
      identity: identity,
      status: "running",
      pendingUserMessages: [],
      terminated: false
    }
  }
}));
```

**Step 4: Start agent loop in background**
```javascript
// Launch async agent loop (non-blocking)
inProcessAgentRunner({
  identity: identity,
  taskId: "3",
  prompt: "Research authentication libraries and recommend one",
  abortController: new AbortController(),
  toolUseContext: { ...context },
  setAppState: setAppState,
  getAppState: getAppState
});
```

**Step 5: Update team config**
```json
// Append to members array in ~/.claude/teams/web-app-team/team.json
{
  "name": "researcher",
  "type": "in_process_teammate",
  "mode": "plan",
  "active": false,  // Initially idle
  "taskId": "3",
  "plan_mode_required": true,
  "color": "#8b5cf6",
  "awaitingPlanApproval": false
}
```

**Timing**: ~100ms (fast, no process spawning)

### 3.3 Split-Pane Teammate Spawn

**What happens** (for `mode: "split-pane"` in tmux):

**Step 1: Create new tmux pane**
```bash
# Execute tmux command to split window
tmux split-window -h -p 70 -t "claude-swarm:swarm-view"
```

**Step 2: Get new pane ID**
```bash
# Capture pane ID from tmux
paneId=$(tmux display-message -p '#{pane_id}')
# Result: "pane-123"
```

**Step 3: Set pane title**
```bash
tmux select-pane -t pane-123 -T "researcher"
```

**Step 4: Launch Claude in pane**
```bash
# Execute command in new pane
tmux send-keys -t pane-123 "claude code \
  --team web-app-team \
  --agent researcher \
  --task 3 \
  --mode plan \
  --parent-session ${SESSION_ID}" Enter
```

**Step 5: Update team config with pane info**
```json
{
  "name": "researcher",
  "type": "pane_teammate",
  "mode": "plan",
  "paneId": "pane-123",
  "backendType": "tmux",
  "taskId": "3",
  "plan_mode_required": true,
  "color": "#8b5cf6"
}
```

**Timing**: ~1-2 seconds (terminal pane creation + Claude startup)

### 3.4 Spawn Result & TUI Update

**Tool result returned to team lead**:
```json
{
  "success": true,
  "agent_name": "researcher",
  "spawn_mode": "in-process",
  "message": "Spawned researcher (in-process mode) with task #3"
}
```

**TUI updates** (for in-process mode):
```
┌─ Team: web-app-team ─────────────────────────────┐
│ ● team-lead (you) - Managing team                │
│ ■ researcher - Planning task... (plan mode)      │ ← New teammate appears
└───────────────────────────────────────────────────┘

Press Shift+Up/Down to navigate teammates
Press Enter to view teammate's output
```

**Teammate starts poll loop**:
```
[inProcessRunner] researcher@web-app-team starting poll loop (abort=false)
[inProcessRunner] researcher@web-app-team poll #1: checking mailbox
```

---

## 4. Phase 3: Task Distribution

### 4.1 Task Creation

**Team lead creates tasks**:
```json
// TaskCreate tool calls
[
  {
    "subject": "Research authentication libraries",
    "description": "Evaluate Passport.js, NextAuth, Auth0",
    "blockedBy": []
  },
  {
    "subject": "Implement user registration endpoint",
    "description": "POST /api/users with validation",
    "blockedBy": ["1"]  // Blocked by research task
  }
]
```

**Task files created**:
```bash
~/.claude/tasks/
├── 1.json  # Research task (status: pending)
└── 2.json  # Implementation task (status: pending, blockedBy: ["1"])
```

### 4.2 Auto-Claim Algorithm

**Teammate poll loop checks for tasks**:
```javascript
// Every 500ms, if no messages in mailbox:
let allTasks = getAllTasks(storageContext);
let nextTask = findNextAvailableTask(allTasks);

// findNextAvailableTask logic:
// 1. Filter to tasks with status = "pending"
// 2. Filter to tasks with no owner
// 3. Filter to tasks where ALL blockedBy tasks are completed
// 4. Return first matching task (or undefined)
```

**Task #1 is claimable** (no blockers):
```javascript
// Attempt atomic claim
let claimResult = attemptToClaimTask(storageContext, "1", "researcher");
// → Acquires file lock on ~/.claude/tasks/1.json
// → Checks dependencies again under lock
// → Sets task.owner = "researcher"
// → Writes to disk
// → Releases lock
```

**Task #2 is NOT claimable** (blocked by task #1):
```javascript
let task2 = { id: "2", blockedBy: ["1"], ... };
let activeTaskIds = new Set(["1", "3", "5"]);  // Task 1 is active
task2.blockedBy.every(id => !activeTaskIds.has(id));  // → false
// Task 2 NOT claimable (must wait for task 1 to complete)
```

### 4.3 Task Assignment Message

**Teammate receives task prompt**:
```javascript
let prompt = generatePromptFromTask(claimedTask);
// Result:
// "Complete all open tasks. Start with task #1:
//
//  Research authentication libraries
//
// Evaluate Passport.js, NextAuth, Auth0"
```

**Teammate agent loop processes prompt**:
```
[inProcessRunner] researcher@web-app-team processing prompt: Complete all open tasks. Start with task #1...
[Agent loop iteration begins]
```

---

## 5. Phase 4: Plan Mode Workflow

### 5.1 Plan Mode Activation

**Teammate spawned with `plan_mode_required: true`**:
```javascript
// Teammate's toolPermissionContext initialized:
{
  mode: "plan",
  prePlanMode: null,
  allowedTools: ["Read", "Glob", "Grep", "EnterPlanMode", "ExitPlanMode"],
  blockedTools: ["Write", "Edit", "Bash", ...]  // Execution tools blocked
}
```

**System prompt includes plan mode instructions**:
```markdown
You are in PLAN MODE. You must create an implementation plan before executing.

1. Research the task using Read/Glob/Grep tools
2. Write your plan to: ~/.claude/plans/researcher@web-app-team/plan.md
3. Call ExitPlanMode to submit plan for approval
4. Wait for team lead approval before proceeding

**IMPORTANT**: You CANNOT write code or execute commands in plan mode.
```

### 5.2 Plan Creation

**Teammate researches**:
```
Researcher: [Calls Read tool to read authentication docs]
Researcher: [Calls Grep to search for auth library usage]
Researcher: [Calls Glob to find relevant files]
```

**Teammate writes plan**:
```markdown
<!-- File: ~/.claude/plans/researcher@web-app-team/plan.md -->

# Authentication Library Research Plan

## Objective
Evaluate and recommend authentication library for Node.js backend

## Approach
1. Research popular libraries (Passport.js, NextAuth, Auth0)
2. Compare features, security, documentation
3. Create comparison matrix
4. Recommend best fit for our use case

## Deliverables
- Comparison document (docs/auth-comparison.md)
- Recommendation with rationale
- Code examples for chosen library
```

### 5.3 Plan Submission

**Teammate calls ExitPlanMode**:
```javascript
// ExitPlanMode tool execution
let planPath = getPlanFilePath("researcher@web-app-team");
let planContent = readFileSync(planPath, "utf-8");

// Generate plan approval request
let requestId = generateRequestId("plan_approval", "researcher@web-app-team");
let approvalRequest = {
  type: "plan_approval_request",
  from: "researcher",
  timestamp: new Date().toISOString(),
  planFilePath: planPath,
  planContent: planContent,
  requestId: requestId
};

// Send to team lead's mailbox
writeToMailbox("team-lead", {
  from: "researcher",
  text: JSON.stringify(approvalRequest),
  timestamp: new Date().toISOString()
}, "web-app-team");

// Update teammate status
setAppState((state) => {
  let teammateTask = state.tasks["researcher@web-app-team"];
  if (teammateTask) {
    teammateTask.awaitingPlanApproval = true;
  }
  return state;
});
```

**Teammate poll loop blocks**:
```
[inProcessRunner] researcher@web-app-team poll #45: checking mailbox
[inProcessRunner] researcher@web-app-team poll #46: checking mailbox
... (waits for approval)
```

### 5.4 Team Lead Review

**Team lead receives plan approval request**:
```
┌─ Plan Approval Request from researcher ────────────┐
│                                                     │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│ # Authentication Library Research Plan              │
│                                                     │
│ ## Objective                                        │
│ Evaluate and recommend authentication library...   │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│                                                     │
│ Plan file: ~/.claude/plans/researcher@web-app-...  │
└─────────────────────────────────────────────────────┘
```

**Team lead LLM reviews plan**:
```
Team Lead: [Reads plan content]
Team Lead: [Evaluates against task requirements]
Team Lead: [Decides: Plan is comprehensive and aligned]
Team Lead: [Generates SendMessage tool call to approve]
```

**Approval message sent**:
```javascript
// SendMessage with plan_approval_response
{
  type: "plan_approval_response",
  recipient: "researcher",
  approve: true,
  request_id: "plan_approval_researcher@web-app-team_1737823920000"
}
```

**Approval handler** (team lead side):
```javascript
// handlePlanApproval function
let targetMode = currentMode === "plan" || currentMode === "delegate"
  ? "default"
  : currentMode;  // "default"

let approvalResponse = {
  type: "plan_approval_response",
  requestId: requestId,
  approved: true,
  timestamp: new Date().toISOString(),
  permissionMode: "default"  // ← Teammate transitions to this mode
};

writeToMailbox("researcher", {
  from: "team-lead",
  text: JSON.stringify(approvalResponse),
  timestamp: new Date().toISOString()
}, "web-app-team");
```

### 5.5 Approval Processing & Mode Transition

**Teammate's InboxPoller detects approval**:
```javascript
// InboxPoller callback (runs every 500ms)
let unreadMessages = getUnreadMessages("researcher", "web-app-team");
for (let message of unreadMessages) {
  let approvalResponse = parsePlanApprovalResponse(message.text);

  if (approvalResponse && message.from === "team-lead") {
    if (approvalResponse.approved) {
      // AUTOMATIC MODE TRANSITION
      let targetMode = approvalResponse.permissionMode ?? "default";
      setAppState((state) => ({
        ...state,
        toolPermissionContext: {
          ...state.toolPermissionContext,
          mode: targetMode,  // "plan" → "default"
          allowedTools: getAllTools(),  // Now has Write, Edit, Bash, etc.
          blockedTools: []
        }
      }));

      debugLog(`[InboxPoller] Plan approved, exited plan mode to ${targetMode}`);
    }
  }
}
```

**Teammate can now execute**:
```
[InboxPoller] Plan approved by team lead, exited plan mode to default

┌─ Success ────────────────────────────────────────┐
│ ✓ Plan Approved by team-lead                     │
│                                                   │
│ You can now proceed with implementation.         │
│ Your plan mode restrictions have been lifted.    │
└───────────────────────────────────────────────────┘

Researcher: [Can now call Write, Edit, Bash tools]
```

**Timing**:
- Plan submission: ~100ms
- Team lead review: Varies (LLM processing time, 5-30 seconds)
- Approval delivery: Up to 500ms (poll interval)
- Mode transition: Immediate (next agent loop iteration)

---

## 6. Phase 5: Message-Based Coordination

### 6.1 Direct Message Flow

**Team lead sends message**:
```json
// SendMessage tool call
{
  "type": "message",
  "recipient": "researcher",
  "content": "Great research! Can you also check if the library supports OAuth2?",
  "summary": "Question about OAuth2 support"
}
```

**Message written to mailbox**:
```bash
# File: ~/.claude/teams/web-app-team/mailboxes/researcher/message-042.json
{
  "from": "team-lead",
  "text": "Great research! Can you also check if the library supports OAuth2?",
  "summary": "Question about OAuth2 support",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "read": false,
  "color": "#6366f1"
}
```

**Teammate poll loop detects message**:
```
[inProcessRunner] researcher@web-app-team poll #78: checking mailbox
[inProcessRunner] researcher@web-app-team received new message from team-lead (index 42)
```

**Message delivered to agent loop**:
```javascript
// Poll loop returns new message
return {
  type: "new_message",
  message: "Great research! Can you also check if the library supports OAuth2?",
  from: "team-lead",
  color: "#6366f1",
  summary: "Question about OAuth2 support"
};

// Agent loop processes as new user input
agentLoop.processInput(message.message);
```

**Teammate responds**:
```
Researcher: [Reads message]
Researcher: [Calls Read tool to check OAuth2 support]
Researcher: [Calls SendMessage to reply]
```

### 6.2 Broadcast Message Flow

**Team lead broadcasts to all teammates**:
```json
{
  "type": "broadcast",
  "content": "Meeting in 10 minutes to discuss progress",
  "summary": "Team meeting reminder"
}
```

**Message delivered to all non-lead members**:
```javascript
// For each teammate in team config:
for (let member of teamConfig.members) {
  if (member.name !== "team-lead") {
    writeToMailbox(member.name, {
      from: "team-lead",
      text: broadcastContent,
      summary: broadcastSummary,
      timestamp: new Date().toISOString(),
      color: "#6366f1"
    }, teamName);
  }
}
```

**All teammates receive simultaneously** (on next poll):
```
[inProcessRunner] researcher@web-app-team received new message from team-lead (index 43)
[inProcessRunner] backend-dev@web-app-team received new message from team-lead (index 12)
[inProcessRunner] frontend-dev@web-app-team received new message from team-lead (index 8)
```

### 6.3 Message Prioritization

**Priority order** (enforced by poll loop):

1. **Shutdown requests** (highest priority)
2. **Messages from team-lead** (higher priority)
3. **Other messages** (normal priority)
4. **Task assignments** (lowest priority, only if no messages)

**Implementation**:
```javascript
// Poll loop message selection algorithm
let messages = readMailbox(agentName, teamName);

// Priority 1: Check for shutdown requests
for (let msg of messages) {
  let shutdownRequest = parseShutdownRequest(msg.text);
  if (shutdownRequest) {
    return { type: "shutdown_request", request: shutdownRequest };
  }
}

// Priority 2: Messages from team-lead
let leadMessageIndex = messages.findIndex(msg =>
  !msg.read && msg.from === "team-lead"
);
if (leadMessageIndex !== -1) {
  return { type: "new_message", message: messages[leadMessageIndex] };
}

// Priority 3: Any other unread message
let unreadIndex = messages.findIndex(msg => !msg.read);
if (unreadIndex !== -1) {
  return { type: "new_message", message: messages[unreadIndex] };
}

// Priority 4: Auto-claim task (if no messages)
let taskPrompt = claimNextTask(storageContext, agentName);
if (taskPrompt) {
  return { type: "new_message", message: taskPrompt, from: "task-list" };
}
```

---

## 7. Phase 6: Task Execution

### 7.1 Tool Execution Loop

**Teammate executes tools**:
```
Researcher:
  [1] Read(file_path: "docs/auth-libraries.md")
  [2] Write(file_path: "docs/auth-comparison.md", content: "# Comparison...")
  [3] Grep(pattern: "OAuth", path: "docs/")
  [4] Edit(file_path: "docs/auth-comparison.md", old_string: "...", new_string: "...")
```

**Each tool call** (telemetry):
```javascript
// Tool selection
trackEvent("tengu_agent_tool_selected", {
  tool: "Write",
  agent: "researcher"
});

// Tool execution
await executeTool("Write", params, context);

// Tool completion
trackEvent("tengu_agent_tool_completed", {
  tool: "Write",
  agent: "researcher"
});
```

### 7.2 Task Completion

**Teammate finishes task**:
```json
// TaskUpdate tool call
{
  "taskId": "1",
  "status": "completed"
}
```

**Task ledger updated**:
```json
// File: ~/.claude/tasks/1.json
{
  "id": "1",
  "subject": "Research authentication libraries",
  "status": "completed",  // ← Changed from "in_progress"
  "owner": "researcher",
  "completedAt": "2025-01-15T15:00:00.000Z"
}
```

**Dependent tasks unblocked**:
```javascript
// Task #2 was blocked by task #1
let allTasks = getAllTasks(storageContext);
let activeTaskIds = new Set(allTasks.filter(t => t.status !== "completed").map(t => t.id));
// activeTaskIds = Set([2, 3, 5, ...])  // ← Task 1 NOT in set (completed)

let task2 = allTasks.find(t => t.id === "2");
task2.blockedBy.every(id => !activeTaskIds.has(id));  // → true (task 1 completed)
// Task #2 is now claimable!
```

**Tool result prompts next task**:
```
Updated task #1 status

Task completed. Call TaskList now to find your next available task or see if your work unblocked others.
```

**Teammate checks task list**:
```
Researcher: [Calls TaskList tool]
System: Returns task list showing task #2 now available
Researcher: [Claims task #2 via auto-claim algorithm]
```

### 7.3 Idle Notification

**Teammate has no more work**:
```javascript
// Poll loop finds no messages and no tasks
return { type: "aborted" };  // No work available

// Agent loop detects idle state
if (pollResult.type === "aborted") {
  // Send idle notification to team lead
  sendIdleNotification(agentName, teamName);

  // Update AppState
  setAppState((state) => {
    let teammateTask = state.tasks[agentId];
    if (teammateTask) teammateTask.isIdle = true;
    return state;
  });

  // Continue polling (wait for new work)
  pollLoop();
}
```

**Team lead sees idle status** (TUI):
```
┌─ Team: web-app-team ─────────────────────────────┐
│ ● team-lead (you) - Managing team                │
│ ○ researcher - Idle (waiting for work)           │ ← Idle indicator
│ ■ backend-dev - Implementing API endpoint        │
└───────────────────────────────────────────────────┘
```

---

## 8. Phase 7: Error Recovery

### 8.1 Tool Execution Error

**Teammate encounters error**:
```
Researcher: [Calls Write tool with invalid path]
System: Error: ENOENT: no such file or directory '/invalid/path/file.txt'
```

**Error returned to agent loop**:
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_123",
  "content": "Error: ENOENT: no such file or directory '/invalid/path/file.txt'"
}
```

**LLM decides recovery strategy**:
```
Researcher: [Reads error message]
Researcher: [Decides to create directory first]
Researcher: [Calls Bash tool: mkdir -p /path/to]
Researcher: [Retries Write tool with same params]
System: Success
```

**No automatic retry**: Error recovery is LLM-driven (no system-level retry).

### 8.2 Task Claiming Race Condition

**Two teammates try to claim same task**:
```
Time  | Researcher                       | Backend-dev
------|----------------------------------|----------------------------------
T0    | findNextAvailableTask() → task 5 | findNextAvailableTask() → task 5
T1    | attemptToClaimTask("5", "...")   | attemptToClaimTask("5", "...")
T2    | lockSync(task5.json) → ACQUIRED  | lockSync(task5.json) → WAITING
T3    | Check: task.owner = null ✓       |
T4    | Write: task.owner = "researcher" |
T5    | unlock()                         | lockSync(task5.json) → ACQUIRED
T6    |                                  | Check: task.owner = "researcher" ✗
T7    |                                  | Return { success: false, reason: "already_claimed" }
```

**Backend-dev handles failure**:
```
[inProcessRunner] backend-dev@web-app-team poll #42: checking mailbox
[inProcessRunner] Failed to claim task #5: already_claimed
[inProcessRunner] backend-dev@web-app-team poll #43: checking mailbox
[inProcessRunner] backend-dev@web-app-team found next task: #6
```

**Graceful degradation**: Find next available task on next poll.

### 8.3 Mailbox Corruption Recovery

**Corrupted mailbox file**:
```javascript
// Read mailbox
try {
  let messages = JSON.parse(readFileSync(mailboxPath, "utf-8"));
} catch (error) {
  // JSON parse error (file corrupted)
  debugLog(`[InboxPoller] Mailbox corrupted for ${agentName}: ${error.message}`);

  // Treat as empty mailbox (skip corrupted messages)
  return [];
}
```

**No automatic repair**: Corrupted mailbox treated as empty (messages lost).

**Manual recovery**:
```bash
# Backup corrupted file
cp ~/.claude/teams/web-app-team/mailboxes/researcher/messages.json \
   ~/.claude/teams/web-app-team/mailboxes/researcher/messages.json.bak

# Restore from backup or delete
rm ~/.claude/teams/web-app-team/mailboxes/researcher/messages.json
# Mailbox will be recreated on next message
```

---

## 9. Phase 8: Graceful Shutdown

### 9.1 Shutdown Request Protocol

**Team lead decides to shutdown teammate**:
```json
// SendMessage tool call
{
  "type": "shutdown_request",
  "recipient": "researcher",
  "content": "Task complete, shutting down"
}
```

**Shutdown request sent**:
```javascript
let requestId = generateRequestId("shutdown", "researcher");
let shutdownRequest = {
  type: "shutdown_request",
  requestId: requestId,
  from: "team-lead",
  reason: "Task complete, shutting down",
  timestamp: new Date().toISOString()
};

writeToMailbox("researcher", {
  from: "team-lead",
  text: JSON.stringify(shutdownRequest),
  timestamp: new Date().toISOString()
}, "web-app-team");
```

### 9.2 Teammate Shutdown Processing

**Poll loop detects shutdown request** (highest priority):
```javascript
// Poll loop checks shutdown requests FIRST
let messages = readMailbox("researcher", "web-app-team");
for (let msg of messages) {
  let shutdownRequest = parseShutdownRequest(msg.text);
  if (shutdownRequest && !msg.read) {
    // PRIORITY: Shutdown takes precedence over all other messages
    markMessageAsRead(msg.index);
    return {
      type: "shutdown_request",
      request: shutdownRequest,
      originalMessage: msg.text
    };
  }
}
```

**Agent loop receives shutdown request**:
```javascript
// Agent loop processes shutdown request
let shutdownPrompt = createShutdownPrompt(shutdownRequest.from, shutdownRequest.reason);
// "You received a shutdown request from team-lead: Task complete, shutting down
//  Please call the appropriate tool to approve or reject the shutdown."

agentLoop.processInput(shutdownPrompt);
```

**LLM decides to approve**:
```json
// SendMessage tool call (shutdown response)
{
  "type": "shutdown_response",
  "request_id": "shutdown_researcher_1737824000000",
  "approve": true
}
```

### 9.3 Shutdown Approval & Termination

**Approval handler**:
```javascript
// handleShutdownApproval function
let approvalMessage = {
  type: "shutdown_approved",
  requestId: requestId,
  from: agentName,
  timestamp: new Date().toISOString()
};

// Send approval to team lead
writeToMailbox("team-lead", {
  from: agentName,
  text: JSON.stringify(approvalMessage),
  timestamp: new Date().toISOString()
}, teamName);

// TERMINATE AGENT LOOP
abortController.abort();  // Signal to exit agent loop

// Update AppState
setAppState((state) => {
  let teammateTask = state.tasks[agentId];
  if (teammateTask) teammateTask.terminated = true;
  return state;
});
```

**Agent loop exits**:
```
[inProcessRunner] researcher@web-app-team received shutdown request - passing to model
[Agent loop processes shutdown]
[SendMessage tool executed: shutdown approval]
[inProcessRunner] researcher@web-app-team agent loop terminated (shutdown approved)
```

**Team config updated**:
```json
// Remove from members array (or mark as inactive)
{
  "members": [
    {
      "name": "team-lead",
      ...
    }
    // researcher removed
  ]
}
```

**Timing**: ~1-5 seconds (LLM decision + approval message delivery)

---

## 10. Phase 9: Cleanup & Deletion

### 10.1 Team Deletion Trigger

**User decides to delete team**:
```
Team Lead: "The project is complete, delete the team"
LLM: [Generates TeamDelete tool call]
```

**TeamDelete validation**:
```javascript
// Read team config
let teamConfig = readTeamConfig("web-app-team");

// Check for active teammates
let activeInProcessTeammates = [];
for (let member of teamConfig.members) {
  if (member.type === "in_process_teammate") {
    let teammateTask = appState.tasks[generateTaskId(member.name, teamName)];
    if (teammateTask && !teammateTask.terminated) {
      activeInProcessTeammates.push(member.name);
    }
  }
}

if (activeInProcessTeammates.length > 0) {
  throw Error(
    `Cannot cleanup team with ${activeInProcessTeammates.length} active member(s): ` +
    `${activeInProcessTeammates.join(", ")}. Use requestShutdown first.`
  );
}

// Validation passed, proceed with cleanup
```

### 10.2 Cleanup Execution

**Step 1: Cleanup git worktrees** (if any):
```javascript
for (let member of teamConfig.members) {
  if (member.worktreePath) {
    await cleanupWorktree(member.worktreePath);
  }
}
```

**Step 2: Delete team directory**:
```bash
rm -rf ~/.claude/teams/web-app-team/
# Removes:
#   - team.json (team config)
#   - mailboxes/ (all unread messages lost)
#   - Any other team-specific files
```

**Step 3: Delete tasks directory** (DESTRUCTIVE):
```bash
rm -rf ~/.claude/tasks/
# Removes ALL tasks globally (not just this team's tasks)
# This is likely a bug - should only delete tasks assigned to this team
```

**Step 4: Update AppState**:
```javascript
setAppState((state) => ({
  ...state,
  teamContext: undefined,  // Clear team context
  inbox: { messages: [] }  // Clear inbox
}));
```

**Step 5: Trigger UI refresh**:
```javascript
triggerTaskListRefresh();  // Notify UI that tasks changed
```

**Result**:
```json
{
  "success": true,
  "message": "Team \"web-app-team\" and all associated data deleted successfully.",
  "active_pane_teammates": []  // Pane teammates (if any) may still be running
}
```

**Timing**: ~1 second (filesystem I/O)

### 10.3 Post-Deletion State

**Filesystem state**:
```
~/.claude/
├── teams/
│   └── [web-app-team/ DELETED]
├── tasks/
│   └── [*.json ALL DELETED]
└── session-abc123/
    ├── session-memory/  ← PRESERVED
    ├── plans/
    │   └── researcher@web-app-team/
    │       └── plan.md  ← PRESERVED (orphaned)
    └── transcript.jsonl  ← PRESERVED
```

**Project files preserved**:
```
project/
├── src/
│   └── api/
│       └── users.js  ← Code written by teammates PRESERVED
└── docs/
    └── auth-comparison.md  ← Documents PRESERVED
```

**What persists**:
- ✅ Code changes made by teammates
- ✅ Session memory (conversation history)
- ✅ Plan files (orphaned, no team to reference)

**What's deleted**:
- ❌ Team config
- ❌ Mailbox messages
- ❌ Task ledger
- ❌ Team metadata

---

## 11. Complete Flow Diagram

### 11.1 High-Level Sequence

```
┌─────────────────┐
│ Phase 1:        │  1s    TeamCreate → team.json created
│ Team Creation   │        AppState.teamContext set
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Phase 2:        │  0.1s  In-process: Start agent loop
│ Teammate        │  1-2s  Pane: Spawn new terminal + Claude process
│ Spawning        │        team.json updated with member
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Phase 3:        │  <1s   TaskCreate → ~/.claude/tasks/{id}.json
│ Task            │        findNextAvailableTask (dependency check)
│ Distribution    │        attemptToClaimTask (atomic with lock)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Phase 4:        │  30s   Write plan.md
│ Plan Mode       │        ExitPlanMode → send approval request
│ Workflow        │        Team lead reviews → approve/reject
│ (if required)   │        InboxPoller → mode transition
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Phase 5:        │  ~1s/  SendMessage → mailbox write
│ Message-Based   │  msg   Poll loop (500ms) → read mailbox
│ Coordination    │        Priority: shutdown > lead > other > tasks
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Phase 6:        │  Min-  Tool execution loop
│ Task            │  Hrs   TaskUpdate(status: completed)
│ Execution       │        Dependent tasks unblocked
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Phase 7:        │  Var   LLM-driven error recovery
│ Error           │        Race condition → try next task
│ Recovery        │        Corruption → skip/manual fix
│ (if needed)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Phase 8:        │  1-5s  Shutdown request → approval protocol
│ Graceful        │        abortController.abort()
│ Shutdown        │        teammateTask.terminated = true
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Phase 9:        │  ~1s   rm -rf ~/.claude/teams/{teamName}/
│ Cleanup &       │        rm -rf ~/.claude/tasks/
│ Deletion        │        AppState.teamContext = undefined
└─────────────────┘
```

### 11.2 State Transition Flowchart

```
                          START
                            │
                            ▼
                    ┌───────────────┐
                    │ Team Created  │
                    │ (Lead Only)   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Teammates     │ ◄──┐
                    │ Spawned       │    │ Add teammate
                    └───────┬───────┘    │
                            │            │
                            ▼            │
                    ┌───────────────┐    │
               ┌────┤ Plan Mode?    ├────┘
               │    └───────────────┘
               │ No         │ Yes
               │            ▼
               │    ┌───────────────┐
               │    │ Write Plan    │
               │    └───────┬───────┘
               │            │
               │            ▼
               │    ┌───────────────┐
               │    │ Submit Plan   │
               │    └───────┬───────┘
               │            │
               │            ▼
               │    ┌───────────────┐     Reject
               │    │ Lead Reviews  ├──────────┐
               │    └───────┬───────┘          │
               │            │ Approve          │
               │            ▼                  │
               │    ┌───────────────┐          │
               │    │ Exit Plan Mode│          │
               │    └───────┬───────┘          │
               │            │                  │
               └────────────┼──────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Claim Tasks   │ ◄──┐
                    └───────┬───────┘    │
                            │            │
                            ▼            │
                    ┌───────────────┐    │
                    │ Execute Tasks │    │
                    └───────┬───────┘    │
                            │            │
                            ▼            │
                    ┌───────────────┐    │
                    │ More Tasks?   ├────┘ Yes
                    └───────┬───────┘
                            │ No
                            ▼
                    ┌───────────────┐
                    │ Idle State    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Shutdown      │
                    │ Request       │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Terminated    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Team Deleted  │
                    └───────────────┘
                            │
                            ▼
                           END
```

---

## 12. State Transition Matrix

| Current State | Event | Next State | Trigger | Duration |
|---------------|-------|------------|---------|----------|
| **None** | User request | Team Created | TeamCreate tool | ~1s |
| **Team Created** | Spawn command | Teammate Spawned | Spawn tool | 0.1s-2s |
| **Teammate Spawned (plan mode)** | Plan written | Plan Submitted | ExitPlanMode | ~100ms |
| **Plan Submitted** | Lead approves | Plan Approved | SendMessage | 5-30s |
| **Plan Submitted** | Lead rejects | Plan Revision | SendMessage | 5-30s |
| **Plan Revision** | Plan rewritten | Plan Submitted | ExitPlanMode | Varies |
| **Plan Approved** | Mode transition | Execution Mode | InboxPoller | <500ms |
| **Execution Mode** | Task available | Task Claimed | Auto-claim | <100ms |
| **Task Claimed** | Work complete | Task Completed | TaskUpdate | Min-Hrs |
| **Task Completed** | More tasks | Task Claimed | Auto-claim | <500ms |
| **Task Completed** | No tasks | Idle State | Poll loop | <500ms |
| **Idle State** | New message | Execution Mode | Poll loop | <500ms |
| **Idle State** | Shutdown request | Shutdown Pending | SendMessage | <500ms |
| **Shutdown Pending** | Approve | Terminated | SendMessage | 1-5s |
| **Shutdown Pending** | Reject | Execution Mode | SendMessage | 1-5s |
| **Terminated** | All terminated | Team Cleanup | TeamDelete | ~1s |
| **Team Cleanup** | Cleanup done | None | Filesystem ops | ~1s |

---

## Related Symbols

> Symbol mappings: See individual documents for detailed symbol mappings
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)

**Key lifecycle functions**:
- `TeamCreateTool` → `spawnTeammateDispatcher` → `inProcessAgentRunner` / `spawnSplitPaneTeammate`
- `findNextAvailableTask` → `attemptToClaimTask` → `generatePromptFromTask`
- `ExitPlanMode` → `handlePlanApproval` / `handlePlanRejection` → `parsePlanApprovalResponse`
- `SendMessage` → `writeToMailbox` → `readMailbox` → `markMessageAsReadByIndex`
- `TeamDelete` → `cleanupTeam` → `deleteDirectory`

---

## Cross-References

**Phase-specific analysis**:
- Phase 1-2: [02_spawn_mechanisms_deep_dive.md](./02_spawn_mechanisms_deep_dive.md)
- Phase 3: [08_task_dependency_resolution.md](./08_task_dependency_resolution.md)
- Phase 4: [07_plan_mode_team_integration.md](./07_plan_mode_team_integration.md)
- Phase 5: [03_mailbox_and_locking.md](./03_mailbox_and_locking.md), [04_polling_priorities.md](./04_polling_priorities.md)
- Phase 6: [06_system_prompts_and_reminders.md](./06_system_prompts_and_reminders.md)
- Phase 7: [error_recovery.md](./error_recovery.md)
- Phase 8-9: [11_storage_cleanup_management.md](./11_storage_cleanup_management.md)

**Infrastructure**:
- [10_session_memory_persistence.md](./10_session_memory_persistence.md) - Storage model
- [09_telemetry_monitoring.md](./09_telemetry_monitoring.md) - Logging throughout lifecycle
- [agent_teams_architecture.md](./agent_teams_architecture.md) - Design philosophy
