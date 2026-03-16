# System Reminder Types: Mode Control

> **Module**: System Reminders - Plan/Delegate/Auto Mode Types
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.173.mjs:2525-2740` (mode reminders), `chunks.142.mjs:2034-2090`

---

## Table of Contents

- [Overview](#overview)
- [v2.1.76 Changes](#v2176-changes)
- [Plan Mode Architecture](#plan-mode-architecture)
- [plan_mode](#plan_mode)
  - [Full Variant (Nzz)](#full-variant-nzz)
  - [Sparse Variant (Ezz)](#sparse-variant-ezz)
  - [Subagent Variant (yzz)](#subagent-variant-yzz)
  - [Ultraplan Complete (Zzz)](#ultraplan-complete-zzz)
- [plan_mode_reentry](#plan_mode_reentry)
- [plan_mode_exit](#plan_mode_exit)
- [plan_file_reference](#plan_file_reference)
- [auto_mode (v2.1.76)](#auto_mode-v2176)
- [auto_mode_exit (v2.1.76)](#auto_mode_exit-v2176)
- [delegate_mode](#delegate_mode)
- [delegate_mode_exit](#delegate_mode_exit)
- [Variant Selection Logic](#variant-selection-logic)
- [Configuration](#configuration)

---

## Overview

Mode control types manage special operational modes:

1. **plan_mode** - Activates planning-only mode (no edits allowed)
2. **plan_mode_reentry** - Re-entering plan mode after exit
3. **plan_mode_exit** - Exiting plan mode
4. **plan_file_reference** - References existing plan file (post-compact or session resume)
5. **auto_mode** (v2.1.76) - Activates autonomous execution mode
6. **auto_mode_exit** (v2.1.76) - Exiting auto mode
7. **delegate_mode** - Activates team delegate mode
8. **delegate_mode_exit** - Exiting delegate mode

Plan mode has the most complex reminder system with **four variants** optimized for different scenarios. Auto mode (new in v2.1.76) has two variants.

---

## v2.1.76 Changes

### /plan Command with Description Argument

In v2.1.76, the `/plan` slash command accepts an optional description argument. When the user invokes `/plan "Fix the authentication bug in the login flow"`, the description is passed into the plan mode activation flow and embedded in the `plan_mode` attachment object.

**Attachment change:**

```javascript
// v2.1.38 plan_mode attachment:
{
    type: "plan_mode",
    reminderType: "full" | "sparse",
    isSubAgent: boolean,
    planFilePath: string,
    planExists: boolean
}

// v2.1.76 plan_mode attachment (additional field):
{
    type: "plan_mode",
    reminderType: "full" | "sparse",
    isSubAgent: boolean,
    planFilePath: string,
    planExists: boolean,
    taskDescription: string | undefined  // New in v2.1.76
}
```

**Impact on full reminder variant:**

When `taskDescription` is present in the `plan_mode` attachment, the full reminder (`szz`) includes an additional section at the top of the Phase 1 instructions:

```markdown
## Task Context

The user wants you to work on the following:
"Fix the authentication bug in the login flow"

Use this as your starting point for Phase 1 exploration.
```

**Rationale:** Without a description, the LLM must ask the user for clarification before it can begin exploring. The description argument allows power users to kick off a plan mode session with full context in a single command, reducing the number of conversation turns needed to start meaningful planning.

**Sparse variant change:** The sparse reminder does not include the task description (it was sent in the full reminder earlier in the conversation). This avoids repeating potentially long descriptions on every turn.

---

## Plan Mode Architecture

### Variant Selection Flow

```
┌───────────────────────────────────────────────────────────────────┐
│                    Plan Mode Attachment                            │
│                   { type: "plan_mode", ... }                       │
└─────────────────────────────┬─────────────────────────────────────┘
                              │
                              ↓
                ┌───────────────────────────┐
                │   planModeReminderDispatcher│
                │          (Wzz)              │
                └─────────────┬───────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
           ↓                  ↓                  ↓
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │ isSubAgent? │    │ reminderType│    │  Default    │
    │             │    │  = "sparse"?│    │             │
    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
           │ YES            │ YES             │ NO
           ↓                ↓                 ↓
    ┌─────────────┐  ┌─────────────┐   ┌─────────────┐
    │ subagent    │  │   sparse    │   │    full     │
    │  (yzz)      │  │   (Ezz)     │   │   (Nzz)     │
    └─────────────┘  └─────────────┘   └─────────────┘
