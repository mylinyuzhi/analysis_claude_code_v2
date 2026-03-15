# Plan Mode - Reminder System Analysis (Claude Code 2.1.38)

> Complete reverse engineering of the reminder/attachment injection system for plan mode, including turn counting, throttling, and content variations.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `ihY` (chunks.142.mjs:2034) - `buildPlanModeAttachments` - Main attachment generator
- `nhY` (chunks.142.mjs:2060) - `buildPlanModeExitAttachment` - Exit attachment
- `ezz` (chunks.173.mjs:619) - `buildPlanModeInterviewReminder` - Full iterative reminder
- `A2z` (chunks.173.mjs:676) - `buildPlanModeSparseReminder` - Sparse turn-end hint
- `lhY` (chunks.142.mjs:2022) - `countPlanModeAttachments` - Attachment counter
- `chY` (chunks.142.mjs:2003) - `countTurnsSinceLastPlanModeAttachment` - Turn counter
- `ii4` (chunks.142.mjs:2921) - Attachment throttling constants

---

## 1. Overview: Reminder Injection Architecture

Plan mode reminders are injected as **attachments** - special message-like objects that provide context to the LLM without being part of the visible conversation history.

```
┌─────────────────────────────────────────────────────────────────┐
│              Plan Mode Reminder Injection Flow                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Agent Loop Turn Start                                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Before sending messages to LLM...                           ││
│  └─────────────────────────────────────────────────────────────┘│
│                        │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ihY() - buildPlanModeAttachments()                          ││
│  │                                                             ││
│  │ 1. Check if mode === "plan"                                 ││
│  │ 2. Count turns since last attachment (chY)                  ││
│  │ 3. Check throttling (TURNS_BETWEEN_ATTACHMENTS = 5)        ││
│  │ 4. Detect re-entry (hasExitedPlanMode)                      ││
│  │ 5. Determine reminder type (full vs sparse)                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                        │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Attachment Types Generated:                                 ││
│  │                                                             ││
│  │ • plan_mode_reentry - If re-entering after exit             ││
│  │ • plan_mode (full) - Every Nth attachment                   ││
│  │ • plan_mode (sparse) - Brief hint between full reminders    ││
│  └─────────────────────────────────────────────────────────────┘│
│                        │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Rendered via ezz() or A2z() depending on:                   ││
│  │ • Interview phase feature flag (sO)                         ││
│  │ • Subagent context                                          ││
│  │ • Reminder type (full vs sparse)                            ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Main Attachment Generator (`ihY`)

```javascript
// ============================================
// ihY - buildPlanModeAttachments
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
async function buildPlanModeAttachments(messages, context) {
    // Step 1: Check if we're in plan mode
    let appState = await context.getAppState();
    if (appState.toolPermissionContext.mode !== "plan") {
        return [];  // Not in plan mode, no attachments
    }

    // Step 2: Throttling check - only inject every N turns
    if (messages && messages.length > 0) {
        let { turnCount, foundPlanModeAttachment } = countTurnsSinceLastAttachment(messages);

        // If we found a recent attachment and haven't waited enough turns, skip
        if (foundPlanModeAttachment && turnCount < TURNS_BETWEEN_ATTACHMENTS) {
            return [];
        }
    }

    // Step 3: Get plan file info
    let planFilePath = getPlanFilePath(context.agentId);
    let planExists = checkPlanFileExists(context.agentId);

    // Step 4: Build attachment list
    let attachments = [];

    // Step 4a: Re-entry detection
    // If user previously exited plan mode and is now back in
    if (hasExitedPlanMode() && planExists !== null) {
        attachments.push({
            type: "plan_mode_reentry",
            planFilePath: planFilePath
        });
        setHasExitedPlanMode(false);  // Reset the flag
    }

    // Step 5: Determine reminder type (full vs sparse)
    // Full reminder every N attachments, sparse in between
    let attachmentCount = countPlanModeAttachments(messages ?? []);
    let reminderType = (attachmentCount + 1) % FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
        ? "full"
        : "sparse";

    // Step 6: Add main plan_mode attachment
    attachments.push({
        type: "plan_mode",
        reminderType: reminderType,
        isSubAgent: !!context.agentId,
        planFilePath: planFilePath,
        planExists: planExists !== null
    });

    return attachments;
}

