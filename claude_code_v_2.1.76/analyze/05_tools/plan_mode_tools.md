# Plan Mode Tools - Deep Analysis (Claude Code 2.1.38)

> Complete analysis of plan mode tools: EnterPlanMode, ExitPlanMode, AskUserQuestion.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode)

Key functions in this document:
- `EnterPlanModeTool` (N_6) - Enter planning mode - chunks.140.mjs:1650
- `ExitPlanModeTool` (bW) - Exit and submit plan - chunks.88.mjs:76
- `AskUserQuestionTool` (TH) - Ask user questions - chunks.139.mjs:2904

---

## Architecture Overview

```
Plan Mode Flow
│
├── EnterPlanMode
│   └── Switches permission mode to "plan"
│       ├── Read-only access enforced
│       ├── Plan file created
│       └── Pre-plan mode saved for restoration
│
├── Planning Phase
│   ├── Explore codebase
│   ├── Design approach
│   ├── AskUserQuestion (if needed)
│   └── Write plan to plan file
│
└── ExitPlanMode
    └── Submit plan for approval
        ├── User reviews plan
        ├── Approve → Implement
        └── Reject → Revise
```

---

## 1. EnterPlanMode Tool

### EnterPlanModeTool (N_6) - Enter planning mode

**What it does:** Requests permission to enter plan mode for complex tasks requiring exploration and design. Switches permission context to read-only "plan" mode.

**How it works:**
1. Validates not in agent context (plan mode not allowed for sub-agents)
2. Saves current permission mode for restoration
3. Switches to "plan" permission mode
4. Returns instructions for planning workflow

```javascript
// ============================================
// EnterPlanModeTool - Plan mode entry
// Location: chunks.140.mjs:1650-1727
// ============================================

// ORIGINAL (for source lookup):
N_6 = "EnterPlanMode"

// Tool definition at chunks.140.mjs:1650-1727
{
    name: N_6,  // "EnterPlanMode"
    maxResultSizeChars: 1e5,
    async description() {
        return "Requests permission to enter plan mode for complex tasks requiring exploration and design"
    },
    async prompt() { return jc4() },
    get inputSchema() { return dCY() },
    get outputSchema() { return cCY() },
    userFacingName() { return "" },
    isEnabled() { return !0 },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !0 },
    async checkPermissions(A) { return { behavior: "allow", updatedInput: A } },
    async call(A, q) {
        if (q.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
        let K = await q.getAppState();
        return ey(K.toolPermissionContext.mode, "plan"), q.setAppState((Y) => ({
            ...Y,
            toolPermissionContext: {
                ...a2(Y.toolPermissionContext, {
                    type: "setMode",
                    mode: "plan",
                    destination: "session"
                }),
                prePlanMode: Y.toolPermissionContext.mode
            }
        })), {
            data: {
                message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
            }
        }
    },
    mapToolResultToToolResultBlockParam({ message: A }, q) {
        return {
            type: "tool_result",
            content: sO() ? `${A}\n\nDO NOT write or edit any files except the plan file.` : `${A}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
            tool_use_id: q
        }
    }
}

// READABLE (for understanding):
const EnterPlanModeTool = {
    name: "EnterPlanMode",
    maxResultSizeChars: 100000,

    async description() {
        return "Requests permission to enter plan mode for complex tasks requiring exploration and design";
    },

    async prompt() {
        return generatePlanModePrompt();  // jc4()
    },

    // Empty input schema - no parameters needed
    inputSchema: z.strictObject({}),

    outputSchema: z.object({
        message: z.string()
    }),

    userFacingName() {
        return "";  // Not shown in UI
    },

    isEnabled() { return true; },
    isConcurrencySafe() { return true; },
    isReadOnly() { return true; },

    async checkPermissions(input) {
        // Always allow entering plan mode
        return { behavior: "allow", updatedInput: input };
    },

    async call(input, toolUseContext) {
        // Plan mode not allowed for sub-agents
        if (toolUseContext.agentId) {
            throw Error("EnterPlanMode tool cannot be used in agent contexts");
        }

        let appState = await toolUseContext.getAppState();

        // Emit telemetry for mode transition
        emitModeTransition(appState.toolPermissionContext.mode, "plan");

        // Switch to plan mode
        toolUseContext.setAppState((state) => ({
            ...state,
            toolPermissionContext: {
                // Update permission context
                ...updatePermissionContext(state.toolPermissionContext, {
                    type: "setMode",
                    mode: "plan",
                    destination: "session"
                }),
                // Save current mode for restoration
                prePlanMode: state.toolPermissionContext.mode
            }
        }));

        return {
            data: {
                message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
            }
        };
    },

    mapToolResultToToolResultBlockParam({ message }, toolUseId) {
        let detailedInstructions = isStructuredPlanMode()
            ? `${message}\n\nDO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`
            : `${message}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`;

        return {
            type: "tool_result",
            content: detailedInstructions,
            tool_use_id: toolUseId
        };
    }
};

