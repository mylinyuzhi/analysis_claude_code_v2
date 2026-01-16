# Plan Mode Implementation - v2.1.7

## Overview

Plan Mode is a read-only exploration and planning phase in Claude Code where the assistant focuses on understanding the codebase and designing implementation strategies before writing code. It provides a structured 5-phase workflow for complex tasks requiring upfront planning.

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules (Plan Mode section)

---

## 1. Plan Mode Architecture Overview

### 1.1 State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PLAN MODE STATE MACHINE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐    EnterPlanMode Tool    ┌───────────────────┐          │
│   │    Normal    │ ─────────────────────────>│    Plan Mode      │          │
│   │    Mode      │                           │    Active         │          │
│   │(mode=default)│                           │   (mode=plan)     │          │
│   └──────────────┘                           └─────────┬─────────┘          │
│         ^                                              │                     │
│         │                                              │                     │
│         │         ExitPlanMode Tool                    │                     │
│         │  ┌───────────────────────────────────────────┘                     │
│         │  │                                                                 │
│         │  ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────┐           │
│   │               Mode Selection on Exit                         │           │
│   │  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐   │           │
│   │  │   default   │  │ acceptEdits  │  │ bypassPermissions │   │           │
│   │  │  (ask each) │  │(auto-approve │  │  (skip all asks)  │   │           │
│   │  │             │  │  file edits) │  │                   │   │           │
│   │  └─────────────┘  └──────────────┘  └───────────────────┘   │           │
│   └─────────────────────────────────────────────────────────────┘           │
│                                                                             │
│   RE-ENTRY DETECTION:                                                       │
│   ┌─────────────────────────────────────────────────────────────┐           │
│   │  if (hasExitedPlanMode && planFileExists) {                 │           │
│   │    → Generate "plan_mode_reentry" attachment                │           │
│   │    → Prompt to evaluate: same task vs different task        │           │
│   │  }                                                          │           │
│   └─────────────────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Five-Phase Workflow

Plan Mode enforces a structured workflow through system reminders:

| Phase | Goal | Actions |
|-------|------|---------|
| **Phase 1: Initial Understanding** | Comprehend user's request | Launch Explore agents (up to 3), use AskUserQuestion |
| **Phase 2: Design** | Design implementation approach | Launch Plan agents (1-3), provide context from Phase 1 |
| **Phase 3: Review** | Ensure alignment with user intent | Read critical files, verify plans, clarify questions |
| **Phase 4: Final Plan** | Write plan to file | Create concise, actionable plan in plan file |
| **Phase 5: Exit** | Get user approval | Call ExitPlanMode tool |

### 1.3 Changes from v2.0.59

| Feature | v2.0.59 | v2.1.7 |
|---------|---------|--------|
| System Reminders | Full only | Full + Sparse + SubAgent |
| Exit Attachment | None | `plan_mode_exit` type added |
| State Tracking | `hasExitedPlanMode` | + `needsPlanModeExitAttachment` |
| Plan Persistence | Lost on /clear | Persists across /clear (fixed 2.1.3) |
| Reminder Frequency | Every attachment | Full every N, sparse otherwise |

---

## 2. EnterPlanMode Tool

### 2.1 Tool Definition

```javascript
// ============================================
// EnterPlanModeTool - Enters plan mode for complex tasks
// Location: chunks.120.mjs:519-605
// ============================================

// ORIGINAL (for source lookup):
VK1 = "EnterPlanMode"

gbA = {
  name: VK1,
  maxResultSizeChars: 1e5,
  async description() {
    return "Requests permission to enter plan mode for complex tasks requiring exploration and design"
  },
  async prompt() {
    return Au2
  },
  inputSchema: fl5,
  outputSchema: hl5,
  isEnabled() {
    if (process.env.CLAUDE_CODE_REMOTE === "true") return !1;
    return !0
  },
  isConcurrencySafe() { return !0 },
  isReadOnly() { return !0 },
  async checkPermissions(A) {
    return { behavior: "allow", updatedInput: A }
  },
  async call(A, Q) {
    if (Q.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
    let B = await Q.getAppState();
    return Ty(B.toolPermissionContext.mode, "plan"), Q.setAppState((G) => ({
      ...G,
      toolPermissionContext: UJ(G.toolPermissionContext, {
        type: "setMode",
        mode: "plan",
        destination: "session"
      })
    })), {
      data: { message: "Entered plan mode..." }
    }
  },
  mapToolResultToToolResultBlockParam({ message: A }, Q) {
    return {
      type: "tool_result",
      content: `${A}\n\nIn plan mode, you should:\n1. Thoroughly explore the codebase...\n6. When ready, use ExitPlanMode...`,
      tool_use_id: Q
    }
  }
}

// READABLE (for understanding):
const ENTER_PLAN_MODE_NAME = "EnterPlanMode"

const EnterPlanModeTool = {
  name: ENTER_PLAN_MODE_NAME,
  maxResultSizeChars: 100000,

  async description() {
    return "Requests permission to enter plan mode for complex tasks requiring exploration and design"
  },

  async prompt() {
    return enterPlanModeDescription  // Detailed when-to-use guidance
  },

  inputSchema: emptyInputSchema,      // No input parameters
  outputSchema: messageOutputSchema,   // { message: string }

  isEnabled() {
    // Disabled in remote mode
    if (process.env.CLAUDE_CODE_REMOTE === "true") return false;
    return true
  },

  isConcurrencySafe() { return true },
  isReadOnly() { return true },

  async checkPermissions(input) {
    return { behavior: "allow", updatedInput: input }  // Always allowed
  },

  async call(input, toolUseContext) {
    // Cannot be used by subagents
    if (toolUseContext.agentId) {
      throw Error("EnterPlanMode tool cannot be used in agent contexts");
    }

    let appState = await toolUseContext.getAppState();

    // Trigger mode transition handler
    onToolPermissionModeChanged(appState.toolPermissionContext.mode, "plan");

    // Update app state to plan mode
    toolUseContext.setAppState((state) => ({
      ...state,
      toolPermissionContext: applyPermissionAction(state.toolPermissionContext, {
        type: "setMode",
        mode: "plan",
        destination: "session"  // Session-scoped, not persisted
      })
    }));

    return {
      data: { message: "Entered plan mode. You should now focus on exploring..." }
    }
  },

  mapToolResultToToolResultBlockParam({ message }, toolUseId) {
    return {
      type: "tool_result",
      content: `${message}\n\nIn plan mode, you should:\n1. Thoroughly explore...\n2. Identify similar features...\n3. Consider multiple approaches...\n4. Use AskUserQuestion...\n5. Design a concrete strategy\n6. When ready, use ExitPlanMode...\n\nRemember: DO NOT write or edit any files yet.`,
      tool_use_id: toolUseId
    }
  }
}

// Mapping: VK1→ENTER_PLAN_MODE_NAME, gbA→EnterPlanModeTool, Au2→enterPlanModeDescription,
//          fl5→emptyInputSchema, hl5→messageOutputSchema, Ty→onToolPermissionModeChanged,
//          UJ→applyPermissionAction
```

