# Plan Mode Implementation - Overview

## Overview

Plan Mode is a read-only exploration and planning phase in Claude Code where the assistant focuses on understanding the codebase and designing implementation strategies before writing code. It provides a structured 5-phase workflow for complex tasks requiring upfront planning.

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

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

```javascript
// ============================================
// Word Lists for Slug Generation
// Location: chunks.86.mjs:3-20
// ============================================

// ORIGINAL (for source lookup):
function Z12() {
  let A = BY0(Q12),  // Random adjective
    Q = BY0(G12),    // Random action
    B = BY0(B12);    // Random noun
  return `${A}-${Q}-${B}`
}

// Word lists (excerpts):
Q12 = ["abundant", "ancient", "bright", "calm", "cheerful", "clever", "cozy", "curious",
       "dapper", "dazzling", "deep", "delightful", "eager", "elegant", "enchanted", ...
       // 200+ adjectives including technical terms:
       "abstract", "adaptive", "agile", "async", "atomic", "binary", "cached", "compiled",
       "concurrent", "distributed", "dynamic", "functional", "generic", "immutable", ...]

B12 = ["aurora", "avalanche", "blossom", "breeze", "brook", "bubble", "canyon", "cascade",
       // Nature terms, animals, objects, and CS pioneers:
       "dijkstra", "hopper", "knuth", "lamport", "liskov", "lovelace", "turing", ...]

G12 = ["baking", "beaming", "booping", "bouncing", "brewing", "bubbling", "chasing",
       "conjuring", "dancing", "dazzling", "discovering", "doodling", "dreaming", ...]

zIZ = Q12.length * G12.length * B12.length  // ~8 million combinations

// READABLE:
function generateSlug() {
  let adjective = randomChoice(adjectives);
  let action = randomChoice(actions);
  let noun = randomChoice(nouns);
  return `${adjective}-${action}-${noun}`;  // e.g., "bright-exploring-aurora"
}
```

```javascript
// ============================================
// getUniquePlanSlug - Get or create unique slug for session
// Location: chunks.86.mjs:23-37
// ============================================

// ORIGINAL (for source lookup):
function GY0(A) {
  let Q = A ?? q0(),        // Session ID
    B = Z7A(),              // Plan slug cache Map
    G = B.get(Q);           // Check cache first
  if (!G) {
    let Z = NN();           // Plans directory
    for (let Y = 0; Y < Fe8; Y++) {  // Fe8 = 10 retries
      G = Z12();            // Generate random slug
      let J = tSA(Z, `${G}.md`);
      if (!vA().existsSync(J)) break  // Found unused name
    }
    B.set(Q, G)             // Cache for session
  }
  return G
}

// READABLE (for understanding):
function getUniquePlanSlug(sessionId) {
  let currentSessionId = sessionId ?? getSessionId();
  let cache = getPlanSlugCache();
  let slug = cache.get(currentSessionId);

  if (!slug) {
    let planDir = getPlanDir();
    // Try up to 10 times to find unused slug
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      slug = generateSlug();  // e.g., "bright-exploring-aurora"
      let planPath = path.join(planDir, `${slug}.md`);
      if (!fs.existsSync(planPath)) break;  // Found unused name
    }
    cache.set(currentSessionId, slug);  // Cache for this session
  }

  return slug;
}

// Mapping: GY0→getUniquePlanSlug, Z12→generateSlug, Z7A→getPlanSlugCache,
//          Fe8→MAX_RETRIES (10), NN→getPlanDir
```

**Design Decision: Why Random Slugs?**

| Alternative | Pros | Cons |
|-------------|------|------|
| UUID | Guaranteed unique | Unreadable, hard to reference |
| Timestamp | Simple, sortable | Collision possible, boring |
| **Random words** | Human-readable, memorable | Slight collision risk |
| Sequential numbers | Simple | No meaning, boring |

**Why this approach:**
- Human-friendly names are easier to remember and reference
- Word combinations are fun ("bright-exploring-aurora")
- Includes CS pioneers (dijkstra, hopper, knuth) as easter eggs
- 8M+ combinations make collisions extremely rare
- 10-retry fallback handles edge cases

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

## 6. Configuration Options

### 6.1 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CLAUDE_CODE_PLAN_V2_AGENT_COUNT` | 1 | Max Plan agents (1-5) |
| `CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT` | 3 | Max Explore agents (1-5) |
| `CLAUDE_CODE_REMOTE` | false | Disables EnterPlanMode/ExitPlanMode when true |
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | false | Disables all attachments including plan mode |

### 6.2 Internal Constants

```javascript
// ============================================
// Plan Mode Configuration Constants
// Location: chunks.131.mjs:3207, chunks.86.mjs:85
// ============================================

ar2 = {
  TURNS_BETWEEN_ATTACHMENTS: 5,        // Skip attachment if < 5 turns since last
  FULL_REMINDER_EVERY_N_ATTACHMENTS: 3  // Full reminder every 3rd, sparse otherwise
}

Fe8 = 10  // Max retries for unique slug generation
```

### 6.3 Model Selection Settings

