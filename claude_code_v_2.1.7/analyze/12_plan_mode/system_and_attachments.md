# Plan Mode - System Reminders and Attachments

This document covers system reminder generation, attachment handling, and permission integration for Plan Mode.

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## 6. System Reminder Generation

### 6.1 Reminder Router

```javascript
// ============================================
// buildPlanModeSystemReminder - Routes to appropriate reminder
// Location: chunks.147.mjs:3247-3251
// ============================================

// ORIGINAL (for source lookup):
function z$7(A) {
  if (A.isSubAgent) return U$7(A);
  if (A.reminderType === "sparse") return C$7(A);
  return $$7(A)
}

// READABLE (for understanding):
function buildPlanModeSystemReminder(attachmentData) {
  // Subagents get special read-only instructions
  if (attachmentData.isSubAgent) {
    return buildSubAgentPlanReminder(attachmentData);
  }

  // Subsequent turns get abbreviated reminder
  if (attachmentData.reminderType === "sparse") {
    return buildSparsePlanReminder(attachmentData);
  }

  // First turn gets full 5-phase workflow
  return buildFullPlanReminder(attachmentData);
}

// Mapping: z$7→buildPlanModeSystemReminder, U$7→buildSubAgentPlanReminder,
//          C$7→buildSparsePlanReminder, $$7→buildFullPlanReminder
```

### 6.2 Full Plan Reminder (First Turn)

```javascript
// ============================================
// buildFullPlanReminder - Complete 5-phase workflow instructions
// Location: chunks.147.mjs:3253-3330
// ============================================

// ORIGINAL (for source lookup):
function $$7(A) {
  if (A.isSubAgent) return [];
  let Q = LJ9(),  // Max plan agents (1-3)
    B = OJ9();    // Max explore agents (3)

  let Z = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${A.planExists
  ? `A plan file already exists at ${A.planFilePath}. You can read it and make incremental edits using the ${J$.name} tool.`
  : `No plan file exists yet. You should create your plan at ${A.planFilePath} using the ${X$.name} tool.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

## Plan Workflow

### Phase 1: Initial Understanding
Goal: Gain a comprehensive understanding of the user's request by reading through code and asking them questions. Critical: In this phase you should only use the ${MS.agentType} subagent type.

1. Focus on understanding the user's request and the code associated with their request

2. **Launch up to ${B} ${MS.agentType} agents IN PARALLEL** (single message, multiple tool calls) to efficiently explore the codebase.
   - Use 1 agent when the task is isolated to known files...
   - Use multiple agents when: the scope is uncertain, multiple areas of the codebase are involved...
   - Quality over quantity - ${B} agents maximum, but you should try to use the minimum number of agents necessary (usually just 1)

3. After exploring the code, use the ${zY} tool to clarify ambiguities in the user request up front.

### Phase 2: Design
Goal: Design an implementation approach.

Launch ${UY1.agentType} agent(s) to design the implementation based on the user's intent and your exploration results from Phase 1.

You can launch up to ${Q} agent(s) in parallel.

**Guidelines:**
- **Default**: Launch at least 1 Plan agent for most tasks...
- **Skip agents**: Only for truly trivial tasks (typo fixes, single-line changes...)
${Q > 1 ? `- **Multiple agents**: Use up to ${Q} agents for complex tasks...` : ""}

### Phase 3: Review
Goal: Review the plan(s) from Phase 2 and ensure alignment with the user's intentions.
1. Read the critical files identified by agents to deepen your understanding
2. Ensure that the plans align with the user's original request
3. Use ${zY} to clarify any remaining questions with the user

### Phase 4: Final Plan
Goal: Write your final plan to the plan file (the only file you can edit).
- Include only your recommended approach, not all alternatives
- Ensure that the plan file is concise enough to scan quickly, but detailed enough to execute effectively
- Include the paths of critical files to be modified
- Include a verification section describing how to test the changes end-to-end

### Phase 5: Call ${V$.name}
At the very end of your turn, once you have asked the user questions and are happy with your final plan file - you should always call ${V$.name} to indicate to the user that you are done planning.
This is critical - your turn should only end with either using the ${zY} tool OR calling ${V$.name}. Do not stop unless it's for these 2 reasons

