# Plan Mode - Reminder System Analysis (Claude Code 2.1.76)

> Complete reverse engineering of the reminder/attachment injection system for plan mode, including turn counting, throttling, and content variations.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `DuY` (chunks.147.mjs:136) - `getPlanModeAttachment` - Main attachment generator
- `XuY` (chunks.147.mjs:170) - `getPlanModeExitAttachment` - Exit attachment
- `JuY` (chunks.147.mjs:105) - `countTurnsSinceLastAttachment` - Turn counter
- `MuY` (chunks.147.mjs:124) - `countPlanModeAttachments` - Attachment counter
- `t4q` (chunks.147.mjs:1235) - Attachment throttling constants
- `nk6` (chunks.1.mjs:2930) - `hasExitedPlanMode` getter
- `HV` (chunks.1.mjs:2934) - `setHasExitedPlanMode` setter
- `rO` (chunks.50.mjs:2520) - `isPlanModeInterviewPhase` feature flag

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
│  │ DuY() - getPlanModeAttachment()                             ││
│  │                                                             ││
│  │ 1. Check if mode === "plan"                                 ││
│  │ 2. Count turns since last attachment (JuY)                  ││
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
│  │ Rendered based on:                                          ││
│  │ • Interview phase feature flag (rO)                         ││
│  │ • Subagent context                                          ││
│  │ • Reminder type (full vs sparse)                            ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Main Attachment Generator (`DuY`)

```javascript
// ============================================
// DuY - getPlanModeAttachment
// Location: chunks.147.mjs:136-168
// ============================================

// ORIGINAL (for source lookup):
async function DuY(A, q) {
    let Y = q.getAppState().toolPermissionContext;
    if (Y.mode !== "plan") return [];
    if (A && A.length > 0) {
        let { turnCount: H, foundPlanModeAttachment: j } = JuY(A);
        if (j && H < t4q.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    let K = uW(q.agentId), w = pD(q.agentId), O = [];
    if (nk6() && w !== null) O.push({
        type: "plan_mode_reentry",
        planFilePath: K
    }), HV(!1);
    let F = (MuY(A ?? []) + 1) % t4q.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
    return O.push({
        type: "plan_mode",
        reminderType: F,
        isSubAgent: !!q.agentId,
        planFilePath: K,
        planExists: w !== null
    }), O
}

// READABLE (for understanding):
async function getPlanModeAttachment(messages, context) {
    // Step 1: Check if we're in plan mode
    let permissionContext = context.getAppState().toolPermissionContext;
    if (permissionContext.mode !== "plan") {
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

// Mapping: DuY→getPlanModeAttachment, JuY→countTurnsSinceLastAttachment,
//          uW→getPlanFilePath, pD→checkPlanFileExists, nk6→hasExitedPlanMode,
//          HV→setHasExitedPlanMode, MuY→countPlanModeAttachments, t4q→constants
```

---

## 3. Turn Counting Functions

### `JuY` - Count Turns Since Last Attachment

```javascript
// ============================================
// JuY - countTurnsSinceLastAttachment
// Location: chunks.147.mjs:105-122
// ============================================

// ORIGINAL (for source lookup):
function JuY(A) {
    let q = 0, K = !1;
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (z?.type === "assistant") {
            if (Ei6(z)) continue;
            q++
        } else if (z?.type === "attachment" && (z.attachment.type === "plan_mode" || z.attachment.type === "plan_mode_reentry")) {
            K = !0;
            break
        }
    }
    return { turnCount: q, foundPlanModeAttachment: K }
}

// READABLE (for understanding):
function countTurnsSinceLastAttachment(messages) {
    let turnCount = 0;
    let foundPlanModeAttachment = false;

    // Iterate backwards through messages
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        if (message?.type === "assistant") {
            // Skip empty/thinking-only turns (Ei6 checks for this)
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

// Mapping: JuY→countTurnsSinceLastAttachment, Ei6→isEmptyAssistantTurn
```