### 2.2 Tool Description (When to Use)

The tool description (`Au2`) provides detailed guidance on when to enter plan mode:

**Use EnterPlanMode when:**
1. New Feature Implementation - Adding meaningful functionality
2. Multiple Valid Approaches - Task can be solved several ways
3. Code Modifications - Changes affecting existing behavior
4. Architectural Decisions - Choosing between patterns/technologies
5. Multi-File Changes - Task touches 2-3+ files
6. Unclear Requirements - Need to explore before understanding scope
7. User Preferences Matter - Implementation could go multiple ways

**Skip EnterPlanMode for:**
- Single-line or few-line fixes
- Adding a single function with clear requirements
- Tasks with very specific detailed instructions
- Pure research/exploration tasks

### 2.3 UI Rendering Functions

```javascript
// ============================================
// EnterPlanMode UI Components
// Location: chunks.120.mjs:474-508
// ============================================

// ORIGINAL:
function Bu2() { return null }  // toolUseMessage
function Gu2() { return null }  // progressMessage
function Zu2(A, Q, B) {         // resultMessage - "Entered plan mode"
  return KV.createElement(T, { flexDirection: "column", marginTop: 1 },
    KV.createElement(T, { flexDirection: "row" },
      KV.createElement(C, { color: iR("plan") }, xJ),  // Plan icon
      KV.createElement(C, null, " Entered plan mode")),
    KV.createElement(T, { paddingLeft: 2 },
      KV.createElement(C, { dimColor: !0 }, "Claude is now exploring and designing...")))
}
function Yu2() {                // rejectedMessage - "User declined"
  return KV.createElement(T, { flexDirection: "row", marginTop: 1 },
    KV.createElement(C, { color: iR("default") }, xJ),
    KV.createElement(C, null, " User declined to enter plan mode"))
}
function Ju2() { return null }  // errorMessage

// READABLE:
function renderEnterPlanToolUseMessage() { return null }
function renderEnterPlanProgressMessage() { return null }
function renderEnterPlanResultMessage(data, input, theme) {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Box flexDirection="row">
        <Text color={getThemeColor("plan")}>{planIcon}</Text>
        <Text> Entered plan mode</Text>
      </Box>
      <Box paddingLeft={2}>
        <Text dimColor>Claude is now exploring and designing an implementation approach.</Text>
      </Box>
    </Box>
  )
}
function renderEnterPlanRejectedMessage() {
  return (
    <Box flexDirection="row" marginTop={1}>
      <Text color={getThemeColor("default")}>{planIcon}</Text>
      <Text> User declined to enter plan mode</Text>
    </Box>
  )
}
function renderEnterPlanErrorMessage() { return null }

// Mapping: Bu2→renderEnterPlanToolUseMessage, Gu2→renderEnterPlanProgressMessage,
//          Zu2→renderEnterPlanResultMessage, Yu2→renderEnterPlanRejectedMessage,
//          Ju2→renderEnterPlanErrorMessage, iR→getThemeColor, xJ→planIcon
```

---

## 3. ExitPlanMode Tool

### 3.1 Tool Definition

```javascript
// ============================================
// ExitPlanModeTool - Exits plan mode after approval
// Location: chunks.119.mjs:2494-2605
// ============================================

// ORIGINAL (for source lookup):
vd = "ExitPlanMode"

Zl5 = m.object({
  tool: m.enum(["Bash"]).describe("The tool this prompt applies to"),
  prompt: m.string().describe('Semantic description of the action, e.g. "run tests"')
})

Yl5 = m.strictObject({
  allowedPrompts: m.array(Zl5).optional()
    .describe("Prompt-based permissions needed to implement the plan.")
})

V$ = {
  name: vd,
  maxResultSizeChars: 1e5,
  async description() {
    return "Prompts the user to exit plan mode and start coding"
  },
  async prompt() { return Xg2 },
  inputSchema: Yl5,
  outputSchema: Jl5,
  isEnabled() {
    if (process.env.CLAUDE_CODE_REMOTE === "true") return !1;
    return !0
  },
  isConcurrencySafe() { return !0 },
  isReadOnly() { return !1 },
  requiresUserInteraction() { return !0 },
  async checkPermissions(A) {
    return { behavior: "ask", message: "Exit plan mode?", updatedInput: A }
  },
  async call(A, Q) {
    let B = !!Q.agentId,
      G = dC(Q.agentId),  // Plan file path
      Z = AK(Q.agentId);  // Plan content
    return Q.setAppState((X) => {
      if (X.toolPermissionContext.mode !== "plan") return X;
      return Iq(!0), lw(!0), {  // Set reentry flags
        ...X,
        toolPermissionContext: UJ(X.toolPermissionContext, {
          type: "setMode",
          mode: "default",
          destination: "session"
        })
      }
    }), {
      data: { plan: Z, isAgent: B, filePath: G }
    }
  },
  mapToolResultToToolResultBlockParam({ isAgent: A, plan: Q, filePath: B, ... }, J) {
    if (A) return {
      type: "tool_result",
      content: 'User has approved the plan. Please respond with "ok"',
      tool_use_id: J
    };
    if (!Q || Q.trim() === "") return {
      type: "tool_result",
      content: "User has approved exiting plan mode. You can now proceed.",
      tool_use_id: J
    };
    return {
      type: "tool_result",
      content: `User has approved your plan. You can now start coding...
Your plan has been saved to: ${B}

## Approved Plan:
${Q}`,
      tool_use_id: J
    }
  }
}

// READABLE (for understanding):
const EXIT_PLAN_MODE_NAME = "ExitPlanMode"

const allowedPromptSchema = z.object({
  tool: z.enum(["Bash"]).describe("The tool this prompt applies to"),
  prompt: z.string().describe('Semantic description, e.g. "run tests"')
})

const exitPlanModeInputSchema = z.strictObject({
  allowedPrompts: z.array(allowedPromptSchema).optional()
    .describe("Prompt-based permissions needed to implement the plan.")
})

const ExitPlanModeTool = {
  name: EXIT_PLAN_MODE_NAME,
  maxResultSizeChars: 100000,

  async description() {
    return "Prompts the user to exit plan mode and start coding"
  },

  async prompt() {
    return exitPlanModeDescription  // File-based description
  },

  inputSchema: exitPlanModeInputSchema,
  outputSchema: exitPlanModeOutputSchema,

  isEnabled() {
    if (process.env.CLAUDE_CODE_REMOTE === "true") return false;
    return true
  },

  isConcurrencySafe() { return true },
  isReadOnly() { return false },  // Modifies state
  requiresUserInteraction() { return true },  // Needs user approval

  async checkPermissions(input) {
    return { behavior: "ask", message: "Exit plan mode?", updatedInput: input }
  },

  async call(input, toolUseContext) {
    let isAgent = !!toolUseContext.agentId;
    let planFilePath = getPlanFilePath(toolUseContext.agentId);
    let planContent = readPlanFile(toolUseContext.agentId);

    toolUseContext.setAppState((state) => {
      if (state.toolPermissionContext.mode !== "plan") return state;

      // Set flags for re-entry detection
      setHasExitedPlanMode(true);
      setNeedsPlanModeExitAttachment(true);

      return {
        ...state,
        toolPermissionContext: applyPermissionAction(state.toolPermissionContext, {
          type: "setMode",
          mode: "default",
          destination: "session"
        })
      }
    });

    return {
      data: { plan: planContent, isAgent: isAgent, filePath: planFilePath }
    }
  },

  mapToolResultToToolResultBlockParam({ isAgent, plan, filePath, ... }, toolUseId) {
    if (isAgent) {
      return {
        type: "tool_result",
        content: 'User has approved the plan. Please respond with "ok"',
        tool_use_id: toolUseId
      };
    }

    if (!plan || plan.trim() === "") {
      return {
        type: "tool_result",
        content: "User has approved exiting plan mode. You can now proceed.",
        tool_use_id: toolUseId
      };
    }

    return {
      type: "tool_result",
      content: `User has approved your plan. Start with updating your todo list if applicable