// Mapping: N_6→EnterPlanModeTool, jc4→generatePlanModePrompt, ey→emitModeTransition,
//          a2→updatePermissionContext, sO→isStructuredPlanMode
```

**Key insight:** Plan mode is enforced at the permission layer - the tool switches the `toolPermissionContext.mode` to "plan" which restricts write operations.

---

## 2. ExitPlanMode Tool

### ExitPlanModeTool (bW) - Exit and submit plan

**What it does:** Exits plan mode and submits the plan for user approval. The user reviews the plan before implementation begins.

**How it works:**
1. Reads the plan from the plan file
2. Validates plan exists and is complete
3. Restores previous permission mode
4. Presents plan for user approval
5. On approval, implementation begins

```javascript
// ============================================
// ExitPlanModeTool - Plan submission
// Location: chunks.88.mjs:76
// ============================================

// ORIGINAL (for source lookup):
bW = "ExitPlanMode"

// READABLE (for understanding):
const ExitPlanModeTool = {
    name: "ExitPlanMode",
    maxResultSizeChars: 100000,

    async description() {
        return "Exit plan mode and submit your plan for user approval";
    },

    async prompt() {
        return `Use this tool when you have finished writing your plan to the plan file and are ready for user approval.

## Important Notes

- Only use this tool when you're done planning and have written your plan
- Do NOT use this tool to ask "Is my plan ready?" or "Should I proceed?"
- The user will see the plan content from the plan file
- On approval, the previous permission mode is restored`;
    },

    inputSchema: z.strictObject({
        allowedPrompts: z.array(z.object({
            prompt: z.string().describe("Semantic description of the action"),
            tool: z.enum(["Bash"]).describe("The tool this prompt applies to")
        })).optional().describe("Prompt-based permissions needed to implement the plan")
    }),

    outputSchema: z.object({
        approved: z.boolean(),
        plan: z.string().optional()
    }),

    isEnabled() { return true; },
    isConcurrencySafe() { return true; },
    isReadOnly() { return true; },

    async checkPermissions(input) {
        // This tool triggers user interaction
        return { behavior: "allow", updatedInput: input };
    },

    requiresUserInteraction() {
        return true;  // Always requires user to approve
    },

    async call({ allowedPrompts }, toolUseContext) {
        let appState = await toolUseContext.getAppState();

        // Read plan from file
        let planContent = await readPlanFile();

        if (!planContent) {
            throw Error("No plan found. Write your plan to the plan file before exiting plan mode.");
        }

        // Restore previous permission mode
        let prePlanMode = appState.toolPermissionContext.prePlanMode || "default";

        toolUseContext.setAppState((state) => ({
            ...state,
            toolPermissionContext: {
                ...updatePermissionContext(state.toolPermissionContext, {
                    type: "setMode",
                    mode: prePlanMode,
                    destination: "session"
                }),
                prePlanMode: undefined,
                // Store allowed prompts for implementation phase
                pendingAllowedPrompts: allowedPrompts
            }
        }));

        return {
            data: {
                approved: true,  // Will be validated by user interaction
                plan: planContent
            }
        };
    }
};