### `MuY` - Count Plan Mode Attachments

```javascript
// ============================================
// MuY - countPlanModeAttachments
// Location: chunks.147.mjs:124-134
// ============================================

// ORIGINAL (for source lookup):
function MuY(A) {
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

// Mapping: MuY→countPlanModeAttachments
```

---

## 4. Throttling Constants

```javascript
// ============================================
// t4q - Plan mode attachment throttling constants
// Location: chunks.147.mjs:1235-1238
// ============================================

// ORIGINAL (for source lookup):
t4q = {
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

// Mapping: t4q→PLAN_MODE_ATTACHMENT_CONFIG
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
...`
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
//          zD→ExitPlanMode, _9→createMetaContent, c6→createContentBlock
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
    let q = rO() ? "Follow iterative workflow: explore codebase, interview user, write to plan incrementally." : "Follow 5-phase workflow.",
        K = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${A.planFilePath}). ${q} End turns with ${TH} (for clarifications) or ${zD.name} (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
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

// Mapping: A2z→buildPlanModeSparseReminder, rO→isInterviewPhase,
//          TH→AskUserQuestion, zD→ExitPlanMode
```

---

## 7. Exit Attachment Builder (`XuY`)

```javascript
// ============================================
// XuY - getPlanModeExitAttachment
// Location: chunks.147.mjs:170-188
// ============================================

// ORIGINAL (for source lookup):
async function XuY(A) {
    if (!Fu1()) return [];
    if ((await A.getAppState()).toolPermissionContext.mode === "plan") return JS(!1), [];
    JS(!1);
    let K = uW(A.agentId), Y = pD(A.agentId) !== null;
    return [{
        type: "plan_mode_exit",
        planFilePath: K,
        planExists: Y
    }]
}

// READABLE (for understanding):
async function getPlanModeExitAttachment(context) {
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

// Mapping: XuY→getPlanModeExitAttachment, Fu1→needsPlanModeExitAttachment,
//          JS→setNeedsPlanModeExitAttachment, uW→getPlanFilePath, pD→checkPlanFileExists
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
    │   └─ setHasExitedPlanMode(true)  ← nk6 = true
    │
    ├─ User decides to re-enter plan mode
    │   └─ Shift+Tab or EnterPlanMode
    │
    └─ Next agent loop turn
        │
        ├─ DuY() called
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

The `rO()` function checks if the interview phase feature flag is enabled:

```javascript
// ============================================
// rO - isPlanModeInterviewPhase
// Location: chunks.50.mjs:2520-2523
// ============================================

// ORIGINAL (for source lookup):
function rO() {
    return Y0(process.env.CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE)
}

// READABLE:
function isPlanModeInterviewPhase() {
    return parseBoolean(process.env.CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE);
}

// Mapping: rO→isPlanModeInterviewPhase, Y0→parseBoolean
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
// Location: chunks.147.mjs (main attachment loop)
// ============================================

// Pseudo-code of the full pipeline:
async function buildAllAttachments(messages, context) {
    let attachments = [];

    // 1. Plan mode attachments
    attachments.push(...await getPlanModeAttachment(messages, context));  // DuY

    // 2. Plan mode exit attachment
    attachments.push(...await getPlanModeExitAttachment(context));  // XuY

    // 3. Delegate mode attachments
    attachments.push(...await buildDelegateModeAttachments(context));

    // 4. Delegate mode exit
    attachments.push(...buildDelegateModeExitAttachment());

    // 5. Critical system reminders
    attachments.push(...buildCriticalSystemReminder(context));

    // 6. Queued commands
    attachments.push(...buildQueuedCommandAttachments(context));

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
│ Interview Phase (rO() = true)?                               │
│   → Iterative workflow instructions                          │
│ Standard Phase?                                              │
│   → 5-phase workflow instructions                            │
│ Sparse?                                                      │
│   → Brief reminder                                           │
└──────────────────────────────────────────────────────────────┘
```