// Mapping: ihY→buildPlanModeAttachments, chY→countTurnsSinceLastAttachment,
//          uW→getPlanFilePath, pD→checkPlanFileExists, aL6→hasExitedPlanMode,
//          OT→setHasExitedPlanMode, lhY→countPlanModeAttachments, ii4→constants
```

---

## 3. Turn Counting Functions

### `chY` - Count Turns Since Last Attachment

```javascript
// ============================================
// chY - countTurnsSinceLastAttachment
// Location: chunks.142.mjs:2003-2020
// ============================================

// ORIGINAL (for source lookup):
function chY(A) {
    let q = 0,
        K = !1;
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (z?.type === "assistant") {
            if (bg1(z)) continue;
            q++
        } else if (z?.type === "attachment" && (z.attachment.type === "plan_mode" || z.attachment.type === "plan_mode_reentry")) {
            K = !0;
            break
        }
    }
    return {
        turnCount: q,
        foundPlanModeAttachment: K
    }
}

// READABLE (for understanding):
function countTurnsSinceLastAttachment(messages) {
    let turnCount = 0;
    let foundPlanModeAttachment = false;

    // Iterate backwards through messages
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        if (message?.type === "assistant") {
            // Skip empty/thinking-only turns (bg1 checks for this)
            if (isEmptyAssistantTurn(message)) continue;
            turnCount++;
        } else if (message?.type === "attachment" &&
                   (message.attachment.type === "plan_mode" ||
                    message.attachment.type === "plan_mode_reentry")) {
            // Found the last plan mode attachment
            foundPlanModeAttachment = true;
            break;
        }
    }

    return {
        turnCount: turnCount,
        foundPlanModeAttachment: foundPlanModeAttachment
    };
}

// Mapping: chY→countTurnsSinceLastAttachment, bg1→isEmptyAssistantTurn
```

### `lhY` - Count Plan Mode Attachments

```javascript
// ============================================
// lhY - countPlanModeAttachments
// Location: chunks.142.mjs:2022-2032
// ============================================

// ORIGINAL (for source lookup):
function lhY(A) {
    let q = 0;
    for (let K = A.length - 1; K >= 0; K--) {
        let Y = A[K];
        if (Y?.type === "attachment") {
            if (Y.attachment.type === "plan_mode_exit") break;
            if (Y.attachment.type === "plan_mode") q++
        }
    }
    return q
}

// READABLE (for understanding):
function countPlanModeAttachments(messages) {
    let count = 0;

    // Iterate backwards through messages
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        if (message?.type === "attachment") {
            // Stop counting if we hit an exit attachment
            if (message.attachment.type === "plan_mode_exit") {
                break;
            }
            // Count plan_mode attachments
            if (message.attachment.type === "plan_mode") {
                count++;
            }
        }
    }

    return count;
}

// Mapping: lhY→countPlanModeAttachments
```

---

## 4. Throttling Constants

```javascript
// ============================================
// ii4 - Plan mode attachment throttling constants
// Location: chunks.142.mjs:2921-2924
// ============================================

// ORIGINAL (for source lookup):
ii4 = {
    TURNS_BETWEEN_ATTACHMENTS: 5,
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5
}

// READABLE (for understanding):
const PLAN_MODE_ATTACHMENT_CONFIG = {
    // Wait this many turns between injecting attachments
    TURNS_BETWEEN_ATTACHMENTS: 5,

    // Every Nth attachment should be a full reminder (not sparse)
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5
};

// Mapping: ii4→PLAN_MODE_ATTACHMENT_CONFIG
```

### Throttling Logic

With `TURNS_BETWEEN_ATTACHMENTS: 5` and `FULL_REMINDER_EVERY_N_ATTACHMENTS: 5`:

```
Turn 1:  Full reminder (1st attachment)
Turn 2-5: No attachment (throttled)
Turn 6:  Sparse reminder (2nd attachment)
Turn 7-10: No attachment (throttled)
Turn 11: Sparse reminder (3rd attachment)
Turn 12-15: No attachment (throttled)
Turn 16: Sparse reminder (4th attachment)
Turn 17-20: No attachment (throttled)
Turn 21: Full reminder (5th attachment) ← Every 5th is full
...
```

**Key insight**: With both values at 5, full reminders appear every 25 turns (5 attachments × 5 turns each).

---

## 5. Full Reminder Builder - Interview Phase (`ezz`)

```javascript
// ============================================
// ezz - buildPlanModeInterviewReminder (Interview Phase)
// Location: chunks.173.mjs:619-673
// ============================================