**Important:** Use ${zY} ONLY to clarify requirements or choose between approaches. Use ${V$.name} to request plan approval. Do NOT ask about plan approval in any other way - no text questions, no AskUserQuestion. Phrases like "Is this plan okay?", "Should I proceed?", "How does this plan look?", "Any changes before we start?", or similar MUST use ${V$.name}.`;

  return q5([H0({ content: Z, isMeta: !0 })])
}

// READABLE (for understanding):
function buildFullPlanReminder(attachmentData) {
  if (attachmentData.isSubAgent) return [];

  let maxPlanAgents = getMaxPlanAgents();      // 1-3 based on env/user tier
  let maxExploreAgents = getMaxExploreAgents(); // 3 by default

  let systemReminder = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools...

## Plan File Info:
${attachmentData.planExists
  ? `A plan file already exists at ${attachmentData.planFilePath}. You can read it and make incremental edits using the ${EditTool.name} tool.`
  : `No plan file exists yet. You should create your plan at ${attachmentData.planFilePath} using the ${WriteTool.name} tool.`}

## Plan Workflow

### Phase 1: Initial Understanding
[... Launch up to ${maxExploreAgents} Explore agents ...]

### Phase 2: Design
[... Launch up to ${maxPlanAgents} Plan agents ...]

### Phase 3: Review
[... Review plans, clarify questions ...]

### Phase 4: Final Plan
[... Write final plan to file ...]

### Phase 5: Call ${ExitPlanModeTool.name}
[... Exit when ready ...]`;

  return formatAsSystemMessage([createMessageBlock({ content: systemReminder, isMeta: true })]);
}

// Mapping: $$7→buildFullPlanReminder, LJ9→getMaxPlanAgents, OJ9→getMaxExploreAgents,
//          J$→EditTool, X$→WriteTool, MS→ExploreAgentConfig, UY1→PlanAgentConfig,
//          zY→AskUserQuestionTool.name, V$→ExitPlanModeTool, q5→formatAsSystemMessage,
//          H0→createMessageBlock
```

### 6.3 Sparse Plan Reminder (Subsequent Turns)

```javascript
// ============================================
// buildSparsePlanReminder - Abbreviated reminder for ongoing plan mode
// Location: chunks.147.mjs:3332-3338
// ============================================

// ORIGINAL (for source lookup):
function C$7(A) {
  let Q = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${A.planFilePath}). Follow 5-phase workflow. End turns with ${zY} (for clarifications) or ${V$.name} (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
  return q5([H0({ content: Q, isMeta: !0 })])
}

// READABLE (for understanding):
function buildSparsePlanReminder(attachmentData) {
  let sparseContent = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${attachmentData.planFilePath}). Follow 5-phase workflow. End turns with ${AskUserQuestion.name} (for clarifications) or ${ExitPlanMode.name} (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;

  return formatAsSystemMessage([createMessageBlock({ content: sparseContent, isMeta: true })]);
}

// Mapping: C$7→buildSparsePlanReminder, zY→AskUserQuestion.name, V$→ExitPlanMode,
//          q5→formatAsSystemMessage, H0→createMessageBlock
```

### 6.4 SubAgent Plan Reminder

```javascript
// ============================================
// buildSubAgentPlanReminder - Read-only instructions for subagents
// Location: chunks.147.mjs:3340-3351
// ============================================