Your plan has been saved to: ${filePath}

## Approved Plan:
${plan}`,
      tool_use_id: toolUseId
    }
  }
}

// Mapping: vd→EXIT_PLAN_MODE_NAME, V$→ExitPlanModeTool, Zl5→allowedPromptSchema,
//          Yl5→exitPlanModeInputSchema, Xg2→exitPlanModeDescription, dC→getPlanFilePath,
//          AK→readPlanFile, Iq→setHasExitedPlanMode, lw→setNeedsPlanModeExitAttachment,
//          UJ→applyPermissionAction
```

### 3.2 Tool Description (File-Based)

The ExitPlanMode tool has a detailed description (`Xg2`) explaining:

**How This Tool Works:**
- Plan should be written to the plan file specified in system message
- Tool does NOT take plan content as parameter - reads from file
- User sees plan file contents when reviewing

**Requesting Permissions (allowedPrompts):**
```json
{
  "allowedPrompts": [
    { "tool": "Bash", "prompt": "run tests" },
    { "tool": "Bash", "prompt": "install dependencies" },
    { "tool": "Bash", "prompt": "build the project" }
  ]
}
```

**Guidelines for prompts:**
- Use semantic descriptions, not specific commands
- "run tests" matches: npm test, pytest, go test, bun test, etc.
- Keep descriptions concise but descriptive
- Only request permissions actually needed
- Scope permissions narrowly (prefer "read-only" constraints)

### 3.3 UI Rendering Functions

```javascript
// ============================================
// ExitPlanMode UI Components
// Location: chunks.119.mjs:2386-2451
// ============================================

// ORIGINAL:
function Dg2() { return null }  // toolUseMessage
function Wg2() { return null }  // progressMessage

function Kg2(A, Q, { theme: B }) {  // resultMessage
  let { plan: G } = A, Z = !G || G.trim() === "",
    Y = "filePath" in A ? A.filePath : void 0,
    J = Y ? k6(Y) : "",  // Short path
    X = "awaitingLeaderApproval" in A ? A.awaitingLeaderApproval : !1;

  if (Z) return r6.createElement(T, {...},
    r6.createElement(C, { color: iR("plan") }, xJ),
    r6.createElement(C, null, " Exited plan mode"));

  if (X) return r6.createElement(T, {...},
    r6.createElement(C, null, " Plan submitted for team lead approval"),
    r6.createElement(C, { dimColor: !0 }, "Waiting for team lead..."));

  return r6.createElement(T, {...},
    r6.createElement(C, { color: iR("plan") }, xJ),
    r6.createElement(C, null, " User approved Claude's plan"),
    r6.createElement(C, { dimColor: !0 }, "Plan saved to: ", J, " · /plan to edit"),
    r6.createElement(JV, null, G));  // Markdown rendered plan
}

function Vg2({ plan: A }, { theme: Q }) {  // rejectedMessage
  let B = A ?? AK() ?? "No plan found";
  return r6.createElement(T, { flexDirection: "column" },
    r6.createElement(iY1, { plan: B }));  // Plan preview component
}

function Fg2() { return null }  // errorMessage

// READABLE:
function renderExitPlanToolUseMessage() { return null }
function renderExitPlanProgressMessage() { return null }

function renderExitPlanResultMessage(data, input, { theme }) {
  let { plan } = data;
  let isEmpty = !plan || plan.trim() === "";
  let filePath = "filePath" in data ? data.filePath : undefined;
  let shortPath = filePath ? shortenPath(filePath) : "";
  let awaitingLeaderApproval = "awaitingLeaderApproval" in data ? data.awaitingLeaderApproval : false;

  if (isEmpty) {
    return (
      <Box flexDirection="column" marginTop={1}>
        <Box flexDirection="row">
          <Text color={getThemeColor("plan")}>{planIcon}</Text>
          <Text> Exited plan mode</Text>
        </Box>
      </Box>
    )
  }

  if (awaitingLeaderApproval) {
    return (
      <Box flexDirection="column" marginTop={1}>
        <Text> Plan submitted for team lead approval</Text>
        <Text dimColor>Waiting for team lead to review and approve...</Text>
      </Box>
    )
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box flexDirection="row">
        <Text color={getThemeColor("plan")}>{planIcon}</Text>
        <Text> User approved Claude's plan</Text>
      </Box>
      <Indent>
        {filePath && <Text dimColor>Plan saved to: {shortPath} · /plan to edit</Text>}
        <MarkdownRenderer>{plan}</MarkdownRenderer>
      </Indent>
    </Box>
  )
}

function renderExitPlanRejectedMessage({ plan }, { theme }) {
  let planContent = plan ?? readPlanFile() ?? "No plan found";
  return (
    <Box flexDirection="column">
      <PlanPreview plan={planContent} />
    </Box>
  )
}

function renderExitPlanErrorMessage() { return null }

// Mapping: Dg2→renderExitPlanToolUseMessage, Wg2→renderExitPlanProgressMessage,
//          Kg2→renderExitPlanResultMessage, Vg2→renderExitPlanRejectedMessage,
//          Fg2→renderExitPlanErrorMessage, k6→shortenPath, iY1→PlanPreview, JV→MarkdownRenderer
```

---

## 4. Plan File Management

### 4.1 Directory Structure

```
~/.claude/
└── plans/
    ├── bright-exploring-aurora.md         # Main session plan
    ├── bright-exploring-aurora-agent-abc123.md  # Subagent plan
    └── calm-dancing-phoenix.md            # Another session
```

### 4.2 Core Functions

```javascript
// ============================================
// getPlanDir - Get/create plans directory
// Location: chunks.86.mjs:48-56
// ============================================

// ORIGINAL (for source lookup):
function NN() {
  let A = tSA(zQ(), "plans");
  if (!vA().existsSync(A)) try {
    vA().mkdirSync(A)
  } catch (Q) {
    e(Q instanceof Error ? Q : Error(String(Q)))
  }
  return A
}

// READABLE (for understanding):
function getPlanDir() {
  let planDir = path.join(getClaudeConfigDir(), "plans");  // ~/.claude/plans

  if (!fs.existsSync(planDir)) {
    try {
      fs.mkdirSync(planDir);
    } catch (error) {
      logError(error instanceof Error ? error : Error(String(error)));
    }
  }

  return planDir;
}

// Mapping: NN→getPlanDir, tSA→path.join, zQ→getClaudeConfigDir, vA→fs, e→logError
```