// ORIGINAL (for source lookup):
function ezz(A) {
    let q = A.planExists ? `A plan file already exists at ${A.planFilePath}. You can read it and make incremental edits using the ${sW.name} tool.` : `No plan file exists yet. You should create your plan at ${A.planFilePath} using the ${vj.name} tool.`,
        K = `You can use the ${bv.agentType} agent type to parallelize complex searches without filling your context, though for straightforward queries direct tools are simpler.`,
        Y = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${q}

## Iterative Planning Workflow

You are pair-planning with the user. Explore the code to build context, ask the user questions when you hit decisions you can't make alone, and write your findings into the plan file as you go. The plan file (above) is the ONLY file you may edit — it starts as a rough skeleton and gradually becomes the final plan.

### The Loop

Repeat this cycle until the plan is complete:

1. **Explore** — Use ${tzz()} to read code. Look for existing functions, utilities, and patterns to reuse. ${K}
2. **Update the plan file** — After each discovery, immediately capture what you learned. Don't wait until the end.
3. **Ask the user** — When you hit an ambiguity or decision you can't resolve from code alone, use ${TH}. Then go back to step 1.

### First Turn

Start by quickly scanning a few key files to form an initial understanding of the task scope. Then write a skeleton plan (headers and rough notes) and ask the user your first round of questions. Don't explore exhaustively before engaging the user.

### Asking Good Questions

- Never ask what you could find out by reading the code
- Batch related questions together (use multi-question ${TH} calls)
- Focus on things only the user can answer: requirements, preferences, tradeoffs, edge case priorities
- Scale depth to the task — a vague feature request needs many rounds; a focused bug fix may need one or none

### Plan File Structure
Your plan file should be divided into clear sections using markdown headers, based on the request. Fill out these sections as you go.
- Begin with a **Context** section: explain why this change is being made — the problem or need it addresses, what prompted it, and the intended outcome
- Include only your recommended approach, not all alternatives
- Ensure that the plan file is concise enough to scan quickly, but detailed enough to execute effectively
- Include the paths of critical files to be modified
- Reference existing functions and utilities you found that should be reused, with their file paths
- Include a verification section describing how to test the changes end-to-end (run the code, use MCP tools, run tests)

### When to Converge

Your plan is ready when you've addressed all ambiguities and it covers: what to change, which files to modify, what existing code to reuse (with file paths), and how to verify the changes. Call ${Nj.name} when the plan is ready for approval.

### Ending Your Turn

Your turn should only end by either:
- Using ${TH} to gather more information
- Calling ${Nj.name} when the plan is ready for approval

**Important:** Use ${Nj.name} to request plan approval. Do NOT ask about plan approval via text or AskUserQuestion.`;
    return _9([c6({
        content: Y,
        isMeta: !0
    })])
}

// READABLE (for understanding):
function buildPlanModeInterviewReminder(attachment) {
    // Plan file info section
    let planFileInfo = attachment.planExists
        ? `A plan file already exists at ${attachment.planFilePath}. You can read it and make incremental edits using the Read tool.`
        : `No plan file exists yet. You should create your plan at ${attachment.planFilePath} using the Write tool.`;

    // Agent recommendation
    let agentRecommendation = `You can use the Explore agent type to parallelize complex searches without filling your context, though for straightforward queries direct tools are simpler.`;

    // Build the full reminder text
    let reminderText = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${planFileInfo}

## Iterative Planning Workflow

You are pair-planning with the user. Explore the code to build context, ask the user questions when you hit decisions you can't make alone, and write your findings into the plan file as you go.

### The Loop

Repeat this cycle until the plan is complete:

1. **Explore** — Use ${buildAllowedToolsList()} to read code...
2. **Update the plan file** — After each discovery, immediately capture what you learned.
3. **Ask the user** — When you hit an ambiguity, use AskUserQuestion.

### Ending Your Turn

Your turn should only end by either:
- Using AskUserQuestion to gather more information
- Calling ExitPlanMode when the plan is ready for approval

**Important:** Use ExitPlanMode to request plan approval. Do NOT ask about plan approval via text or AskUserQuestion.`;

    return createMetaContent(reminderText);
}