// ORIGINAL (for source lookup):
function U$7(A) {
  let B = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
${A.planExists
  ? `A plan file already exists at ${A.planFilePath}. You can read it and make incremental edits using the ${J$.name} tool if you need to.`
  : `No plan file exists yet. You should create your plan at ${A.planFilePath} using the ${X$.name} tool if you need to.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.
Answer the user's query comprehensively, using the ${zY} tool if you need to ask the user clarifying questions. If you do use the ${zY}, make sure to ask all clarifying questions you need to fully understand the user's intent before proceeding.`;
  return q5([H0({ content: B, isMeta: !0 })])
}

// READABLE (for understanding):
function buildSubAgentPlanReminder(attachmentData) {
  let subAgentContent = `Plan mode is active. You MUST NOT make any edits, run any non-readonly tools... This supercedes any other instructions you have received.

## Plan File Info:
${attachmentData.planExists
  ? `A plan file exists at ${attachmentData.planFilePath}. You can read and edit it using ${EditTool.name}.`
  : `No plan file exists. Create your plan at ${attachmentData.planFilePath} using ${WriteTool.name}.`}

NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

Answer the user's query comprehensively, using ${AskUserQuestion.name} if you need clarifying questions.`;

  return formatAsSystemMessage([createMessageBlock({ content: subAgentContent, isMeta: true })]);
}

// Mapping: U$7→buildSubAgentPlanReminder, J$→EditTool, X$→WriteTool, zY→AskUserQuestion,
//          q5→formatAsSystemMessage, H0→createMessageBlock
```

### 6.5 Agent Count Configuration

```javascript
// ============================================
// getMaxPlanAgents - Get max design agents count
// Location: chunks.147.mjs:2289-2298
// ============================================

// ORIGINAL (for source lookup):
function LJ9() {
  let A = process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT;
  if (A !== void 0) {
    let Q = parseInt(A, 10);
    if (!isNaN(Q)) return Math.max(1, Math.min(5, Q))
  }
  return 1  // Default: 1 plan agent
}

// READABLE:
function getMaxPlanAgents() {
  let envValue = process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT;
  if (envValue !== undefined) {
    let parsed = parseInt(envValue, 10);
    if (!isNaN(parsed)) {
      return Math.max(1, Math.min(5, parsed));  // Clamp to 1-5
    }
  }
  return 1;  // Default
}

// Mapping: LJ9→getMaxPlanAgents
```

```javascript
// ============================================
// getMaxExploreAgents - Get max explore agents count
// Location: chunks.147.mjs:2301-2306
// ============================================

// ORIGINAL (for source lookup):
function OJ9() {
  let A = process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT;
  if (A !== void 0) {
    let Q = parseInt(A, 10);
    if (!isNaN(Q)) return Math.max(1, Math.min(5, Q))
  }
  return 3  // Default: 3 explore agents
}

// READABLE:
function getMaxExploreAgents() {
  let envValue = process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT;
  if (envValue !== undefined) {
    let parsed = parseInt(envValue, 10);
    if (!isNaN(parsed)) {
      return Math.max(1, Math.min(5, parsed));  // Clamp to 1-5
    }
  }
  return 3;  // Default
}

// Mapping: OJ9→getMaxExploreAgents
```

---

## 7. Attachment Generation

### 7.1 Attachment Types

| Type | When Generated | Purpose |
|------|----------------|---------|
| `plan_mode` | Each turn in plan mode | Main reminder (full or sparse) |
| `plan_mode_reentry` | Re-entering after exit | Ask if same/different task |
| `plan_mode_exit` | After leaving plan mode | Notify that plan mode ended |

### 7.2 Main Attachment Builder

```javascript
// ============================================
// buildPlanModeAttachment - Main plan mode attachment generation
// Location: chunks.131.mjs:3207-3231
// ============================================

// ORIGINAL (for source lookup):
async function j27(A, Q) {
  if ((await Q.getAppState()).toolPermissionContext.mode !== "plan") return [];

  // Throttle: Don't send if recent attachment exists
  if (A && A.length > 0) {
    let { turnCount: D, foundPlanModeAttachment: W } = R27(A);
    if (W && D < ar2.TURNS_BETWEEN_ATTACHMENTS) return []  // ar2 = { TURNS_BETWEEN_ATTACHMENTS: 5, FULL_REMINDER_EVERY_N_ATTACHMENTS: 3 }
  }

  let Z = dC(Q.agentId),  // Plan file path
    Y = AK(Q.agentId),    // Plan content
    J = [];

  // Re-entry detection
  if (Xf0() && Y !== null) {
    J.push({ type: "plan_mode_reentry", planFilePath: Z });
    Iq(!1);  // Reset flag
  }

  // Determine reminder type: full every N attachments, sparse otherwise
  let I = (_27(A ?? []) + 1) % ar2.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";

  J.push({
    type: "plan_mode",
    reminderType: I,
    isSubAgent: !!Q.agentId,
    planFilePath: Z,
    planExists: Y !== null
  });

  return J
}

// READABLE (for understanding):
async function buildPlanModeAttachment(messages, toolUseContext) {
  let appState = await toolUseContext.getAppState();

  // Only in plan mode
  if (appState.toolPermissionContext.mode !== "plan") {
    return [];
  }

  // Throttle: Skip if recent plan attachment exists
  if (messages && messages.length > 0) {
    let { turnCount, foundPlanModeAttachment } = findPlanModeAttachmentInfo(messages);
    if (foundPlanModeAttachment && turnCount < CONFIG.TURNS_BETWEEN_ATTACHMENTS) {
      return [];  // Too recent
    }
  }

  let planFilePath = getPlanFilePath(toolUseContext.agentId);
  let planContent = readPlanFile(toolUseContext.agentId);
  let attachments = [];

  // Re-entry detection: exited plan mode before but re-entering with existing plan
  if (hasExitedPlanMode() && planContent !== null) {
    attachments.push({
      type: "plan_mode_reentry",
      planFilePath: planFilePath
    });
    setHasExitedPlanMode(false);  // Reset
  }

  // Determine full vs sparse: full every N, sparse otherwise
  let attachmentCount = countPlanModeAttachments(messages ?? []);
  let reminderType = (attachmentCount + 1) % CONFIG.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
    ? "full"
    : "sparse";

  attachments.push({
    type: "plan_mode",
    reminderType: reminderType,
    isSubAgent: !!toolUseContext.agentId,
    planFilePath: planFilePath,
    planExists: planContent !== null
  });

  return attachments;
}

// Mapping: j27→buildPlanModeAttachment, R27→findPlanModeAttachmentInfo, dC→getPlanFilePath,
//          AK→readPlanFile, Xf0→hasExitedPlanMode, Iq→setHasExitedPlanMode,
//          _27→countPlanModeAttachments, ar2→CONFIG
```

### 7.3 Throttling Functions

```javascript
// ============================================
// findPlanModeAttachmentInfo - Count turns since last plan attachment
// Location: chunks.131.mjs:3176-3192
// ============================================

// ORIGINAL (for source lookup):
function R27(A) {
  let Q = 0, B = !1;
  for (let G = A.length - 1; G >= 0; G--) {
    let Z = A[G];
    if (Z?.type === "assistant") {
      if (dF1(Z)) continue;  // Skip empty
      Q++
    } else if (Z?.type === "attachment" &&
               (Z.attachment.type === "plan_mode" || Z.attachment.type === "plan_mode_reentry")) {
      B = !0;
      break
    }
  }
  return { turnCount: Q, foundPlanModeAttachment: B }
}

// READABLE (for understanding):
function findPlanModeAttachmentInfo(messages) {
  let turnCount = 0;
  let foundPlanModeAttachment = false;

  // Search backwards through messages
  for (let i = messages.length - 1; i >= 0; i--) {
    let message = messages[i];

    if (message?.type === "assistant") {
      if (isEmptyMessage(message)) continue;
      turnCount++;
    } else if (message?.type === "attachment" &&
               (message.attachment.type === "plan_mode" ||
                message.attachment.type === "plan_mode_reentry")) {
      foundPlanModeAttachment = true;
      break;
    }
  }

  return { turnCount, foundPlanModeAttachment };
}

// Mapping: R27→findPlanModeAttachmentInfo, dF1→isEmptyMessage
```

```javascript
// ============================================
// countPlanModeAttachments - Count plan_mode attachments since last exit
// Location: chunks.131.mjs:3195-3204
// ============================================

// ORIGINAL (for source lookup):
function _27(A) {
  let Q = 0;
  for (let B = A.length - 1; B >= 0; B--) {
    let G = A[B];
    if (G?.type === "attachment") {
      if (G.attachment.type === "plan_mode_exit") break;  // Stop at exit
      if (G.attachment.type === "plan_mode") Q++
    }
  }
  return Q
}

// READABLE (for understanding):
function countPlanModeAttachments(messages) {
  let count = 0;

  for (let i = messages.length - 1; i >= 0; i--) {
    let message = messages[i];

    if (message?.type === "attachment") {
      // Stop counting at plan_mode_exit
      if (message.attachment.type === "plan_mode_exit") break;

      if (message.attachment.type === "plan_mode") {
        count++;
      }
    }
  }

  return count;
}

// Mapping: _27→countPlanModeAttachments
```

### 7.4 Exit Attachment Builder

```javascript
// ============================================
// buildPlanModeExitAttachment - Generate exit notification
// Location: chunks.131.mjs:3233-3244
// ============================================

// ORIGINAL (for source lookup):
async function T27(A) {
  if (!If0()) return [];  // No exit attachment needed

  if ((await A.getAppState()).toolPermissionContext.mode === "plan") {
    return lw(!1), [];  // Still in plan mode, clear flag
  }

  lw(!1);  // Clear flag
  let B = dC(A.agentId),
    G = AK(A.agentId) !== null;

  return [{
    type: "plan_mode_exit",
    planFilePath: B,
    planExists: G
  }]
}

// READABLE (for understanding):
async function buildPlanModeExitAttachment(toolUseContext) {
  // Only if exit attachment flag is set
  if (!needsPlanModeExitAttachment()) {
    return [];
  }

  let appState = await toolUseContext.getAppState();

  // If still in plan mode, just clear the flag
  if (appState.toolPermissionContext.mode === "plan") {
    setNeedsPlanModeExitAttachment(false);
    return [];
  }

  // Clear flag
  setNeedsPlanModeExitAttachment(false);

  let planFilePath = getPlanFilePath(toolUseContext.agentId);
  let planExists = readPlanFile(toolUseContext.agentId) !== null;

  return [{
    type: "plan_mode_exit",
    planFilePath: planFilePath,
    planExists: planExists
  }];
}

// Mapping: T27→buildPlanModeExitAttachment, If0→needsPlanModeExitAttachment,
//          lw→setNeedsPlanModeExitAttachment, dC→getPlanFilePath, AK→readPlanFile
```

---

## 8. Permission Integration

### 8.1 AllowedPrompts Processing

When user approves the plan, `allowedPrompts` are converted to permission rules:

```javascript
// ============================================
// buildPermissionRules - Convert allowedPrompts to permission rules
// Location: chunks.150.mjs:2402-2418
// ============================================

// ORIGINAL (for source lookup):
function re(A, Q) {
  let B = [{
    type: "setMode",
    mode: A,
    destination: "session"
  }];

  if (Q && Q.length > 0) {
    B.push({
      type: "addRules",
      rules: Q.map((G) => ({
        toolName: G.tool,
        ruleContent: aK1(G.prompt)  // Semantic to regex conversion
      })),
      behavior: "allow",
      destination: "session"
    });
  }

  return B
}

// READABLE (for understanding):
function buildPermissionRules(permissionMode, allowedPrompts) {
  let rules = [{
    type: "setMode",
    mode: permissionMode,  // "bypassPermissions", "acceptEdits", "default"
    destination: "session"
  }];

  if (allowedPrompts && allowedPrompts.length > 0) {
    rules.push({
      type: "addRules",
      rules: allowedPrompts.map((prompt) => ({
        toolName: prompt.tool,  // "Bash"
        ruleContent: semanticToRegex(prompt.prompt)  // "run tests" → regex
      })),
      behavior: "allow",
      destination: "session"
    });
  }

  return rules;
}

// Mapping: re→buildPermissionRules, aK1→semanticToRegex
```

**How it works:**
1. Claude includes `allowedPrompts` in ExitPlanMode call
2. User approves plan with permission mode selection
3. `buildPermissionRules()` constructs permission actions:
   - First: `setMode` to selected mode
   - Second: `addRules` with semantic-to-regex converted prompts
4. Rules applied to session-scoped permission context
5. Subsequent Bash commands auto-matched against rules

### 8.2 Semantic-to-Prompt Conversion (NOT Regex!)

**Important Correction:** The function does NOT convert to regex - it stores semantic descriptions as-is with a `prompt:` prefix.

```javascript
// ============================================
// aK1 - Convert semantic description to rule content
// Location: chunks.123.mjs:1838-1839
// ============================================

// ORIGINAL (for source lookup):
function aK1(A) {
  return `prompt: ${A.trim()}`
}

// READABLE (for understanding):
function semanticToRuleContent(semanticDescription) {
  return `prompt: ${semanticDescription.trim()}`;
}

// Example: "run tests" → "prompt: run tests"
// Mapping: aK1→semanticToRuleContent
```

### 8.3 Rule Matching via LLM Classifier

The actual matching is done by an **LLM-based classifier** that semantically compares commands against rule descriptions:

```javascript
// ============================================
// rK1 - LLM-based command-to-rule classifier
// Location: chunks.123.mjs:2170-2181
// ============================================

// ORIGINAL (for source lookup):
async function hq0(A, Q, B) {
  k(`Running allow classifier for command: ${A.command.substring(0,100)}...`);
  let Z = await rK1(A.command, o1(), G, "allow", Q.abortController.signal, ...);

  if (Z.matches && Z.confidence === "high") return {
    behavior: "allow",
    updatedInput: A,
    decisionReason: {
      type: "other",
      reason: `Allowed by Bash prompt rule: "${Z.matchedDescription}"`
    }
  };
  return null
}

// READABLE (for understanding):
async function checkAllowRules(input, context, rules) {
  log(`Running allow classifier for command: ${input.command.substring(0,100)}...`);

  // Call LLM classifier to check if command matches any rule
  let classifierResult = await runPromptClassifier(
    input.command,
    getModel(),
    rules,         // e.g., ["prompt: run tests", "prompt: build the project"]
    "allow",
    context.abortController.signal
  );

  if (classifierResult.matches && classifierResult.confidence === "high") {
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: `Allowed by Bash prompt rule: "${classifierResult.matchedDescription}"`
      }
    };
  }
  return null;
}

