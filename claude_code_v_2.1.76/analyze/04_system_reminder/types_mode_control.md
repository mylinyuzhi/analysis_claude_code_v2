# System Reminder Types: Mode Control

> **Module**: System Reminders - Plan/Delegate Mode Types
> **Version**: Claude Code 2.1.38
> **Source**: `chunks.173.mjs:525-696`, `chunks.173.mjs:937-994`, `chunks.142.mjs:2034-2090`

---

## Table of Contents

- [Overview](#overview)
- [Plan Mode Architecture](#plan-mode-architecture)
- [plan_mode](#plan_mode)
  - [Full Variant (szz)](#full-variant-szz)
  - [Iterative Variant (ezz)](#iterative-variant-ezz)
  - [Sparse Variant (A2z)](#sparse-variant-a2z)
  - [Subagent Variant (q2z)](#subagent-variant-q2z)
- [plan_mode_reentry](#plan_mode_reentry)
- [plan_mode_exit](#plan_mode_exit)
- [plan_file_reference](#plan_file_reference)
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
5. **delegate_mode** - Activates team delegate mode
6. **delegate_mode_exit** - Exiting delegate mode

Plan mode has the most complex reminder system with **four variants** optimized for different scenarios.

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
                │          (azz)              │
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
    │  (q2z)      │  │   (A2z)     │   │   (szz)     │
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
    // Check if plan mode is active
    let appState = await sessionContext.getAppState();
    if (appState.toolPermissionContext.mode !== "plan") return [];

    // Throttle: Don't send too frequently
    if (messages && messages.length > 0) {
        let { turnCount, foundPlanModeAttachment } = countTurnsSincePlanMode(messages);
        if (foundPlanModeAttachment && turnCount < PLAN_MODE_CONSTANTS.TURNS_BETWEEN_ATTACHMENTS) {
            return [];
        }
    }

    let planFilePath = getPlanFilePath(sessionContext.agentId);
    let planExists = checkPlanExists(sessionContext.agentId);
    let attachments = [];

    // If re-entering plan mode with existing plan, add reentry attachment
    if (isReenteringPlanMode() && planExists !== null) {
        attachments.push({
            type: "plan_mode_reentry",
            planFilePath: planFilePath
        });
        clearReentryFlag(false);
    }

    // Determine if this should be full or sparse reminder
    let reminderType = (countPlanModeReminders(messages ?? []) + 1) %
                       PLAN_MODE_CONSTANTS.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
                       ? "full"
                       : "sparse";

    attachments.push({
        type: "plan_mode",
        reminderType: reminderType,
        isSubAgent: !!sessionContext.agentId,
        planFilePath: planFilePath,
        planExists: planExists !== null
    });

    return attachments;
}

// Mapping: ihY→getPlanModeAttachment, A→messages, q→sessionContext, _→turnCount, J→foundPlanModeAttachment, chY→countTurnsSincePlanMode, z→planFilePath, w→planExists, H→attachments, uW→getPlanFilePath, pD→checkPlanExists, aL6→isReenteringPlanMode, OT→clearReentryFlag, lhY→countPlanModeReminders, ii4→PLAN_MODE_CONSTANTS
```

---

### Full Variant (szz)

**Location:** `chunks.173.mjs:531-609`

The full variant provides comprehensive 5-phase planning instructions.

#### Content Structure

```markdown
Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
[A plan file already exists at /path/to/plan.md. You can read it and make incremental edits using the Edit tool.]
OR
[No plan file exists yet. You should create your plan at /path/to/plan.md using the Write tool.]

You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

## Plan Workflow

### Phase 1: Initial Understanding
Goal: Gain a comprehensive understanding of the user's request by reading through code and asking them questions. Critical: In this phase you should only use the Explore subagent type.

1. Focus on understanding the user's request and the code associated with their request. Actively search for existing functions, utilities, and patterns that can be reused — avoid proposing new code when suitable implementations already exist.

2. **Launch up to N Explore agents IN PARALLEL** (single message, multiple tool calls) to efficiently explore the codebase.
   - Use 1 agent when the task is isolated to known files...
   - Use multiple agents when: the scope is uncertain, multiple areas...

### Phase 2: Design
Goal: Design an implementation approach.

Launch Plan agent(s) to design the implementation based on the user's intent and your exploration results from Phase 1.

You can launch up to M agent(s) in parallel.

**Guidelines:**
- **Default**: Launch at least 1 Plan agent for most tasks...
- **Skip agents**: Only for truly trivial tasks...

### Phase 3: Review
Goal: Review the plan(s) from Phase 2 and ensure alignment with the user's intentions.
1. Read the critical files identified by agents to deepen your understanding
2. Ensure that the plans align with the user's original request
3. Use AskUserQuestion to clarify any remaining questions with the user

### Phase 4: Final Plan
Goal: Write your final plan to the plan file (the only file you can edit).
- Begin with a **Context** section: explain why this change is being made...
- Include only your recommended approach, not all alternatives
- Ensure that the plan file is concise enough to scan quickly...
- Include the paths of critical files to be modified
- Reference existing functions and utilities you found that should be reused...
- Include a verification section describing how to test the changes...

### Phase 5: Call ExitPlanMode
At the very end of your turn, once you have asked the user questions and are happy with your final plan file - you should always call ExitPlanMode to indicate to the user that you are done planning.

This is critical - your turn should only end with either using the AskUserQuestion tool OR calling ExitPlanMode. Do not stop unless it's for these 2 reasons.

**Important:** Use AskUserQuestion ONLY to clarify requirements or choose between approaches. Use ExitPlanMode to request plan approval. Do NOT ask about plan approval in any other way...
```

#### Key Insights

1. **Phase-based workflow**: Clear 5-phase structure guides the planning process.
2. **Agent parallelization**: Encourages launching Explore agents in parallel.
3. **Single exit path**: Turn must end with AskUserQuestion or ExitPlanMode.
4. **Tool restrictions**: Only Edit to plan file allowed, all else is read-only.

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

### First Turn

Start by quickly scanning a few key files to form an initial understanding of the task scope. Then write a skeleton plan (headers and rough notes) and ask the user your first round of questions. Don't explore exhaustively before engaging the user.

### Asking Good Questions

- Never ask what you could find out by reading the code
- Batch related questions together (use multi-question AskUserQuestion calls)
- Focus on things only the user can answer: requirements, preferences, tradeoffs, edge case priorities
- Scale depth to the task — a vague feature request needs many rounds; a focused bug fix may need one or none

### Plan File Structure
...

### When to Converge

Your plan is ready when you've addressed all ambiguities and it covers: what to change, which files to modify, what existing code to reuse (with file paths), and how to verify the changes. Call ExitPlanMode when the plan is ready for approval.

### Ending Your Turn

Your turn should only end by either:
- Using AskUserQuestion to gather more information
- Calling ExitPlanMode when the plan is ready for approval

**Important:** Use ExitPlanMode to request plan approval. Do NOT ask about plan approval via text or AskUserQuestion.
```

---

### Sparse Variant (A2z)

**Location:** `chunks.173.mjs:676-683`

Brief reminder for subsequent turns after full reminder.

#### Content Structure

```markdown
Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (/path/to/plan.md). Follow 5-phase workflow. End turns with AskUserQuestion (for clarifications) or ExitPlanMode (for plan approval). Never ask about plan approval via text or AskUserQuestion.
```

#### Token Savings

Sparse variant saves approximately **1,300 tokens** per reminder vs. full variant.

---

### Subagent Variant (q2z)

**Location:** `chunks.173.mjs:685-696`

Simplified instructions for subagents in plan mode.

#### Content Structure

```markdown
Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
[Plan file info here]

You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

Answer the user's query comprehensively, using the AskUserQuestion tool if you need to ask the user clarifying questions. If you do use the AskUserQuestion, make sure to ask all clarifying questions you need to fully understand the user's intent before proceeding.
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
    return _9([c6({
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
    // Check if exiting plan mode
    if (!shouldSendPlanModeExit()) return [];

    let appState = await sessionContext.getAppState();

    // If still in plan mode, don't send exit
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
    return _9([c6({
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
    // Check if plan file exists and has content
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

#### Usage in Compaction

```javascript
// ============================================
// Usage in compaction flow
// Location: chunks.146.mjs:2387-2388, chunks.147.mjs:639
// ============================================

// ORIGINAL (for source lookup):
let k = jZ6(q.agentId);
if (k) N.push(k);

// READABLE (for understanding):
// After compaction, restore plan file reference if exists
let planReference = getPlanFileReferenceAttachment(sessionContext.agentId);
if (planReference) {
    attachments.push(planReference);
}
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - plan_file_reference case
// Location: chunks.173.mjs:812-821
// ============================================

// ORIGINAL (for source lookup):
case "plan_file_reference":
    return _9([c6({
        content: `A plan file exists from plan mode at: ${A.planFilePath}

Plan contents:

${A.planContent}

If this plan is relevant to the current work and not already complete, continue working on it.`,
        isMeta: !0
    })]);

// READABLE (for understanding):
case "plan_file_reference":
    return wrapWithSystemReminderTags([
        createUserMessage({
            content: `A plan file exists from plan mode at: ${attachment.planFilePath}

Plan contents:

${attachment.planContent}

If this plan is relevant to the current work and not already complete, continue working on it.`,
            isMeta: true
        })
    ]);
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
    return _9([c6({
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
    return _9([c6({
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

- `planModeReminderDispatcher` (azz) - Variant router, `chunks.173.mjs:525-529`
- `fullPlanReminder` (szz) - Full instructions, `chunks.173.mjs:531-609`
- `iterativePlanReminder` (ezz) - Iterative workflow, `chunks.173.mjs:619-674`
- `sparsePlanReminder` (A2z) - Abbreviated reminder, `chunks.173.mjs:676-683`
- `subAgentPlanReminder` (q2z) - Subagent instructions, `chunks.173.mjs:685-696`
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