```javascript
// ============================================
// getPlanFilePath - Get plan file path for session/agent
// Location: chunks.86.mjs:58-62
// ============================================

// ORIGINAL (for source lookup):
function dC(A) {
  let Q = GY0(q0());
  if (!A) return tSA(NN(), `${Q}.md`);
  return tSA(NN(), `${Q}-agent-${A}.md`)
}

// READABLE (for understanding):
function getPlanFilePath(agentId) {
  let planSlug = getUniquePlanSlug(getSessionId());  // e.g., "bright-exploring-aurora"

  if (!agentId) {
    // Main session: ~/.claude/plans/bright-exploring-aurora.md
    return path.join(getPlanDir(), `${planSlug}.md`);
  }

  // Subagent: ~/.claude/plans/bright-exploring-aurora-agent-{agentId}.md
  return path.join(getPlanDir(), `${planSlug}-agent-${agentId}.md`);
}

// Mapping: dC→getPlanFilePath, GY0→getUniquePlanSlug, q0→getSessionId, tSA→path.join, NN→getPlanDir
```

```javascript
// ============================================
// readPlanFile - Read plan content from file
// Location: chunks.86.mjs:64-74
// ============================================

// ORIGINAL (for source lookup):
function AK(A) {
  let Q = dC(A);
  if (!vA().existsSync(Q)) return null;
  try {
    return vA().readFileSync(Q, { encoding: "utf-8" })
  } catch (B) {
    return e(B instanceof Error ? B : Error(String(B))), null
  }
}

// READABLE (for understanding):
function readPlanFile(agentId) {
  let planPath = getPlanFilePath(agentId);

  if (!fs.existsSync(planPath)) {
    return null;  // No plan file yet
  }

  try {
    return fs.readFileSync(planPath, { encoding: "utf-8" });
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
    return null;
  }
}

// Mapping: AK→readPlanFile, dC→getPlanFilePath, vA→fs, e→logError
```

```javascript
// ============================================
// checkPlanExists - Check if plan file exists for session
// Location: chunks.86.mjs:76-83
// ============================================

// ORIGINAL (for source lookup):
function W71(A, Q) {
  let B = A.messages.find((Y) => Y.slug)?.slug;
  if (!B) return !1;
  let G = Q ?? q0();
  ZY0(G, B);
  let Z = tSA(NN(), `${B}.md`);
  return vA().existsSync(Z)
}

// READABLE (for understanding):
function checkPlanExists(conversation, sessionId) {
  // Find slug from conversation messages
  let slug = conversation.messages.find((msg) => msg.slug)?.slug;
  if (!slug) return false;

  let currentSessionId = sessionId ?? getSessionId();
  cachePlanSlug(currentSessionId, slug);  // Cache for later use

  let planPath = path.join(getPlanDir(), `${slug}.md`);
  return fs.existsSync(planPath);
}

// Mapping: W71→checkPlanExists, ZY0→cachePlanSlug, q0→getSessionId, tSA→path.join, NN→getPlanDir, vA→fs
```

### 4.3 Plan Slug Generation

**How it works:**
1. Random slug generated from word lists: `{adjective}-{action}-{noun}`
2. Word lists contain 200+ options each
3. Total combinations: ~8 million unique names
4. Slug cached per session in Map to ensure consistency
5. Up to 10 retries to find unused name

---

## 5. State Tracking

### 5.1 Global State Flags

```javascript
// ============================================
// Plan mode state tracking functions
// Location: chunks.1.mjs:2706-2725
// ============================================

// ORIGINAL (for source lookup):
function Xf0() {
  return g0.hasExitedPlanMode
}

function Iq(A) {
  g0.hasExitedPlanMode = A
}

function If0() {
  return g0.needsPlanModeExitAttachment
}

function lw(A) {
  g0.needsPlanModeExitAttachment = A
}

function Ty(A, Q) {
  if (Q === "plan" && A !== "plan") g0.needsPlanModeExitAttachment = !1;
  if (A === "plan" && Q !== "plan") g0.needsPlanModeExitAttachment = !0
}

// READABLE (for understanding):
function hasExitedPlanMode() {
  return globalState.hasExitedPlanMode;  // true if user exited plan mode this session
}

function setHasExitedPlanMode(value) {
  globalState.hasExitedPlanMode = value;
}

function needsPlanModeExitAttachment() {
  return globalState.needsPlanModeExitAttachment;  // true if exit attachment needed
}

function setNeedsPlanModeExitAttachment(value) {
  globalState.needsPlanModeExitAttachment = value;
}

function onToolPermissionModeChanged(newMode, oldMode) {
  // When entering plan mode from non-plan: clear exit attachment flag
  if (newMode === "plan" && oldMode !== "plan") {
    globalState.needsPlanModeExitAttachment = false;
  }

  // When exiting plan mode: set exit attachment flag
  if (oldMode === "plan" && newMode !== "plan") {
    globalState.needsPlanModeExitAttachment = true;
  }
}

// Mapping: Xf0→hasExitedPlanMode, Iq→setHasExitedPlanMode, If0→needsPlanModeExitAttachment,
//          lw→setNeedsPlanModeExitAttachment, Ty→onToolPermissionModeChanged, g0→globalState
```

### 5.2 State Flag Usage

| Flag | Set When | Used For |
|------|----------|----------|
| `hasExitedPlanMode` | ExitPlanMode executed | Re-entry detection (show plan_mode_reentry) |
| `needsPlanModeExitAttachment` | Mode transitions | Show exit notification once after leaving plan mode |

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

### 8.2 Semantic-to-Regex Conversion

The function `aK1` (semanticToRegex) converts semantic descriptions to regex patterns for command matching:
- "run tests" → matches `npm test`, `pytest`, `go test`, `bun test`, etc.
- "install dependencies" → matches `npm install`, `pip install`, `cargo build`, etc.
- "build the project" → matches `npm run build`, `make`, `cargo build`, etc.

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

## 12. Session Restore and Plan Persistence

### 12.1 Plan Slug Caching

```javascript
// ============================================
// Plan Slug Cache - Global State
// Location: chunks.1.mjs:2778-2780
// ============================================

// ORIGINAL:
function Z7A() {
  return g0.planSlugCache  // Map<sessionId, slug>
}

// READABLE:
function getPlanSlugCache() {
  return globalState.planSlugCache;  // In-memory Map
}

// The cache stores session ID → slug mappings:
// "abc123" → "bright-exploring-aurora"
// "def456" → "calm-dancing-phoenix"
```

### 12.2 Slug Caching Functions