// Mapping: hq0→checkAllowRules, rK1→runPromptClassifier
```

**Design Decision: Why LLM Classifier Instead of Regex?**

| Approach | Pros | Cons |
|----------|------|------|
| Regex matching | Fast, deterministic | Cannot handle semantic variations |
| **LLM classifier** | Understands intent, flexible | Slower, requires API call |

**Why this approach:**
- "run tests" should match `npm test`, `pytest`, `go test ./...`, `make test`, etc.
- Regex cannot capture semantic equivalence
- LLM understands that "npm run build" and "make" both mean "build the project"
- Confidence threshold ("high") prevents false positives

**Matching Flow:**
```
User exits plan mode with allowedPrompts: [{ tool: "Bash", prompt: "run tests" }]
    ↓
semanticToRuleContent("run tests") → "prompt: run tests"
    ↓
Rule stored in session permission context
    ↓
Later: Claude runs `npm test`
    ↓
runPromptClassifier("npm test", ["prompt: run tests"], "allow")
    ↓
LLM returns: { matches: true, confidence: "high", matchedDescription: "run tests" }
    ↓
Command auto-allowed without permission prompt
```

---

## 9. Tool Integration Points

### 9.1 Tool Execution Gate

```javascript
// ============================================
// handleToolPermissionDecision - Plan mode auto-allows tools
// Location: chunks.147.mjs:1570-1598
// ============================================