// Mapping: ezz→buildPlanModeInterviewReminder, sW→ReadTool, vj→WriteTool,
//          bv→ExploreAgentType, tzz→buildAllowedToolsList, TH→AskUserQuestion,
//          Nj→ExitPlanMode, _9→createMetaContent, c6→createContentBlock
```

---

## 6. Sparse Reminder Builder (`A2z`)

```javascript
// ============================================
// A2z - buildPlanModeSparseReminder
// Location: chunks.173.mjs:676-683
// ============================================

// ORIGINAL (for source lookup):
function A2z(A) {
    let q = sO() ? "Follow iterative workflow: explore codebase, interview user, write to plan incrementally." : "Follow 5-phase workflow.",
        K = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${A.planFilePath}). ${q} End turns with ${TH} (for clarifications) or ${Nj.name} (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
    return _9([c6({
        content: K,
        isMeta: !0
    })])
}

// READABLE (for understanding):
function buildPlanModeSparseReminder(attachment) {
    // Different hint based on feature flag
    let workflowHint = isInterviewPhase()
        ? "Follow iterative workflow: explore codebase, interview user, write to plan incrementally."
        : "Follow 5-phase workflow.";

    // Brief reminder - references earlier full instructions
    let reminderText = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${attachment.planFilePath}). ${workflowHint} End turns with AskUserQuestion (for clarifications) or ExitPlanMode (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;

    return createMetaContent(reminderText);
}

// Mapping: A2z→buildPlanModeSparseReminder, sO→isInterviewPhase,
//          TH→AskUserQuestion, Nj→ExitPlanMode
```

---

## 7. Exit Attachment Builder (`nhY`)

```javascript
// ============================================
// nhY - buildPlanModeExitAttachment
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
async function buildPlanModeExitAttachment(context) {
    // Check if exit attachment is needed
    if (!needsPlanModeExitAttachment()) {
        return [];
    }

    // If still in plan mode, don't add exit attachment
    let appState = await context.getAppState();
    if (appState.toolPermissionContext.mode === "plan") {
        setNeedsPlanModeExitAttachment(false);
        return [];
    }

    // Reset the flag
    setNeedsPlanModeExitAttachment(false);

    // Get plan file info
    let planFilePath = getPlanFilePath(context.agentId);
    let planExists = checkPlanFileExists(context.agentId) !== null;

    // Return exit attachment
    return [{
        type: "plan_mode_exit",
        planFilePath: planFilePath,
        planExists: planExists
    }];
}

// Mapping: nhY→buildPlanModeExitAttachment, sL6→needsPlanModeExitAttachment,
//          kx→setNeedsPlanModeExitAttachment, uW→getPlanFilePath, pD→checkPlanFileExists
```

---

## 8. Attachment Types Summary

| Type | Purpose | When Generated |
|------|---------|----------------|
| `plan_mode` (full) | Complete workflow instructions | Every Nth attachment (configurable) |
| `plan_mode` (sparse) | Brief reminder with key points | Between full reminders |
| `plan_mode_reentry` | Context restoration after re-entry | When `hasExitedPlanMode` is true |
| `plan_mode_exit` | Confirmation of mode transition | When exiting plan mode |

---

## 9. Re-entry Detection Flow

When a user exits plan mode and then re-enters (via Shift+Tab or EnterPlanMode), the system detects this and provides context:

```
User exits plan mode
    │
    ├─ ExitPlanMode.call() executes
    │   └─ setHasExitedPlanMode(true)  ← aL6 = true
    │
    ├─ User decides to re-enter plan mode
    │   └─ Shift+Tab or EnterPlanMode
    │
    └─ Next agent loop turn
        │
        ├─ ihY() called
        │   ├─ hasExitedPlanMode() = true
        │   ├─ Push plan_mode_reentry attachment
        │   └─ setHasExitedPlanMode(false)
        │
        └─ LLM receives:
            "You previously exited plan mode. Your plan file is at..."