// Mapping: bW→ExitPlanModeTool
```

**Why prompt-based permissions:** The `allowedPrompts` field allows the plan to specify what operations will be needed during implementation, enabling pre-approval of specific actions like "run tests" or "install dependencies".

---

## 3. AskUserQuestion Tool

### AskUserQuestionTool (TH) - Interactive user questions

**What it does:** Asks the user multiple-choice questions during execution to gather preferences, clarify ambiguity, or get decisions on implementation choices.

**How it works:**
1. Presents questions to user via permission UI
2. User selects answers (can choose "Other" for custom input)
3. Returns answers to the agent for processing

```javascript
// ============================================
// AskUserQuestionTool - User interaction
// Location: chunks.139.mjs:2904-2985
// ============================================

// ORIGINAL (for source lookup):
TH = "AskUserQuestion"

// Tool definition at chunks.139.mjs:2904-2985
{
    name: TH,  // "AskUserQuestion"
    maxResultSizeChars: 1e5,
    async description() { return Qp7 },
    async prompt() { return gp7 },
    get inputSchema() { return wCY() },
    get outputSchema() { return HCY() },
    userFacingName() { return "" },
    isEnabled() { return !0 },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !0 },
    requiresUserInteraction() { return !0 },
    async checkPermissions(A) {
        return { behavior: "ask", message: "Answer questions?", updatedInput: A }
    },
    renderToolUseMessage() { return null },
    renderToolUseProgressMessage() { return null },
    async call({ questions: A, answers: q = {} }, K) {
        return { data: { questions: A, answers: q } }
    },
    mapToolResultToToolResultBlockParam({ answers: A }, q) {
        return {
            type: "tool_result",
            content: `User has answered your questions: ${Object.entries(A).map(([Y,z])=>`"${Y}"="${z}"`).join(", ")}. You can now continue with the user's answers in mind.`,
            tool_use_id: q
        }
    }
}

// READABLE (for understanding):
const AskUserQuestionTool = {
    name: "AskUserQuestion",
    maxResultSizeChars: 100000,

    async description() {
        return "Asks the user multiple choice questions to gather information, clarify ambiguity, understand preferences, make decisions or offer them choices.";
    },

    async prompt() {
        return `Use this tool when you need to ask the user questions during execution. This allows you to:
1. Gather user preferences or requirements
2. Clarify ambiguous instructions
3. Get decisions on implementation choices as you work
4. Offer choices to the user about what direction to take.

Usage notes:
- Users will always be able to select "Other" to provide custom text input
- Use multiSelect: true to allow multiple answers to be selected for a question
- If you recommend a specific option, make that the first option in the list and add "(Recommended)" at the end of the label

Plan mode note: In plan mode, use this tool to clarify requirements or choose between approaches BEFORE finalizing your plan. Do NOT use this tool to ask "Is my plan ready?" or "Should I proceed?" - use ExitPlanMode for plan approval.`;
    },

    inputSchema: z.strictObject({
        questions: z.array(z.object({
            question: z.string().describe("The complete question to ask the user"),
            header: z.string().describe("Very short label displayed as a chip/tag (max 12 chars)"),
            multiSelect: z.boolean().default(false).describe("Allow multiple selections"),
            options: z.array(z.object({
                label: z.string().describe("Display text for this option"),
                description: z.string().describe("Explanation of what this option means"),
                markdown: z.string().optional().describe("Preview content for comparison")
            })).min(2).max(4)
        })).min(1).max(4),

        answers: z.record(z.string()).optional()  // Filled by permission UI
    }),

    outputSchema: z.object({
        questions: z.array(z.any()),
        answers: z.record(z.string())
    }),

    isEnabled() { return true; },
    isConcurrencySafe() { return true; },
    isReadOnly() { return true; },

    requiresUserInteraction() {
        return true;  // Triggers permission UI
    },

    async checkPermissions(input) {
        // This triggers the question UI
        return {
            behavior: "ask",
            message: "Answer questions?",
            updatedInput: input
        };
    },

    renderToolUseMessage() {
        return null;  // No tool use message shown
    },

    renderToolUseProgressMessage() {
        return null;  // No progress message shown
    },

    async call({ questions, answers = {} }, toolUseContext) {
        // Answers are filled by permission UI before call()
        return {
            data: {
                questions: questions,
                answers: answers
            }
        };
    },

    mapToolResultToToolResultBlockParam({ answers }, toolUseId) {
        let formattedAnswers = Object.entries(answers)
            .map(([question, answer]) => `"${question}"="${answer}"`)
            .join(", ");

        return {
            type: "tool_result",
            content: `User has answered your questions: ${formattedAnswers}. You can now continue with the user's answers in mind.`,
            tool_use_id: toolUseId
        };
    }
};