// ORIGINAL (for source lookup):
async function tO9({ tool: A, requiresUserInteraction: Q, getAppState: B }) {
  let Z = await B.getAppState();

  // Plan mode check: auto-allow if bypass available
  if (Z.toolPermissionContext.mode === "bypassPermissions" ||
      Z.toolPermissionContext.mode === "plan" &&
      Z.toolPermissionContext.isBypassPermissionsModeAvailable) {
    return {
      behavior: "allow",
      updatedInput: Q,
      decisionReason: { type: "mode", mode: Z.toolPermissionContext.mode }
    };
  }
  // ... rest of permission logic
}

// READABLE (for understanding):
async function handleToolPermissionDecision({ tool, requiresUserInteraction, getAppState }) {
  let appState = await getAppState();

  // In plan mode or bypass mode, automatically allow tools
  if (appState.toolPermissionContext.mode === "bypassPermissions" ||
      (appState.toolPermissionContext.mode === "plan" &&
       appState.toolPermissionContext.isBypassPermissionsModeAvailable)) {
    return {
      behavior: "allow",
      updatedInput: requiresUserInteraction,
      decisionReason: { type: "mode", mode: appState.toolPermissionContext.mode }
    };
  }
  // ... rest of permission logic
}

// Mapping: tO9→handleToolPermissionDecision
```

**Key insight:** When `mode === "plan"` and `isBypassPermissionsModeAvailable`, read-only tools are auto-allowed. This enables efficient codebase exploration during planning.

### 9.2 Prompt Suggestion Suppression

```javascript
// ============================================
// Prompt suggestion suppression in plan mode
// Location: chunks.135.mjs:1023-1035
// ============================================