```javascript
// ============================================
// cachePlanSlug - Store slug in cache
// Location: chunks.86.mjs:39-41
// ============================================

// ORIGINAL:
function ZY0(A, Q) {
  Z7A().set(A, Q)
}

// READABLE:
function cachePlanSlug(sessionId, slug) {
  getPlanSlugCache().set(sessionId, slug);
}

// ============================================
// clearPlanSlugCacheForSession - Clear slug from cache
// Location: chunks.86.mjs:43-46
// ============================================

// ORIGINAL:
function J12(A) {
  let Q = A ?? q0();
  Z7A().delete(Q)
}

// READABLE:
function clearPlanSlugCacheForSession(sessionId) {
  let sessionToClear = sessionId ?? getSessionId();
  getPlanSlugCache().delete(sessionToClear);
}
```

### 12.3 Session Resume - Restoring Plan Slug

```javascript
// ============================================
// resumeSession - Restores plan slug from session messages
// Location: chunks.120.mjs:2608-2643
// ============================================

// ORIGINAL (key excerpt):
async function Zt(A, Q) {
  // ... session loading logic ...

  if (B) {
    if (Gj(B)) B = await Vx(B);  // Decompress if needed
    if (!Z) Z = xX(B);            // Extract session ID
    if (w71(B), Z) W71(B, lz(Z)); // KEY: Restore plan slug!
    EW1(B), G = B.messages
  }

  // Run SessionStart hooks (may add plan context)
  let Y = await WU("resume", Z);
  return G.push(...Y), { messages: G, sessionId: Z }
}

// READABLE:
async function resumeSession(sessionData, query) {
  // ... session loading ...

  if (messages) {
    if (needsDecompression(messages)) {
      messages = await decompressMessages(messages);
    }
    if (!sessionId) sessionId = extractSessionId(messages);

    // CRITICAL: Restore plan slug from session messages
    restorePlanSlugFromSession(messages, sessionId);

    validateMessages(messages);
    convertedMessages = messages;
  }

  // SessionStart hooks may restore plan context
  let hookMessages = await executeSessionStartHooks("resume", sessionId);
  convertedMessages.push(...hookMessages);

  return { messages: convertedMessages, sessionId };
}

// Mapping: Zt→resumeSession, W71→restorePlanSlugFromSession, WU→executeSessionStartHooks
```

### 12.4 Restore Plan Slug from Session

```javascript
// ============================================
// restorePlanSlugFromSession - Extracts and caches slug from messages
// Location: chunks.86.mjs:76-83
// ============================================

// ORIGINAL:
function W71(A, Q) {
  let B = A.messages.find((Y) => Y.slug)?.slug;
  if (!B) return !1;
  let G = Q ?? q0();
  ZY0(G, B);  // Cache the slug!
  let Z = tSA(NN(), `${B}.md`);
  return vA().existsSync(Z)
}

// READABLE:
function restorePlanSlugFromSession(messageContainer, sessionId) {
  // Find the first message with a slug property
  let slug = messageContainer.messages.find((msg) => msg.slug)?.slug;
  if (!slug) return false;

  let currentSessionId = sessionId ?? getSessionId();

  // RESTORE: Cache the slug for this session
  cachePlanSlug(currentSessionId, slug);

  // Verify plan file exists
  let planFilePath = path.join(getPlanDir(), `${slug}.md`);
  return fs.existsSync(planFilePath);
}

// Mapping: W71→restorePlanSlugFromSession, ZY0→cachePlanSlug
```

### 12.5 /clear Command Behavior

```javascript
// ============================================
// clearSessionHandler - Clears session but NOT plan files
// Location: chunks.136.mjs:1907-1932
// ============================================

// ORIGINAL:
async function IE1({ setMessages: A, readFileState: Q, getAppState: B, setAppState: G }) {
  // Execute SessionEnd hooks
  if (await tU0("clear", { getAppState: B, setAppState: G }), !Tz())
    await sI();

  // Clear messages (but NOT plan files on disk!)
  if (A(() => []), XE1(), DO(EQ()), Q.clear(), G)
    G((Y) => ({
      ...Y,
      fileHistory: { snapshots: [], trackedFiles: new Set },
      mcp: { clients: [], tools: [], commands: [], resources: {} }
    }));

  // Clear plan slug cache (but NOT files!)
  J12();  // clearPlanSlugCacheForSession
  wb0();
  await wj();

  // Run SessionStart hooks (can restore plan context)
  let Z = await WU("clear");
  if (Z.length > 0) A(() => Z)
}

// READABLE:
async function clearSessionHandler({ setMessages, readFileState, getAppState, setAppState }) {
  // 1. Execute SessionEnd hooks
  await executeSessionEndHooks("clear", { getAppState, setAppState });
  if (!isSandboxMode()) await restoreSessionStorage();

  // 2. Clear all messages (NOT plan files!)
  setMessages(() => []);
  clearAllCaches();
  clearFileTracking();
  readFileState.clear();

  // 3. Reset MCP and file history
  if (setAppState) setAppState((state) => ({
    ...state,
    fileHistory: { snapshots: [], trackedFiles: new Set },
    mcp: { clients: [], tools: [], commands: [], resources: {} }
  }));

  // 4. Clear plan slug cache (files remain on disk!)
  clearPlanSlugCacheForSession();
  resetOtherState();

  // 5. Run SessionStart hooks (can add plan context back)
  let restoredMessages = await executeSessionStartHooks("clear");
  if (restoredMessages.length > 0) {
    setMessages(() => restoredMessages);
  }
}

// Key insight: Plan files at ~/.claude/plans/*.md are NOT deleted
// Only the in-memory slug cache is cleared
// This is why plan files "persist across /clear" (fixed in 2.1.3)
```

---

## 13. Full Attachment Pipeline Integration

### 13.1 Main Attachment Generator