```

### Re-entry Attachment Content

The re-entry attachment is minimal - it just points to the plan file:

```javascript
{
    type: "plan_mode_reentry",
    planFilePath: ".claude/sessions/abc123/plan.md"
}
```

This is rendered into a message that tells the LLM to check if the previous plan is still relevant.

---

## 10. Feature Flag: Interview Phase

The `sO()` function checks if the interview phase feature flag is enabled:

```javascript
// ============================================
// sO - isPlanModeInterviewPhase
// Location: chunks.140.mjs:1475
// ============================================

function sO() {
    return Y0(process.env.CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE)
}

// READABLE:
function isPlanModeInterviewPhase() {
    return parseBoolean(process.env.CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE);
}
```

### Interview Phase vs Standard (5-Phase)

| Aspect | Interview Phase | Standard 5-Phase |
|--------|----------------|------------------|
| Workflow | Iterative loop | Sequential phases |
| Exploration | Continuous | Phase 1 only |
| Questions | As needed | Phase 2 |
| Plan Writing | Incremental | Phase 3 |
| Reminder Content | "Iterative workflow" hint | "5-phase workflow" hint |
| Full Reminder | `ezz()` | `szz()` |

---

## 11. Interaction with Other Attachment Generators

Plan mode attachments are part of a larger attachment system:

```javascript
// ============================================
// Attachment generator pipeline
// Location: chunks.142.mjs (main attachment loop)
// ============================================

// Pseudo-code of the full pipeline:
async function buildAllAttachments(messages, context) {
    let attachments = [];

    // 1. Plan mode attachments
    attachments.push(...await buildPlanModeAttachments(messages, context));  // ihY

    // 2. Plan mode exit attachment
    attachments.push(...await buildPlanModeExitAttachment(context));  // nhY

    // 3. Delegate mode attachments
    attachments.push(...await buildDelegateModeAttachments(context));  // rhY

    // 4. Delegate mode exit
    attachments.push(...buildDelegateModeExitAttachment());  // ohY

    // 5. Critical system reminders
    attachments.push(...buildCriticalSystemReminder(context));  // ahY

    // 6. Queued commands
    attachments.push(...buildQueuedCommandAttachments(context));  // dhY

    return attachments;
}
```

### Priority Order

1. **Plan mode** - Most important for planning workflow
2. **Delegate mode** - For swarm teammates
3. **Critical reminders** - System-level alerts
4. **Queued commands** - Pending slash commands

---

## 12. Telemetry and Logging

Attachment generation includes telemetry:

```javascript
// From chunks.142.mjs:1984-1988
if (Math.random() < 0.05) {
    trackEvent("tengu_attachment_compute_duration", {
        label: attachmentType,
        duration_ms: duration,
        error: false
    });
}
```

5% of attachment computations are sampled for performance monitoring.

---

## Summary: Attachment Injection Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   Turn Start                                  │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ Check: mode === "plan"?                                      │
│                                                              │
│ NO → Skip plan mode attachments                              │
│ YES → Continue                                                │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ Throttle Check:                                              │
│                                                              │
│ turnCount < TURNS_BETWEEN_ATTACHMENTS (5)?                   │
│                                                              │
│ YES → Skip (too soon)                                        │
│ NO → Continue                                                 │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ Re-entry Check:                                              │
│                                                              │
│ hasExitedPlanMode === true?                                  │
│                                                              │
│ YES → Add plan_mode_reentry attachment                       │
│       Reset hasExitedPlanMode = false                        │
│ NO → Skip                                                     │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ Determine Reminder Type:                                     │
│                                                              │
│ (attachmentCount + 1) % FULL_REMINDER_EVERY_N (5) === 1?     │
│                                                              │
│ YES → "full" (detailed instructions)                         │
│ NO → "sparse" (brief hint)                                   │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ Build Attachment:                                            │
│                                                              │
│ {                                                            │
│   type: "plan_mode",                                         │
│   reminderType: "full" | "sparse",                           │
│   isSubAgent: boolean,                                       │
│   planFilePath: string,                                      │
│   planExists: boolean                                        │
│ }                                                            │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ Render Content:                                              │
│                                                              │
│ Interview Phase (sO() = true)?                               │
│   → ezz() - Iterative workflow instructions                  │
│ Standard Phase?                                              │
│   → szz() - 5-phase workflow instructions                    │
│ Sparse?                                                      │
│   → A2z() - Brief reminder                                   │
└──────────────────────────────────────────────────────────────┘
```