// ORIGINAL (for source lookup):
let Q = await A.toolUseContext.getAppState();
if (Q.toolPermissionContext.mode === "plan") {
  Uj("plan_mode");  // Log telemetry
  return;           // Skip suggestions
}

// READABLE (for understanding):
let appState = await context.toolUseContext.getAppState();
if (appState.toolPermissionContext.mode === "plan") {
  logTelemetry("plan_mode");  // Record why skipped
  return;  // Don't generate prompt suggestions
}

// Mapping: Uj→logTelemetry
```

**Why:** Prompt suggestions during planning would interrupt the structured workflow.

### 9.3 Model Selection

```javascript
// ============================================
// Opus Plan Mode model selection
// Location: chunks.46.mjs:2346, 2613-2614
// ============================================

// Model option:
"Opus Plan Mode" - "Use Opus 4.5 in plan mode, Sonnet 4.5 otherwise"

// Model ID:
"opusplan" - Uses claude-opus-4-5 in plan mode, claude-sonnet-4-5 otherwise
```

**Why:** Opus 4.5 provides better reasoning for complex planning tasks.

---

## 10. Attachment Content Rendering

### 10.1 Message Type Handler

```javascript
// ============================================
// Plan mode attachment content rendering
// Location: chunks.148.mjs:177-206
// ============================================