```

### Token Efficiency Strategy

| Variant | Token Count | When Used |
|---------|-------------|-----------|
| Full | ~1500 tokens | First reminder, every 5th thereafter |
| Iterative | ~1200 tokens | When iterative planning enabled |
| Sparse | ~150 tokens | Most turns (after initial full) |
| Subagent | ~400 tokens | Subagents in plan mode |

**Key insight:** By sending sparse reminders most of the time, the system saves ~1300 tokens per turn while maintaining plan mode awareness.

---

## Trigger Source Summary

Each mode control type has a specific producer function with distinct trigger conditions:

| Type | Producer Function | Location | Key Trigger Logic |
|------|-------------------|----------|-------------------|
| `plan_mode` | `ihY` (getPlanModeAttachment) | chunks.142.mjs:2034-2058 | `mode === "plan"` && turn throttling |
| `plan_mode_reentry` | `ihY` (getPlanModeAttachment) | chunks.142.mjs:2046-2049 | `aL6()` flag && plan file exists |
| `plan_mode_exit` | `nhY` (getPlanModeExitAttachment) | chunks.142.mjs:2060-2071 | `sL6()` flag && mode !== "plan" |
| `delegate_mode` | `rhY` (getDelegateModeAttachment) | chunks.142.mjs:2073-2083 | `mode === "delegate"` && teamContext |
| `delegate_mode_exit` | `ohY` (getDelegateModeExitAttachment) | chunks.142.mjs:2085-2090 | `eL6()` flag |

### Timing Constants

```javascript
// ============================================
// Plan mode timing constants
// Location: chunks.142.mjs:2921-2924
// ============================================

ii4 = {
    TURNS_BETWEEN_ATTACHMENTS: 5,          // Minimum turns between plan_mode attachments
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5   // Every 5th reminder is "full" variant
}
```

### Variant Selection Logic

The `plan_mode` reminderType is determined by:

```javascript
// Location: chunks.142.mjs:2050
let reminderType = (countPlanModeReminders(messages) + 1) % FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
    ? "full"
    : "sparse";
```

**Selection pattern:**
- 1st reminder: full
- 2nd-5th: sparse
- 6th: full
- 7th-10th: sparse
- And so on...

---

## plan_mode

### What It Does

Instructs the LLM to operate in planning-only mode where no edits or non-readonly tools are allowed. The LLM should explore, design, and write a plan to a designated file.

**v2.1.76:** When the `/plan` command is invoked with a description argument (e.g., `/plan "Fix the authentication bug"`), the description is included in the attachment and rendered in the full variant reminder.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Mode is "plan" | `toolPermissionContext.mode === "plan"` |
| Turn threshold | Not sent within last `TURNS_BETWEEN_ATTACHMENTS` (5) turns |
| Main agent OR subagent | Both can receive plan mode instructions |

### Source Code

#### Producer Function

```javascript
// ============================================
// getPlanModeAttachment - Produce plan mode attachment
// Location: chunks.142.mjs:2034-2058
// ============================================