```javascript
// ============================================
// buildSystemAttachments - Where plan mode fits in the pipeline
// Location: chunks.131.mjs:3121-3137
// ============================================

// ORIGINAL:
async function O27(A, Q, B, G, Z, Y) {
  if (a1(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) return [];

  let J = c9();  // AbortController
  setTimeout(() => { J.abort() }, 1000);  // 1 second timeout

  let X = { ...Q, abortController: J },
    I = !Q.agentId,  // Is main loop (not subagent)?

    // GROUP 1: User-mention attachments
    D = A ? [
      fJ("at_mentioned_files", () => h27(A, X)),
      fJ("mcp_resources", () => u27(A, X)),
      fJ("agent_mentions", () => Promise.resolve(g27(A, Q.options.agentDefinitions.activeAgents)))
    ] : [],
    W = await Promise.all(D),

    // GROUP 2: Core attachments (includes plan mode!)
    K = [
      fJ("changed_files", () => m27(X)),
      fJ("nested_memory", () => d27(X)),
      fJ("ultra_claude_md", async () => v27(Z)),
      fJ("plan_mode", () => j27(Z, Q)),           // ← PLAN MODE HERE (position 4)
      fJ("plan_mode_exit", () => T27(Q)),         // ← PLAN MODE EXIT (position 5)
      fJ("delegate_mode", () => P27(Q)),
      fJ("delegate_mode_exit", () => Promise.resolve(S27())),
      fJ("todo_reminders", () => t27(Z, Q)),
      fJ("collab_notification", async () => B97()),
      fJ("critical_system_reminder", () => Promise.resolve(x27(Q)))
    ],

    // GROUP 3: Main-loop-only attachments
    V = I ? [
      fJ("ide_selection", async () => k27(B, Q)),
      fJ("ide_opened_file", async () => f27(B, Q)),
      fJ("output_style", async () => Promise.resolve(y27())),
      fJ("queued_commands", async () => M27(G)),
      fJ("diagnostics", async () => o27()),
      fJ("lsp_diagnostics", async () => r27()),
      fJ("unified_tasks", async () => A97(Q, Z)),
      fJ("async_hook_responses", async () => Q97()),
      fJ("memory", async () => mr2(Q, Z, Y)),
      fJ("token_usage", async () => Promise.resolve(G97(Z ?? []))),
      fJ("budget_usd", async () => Promise.resolve(Z97(Q.options.maxBudgetUsd))),
      fJ("verify_plan_reminder", async () => J97(Z, Q))
    ] : [],

    [F, H] = await Promise.all([Promise.all(K), Promise.all(V)]);

  // Combine all groups: user-mentions → core → main-loop-only
  return [...W.flat(), ...F.flat(), ...H.flat()]
}
```

### 13.2 Attachment Ordering

| Priority | Group | Attachments |
|----------|-------|-------------|
| 1 | User-mentions | at_mentioned_files, mcp_resources, agent_mentions |
| 2 | **Core** | changed_files, nested_memory, ultra_claude_md, **plan_mode**, **plan_mode_exit**, delegate_mode, delegate_mode_exit, todo_reminders, collab_notification, critical_system_reminder |
| 3 | Main-loop-only | ide_selection, ide_opened_file, output_style, queued_commands, diagnostics, lsp_diagnostics, unified_tasks, async_hook_responses, memory, token_usage, budget_usd, verify_plan_reminder |

**Key insight:** Plan mode attachments are in the **core group** (always generated for both main agent and subagents), not in the main-loop-only group.

### 13.3 Attachment Telemetry Wrapper

```javascript
// ============================================
// generateAttachment - Wraps with telemetry
// Location: chunks.131.mjs:3140-3164
// ============================================

// ORIGINAL:
async function fJ(A, Q) {
  let B = Date.now();
  try {
    let G = await Q(),
      Z = Date.now() - B,
      Y = G.reduce((J, X) => J + eA(X).length, 0);

    // 5% sampling for telemetry
    if (Math.random() < 0.05) l("tengu_attachment_compute_duration", {
      label: A,
      duration_ms: Z,
      attachment_size_bytes: Y,
      attachment_count: G.length
    });
    return G
  } catch (G) {
    let Z = Date.now() - B;
    if (Math.random() < 0.05) l("tengu_attachment_compute_duration", {
      label: A,
      duration_ms: Z,
      error: !0
    });
    return e(G), xM(`Attachment error in ${A}`, G), []
  }
}
```

### 13.4 Attachment-to-Message Conversion

```javascript
// ============================================
// wrapAttachmentAsMessage - Wraps raw attachment
// Location: chunks.132.mjs:87-94
// ============================================

// ORIGINAL:
function X4(A) {
  return {
    attachment: A,
    type: "attachment",
    uuid: q27(),
    timestamp: new Date().toISOString()
  }
}

// READABLE:
function wrapAttachmentAsMessage(attachment) {
  return {
    attachment: attachment,
    type: "attachment",
    uuid: generateUUID(),
    timestamp: new Date().toISOString()
  }
}
```

### 13.5 Full Pipeline Flow

```
User sends message
    ↓
aN() generator (chunks.134.mjs:99)
    ↓
O27() - buildSystemAttachments
    ├─ GROUP 1: User-mention attachments
    ├─ GROUP 2: Core attachments
    │  ├─ j27() → plan_mode attachment
    │  └─ T27() → plan_mode_exit attachment
    └─ GROUP 3: Main-loop-only attachments
    ↓
VHA() generator - yields each attachment
    ↓
X4() - wraps as message envelope
    ↓
q$7() - converts to API message format
    ├─ case "plan_mode" → z$7() → ($$7 or C$7 or U$7)
    ├─ case "plan_mode_reentry" → direct conversion
    └─ case "plan_mode_exit" → direct conversion
    ↓
API message ready for sending
```

---

## 14. Main Loop Integration

### 14.1 Model Selection in Main Loop

```javascript
// ============================================
// selectModelForPlanMode - Selects Opus/Sonnet based on plan mode
// Location: chunks.46.mjs:2259-2268
// ============================================

// ORIGINAL (for source lookup):
function HQA(A) {
  let {
    permissionMode: Q,
    mainLoopModel: B,
    exceeds200kTokens: G = !1
  } = A;
  if (FQA() === "opusplan" && Q === "plan" && !G) return sJA();
  if (FQA() === "haiku" && Q === "plan") return OR();
  return B
}

// READABLE (for understanding):
function selectModelForPlanMode({ permissionMode, mainLoopModel, exceeds200kTokens = false }) {
  // If "Opus Plan Mode" selected AND in plan mode AND under 200k tokens
  // → Use Opus 4.5 (better reasoning for complex planning)
  if (getMainLoopModelSetting() === "opusplan" && permissionMode === "plan" && !exceeds200kTokens) {
    return getOpusModel();  // claude-opus-4-5 or claude-opus-4-1
  }

  // If Haiku selected AND in plan mode
  // → Upgrade to Sonnet 4.5 (Haiku too weak for planning)
  if (getMainLoopModelSetting() === "haiku" && permissionMode === "plan") {
    return getSonnetModel();  // claude-sonnet-4-5
  }

  // Otherwise use configured main loop model
  return mainLoopModel;
}

// Mapping: HQA→selectModelForPlanMode, FQA→getMainLoopModelSetting, sJA→getOpusModel, OR→getSonnetModel
```

**Key insight:** Model selection is automatically adjusted in plan mode:
- "Opus Plan Mode" → Uses Opus 4.5 for better reasoning (unless >200k tokens)
- Haiku → Upgraded to Sonnet 4.5 (Haiku insufficient for planning)

### 14.2 Token Threshold Check

```javascript
// ============================================
// checkExceeds200kTokens - Check if last response exceeded 200k tokens
// Location: chunks.85.mjs:921-931
// ============================================

// ORIGINAL (for source lookup):
function h51(A) {
  for (let B = A.length - 1; B >= 0; B--) {
    let G = A[B];
    if (G?.type === "assistant") {
      let Z = Jd(G);
      if (Z) return uSA(Z) > 200000;
      return !1
    }
  }
  return !1
}

// READABLE (for understanding):
function checkExceeds200kTokens(messages) {
  // Search backwards for last assistant message
  for (let i = messages.length - 1; i >= 0; i--) {
    let message = messages[i];
    if (message?.type === "assistant") {
      let usage = getMessageUsage(message);
      if (usage) {
        return getTotalTokens(usage) > 200000;
      }
      return false;
    }
  }
  return false;
}

// Mapping: h51→checkExceeds200kTokens, Jd→getMessageUsage, uSA→getTotalTokens
```