| Setting | Model in Plan Mode | Model Outside Plan Mode |
|---------|-------------------|------------------------|
| `sonnet` | Sonnet 4.5 | Sonnet 4.5 |
| `haiku` | **Sonnet 4.5** (upgraded) | Haiku |
| `opusplan` | **Opus 4.5** | Sonnet 4.5 |

**Note:** Haiku is auto-upgraded to Sonnet in plan mode because Haiku lacks sufficient reasoning capability for complex planning tasks.

---

## 7. Design Decisions and Key Insights

### 7.1 Why a 5-Phase Workflow?

**Problem:** LLMs tend to jump directly to implementation without proper exploration.

**Solution:** Structured 5-phase workflow forces systematic approach:

| Phase | Prevents | Ensures |
|-------|----------|---------|
| 1. Understanding | Premature coding | Requirements captured |
| 2. Design | Ad-hoc architecture | Considered approaches |
| 3. Review | Misaligned implementation | User intent preserved |
| 4. Final Plan | Scattered notes | Actionable checklist |
| 5. Exit | Indefinite planning | Clear handoff point |

**Key Insight:** The workflow is enforced through system reminders, not code constraints. The LLM can technically skip phases, but explicit instructions significantly improve compliance.

### 7.2 Why Full + Sparse Reminders?

**Problem:** Repeating full 5-phase instructions every turn wastes tokens.

**Solution:** Full reminder every 3rd attachment, sparse otherwise.

```
Turn 1: FULL reminder (complete 5-phase workflow)
Turn 2: SPARSE reminder (brief "still in plan mode")
Turn 3: SPARSE reminder
Turn 4: FULL reminder (refresh instructions)
Turn 5: SPARSE reminder
...
```

**Trade-off:**
- Token savings: ~80% reduction in reminder tokens
- Risk: LLM might forget workflow details
- Mitigation: Full refresh every 3rd turn balances cost vs. compliance

### 7.3 Why Plan File Instead of In-Memory?

**Problem:** Where should the plan content live?

| Option | Pros | Cons |
|--------|------|------|
| In-memory only | Fast, simple | Lost on crash/clear |
| **Disk file** | Persists, user-editable | I/O overhead |
| Database | Structured, queryable | Over-engineered |

**Decision:** Disk file (`~/.claude/plans/*.md`)

**Why:**
1. **Persistence:** Plan survives /clear command
2. **User access:** Can edit with any editor
3. **Visibility:** User can see what Claude plans
4. **Recovery:** Session restore can find existing plan
5. **Simplicity:** Just a markdown file, no schema

### 7.4 Why Multi-Layered Read-Only Enforcement?

**Problem:** LLMs sometimes ignore instructions, especially under prompt injection.

**Solution:** 5 enforcement layers:

```
Layer 1: disallowedTools array     → Hard block at tool level
Layer 2: System prompt             → Explicit READ-ONLY instructions
Layer 3: Critical reminder         → Additional emphasis
Layer 4: Permission check          → Runtime mode verification
Layer 5: SubAgent reminder         → Subagent-specific instructions
```

**Key Insight:** Each layer catches what others miss:
- Layer 1 catches direct tool calls
- Layers 2-3 catch "creative" workarounds (e.g., Bash redirects)
- Layer 4 catches mode confusion
- Layer 5 catches subagent context loss

### 7.5 Why Session-Scoped Permissions from allowedPrompts?

**Problem:** User approves plan with specific permissions (e.g., "run tests"). How long do they last?

| Scope | Behavior | Risk |
|-------|----------|------|
| Single command | Ask again next time | Too many prompts |
| **Session** | Valid until /clear | Balanced |
| Permanent | Never ask again | Security concern |

**Decision:** Session-scoped (cleared on /clear)

**Why:**
1. User explicitly approved these actions for this task
2. Session boundary is natural reset point
3. Avoids permission accumulation over time
4. User can always /clear to revoke

---

## 8. Edge Cases and Error Handling

### 8.1 Plan File Scenarios

| Scenario | Behavior |
|----------|----------|
| Plan file deleted mid-session | `readPlanFile()` returns null, `planExists: false` in attachment |
| Plan file externally edited | Changes visible on next Read tool call |
| Plan file locked by editor | Write fails, error logged but not fatal |
| No write permission to ~/.claude | `getPlanDir()` catches error, logs it |

### 8.2 State Edge Cases

| Scenario | Behavior |
|----------|----------|
| Enter plan mode, never write plan | Empty plan on exit, brief exit message |
| Enter plan mode, /clear, re-enter | New slug generated, fresh start |
| Session restore with plan file | Slug restored from messages, plan file found |
| Session restore without plan file | Slug restored but `planExists: false` |
| Subagent tries to exit plan mode | Error: "ExitPlanMode cannot be used in agent contexts" |

### 8.3 Slug Collision Handling

```javascript
// After 10 retries, if all slugs exist:
// - Uses the last generated slug anyway
// - Overwrites existing file (rare edge case)
// - Probability: ~10^-21 with 8M+ combinations
```

---

## Related Documents

- [system_and_attachments.md](./system_and_attachments.md) - System reminders, attachments, permissions
- [integration.md](./integration.md) - Session persistence, main loop, subagent propagation