// ORIGINAL (for source lookup):
case "plan_mode":
  return z$7(A);  // Route to buildPlanModeSystemReminder

case "plan_mode_reentry":
  return q5([H0({
    content: `You are re-entering plan mode with an existing plan file at ${A.planFilePath}.

First, read the plan file to understand the previous plan context.

Then evaluate:
- If this is a CONTINUATION of the same task, build on the existing plan
- If this is a NEW task, start fresh and update the plan file accordingly

Use ${zY} if you need to clarify with the user whether they want to continue the previous plan or start a new one.`,
    isMeta: !0
  })]);

case "plan_mode_exit":
  return q5([H0({
    content: `## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions. The plan file is located at ${A.planFilePath} if you need to reference it.`,
    isMeta: !0
  })]);

// READABLE (for understanding):
switch (attachmentType) {
  case "plan_mode":
    return buildPlanModeSystemReminder(attachmentData);

  case "plan_mode_reentry":
    return formatAsSystemMessage([createMessageBlock({
      content: `You are re-entering plan mode with an existing plan file at ${attachmentData.planFilePath}.

First, read the plan file to understand the previous plan context.

Then evaluate:
- If this is a CONTINUATION of the same task, build on the existing plan
- If this is a NEW task, start fresh and update the plan file accordingly

Use ${AskUserQuestion.name} if you need to clarify with the user...`,
      isMeta: true
    })]);

  case "plan_mode_exit":
    return formatAsSystemMessage([createMessageBlock({
      content: `## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions. The plan file is located at ${attachmentData.planFilePath} if you need to reference it.`,
      isMeta: true
    })]);
}

// Mapping: z$7→buildPlanModeSystemReminder, q5→formatAsSystemMessage, H0→createMessageBlock, zY→AskUserQuestion.name
```

---

## 11. Tool Restrictions in Plan Mode

### 11.1 Disallowed Tools for Subagents

When spawning subagents in plan mode, specific tools are blocked:

```javascript
// ============================================
// Plan Agent disallowedTools configuration
// Location: chunks.93.mjs:222, 292
// ============================================

// The plan agent configuration includes:
disallowedTools: [f3, CY1, I8, BY, tq]

// Decoded:
// f3 = "Task" - Cannot spawn further agents
// CY1 = "ExitPlanMode" - Only main agent can exit
// I8 = "Edit" - Cannot edit files (read-only)
// BY = "Write" - Cannot write files (read-only)
// tq = "KillShell" - Cannot kill shells
```

### 11.2 Read-Only Enforcement in Subagent Prompts

```javascript
// ============================================
// Plan Mode Read-Only System Prompt
// Location: chunks.93.mjs:240-289
// ============================================

// The plan agent system prompt contains explicit read-only enforcement:
`=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to explore the codebase and design implementation plans.
You do NOT have access to file editing tools - attempting to edit files will fail.

REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write,
edit, or modify any files. You do NOT have access to file editing tools.`
```

### 11.3 Permission Mode Enum

```javascript
// ============================================
// Valid permission modes
// Location: chunks.58.mjs:1832
// ============================================

NP = ["acceptEdits", "bypassPermissions", "default", "dontAsk", "plan"]

// When mode === "plan":
// - Read-only tools are auto-allowed (if isBypassPermissionsModeAvailable)
// - Write/Edit tools are blocked by disallowedTools
// - Prompt suggestions are suppressed
```

---

## Related Documents

- [overview.md](./overview.md) - Architecture, tools, file management, state tracking
- [integration.md](./integration.md) - Session persistence, main loop, subagent propagation