**Why 200k threshold:** When token count exceeds 200k, the Opus model switch is skipped to avoid performance issues with very long contexts.

### 14.3 Permission Mode Retrieval in Main Loop

```javascript
// ============================================
// Main loop permission mode retrieval
// Location: chunks.134.mjs:174-180
// ============================================

// ORIGINAL (for source lookup):
h6("query_setup_start");
let x = f8("tengu_streaming_tool_execution2") ? new _H1(Y.options.tools, Z, Y) : null,
  b = await Y.getAppState(),
  S = b.toolPermissionContext.mode,  // Get current permission mode
  u = HQA({
    permissionMode: S,
    mainLoopModel: Y.options.mainLoopModel,
    exceeds200kTokens: S === "plan" && h51(z)  // Only check 200k in plan mode
  }),
  f = fA9(Q, G);
h6("query_setup_end");

// READABLE (for understanding):
logTiming("query_setup_start");

// 1. Get current app state
let appState = await toolUseContext.getAppState();

// 2. Extract permission mode ("default", "plan", "acceptEdits", "bypassPermissions", "dontAsk")
let permissionMode = appState.toolPermissionContext.mode;

// 3. Select model based on plan mode
let model = selectModelForPlanMode({
  permissionMode: permissionMode,
  mainLoopModel: toolUseContext.options.mainLoopModel,
  exceeds200kTokens: permissionMode === "plan" && checkExceeds200kTokens(messages)
});

logTiming("query_setup_end");

// Mapping: h6→logTiming, S→permissionMode, u→model, HQA→selectModelForPlanMode, h51→checkExceeds200kTokens
```

### 14.4 Mode Transition Triggering Exit Attachment

```javascript
// ============================================
// Mode cycle handler - triggers exit attachment on plan mode exit
// Location: chunks.152.mjs:2514-2528
// ============================================

// ORIGINAL (for source lookup):
let k1 = z4.useCallback(() => {
  let T0 = kK9(B, FA.teamContext);  // Get next mode in cycle
  if (l("tengu_mode_cycle", { to: T0 }),
    B.mode === "plan" && T0 !== "plan") Iq(!0);  // KEY: Set hasExitedPlanMode!
  if (Ty(B.mode, T0),  // Track mode transition
    B.mode === "delegate" && T0 !== "delegate") Df0(!0), jdA(!0);
  if (T0 === "plan") S0((PB) => ({
    ...PB,
    lastPlanModeUse: Date.now()
  }));
  if (T0 === "acceptEdits") T9("auto-accept-mode");
  let NQ = UJ(B, {
    type: "setMode",
    mode: T0,
    destination: "session"
  });
  if (G(NQ), XL7(T0, FA.teamContext?.teamName), ZA) zA(!1)
}, [B, FA.teamContext, G, ZA])

// READABLE (for understanding):
const handleModeCycle = useCallback(() => {
  let nextMode = getNextModeInCycle(currentPermissionContext, teamContext);

  logTelemetry("tengu_mode_cycle", { to: nextMode });

  // CRITICAL: When exiting plan mode → set flag for exit attachment
  if (currentPermissionContext.mode === "plan" && nextMode !== "plan") {
    setHasExitedPlanMode(true);  // Triggers plan_mode_exit attachment
  }

  // Track mode transition (sets needsPlanModeExitAttachment)
  onToolPermissionModeChanged(currentPermissionContext.mode, nextMode);

  // Handle delegate mode exit
  if (currentPermissionContext.mode === "delegate" && nextMode !== "delegate") {
    setNeedsDelegateModeExitAttachment(true);
    setDelegateModeExited(true);
  }

  // Track last plan mode usage
  if (nextMode === "plan") {
    updateUserPrefs((prefs) => ({
      ...prefs,
      lastPlanModeUse: Date.now()
    }));
  }

  // Apply mode change
  let newContext = applyPermissionAction(currentPermissionContext, {
    type: "setMode",
    mode: nextMode,
    destination: "session"
  });
  setPermissionContext(newContext);
}, [currentPermissionContext, teamContext, setPermissionContext]);

// Mapping: k1→handleModeCycle, kK9→getNextModeInCycle, Iq→setHasExitedPlanMode,
//          Ty→onToolPermissionModeChanged, UJ→applyPermissionAction
```

**Flow when user exits plan mode:**
1. User clicks mode cycle button (Shift+Escape)
2. `kK9()` calculates next mode
3. If exiting plan mode → `Iq(!0)` sets `hasExitedPlanMode = true`
4. `Ty()` tracks transition → sets `needsPlanModeExitAttachment = true`
5. Next turn: `T27()` generates `plan_mode_exit` attachment

---

## 15. Subagent Plan Mode Propagation

### 15.1 How Plan Mode is Propagated

Plan mode is **NOT passed as an explicit parameter** to subagents. Instead, it's enforced through:

1. **Tool restrictions** via `disallowedTools` array
2. **System prompts** with explicit read-only instructions
3. **Critical system reminders** in agent configuration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PLAN MODE PROPAGATION TO SUBAGENTS                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Main Agent (mode = "plan")                                                │
│         │                                                                   │
│         ├─── Task tool spawns subagent ──────────────────────────────────┐  │
│         │                                                                │  │
│         ▼                                                                ▼  │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    SUBAGENT CONFIGURATION                            │  │
│   │                                                                      │  │
│   │   1. disallowedTools: [Task, ExitPlanMode, Edit, Write, KillShell]  │  │
│   │      ↳ Cannot spawn more agents                                      │  │
│   │      ↳ Cannot exit plan mode                                         │  │
│   │      ↳ Cannot edit/write files                                       │  │
│   │                                                                      │  │
│   │   2. System Prompt:                                                  │  │
│   │      "=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ==="     │  │
│   │      "You are STRICTLY PROHIBITED from..."                           │  │
│   │                                                                      │  │
│   │   3. criticalSystemReminder_EXPERIMENTAL:                           │  │
│   │      "CRITICAL: This is a READ-ONLY task. You CANNOT edit..."       │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   Result: Subagent cannot modify files even if it tries                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 15.2 Explore Agent Configuration

```javascript
// ============================================
// Explore Agent - Plan Mode Configuration
// Location: chunks.93.mjs:219-228
// ============================================

// ORIGINAL (for source lookup):
MS = {
  agentType: "Explore",
  whenToUse: 'Fast agent specialized for exploring codebases...',
  disallowedTools: [f3, CY1, I8, BY, tq],
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",
  getSystemPrompt: () => sZ5,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// READABLE (for understanding):
const ExploreAgentConfig = {
  agentType: "Explore",
  whenToUse: 'Fast agent for exploring codebases. Use for file searches, code keywords, codebase questions.',

  // KEY: These tools are BLOCKED for this agent
  disallowedTools: [
    "Task",          // Cannot spawn further agents
    "ExitPlanMode",  // Cannot exit plan mode
    "Edit",          // Cannot edit files
    "Write",         // Cannot write files
    "KillShell"      // Cannot kill shells
  ],

  source: "built-in",
  baseDir: "built-in",
  model: "haiku",  // Uses Haiku for speed
  getSystemPrompt: () => exploreAgentSystemPrompt,

  // Additional reminder for read-only enforcement
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// Mapping: MS→ExploreAgentConfig, f3→"Task", CY1→"ExitPlanMode", I8→"Edit", BY→"Write", tq→"KillShell"
```