// Mapping: TH→AskUserQuestionTool, Qp7→ASK_QUESTION_DESCRIPTION, gp7→ASK_QUESTION_PROMPT,
//          wCY→askQuestionInputSchema, HCY→askQuestionOutputSchema
```

### Question Schema Details

```javascript
// ============================================
// Question Schema - Detailed structure
// ============================================

interface Question {
    question: string;       // Full question text ending with "?"

    header: string;         // Short label (max 12 chars) for chip display
                            // Examples: "Auth method", "Library", "Approach"

    multiSelect: boolean;   // Allow multiple selections

    options: Option[];      // 2-4 options, mutually exclusive unless multiSelect
}

interface Option {
    label: string;          // Display text (1-5 words)
                            // Add "(Recommended)" for recommended options

    description: string;    // Explanation of the option

    markdown?: string;      // Preview content for comparison
                            // Shows side-by-side preview in UI
}

// Example usage:
const questions = [
    {
        question: "Which authentication method should we use?",
        header: "Auth method",
        multiSelect: false,
        options: [
            {
                label: "JWT (Recommended)",
                description: "Stateless authentication with tokens. Good for APIs."
            },
            {
                label: "Session-based",
                description: "Server-side sessions. Good for traditional web apps."
            },
            {
                label: "OAuth",
                description: "Third-party authentication. Good for social login."
            }
        ]
    },
    {
        question: "Which features should we enable?",
        header: "Features",
        multiSelect: true,
        options: [
            {
                label: "Dark mode",
                description: "Add dark theme support"
            },
            {
                label: "Notifications",
                description: "Enable push notifications"
            }
        ]
    }
];
```

---

## 4. Complete Tool Reference

| Tool | Obfuscated | Purpose | Location |
|------|------------|---------|----------|
| EnterPlanMode | `N_6` | Enter planning mode | chunks.140.mjs:1650 |
| ExitPlanMode | `bW` | Exit and submit plan | chunks.88.mjs:76 |
| AskUserQuestion | `TH` | Ask user questions | chunks.139.mjs:2904 |

---

## 5. Key Properties

| Tool | Concurrency Safe | Read-Only | User Interaction |
|------|-----------------|-----------|------------------|
| EnterPlanMode | ✅ | ✅ | No |
| ExitPlanMode | ✅ | ✅ | Yes (approval) |
| AskUserQuestion | ✅ | ✅ | Yes (answers) |

---

## 6. Plan Mode Workflow

```
User Request (complex task)
         │
         ▼
    Agent analyzes task complexity
         │
         ├── Simple task → Proceed with implementation
         │
         └── Complex task → EnterPlanMode
                 │
                 ▼
         Permission mode switches to "plan"
                 │
                 ▼
         Read-only exploration phase
         │
         ├── Read files
         ├── Grep/Glob for patterns
         ├── AskUserQuestion for clarification
         └── Write plan to plan file
                 │
                 ▼
         ExitPlanMode
                 │
                 ├── Plan submitted for approval
                 │
                 ├── User approves → Implementation begins
                 │   └── Permission mode restored
                 │
                 └── User rejects → Back to planning
```

---

## 7. Permission Mode Transitions

```
Default Mode
     │
     ├── EnterPlanMode() ──────────► Plan Mode
     │                                    │
     │                                    ├── Read: ✅ Allowed
     │                                    ├── Write: ❌ Blocked
     │                                    ├── Edit: ❌ Blocked
     │                                    └── Bash: ❌ Blocked (unless readonly)
     │                                    │
     │                                    └── ExitPlanMode() ──► Back to Default
     │
     └── Alternative modes:
          ├── "acceptEdits" → Auto-approve Edit tool
          ├── "auto" → Auto-approve all tools
          └── "plan" → Read-only planning mode
```