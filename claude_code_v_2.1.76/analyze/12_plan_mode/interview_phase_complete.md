# Plan Mode Interview Phase Complete Analysis (Claude Code 2.1.76)

> Complete analysis of the iterative interview phase workflow in Plan Mode.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key concepts:
- Interview Phase - Iterative question-asking workflow before planning
- "Chat about this" - User option to continue discussion
- "Skip interview" - User option to proceed directly to planning
- "Ready to code?" - Exit approval dialog

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INTERVIEW PHASE ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ User enters plan mode (/plan or EnterPlanMode tool)           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Initial Context Injection                                      │  │
│  │                                                                 │  │
│  │  If /plan <description>:                                       │  │
│  │    • Inject description as task framing                        │  │
│  │    • Begin interview with context                              │  │
│  │                                                                 │  │
│  │  If /plan (no description):                                    │  │
│  │    • Ask user to describe their task                           │  │
│  │    • Begin open-ended interview                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Iterative Interview Loop                                       │  │
│  │                                                                 │  │
│  │  while (!userWantsToProceed) {                                 │  │
│  │    agent asks clarifying questions                             │  │
│  │    user responds with details                                  │  │
│  │    agent explores codebase                                     │  │
│  │    agent asks follow-up questions                              │  │
│  │                                                                 │  │
│  │    [Show options: "Chat about this" | "Skip interview"]        │  │
│  │  }                                                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Planning Phase                                                 │  │
│  │                                                                 │  │
│  │  1. Explore codebase with read-only tools                      │  │
│  │  2. Design implementation approach                             │  │
│  │  3. Write plan to plan file                                    │  │
│  │  4. Call ExitPlanMode for approval                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Exit Approval Dialog                                           │  │
│  │                                                                 │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ Ready to code?                                           │  │  │
│  │  │                                                           │  │  │
│  │  │ I've written a plan to:                                  │  │  │
│  │  │ • Step 1: ...                                            │  │  │
│  │  │ • Step 2: ...                                            │  │  │
│  │  │                                                           │  │  │
│  │  │ [Yes, let's implement] [Let me refine the plan] [Cancel] │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Interview Phase Feature Flag

The interview phase is controlled by a feature flag:

```javascript
// ============================================
// Interview Phase Feature Flag Check
// Location: chunks.1.mjs / chunks.144.mjs
// ============================================

function isPlanModeInterviewPhase() {
  // Check GrowthBook feature flag
  return getFeatureFlag("plan-mode-interview-phase", false);
}

// Used in EnterPlanMode result
function mapToolResultToToolResultBlockParam({ message }, toolUseId) {
  const isInterviewPhase = isPlanModeInterviewPhase();

  return {
    type: "tool_result",
    content: isInterviewPhase
      ? `${message}\n\nDO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`
      : `${message}\n\nIn plan mode, you should:\n1. Thoroughly explore the codebase...\n...`,
    tool_use_id: toolUseId
  };
}
```

---

## Plan Mode Reminder Variants

The system reminder for plan mode has multiple variants based on context:

```javascript
// ============================================
// planModeReminderDispatcher - Select instruction variant
// Location: chunks.173.mjs:525-529
// ============================================

// ORIGINAL (for source lookup):
function azz(A) {
    if (A.isSubAgent) return q2z(A);
    if (A.reminderType === "sparse") return A2z(A);
    if (A.iterativeMode) return ezz(A);
    return szz(A)
}

// READABLE (for understanding):
function planModeReminderDispatcher(planModeAttachment) {
  // VARIANT 1: Subagent (brief, no plan file editing)
  if (planModeAttachment.isSubAgent) {
    return formatSubagentPlanReminder(planModeAttachment);
  }

  // VARIANT 2: Sparse (short reminder, not full instructions)
  if (planModeAttachment.reminderType === "sparse") {
    return formatSparsePlanReminder(planModeAttachment);
  }

  // VARIANT 3: Iterative (pair-planning workflow)
  if (planModeAttachment.iterativeMode) {
    return formatIterativePlanReminder(planModeAttachment);
  }

  // VARIANT 4: Full (5-phase workflow)
  return formatFullPlanReminder(planModeAttachment);
}

// Mapping: azz→planModeReminderDispatcher, A→planModeAttachment,
//          q2z→formatSubagentPlanReminder, A2z→formatSparsePlanReminder,
//          ezz→formatIterativePlanReminder, szz→formatFullPlanReminder
```

### Full Reminder Content (5-Phase Workflow)

```markdown
Plan Mode on.

You MUST follow this workflow when the user asks you to make code changes:

## Phase 1: Initial Understanding

1. Focus on understanding the user's request and the code associated with their request.
2. Actively search for existing functions, utilities, and patterns that can be reused.
3. Launch Explore agents to efficiently explore the codebase.
4. If the scope is uncertain, launch multiple agents with specific search focuses.

## Phase 2: Design

1. Launch Plan agents to design the implementation based on your exploration.
2. Request a detailed implementation plan.
3. Consider multiple approaches and their trade-offs.

## Phase 3: Review

1. Read the critical files identified by agents.
2. Ensure that the plans align with the user's original request.
3. Use AskUserQuestion to clarify any remaining questions.

## Phase 4: Final Plan

1. Write your final plan to the plan file.
2. Begin with a Context section explaining the change.
3. Include the paths of critical files to be modified.

## Phase 5: Call ExitPlanMode

1. Call ExitPlanMode to request user approval.
2. This is the only way to exit plan mode.

DO NOT write or edit any files except the plan file at:
~/.claude_api/plans/<session-slug>.md
```

### Sparse Reminder Content

```markdown
[Plan Mode on - Shift+Tab to exit]

Reminder: Plan file at ~/.claude_api/plans/<session-slug>.md

Key rules:
• Read-only exploration only
• Write/Edit allowed only to plan file
• Use ExitPlanMode to request approval
```

---

## Interview Options UI

### "Chat about this" Option

When the agent asks a question, the user can continue the conversation:

```
┌─────────────────────────────────────────────────────────────────┐
│  Agent: What kind of database are you using? PostgreSQL,       │
│         MySQL, or something else?                               │
│                                                                 │
│  User options:                                                  │
│  [Chat about this] - Continue the conversation                  │
│  [Skip interview] - Proceed to planning phase                   │
└─────────────────────────────────────────────────────────────────┘
```

### "Skip interview" Option

User can bypass the interview and proceed directly to planning:

```javascript
// When user clicks "Skip interview"
function handleSkipInterview(toolUseContext) {
  // Set a flag that interview was skipped
  toolUseContext.setAppState({
    ...appState,
    interviewSkipped: true
  });

  // The agent will proceed to the planning phase
  // without asking more clarifying questions
}
```

---

## Exit Approval Dialog

### "Ready to code?" Options

```javascript
// ============================================
// ExitPlanMode Approval Dialog
// Location: chunks.143.mjs:2880+
// ============================================

const APPROVAL_OPTIONS = [
  {
    label: "Yes, let's implement",
    action: "approve",
    description: "Exit plan mode and begin implementation"
  },
  {
    label: "Let me refine the plan",
    action: "revise",
    description: "Stay in plan mode to make changes"
  },
  {
    label: "Cancel",
    action: "cancel",
    description: "Stay in plan mode, no exit"
  }
];
```

### Approval Flow

```javascript
// ============================================
// ExitPlanMode Tool Call (simplified)
// Location: chunks.143.mjs:2802+
// ============================================

async function call(input, context) {
  // 1. Check if plan file exists
  const planFilePath = getPlanFilePath();
  const planExists = await fileExists(planFilePath);

  if (!planExists) {
    throw new Error(`No plan file found at ${planFilePath}. Please write your plan before exiting.`);
  }

  // 2. Read plan content
  const planContent = await readFile(planFilePath);

  // 3. Show approval dialog
  const userDecision = await showApprovalDialog({
    title: "Ready to code?",
    planSummary: extractPlanSummary(planContent),
    options: APPROVAL_OPTIONS
  });

  // 4. Handle user decision
  switch (userDecision.action) {
    case "approve":
      // Restore previous mode
      context.setAppState((state) => ({
        ...state,
        toolPermissionContext: applyPermissionAction(
          state.toolPermissionContext,
          { type: "setMode", mode: state.prePlanMode }
        )
      }));

      // Set exit flags
      setHasExitedPlanMode(true);
      setNeedsPlanModeExitAttachment(true);

      return {
        data: {
          message: "Exiting plan mode. Proceeding with implementation."
        }
      };

    case "revise":
      // Stay in plan mode
      return {
        data: {
          message: "Staying in plan mode. Feel free to refine your plan."
        }
      };

    case "cancel":
      // Stay in plan mode, no changes
      return {
        data: {
          message: "Cancelled. Remaining in plan mode."
        }
      };
  }
}
```

---

## Swarm Integration - Teammate Plan Approval

When a teammate agent wants to exit plan mode, the request routes to the team lead:

```
Teammate Agent                     Team Lead Agent
      │                                  │
      │ ──── plan_approval_request ────► │
      │       (plan content)             │
      │                                  │
      │                                  ├─► Show approval dialog
      │                                  ├─► User reviews
      │                                  │
      │ ◄──── plan_approval_response ─── │
      │       (approved/rejected)        │
      │                                  │
      ├─► If approved: Exit plan mode    │
      └─► If rejected: Revise plan       │
```

### Message Format

```javascript
// plan_approval_request
{
  type: "plan_approval_request",
  sender: "developer-agent",
  planContent: "# Plan: Implement login UI\n\n## Steps\n1. Create form component\n...",
  planFilePath: "~/.claude_api/plans/login-ui.md"
}

// plan_approval_response
{
  type: "plan_approval_response",
  approved: true,  // or false
  feedback: "Looks good, proceed with implementation",
  sender: "team-lead"
}
```

---

## Cross-Feature Integration

### Interview Phase ↔ System Reminder (04)

```javascript
// Plan mode attachments
function generatePlanModeAttachment(context) {
  return {
    type: "plan_mode",
    reminderType: shouldShowSparseReminder() ? "sparse" : "full",
    planFilePath: getPlanFilePath(),
    isSubAgent: context.isSubAgent || false,
    iterativeMode: context.iterativeMode || false,
    turnCount: getPlanModeTurnCount()
  };
}
```

### Interview Phase ↔ Tools (05)

Tool filtering during interview phase:

```javascript
// Tools available during interview phase
const INTERVIEW_PHASE_TOOLS = [
  "Read", "Grep", "Glob", "WebFetch", "WebSearch",  // Read-only exploration
  "AskUserQuestion",  // For clarifying questions
  "EnterPlanMode", "ExitPlanMode",  // Mode management
  "Write", "Edit"  // Only to plan file
];

// Tool execution check
function canExecuteToolInPlanMode(toolName, input, planFilePath) {
  if (toolName === "Write" || toolName === "Edit") {
    // Only allow if target is plan file
    return input.file_path === planFilePath;
  }
  return INTERVIEW_PHASE_TOOLS.includes(toolName);
}
```

### Interview Phase ↔ Compact (07)

Plan preservation during compaction:

```javascript
// When compaction occurs, preserve plan state
function preservePlanState(messages) {
  // Plan file path and mode are state-preservation attachments
  // They survive compaction and are re-injected
  return {
    planFilePath: getPlanFilePath(),
    prePlanMode: getPrePlanMode(),
    planModeTurnCount: getPlanModeTurnCount()
  };
}
```

---

## Context Clearing on Rejection

If the user rejects the plan, the conversation can be cleared:

```javascript
// ============================================
// clearConversation - Full session reset
// Location: chunks.152.mjs:1438
// ============================================

function clearConversation() {
  // 1. Clear message history
  clearMessages();

  // 2. Clear caches
  clearSessionCaches();

  // 3. Reset state
  resetSessionState();

  // 4. Generate new session ID (with parent tracking)
  createNewSessionId();

  // 5. Preserve plan file (optional)
  // User may want to reference the rejected plan

  // 6. Reset mode
  setMode("default");
}
```

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Interview phase enhancements, iterative mode |
| 2.1.72 | /plan command with description argument |
| 2.1.32 | Swarm teammate plan approval workflow |
| 2.1.18 | Shift+Tab mode cycling for plan mode entry/exit |