### 15.3 Plan Agent Configuration

```javascript
// ============================================
// Plan Agent - Configuration with Read-Only Enforcement
// Location: chunks.93.mjs:289-299
// ============================================

// ORIGINAL (for source lookup):
UY1 = {
  agentType: "Plan",
  whenToUse: "Software architect agent for designing implementation plans...",
  disallowedTools: [f3, CY1, I8, BY, tq],
  source: "built-in",
  tools: MS.tools,  // Same tools as Explore
  baseDir: "built-in",
  model: "inherit",  // Inherits parent model (Opus in plan mode)
  getSystemPrompt: () => tZ5,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// READABLE (for understanding):
const PlanAgentConfig = {
  agentType: "Plan",
  whenToUse: "Software architect for designing implementation plans. Returns step-by-step plans, identifies critical files.",

  // SAME restrictions as Explore agent
  disallowedTools: ["Task", "ExitPlanMode", "Edit", "Write", "KillShell"],

  source: "built-in",
  tools: ExploreAgentConfig.tools,  // Same tool set
  baseDir: "built-in",
  model: "inherit",  // KEY: Inherits parent model (Opus when in plan mode)
  getSystemPrompt: () => planAgentSystemPrompt,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// Mapping: UY1→PlanAgentConfig, tZ5→planAgentSystemPrompt
```

### 15.4 Plan Agent System Prompt (Full Text)

```javascript
// ============================================
// Plan Agent System Prompt - Read-Only Instructions
// Location: chunks.93.mjs:240-289
// ============================================

planAgentSystemPrompt = `You are a software architect and planning specialist for Claude Code. Your role is to explore the codebase and design implementation plans.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to explore the codebase and design implementation plans. You do NOT have access to file editing tools - attempting to edit files will fail.

## Your Process

1. **Understand Requirements**: Focus on the requirements provided.

2. **Explore Thoroughly**:
   - Read any files provided to you in the initial prompt
   - Find existing patterns using ${Glob.name}, ${Grep.name}, and ${Read.name}
   - Understand the current architecture
   - Identify similar features as reference
   - Use ${Bash.name} ONLY for read-only operations (ls, git status, git log, git diff)
   - NEVER use ${Bash.name} for: mkdir, touch, rm, cp, mv, git add, git commit

3. **Design Solution**:
   - Create implementation approach
   - Consider trade-offs and architectural decisions

4. **Detail the Plan**:
   - Provide step-by-step implementation strategy
   - Identify dependencies and sequencing

## Required Output

End your response with:

### Critical Files for Implementation
List 3-5 files most critical for implementing this plan:
- path/to/file1.ts - [Brief reason]

REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files.`
```

### 15.5 Multi-Layered Read-Only Enforcement

| Layer | Mechanism | Location |
|-------|-----------|----------|
| **1. Tool Blocking** | `disallowedTools` array prevents Edit/Write | chunks.93.mjs:222, 292 |
| **2. System Prompt** | Explicit "READ-ONLY MODE" instructions | chunks.93.mjs:240-289 |
| **3. Critical Reminder** | `criticalSystemReminder_EXPERIMENTAL` | chunks.93.mjs:227, 298 |
| **4. Permission Check** | Tools check mode === "plan" | chunks.147.mjs:1570-1598 |
| **5. SubAgent Reminder** | `buildSubAgentPlanReminder()` | chunks.147.mjs:3340-3351 |

**Why multi-layered:** LLMs can sometimes ignore instructions. Multiple enforcement layers ensure read-only behavior is maintained even if one layer fails.

---

## 16. Related Symbols

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules (Plan Mode section)

### Tool Definitions
- `EnterPlanModeTool` (gbA) - Enter plan mode tool object
- `ExitPlanModeTool` (V$) - Exit plan mode tool object

### Plan File Management
- `getPlanDir` (NN) - Get ~/.claude/plans directory
- `getPlanFilePath` (dC) - Get plan file path for session/agent
- `readPlanFile` (AK) - Read plan content from file
- `checkPlanExists` (W71) - Check if plan file exists, restore slug

### State Tracking
- `hasExitedPlanMode` (Xf0) - Check if exited plan mode
- `setHasExitedPlanMode` (Iq) - Set exit flag
- `needsPlanModeExitAttachment` (If0) - Check if exit attachment needed
- `setNeedsPlanModeExitAttachment` (lw) - Set exit attachment flag
- `onToolPermissionModeChanged` (Ty) - Handle mode transitions
- `getPlanSlugCache` (Z7A) - Get slug cache Map
- `cachePlanSlug` (ZY0) - Cache slug for session
- `clearPlanSlugCacheForSession` (J12) - Clear cached slug

### System Reminders
- `buildPlanModeSystemReminder` (z$7) - Router for plan reminders
- `buildFullPlanReminder` ($$7) - Full 5-phase workflow
- `buildSparsePlanReminder` (C$7) - Abbreviated reminder
- `buildSubAgentPlanReminder` (U$7) - Subagent instructions
- `getMaxPlanAgents` (LJ9) - Get max design agents
- `getMaxExploreAgents` (OJ9) - Get max explore agents

### Attachment Generation
- `buildPlanModeAttachment` (j27) - Main attachment builder
- `buildPlanModeExitAttachment` (T27) - Exit attachment builder
- `findPlanModeAttachmentInfo` (R27) - Count turns since attachment
- `countPlanModeAttachments` (_27) - Count plan attachments
- `buildSystemAttachments` (O27) - Full attachment pipeline

### Permission Integration
- `buildPermissionRules` (re) - Convert allowedPrompts to rules
- `semanticToRegex` (aK1) - Convert semantic description to regex

### Main Loop Integration
- `selectModelForPlanMode` (HQA) - Select Opus/Sonnet for plan mode
- `checkExceeds200kTokens` (h51) - Check 200k token threshold
- `handleModeCycle` (k1) - UI mode cycle handler
- `getNextModeInCycle` (kK9) - Calculate next permission mode

### Subagent Configurations
- `ExploreAgentConfig` (MS) - Explore agent definition
- `PlanAgentConfig` (UY1) - Plan agent definition
- `exploreAgentSystemPrompt` (sZ5) - Explore agent prompt
- `planAgentSystemPrompt` (tZ5) - Plan agent prompt with READ-ONLY enforcement

### Disallowed Tools (Agent Restrictions)
- Task (f3), ExitPlanMode (CY1), Edit (I8), Write (BY), KillShell (tq)