// ORIGINAL (for source lookup):
async function ihY(A, q) {
    if ((await q.getAppState()).toolPermissionContext.mode !== "plan") return [];
    if (A && A.length > 0) {
        let {
            turnCount: _,
            foundPlanModeAttachment: J
        } = chY(A);
        if (J && _ < ii4.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    let z = uW(q.agentId),
        w = pD(q.agentId),
        H = [];
    if (aL6() && w !== null) H.push({
        type: "plan_mode_reentry",
        planFilePath: z
    }), OT(!1);
    let O = (lhY(A ?? []) + 1) % ii4.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
    return H.push({
        type: "plan_mode",
        reminderType: O,
        isSubAgent: !!q.agentId,
        planFilePath: z,
        planExists: w !== null
    }), H
}

// READABLE (for understanding):
async function getPlanModeAttachment(messages, sessionContext) {
    let appState = await sessionContext.getAppState();
    if (appState.toolPermissionContext.mode !== "plan") return [];

    if (messages && messages.length > 0) {
        let { turnCount, foundPlanModeAttachment } = countTurnsSincePlanMode(messages);
        if (foundPlanModeAttachment && turnCount < PLAN_MODE_CONSTANTS.TURNS_BETWEEN_ATTACHMENTS) {
            return [];
        }
    }

    let planFilePath = getPlanFilePath(sessionContext.agentId);
    let planExists = checkPlanExists(sessionContext.agentId);
    let attachments = [];

    if (isReenteringPlanMode() && planExists !== null) {
        attachments.push({
            type: "plan_mode_reentry",
            planFilePath: planFilePath
        });
        clearReentryFlag(false);
    }

    let reminderType = (countPlanModeReminders(messages ?? []) + 1) %
                       PLAN_MODE_CONSTANTS.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
                       ? "full"
                       : "sparse";

    attachments.push({
        type: "plan_mode",
        reminderType: reminderType,
        isSubAgent: !!sessionContext.agentId,
        planFilePath: planFilePath,
        planExists: planExists !== null,
        // v2.1.76: optional task description from /plan command argument
        taskDescription: sessionContext.planTaskDescription
    });

    return attachments;
}

// Mapping: ihY→getPlanModeAttachment, A→messages, q→sessionContext, _→turnCount, J→foundPlanModeAttachment, chY→countTurnsSincePlanMode, z→planFilePath, w→planExists, H→attachments, uW→getPlanFilePath, pD→checkPlanExists, aL6→isReenteringPlanMode, OT→clearReentryFlag, lhY→countPlanModeReminders, ii4→PLAN_MODE_CONSTANTS
```

---

### Full Variant (Nzz)

**Location:** `chunks.173.mjs:2556-2690`

The full variant provides comprehensive 5-phase planning instructions.

#### Content Structure (v2.1.76)

```markdown
Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
[A plan file already exists at /path/to/plan.md. You can read it and make incremental edits using the Edit tool.]
OR
[No plan file exists yet. You should create your plan at /path/to/plan.md using the Write tool.]

[v2.1.76: Task Context section appears here when /plan invoked with description]
## Task Context

The user wants you to work on the following:
"Fix the authentication bug in the login flow"

Use this as your starting point for Phase 1 exploration.

You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

## Plan Workflow

### Phase 1: Initial Understanding
Goal: Gain a comprehensive understanding of the user's request by reading through code and asking them questions. Critical: In this phase you should only use the Explore subagent type.

1. Focus on understanding the user's request and the code associated with their request...

2. **Launch up to N Explore agents IN PARALLEL** (single message, multiple tool calls) to efficiently explore the codebase.

### Phase 2: Design
Goal: Design an implementation approach.

### Phase 3: Review
Goal: Review the plan(s) from Phase 2 and ensure alignment with the user's intentions.

### Phase 4: Final Plan
Goal: Write your final plan to the plan file (the only file you can edit).

### Phase 5: Call ExitPlanMode
At the very end of your turn, once you have asked the user questions and are happy with your final plan file - you should always call ExitPlanMode to indicate to the user that you are done planning.

**Important:** Use AskUserQuestion ONLY to clarify requirements or choose between approaches. Use ExitPlanMode to request plan approval...
```

#### Key Insights

1. **Phase-based workflow**: Clear 5-phase structure guides the planning process.
2. **Agent parallelization**: Encourages launching Explore agents in parallel.
3. **Single exit path**: Turn must end with AskUserQuestion or ExitPlanMode.
4. **Tool restrictions**: Only Edit to plan file allowed, all else is read-only.
5. **v2.1.76**: Task description provides initial context when provided via `/plan "description"`.

---

### Iterative Variant (ezz)

**Location:** `chunks.173.mjs:619-674`

Used when iterative planning mode is enabled. Simpler, more conversational workflow.

#### Content Structure

```markdown
Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
[Plan file info here]

## Iterative Planning Workflow

You are pair-planning with the user. Explore the code to build context, ask the user questions when you hit decisions you can't make alone, and write your findings into the plan file as you go. The plan file (above) is the ONLY file you may edit — it starts as a rough skeleton and gradually becomes the final plan.

### The Loop

Repeat this cycle until the plan is complete:

1. **Explore** — Use Read, Glob, Grep to read code. Look for existing functions, utilities, and patterns to reuse.
2. **Update the plan file** — After each discovery, immediately capture what you learned. Don't wait until the end.
3. **Ask the user** — When you hit an ambiguity or decision you can't resolve from code alone, use AskUserQuestion. Then go back to step 1.

...

Call ExitPlanMode when the plan is ready for approval.
```

---

### Sparse Variant (Ezz)

**Location:** `chunks.173.mjs:2692-2699`

Brief reminder for subsequent turns after full reminder.

#### Content Structure

```markdown
Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (/path/to/plan.md). Follow 5-phase workflow. End turns with AskUserQuestion (for clarifications) or ExitPlanMode (for plan approval). Never ask about plan approval via text or AskUserQuestion.
```

#### Token Savings

Sparse variant saves approximately **1,300 tokens** per reminder vs. full variant.

---

### Subagent Variant (yzz)

**Location:** `chunks.173.mjs:2701-2712`

Simplified instructions for subagents in plan mode.

#### Content Structure

```markdown
Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
[Plan file info here]

You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

Answer the user's query comprehensively, using the AskUserQuestion tool if you need to ask the user clarifying questions.
```

#### Key Difference

Subagents cannot call `ExitPlanMode` - they report back to the parent agent instead.

---

## plan_mode_reentry

### What It Does

Special notification when re-entering plan mode after having previously exited. Instructs the LLM to evaluate whether the existing plan is still relevant.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Reentry flag set | `aL6()` returns true |
| Plan exists | Previous plan file exists |

### Source Code

```javascript
// ============================================
// getPlanModeAttachment - Reentry handling
// Location: chunks.142.mjs:2046-2049
// ============================================

// ORIGINAL (for source lookup):
if (aL6() && w !== null) H.push({
    type: "plan_mode_reentry",
    planFilePath: z
}), OT(!1);

// READABLE (for understanding):
if (isReenteringPlanMode() && planExists !== null) {
    attachments.push({
        type: "plan_mode_reentry",
        planFilePath: planFilePath
    });
    clearReentryFlag(false);
}
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - plan_mode_reentry case
// Location: chunks.173.mjs:939-956
// ============================================

// ORIGINAL (for source lookup):
case "plan_mode_reentry": {
    let K = `## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at ${A.planFilePath} from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ExitPlanMode

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`;
    return b5([p1({
        content: K,
        isMeta: !0
    })])
}
```

### Output Format

```markdown
<system-reminder>
## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at /path/to/plan.md from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ExitPlanMode

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.
</system-reminder>
```

---

## plan_mode_exit

### What It Does

Notifies the LLM that it has exited plan mode and can now take actions (edit files, run tools, etc.).

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Mode change | Was in "plan" mode, now not |
| Exit flag | `sL6()` returns true |

### Source Code

```javascript
// ============================================
// getPlanModeExitAttachment - Produce exit notification
// Location: chunks.142.mjs:2060-2071
// ============================================

// ORIGINAL (for source lookup):
async function nhY(A) {
    if (!sL6()) return [];
    if ((await A.getAppState()).toolPermissionContext.mode === "plan") return kx(!1), [];
    kx(!1);
    let K = uW(A.agentId),
        Y = pD(A.agentId) !== null;
    return [{
        type: "plan_mode_exit",
        planFilePath: K,
        planExists: Y
    }]
}

// READABLE (for understanding):
async function getPlanModeExitAttachment(sessionContext) {
    if (!shouldSendPlanModeExit()) return [];

    let appState = await sessionContext.getAppState();

    if (appState.toolPermissionContext.mode === "plan") {
        clearExitFlag(false);
        return [];
    }

    clearExitFlag(false);

    let planFilePath = getPlanFilePath(sessionContext.agentId);
    let planExists = checkPlanExists(sessionContext.agentId) !== null;

    return [{
        type: "plan_mode_exit",
        planFilePath: planFilePath,
        planExists: planExists
    }];
}

// Mapping: nhY→getPlanModeExitAttachment, A→sessionContext, K→planFilePath, Y→planExists, sL6→shouldSendPlanModeExit, kx→clearExitFlag, uW→getPlanFilePath, pD→checkPlanExists
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - plan_mode_exit case
// Location: chunks.173.mjs:958-965
// ============================================

// ORIGINAL (for source lookup):
case "plan_mode_exit": {
    let Y = `## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions.${A.planExists?` The plan file is located at ${A.planFilePath} if you need to reference it.`:""}`;
    return b5([p1({
        content: Y,
        isMeta: !0
    })])
}
```

### Output Format

```markdown
<system-reminder>
## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions. The plan file is located at /path/to/plan.md if you need to reference it.
</system-reminder>
```

---

## plan_file_reference

### What It Does

Injects the content of an existing plan file when a plan exists but the session is not currently in plan mode. This is primarily used after context compaction to restore awareness of an ongoing plan, and when resuming a session with an existing plan file.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Plan file exists | `checkPlanExists(agentId)` returns content |
| NOT in plan mode | Current mode is not "plan" |
| Post-compaction OR session resume | Context needs to be restored |

### Source Code

#### Producer Function

```javascript
// ============================================
// getPlanFileReferenceAttachment - Create plan file reference
// Location: chunks.146.mjs:2699-2708
// ============================================

// ORIGINAL (for source lookup):
function jZ6(A) {
    let q = pD(A);
    if (!q) return null;
    let K = uW(A);
    return kq({
        type: "plan_file_reference",
        planFilePath: K,
        planContent: q
    })
}

// READABLE (for understanding):
function getPlanFileReferenceAttachment(agentId) {
    let planContent = checkPlanExists(agentId);
    if (!planContent) return null;

    let planFilePath = getPlanFilePath(agentId);

    return createAttachment({
        type: "plan_file_reference",
        planFilePath: planFilePath,
        planContent: planContent
    });
}

// Mapping: jZ6→getPlanFileReferenceAttachment, A→agentId, q→planContent, K→planFilePath, pD→checkPlanExists, uW→getPlanFilePath, kq→createAttachment
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - plan_file_reference case
// Location: chunks.173.mjs:812-821
// ============================================

// ORIGINAL (for source lookup):
case "plan_file_reference":
    return b5([p1({
        content: `A plan file exists from plan mode at: ${A.planFilePath}

Plan contents:

${A.planContent}

If this plan is relevant to the current work and not already complete, continue working on it.`,
        isMeta: !0
    })]);
```

### Output Format

```markdown
<system-reminder>
A plan file exists from plan mode at: /path/to/plan.md

Plan contents:

# Plan: Implement Feature X

## Context
- User wants to add feature X to the application
- ...

## Implementation Steps
1. Create component A
2. Add API endpoint B
3. Write tests

## Verification
- Run test suite
- Manual testing checklist

If this plan is relevant to the current work and not already complete, continue working on it.
</system-reminder>
```

### Key Insights

1. **Post-compaction restoration**: When context is compacted, the plan file content is re-injected so the LLM remembers the ongoing plan.

2. **Non-intrusive**: Unlike `plan_mode`, this type doesn't restrict actions - it simply informs the LLM about an existing plan.

3. **Relevance check**: The reminder explicitly tells the LLM to evaluate if the plan is still relevant and continue if appropriate.

4. **Different from plan_mode**: This type shows the plan content WITHOUT entering plan mode. The LLM can still take any action.

5. **Session continuity**: Helps maintain work continuity across compaction events and session resumes.

---

## delegate_mode

### What It Does

Activates delegate mode for team coordination. The LLM can only use team-related tools (TeammateTool, Task tools).

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Mode is "delegate" | `toolPermissionContext.mode === "delegate"` |
| Team context exists | `teamContext` is defined |

### Source Code

```javascript
// ============================================
// getDelegateModeAttachment - Produce delegate mode attachment
// Location: chunks.142.mjs:2073-2083
// ============================================

// ORIGINAL (for source lookup):
async function rhY(A) {
    let q = await A.getAppState();
    if (q.toolPermissionContext.mode !== "delegate") return [];
    if (!q.teamContext) return [];
    let Y = `${O8()}/tasks/${q.teamContext.teamName}/`;
    return [{
        type: "delegate_mode",
        teamName: q.teamContext.teamName,
        taskListPath: Y
    }]
}

// READABLE (for understanding):
async function getDelegateModeAttachment(sessionContext) {
    let appState = await sessionContext.getAppState();

    if (appState.toolPermissionContext.mode !== "delegate") return [];
    if (!appState.teamContext) return [];

    let taskListPath = `${getTeamDataPath()}/tasks/${appState.teamContext.teamName}/`;

    return [{
        type: "delegate_mode",
        teamName: appState.teamContext.teamName,
        taskListPath: taskListPath
    }];
}

// Mapping: rhY→getDelegateModeAttachment, A→sessionContext, q→appState, Y→taskListPath, O8→getTeamDataPath
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - delegate_mode case
// Location: chunks.173.mjs:967-986
// ============================================

// ORIGINAL (for source lookup):
case "delegate_mode": {
    if (!l8()) return [];
    let K = `## Delegate Mode

You are in delegate mode for team "${A.teamName}". In this mode, you can ONLY use the following tools:
- TeammateTool: For spawning teammates, sending messages, and team coordination
- TaskCreate: For creating new tasks
- TaskGet: For retrieving task details
- TaskUpdate: For updating task status and adding comments
- TaskList: For listing all tasks

You CANNOT use any other tools (Bash, Read, Write, Edit, etc.) until you exit delegate mode.

**Task list location:** ${A.taskListPath}

Focus on coordinating work by creating tasks, assigning them to teammates, and monitoring progress. Use the Teammate tool to communicate with your team.`;
    return b5([p1({
        content: K,
        isMeta: !0
    })])
}
```

### Output Format

```markdown
<system-reminder>
## Delegate Mode

You are in delegate mode for team "my-team". In this mode, you can ONLY use the following tools:
- TeammateTool: For spawning teammates, sending messages, and team coordination
- TaskCreate: For creating new tasks
- TaskGet: For retrieving task details
- TaskUpdate: For updating task status and adding comments
- TaskList: For listing all tasks

You CANNOT use any other tools (Bash, Read, Write, Edit, etc.) until you exit delegate mode.

**Task list location:** ~/.claude/tasks/my-team/

Focus on coordinating work by creating tasks, assigning them to teammates, and monitoring progress. Use the Teammate tool to communicate with your team.
</system-reminder>
```

---

## delegate_mode_exit

### What It Does

Notifies the LLM that it has exited delegate mode and can now use all tools.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Exit flag | `eL6()` returns true |

### Source Code

```javascript
// ============================================
// getDelegateModeExitAttachment - Produce delegate exit notification
// Location: chunks.142.mjs:2085-2090
// ============================================

// ORIGINAL (for source lookup):
function ohY() {
    if (!eL6()) return [];
    return XN1(!1), [{
        type: "delegate_mode_exit"
    }]
}

// READABLE (for understanding):
function getDelegateModeExitAttachment() {
    if (!shouldSendDelegateModeExit()) return [];

    clearDelegateExitFlag(false);

    return [{
        type: "delegate_mode_exit"
    }];
}

// Mapping: ohY→getDelegateModeExitAttachment, eL6→shouldSendDelegateModeExit, XN1→clearDelegateExitFlag
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - delegate_mode_exit case
// Location: chunks.173.mjs:988-994
// ============================================

// ORIGINAL (for source lookup):
case "delegate_mode_exit":
    return b5([p1({
        content: `## Exited Delegate Mode

You have exited delegate mode. You can now use all tools (Bash, Read, Write, Edit, etc.) and take actions directly. Continue with your tasks.`,
        isMeta: !0
    })]);
```

### Output Format

```markdown
<system-reminder>
## Exited Delegate Mode

You have exited delegate mode. You can now use all tools (Bash, Read, Write, Edit, etc.) and take actions directly. Continue with your tasks.
</system-reminder>
```

---

## auto_mode (v2.1.76)

### What It Does

Instructs the LLM to operate in autonomous execution mode where it should execute immediately, minimize interruptions, and prefer action over planning.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Auto mode activated | User activates auto mode (typically via `/auto` command) |

### Source Code

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - auto_mode case
// Location: chunks.174.mjs:276-277
// ============================================

// Dispatches to Lzz (autoModeReminder)
case "auto_mode":
    return Lzz(A);
```

#### Dispatcher Function (Lzz)

```javascript
// ============================================
// autoModeReminder - Dispatch to full or sparse variant
// Location: chunks.173.mjs:2714-2717
// ============================================

// ORIGINAL (for source lookup):
function Lzz(A) {
    if (A.reminderType === "sparse") return hzz();
    return Rzz()
}

// READABLE (for understanding):
function autoModeReminder(attachment) {
    if (attachment.reminderType === "sparse") return sparseAutoModeReminder();
    return fullAutoModeReminder();
}
```

#### Full Variant (Rzz)

**Location:** `chunks.173.mjs:2719-2732`

```markdown
<system-reminder>
## Auto Mode Active

Auto mode is active. The user chose continuous, autonomous execution. You should:

1. **Execute immediately** — Start implementing right away. Make reasonable assumptions and proceed.
2. **Minimize interruptions** — Prefer making reasonable assumptions over asking questions. Use AskUserQuestion only when the task genuinely cannot proceed without user input (e.g., choosing between fundamentally different approaches with no clear default).
3. **Prefer action over planning** — Do not enter plan mode unless the user explicitly asks. When in doubt, start coding.
4. **Make reasonable decisions** — Choose the most sensible approach and keep moving. Don't block on ambiguity that you can resolve with a reasonable default.
5. **Be thorough** — Complete the full task including tests, linting, and verification without stopping to ask.
</system-reminder>
```

#### Sparse Variant (hzz)

**Location:** `chunks.173.mjs:2734-2739`

```markdown
<system-reminder>
Auto mode still active (see full instructions earlier in conversation). Execute autonomously, minimize interruptions, prefer action over planning.
</system-reminder>
```

---

## auto_mode_exit (v2.1.76)

### What It Does

Notifies the LLM that auto mode has ended and it should ask clarifying questions when the approach is ambiguous.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Auto mode deactivated | User deactivates auto mode |

### Source Code

```javascript
// ============================================
// normalizeAttachmentForAPI - auto_mode_exit case
// Location: chunks.174.mjs:278-284
// ============================================

// ORIGINAL (for source lookup):
case "auto_mode_exit":
    return b5([p1({
        content: `## Exited Auto Mode

You have exited auto mode. The user may now want to interact more directly. You should ask clarifying questions when the approach is ambiguous rather than making assumptions.`,
        isMeta: !0
    })]);
```

### Output Format

```markdown
<system-reminder>
## Exited Auto Mode

You have exited auto mode. The user may now want to interact more directly. You should ask clarifying questions when the approach is ambiguous rather than making assumptions.
</system-reminder>
```

---

## Variant Selection Logic

### Full vs. Sparse Selection

```javascript
// ============================================
// Variant selection - Full vs Sparse
// Location: chunks.142.mjs:2050
// ============================================

// Formula:
let reminderType = (countPlanModeReminders(messages) + 1) %
                   FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
                   ? "full"
                   : "sparse";

// This means:
// Reminder #1:  (1) % 5 === 1 → "full"
// Reminder #2:  (2) % 5 === 2 → "sparse"
// Reminder #3:  (3) % 5 === 3 → "sparse"
// Reminder #4:  (4) % 5 === 4 → "sparse"
// Reminder #5:  (5) % 5 === 0 → "sparse"
// Reminder #6:  (6) % 5 === 1 → "full"
// ...
```

### Subagent Detection

```javascript
// Subagents are detected by the presence of agentId
let isSubAgent = !!sessionContext.agentId;

// In planModeReminderDispatcher:
if (attachment.isSubAgent) return formatSubagentPlanReminder(attachment);
```

### Iterative Mode Detection

```javascript
// Iterative mode is enabled via feature flag
if (sO()) return iterativePlanReminder(attachment);
```

---

## Configuration

### Constants

```javascript
// ============================================
// Plan mode constants
// Location: chunks.142.mjs:2921-2924
// ============================================

ii4 = {
    TURNS_BETWEEN_ATTACHMENTS: 5,       // Minimum turns between plan reminders
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5 // Send full every 5th reminder
}
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | Disables all attachment production |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions in this document:

- `planModeReminderDispatcher` (Wzz) - Variant router, `chunks.173.mjs:2525-2530`
- `fullPlanReminder` (Nzz) - Full instructions, `chunks.173.mjs:2556-2690`
- `sparsePlanReminder` (Ezz) - Abbreviated reminder, `chunks.173.mjs:2692-2699`
- `subAgentPlanReminder` (yzz) - Subagent instructions, `chunks.173.mjs:2701-2712`
- `ultraplanCompleteReminder` (Zzz) - Ultraplan complete, `chunks.173.mjs:2532-2538`
- `autoModeReminder` (Lzz) - Auto mode dispatcher, `chunks.173.mjs:2714-2717`
- `fullAutoModeReminder` (Rzz) - Full auto mode instructions, `chunks.173.mjs:2719-2732`
- `sparseAutoModeReminder` (hzz) - Sparse auto mode reminder, `chunks.173.mjs:2734-2739`
- `getPlanModeAttachment` (ihY) - Plan mode producer, `chunks.142.mjs:2034-2058`
- `getPlanModeExitAttachment` (nhY) - Exit producer, `chunks.142.mjs:2060-2071`
- `getPlanFileReferenceAttachment` (jZ6) - Plan file reference producer, `chunks.146.mjs:2699-2708`
- `getDelegateModeAttachment` (rhY) - Delegate mode producer, `chunks.142.mjs:2073-2083`
- `getDelegateModeExitAttachment` (ohY) - Delegate exit producer, `chunks.142.mjs:2085-2090`
- `countTurnsSincePlanMode` (chY) - Turn counter, `chunks.142.mjs:2003-2020`
- `countPlanModeReminders` (lhY) - Reminder counter, `chunks.142.mjs:2022-2032`
- `PLAN_MODE_CONSTANTS` (ii4) - Configuration constants

---

## Related Documents

- [README.md](./README.md) - Documentation index
- [implementation_details.md](./implementation_details.md) - Core implementation
- [types_team_mode.md](./types_team_mode.md) - Team mode types
