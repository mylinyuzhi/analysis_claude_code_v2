# Plan Mode UI Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of plan mode UI components, interview phase rendering, approval workflow, and mode cycling interactions.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key functions in this document:
- `EnterPlanModeTool` (Ki6) - Enter plan mode - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit with approval - chunks.143.mjs:2802
- `QuestionForm` ($Wq) - Multi-question form - chunks.181.mjs
- `SingleQuestionComponent` (YWq) - Individual question - chunks.181.mjs
- `ReviewAnswersScreen` (wWq) - Answer review UI - chunks.181.mjs
- `KIq` - Interview question component - chunks.190.mjs

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PLAN MODE UI ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     Mode Entry (EnterPlanMode)                  │  │
│  │  ├─ Shift+Tab keybinding → cycleModeWithContext                │  │
│  │  ├─ /plan slash command                                        │  │
│  │  └─ EnterPlanMode tool (Ki6)                                   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   Planning Workflow UI                          │  │
│  │                                                                  │  │
│  │  Phase 1: Initial Understanding                                 │  │
│  │  ├─ Explore agents (via Agent tool)                            │  │
│  │  └─ Codebase exploration (Glob, Grep, Read)                    │  │
│  │                                                                  │  │
│  │  Phase 2: Design                                                │  │
│  │  ├─ Plan agents (via Agent tool)                               │  │
│  │  └─ AskUserQuestion for clarification                          │  │
│  │                                                                  │  │
│  │  Phase 3: Review                                                │  │
│  │  ├─ Interview questions (KIq)                                  │  │
│  │  └─ User feedback collection                                   │  │
│  │                                                                  │  │
│  │  Phase 4: Final Plan                                            │  │
│  │  ├─ Write to plan file                                         │  │
│  │  └─ Plan file preview                                          │  │
│  │                                                                  │  │
│  │  Phase 5: ExitPlanMode                                          │  │
│  │  ├─ Approval dialog                                            │  │
│  │  └─ Swarm approval (if teammate)                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     Mode Exit (ExitPlanMode)                     │  │
│  │  ├─ Approval dialog rendering                                  │  │
│  │  ├─ "Ready to code?" prompt                                    │  │
│  │  └─ ExitPlanMode tool (zD)                                     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Mode Indicator (Footer):                                            │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ ⏸ Plan Mode on (shift+tab)                                   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. Mode Entry UI

### EnterPlanModeTool Rendering

**What it does:**
Renders the entry into plan mode, showing a transition message and workflow instructions.

```javascript
// ============================================
// EnterPlanModeTool - UI rendering methods
// Location: chunks.144.mjs:1579-1659
// ============================================

// ORIGINAL (for source lookup):
Ki6 = {
    name: dt,  // "EnterPlanMode"
    // ... tool definition ...
    mapToolResultToToolResultBlockParam({ message: A }, q) {
        return {
            type: "tool_result",
            content: rO() ? `${A}

DO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.` : `${A}

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

    // Render tool result with mode instructions
    mapToolResultToToolResultBlockParam({ message }, toolUseId) {
        const isSparseMode = isSparsePlanReminder();

        if (isSparseMode) {
            return {
                type: "tool_result",
                content: `${message}

DO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`,
                tool_use_id: toolUseId
            };
        }

        return {
            type: "tool_result",
            content: `${message}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
            tool_use_id: toolUseId
        };
    }
};

// Mapping: Ki6→EnterPlanModeTool, dt→"EnterPlanMode", rO→isSparsePlanReminder
```

---

## 2. Interview Phase UI Components

### QuestionForm ($Wq) - Multi-Question Form

**What it does:**
Renders a multi-question form for iterative interview workflow. Displays questions one at a time with navigation.

```javascript
// ============================================
// QuestionForm - Multi-question interview form
// Location: chunks.181.mjs
// ============================================

// READABLE (for understanding):
function QuestionForm({ questions, onAnswer, onCancel, currentIndex, answers }) {
    const [localAnswer, setLocalAnswer] = useState("");

    const currentQuestion = questions[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === questions.length - 1;

    // Handle answer submission
    const handleSubmit = () => {
        if (localAnswer.trim()) {
            onAnswer(currentIndex, localAnswer.trim());
            if (!isLast) {
                setLocalAnswer(""); // Clear for next question
            }
        }
    };

    // Handle previous navigation
    const handlePrevious = () => {
        if (!isFirst) {
            // Move to previous question
        }
    };

    return (
        <Box flexDirection="column">
            {/* Progress indicator */}
            <Box>
                <Text dimColor>Question {currentIndex + 1} of {questions.length}</Text>
            </Box>

            {/* Question text */}
            <Box marginTop={1}>
                <Text bold>{currentQuestion.question}</Text>
            </Box>

            {/* Answer input */}
            <Box marginTop={1}>
                <TextInput
                    value={localAnswer}
                    onChange={setLocalAnswer}
                    placeholder="Type your answer..."
                    onSubmit={handleSubmit}
                />
            </Box>

            {/* Navigation */}
            <Box marginTop={1} flexDirection="row">
                {!isFirst && (
                    <Button onPress={handlePrevious}>Previous</Button>
                )}
                <Button onPress={handleSubmit}>
                    {isLast ? "Finish" : "Next"}
                </Button>
                <Button onPress={onCancel}>Cancel</Button>
            </Box>

            {/* Answered questions summary */}
            {answers.length > 0 && (
                <Box marginTop={1}>
                    <Text dimColor>Answered: {answers.length}/{questions.length}</Text>
                </Box>
            )}
        </Box>
    );
}

// Mapping: $Wq→QuestionForm
```

### SingleQuestionComponent (YWq)

**What it does:**
Renders a single question with header, input, and navigation controls.

```javascript
// ============================================
// SingleQuestionComponent - Individual question UI
// Location: chunks.181.mjs
// ============================================

// READABLE (for understanding):
function SingleQuestionComponent({
    question,
    header,
    onAnswer,
    onSkip,
    multiSelect = false,
    options = []
}) {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [textInput, setTextInput] = useState("");

    // Handle option selection
    const toggleOption = (option) => {
        if (multiSelect) {
            setSelectedOptions(prev =>
                prev.includes(option)
                    ? prev.filter(o => o !== option)
                    : [...prev, option]
            );
        } else {
            setSelectedOptions([option]);
        }
    };

    // Submit answer
    const submitAnswer = () => {
        if (options.length > 0) {
            onAnswer(multiSelect ? selectedOptions : selectedOptions[0]);
        } else {
            onAnswer(textInput);
        }
    };

    return (
        <Box flexDirection="column">
            {/* Header with label */}
            <Box>
                <Text color="cyan">{header}</Text>
            </Box>

            {/* Question */}
            <Box marginTop={1}>
                <Text bold>{question}</Text>
            </Box>

            {/* Options (if provided) */}
            {options.length > 0 && (
                <Box marginTop={1} flexDirection="column">
                    {options.map((option, idx) => (
                        <Box key={idx}>
                            <Text
                                color={selectedOptions.includes(option) ? "green" : undefined}
                            >
                                {selectedOptions.includes(option) ? "● " : "○ "}
                                {option}
                            </Text>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Text input (if no options) */}
            {options.length === 0 && (
                <Box marginTop={1}>
                    <TextInput
                        value={textInput}
                        onChange={setTextInput}
                        onSubmit={submitAnswer}
                    />
                </Box>
            )}

            {/* Actions */}
            <Box marginTop={1} flexDirection="row">
                <Button onPress={submitAnswer}>Submit</Button>
                {onSkip && <Button onPress={onSkip}>Skip</Button>}
            </Box>
        </Box>
    );
}

// Mapping: YWq→SingleQuestionComponent
```

### ReviewAnswersScreen (wWq)

**What it does:**
Shows a summary of all answered questions before finalizing the plan.

```javascript
// ============================================
// ReviewAnswersScreen - Answer review UI
// Location: chunks.181.mjs
// ============================================

// READABLE (for understanding):
function ReviewAnswersScreen({ questions, answers, onEdit, onConfirm, onCancel }) {
    return (
        <Box flexDirection="column">
            <Text bold>Review Your Answers</Text>
            <Text dimColor>─────────────────────</Text>

            {questions.map((q, idx) => (
                <Box key={idx} flexDirection="column" marginTop={1}>
                    <Text bold color="cyan">Q{idx + 1}: {q.question}</Text>
                    <Box marginLeft={2}>
                        <Text>{answers[idx] || <Text dimColor>(skipped)</Text>}</Text>
                    </Box>
                    <Button onPress={() => onEdit(idx)}>Edit</Button>
                </Box>
            ))}

            <Box marginTop={2} flexDirection="row">
                <Button onPress={onConfirm}>Continue with these answers</Button>
                <Button onPress={onCancel}>Cancel</Button>
            </Box>
        </Box>
    );
}

// Mapping: wWq→ReviewAnswersScreen
```

---

## 3. Interview Phase Main Component (KIq)

**What it does:**
Main orchestrator component for the interview phase in plan mode. Handles question navigation, answer collection, and workflow progression.

```javascript
// ============================================
// KIq - Interview question main component
// Location: chunks.190.mjs
// ============================================

// ORIGINAL (for source lookup):
function KIq(A) {
    let q = A6(27),
        {
            questions: K,
            onComplete: Y,
            onCancel: z
        } = A,
        [_, w] = V_.useState(0),
        [O, $] = V_.useState([]),
        H = K[_];
    // ... component logic
}

// READABLE (for understanding):
function InterviewPhaseComponent({ questions, onComplete, onCancel }) {
    const cache = useCache(27);

    // Current question index
    const [currentIndex, setCurrentIndex] = useState(0);

    // Collected answers
    const [answers, setAnswers] = useState([]);

    // Current question
    const currentQuestion = questions[currentIndex];

    // Total questions
    const totalQuestions = questions.length;

    // Progress percentage
    const progress = Math.round((currentIndex / totalQuestions) * 100);

    // Handle answer submission
    const handleAnswer = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = answer;
        setAnswers(newAnswers);

        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // All questions answered
            onComplete(newAnswers);
        }
    };

    // Handle skip
    const handleSkip = () => {
        handleAnswer(null); // null indicates skipped
    };

    // Handle back navigation
    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Tab state for multi-tab questions
    const [activeTab, setActiveTab] = useState("form");

    return (
        <Box flexDirection="column">
            {/* Header */}
            <Box flexDirection="row">
                <Text bold>Planning Interview</Text>
                <Text dimColor>  ({currentIndex + 1}/{totalQuestions})</Text>
            </Box>

            {/* Progress bar */}
            <Box>
                <ProgressBar percent={progress} />
            </Box>

            {/* Tab navigation (if applicable) */}
            {currentQuestion.tabs && (
                <Box flexDirection="row">
                    <Tab
                        active={activeTab === "form"}
                        onPress={() => setActiveTab("form")}
                    >Form</Tab>
                    <Tab
                        active={activeTab === "preview"}
                        onPress={() => setActiveTab("preview")}
                    >Preview</Tab>
                </Box>
            )}

            {/* Question content */}
            <SingleQuestionComponent
                question={currentQuestion.question}
                header={currentQuestion.header}
                options={currentQuestion.options}
                multiSelect={currentQuestion.multiSelect}
                onAnswer={handleAnswer}
                onSkip={handleSkip}
            />

            {/* Navigation */}
            <Box flexDirection="row" marginTop={1}>
                {currentIndex > 0 && (
                    <Button onPress={handleBack}>← Back</Button>
                )}
                <Button onPress={onCancel}>Cancel Interview</Button>
            </Box>
        </Box>
    );
}

// Mapping: KIq→InterviewPhaseComponent, A→props, A6→useCache, K→questions,
//          Y→onComplete, z→onCancel, _→currentIndex, w→setCurrentIndex,
//          O→answers, $→setAnswers, H→currentQuestion
```

---

## 4. Exit Plan Mode UI

### ExitPlanModeTool Approval Dialog

**What it does:**
Renders the approval dialog when exiting plan mode. Shows plan content preview and approval options.

```javascript
// ============================================
// ExitPlanModeTool - Approval dialog rendering
// Location: chunks.143.mjs:2802-3000+
// ============================================

// READABLE (for understanding):
function renderExitPlanModeApproval({ planContent, filePath, onApprove, onReject, onRefine }) {
    return (
        <Box flexDirection="column">
            {/* Header */}
            <Box>
                <Text bold color="yellow">Ready to implement?</Text>
            </Box>

            {/* Plan preview */}
            <Box marginTop={1} flexDirection="column">
                <Text dimColor>Plan file: {filePath}</Text>
                <Box marginTop={1}>
                    <Text>Plan preview:</Text>
                    <Box marginLeft={2}>
                        <Text dimColor>{planContent?.slice(0, 200)}...</Text>
                    </Box>
                </Box>
            </Box>

            {/* Options */}
            <Box marginTop={2} flexDirection="column">
                <Button onPress={onApprove}>
                    <Text color="green">✓ Yes, let's implement</Text>
                </Button>
                <Button onPress={onRefine}>
                    <Text color="yellow">↻ Let me refine the plan</Text>
                </Button>
                <Button onPress={onReject}>
                    <Text color="red">✗ Cancel</Text>
                </Button>
            </Box>
        </Box>
    );
}
```

### Swarm Approval Flow

**What it does:**
When a teammate agent exits plan mode, the approval request is sent to the team lead.

```javascript
// ============================================
// Swarm plan approval UI
// ============================================

// Team lead receives approval request
function renderPlanApprovalRequest({ from, planContent, onApprove, onReject, feedback }) {
    return (
        <Box flexDirection="column">
            <Box>
                <Text bold color="cyan">Plan Approval Request</Text>
                <Text dimColor>From: {from}</Text>
            </Box>

            {/* Plan content */}
            <Box marginTop={1}>
                <Text>{planContent}</Text>
            </Box>

            {/* Feedback input (if rejecting) */}
            <Box marginTop={1}>
                <TextInput
                    placeholder="Feedback (optional)..."
                    value={feedback}
                    onChange={setFeedback}
                />
            </Box>

            {/* Actions */}
            <Box marginTop={1} flexDirection="row">
                <Button onPress={onApprove}>
                    <Text color="green">Approve</Text>
                </Button>
                <Button onPress={() => onReject(feedback)}>
                    <Text color="red">Request Changes</Text>
                </Button>
            </Box>
        </Box>
    );
}

// Teammate sees waiting status
function renderAwaitingApproval({ planContent, requestId }) {
    return (
        <Box flexDirection="column">
            <Text>Waiting for team lead approval...</Text>
            <Text dimColor>Request ID: {requestId}</Text>
            <Box marginTop={1}>
                <Spinner />
                <Text>Check your inbox for the response</Text>
            </Box>
        </Box>
    );
}
```

---

## 5. Mode Cycling UI

### Shift+Tab Mode Cycling

**What it does:**
Cycles through available modes when user presses Shift+Tab.

```javascript
// ============================================
// cycleModeWithContext - Mode cycling handler
// Location: chunks.183.mjs
// ============================================

// ORIGINAL (for source lookup):
function FGq(A, q, K) {
    let Y = ["default", "plan", "acceptEdits"],
        z = Y.indexOf(q),
        _ = Y[(z + 1) % Y.length];
    K({
        type: "setMode",
        mode: _,
        destination: "session"
    }),
    d("tengu_mode_cycled", {
        fromMode: q,
        toMode: _,
        source: A
    })
}

// READABLE (for understanding):
function cycleModeWithContext(source, currentMode, setModeAction) {
    const modes = ["default", "plan", "acceptEdits"];
    const currentIndex = modes.indexOf(currentMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];

    setModeAction({
        type: "setMode",
        mode: nextMode,
        destination: "session"
    });

    emitTelemetry("tengu_mode_cycled", {
        fromMode: currentMode,
        toMode: nextMode,
        source: source
    });
}

// Mapping: FGq→cycleModeWithContext, A→source, q→currentMode, K→setModeAction
```

### Mode Indicator (Footer)

**What it does:**
Shows current mode in the footer status bar.

```javascript
// ============================================
// Mode indicator rendering in footer
// ============================================

function renderModeIndicator(mode) {
    const modeConfig = {
        default: {
            text: "",
            color: undefined
        },
        plan: {
            text: "⏸ Plan Mode on (shift+tab)",
            color: "yellow"
        },
        acceptEdits: {
            text: "✓ Auto-accept edits (shift+tab)",
            color: "green"
        }
    };

    const config = modeConfig[mode];

    if (!config.text) return null;

    return (
        <Text color={config.color}>{config.text}</Text>
    );
}
```

---

## 6. Tool Restrictions in Plan Mode

### Tool Filtering UI

When in plan mode, certain tools show a restricted indicator:

```javascript
// ============================================
// Tool restriction display
// ============================================

function renderToolInPlanMode(tool, input, planFilePath) {
    const isWriteEdit = tool.name === "Write" || tool.name === "Edit";
    const isPlanFile = input.file_path === planFilePath;

    if (isWriteEdit && !isPlanFile) {
        return (
            <Box>
                <Text color="red">✗ Cannot write outside plan file in plan mode</Text>
            </Box>
        );
    }

    if (!tool.isReadOnly?.() && !isWriteEdit) {
        return (
            <Box>
                <Text color="yellow">⚠ Tool not available in plan mode</Text>
            </Box>
        );
    }

    // Normal rendering for allowed tools
    return tool.renderToolUseMessage(input);
}
```

---

## 7. RejectedPlanViewer Component

**What it does:**
Shows when a plan was rejected, allowing the user to view what was proposed.

```javascript
// ============================================
// HX6 - RejectedPlanViewer component
// Location: chunks.107.mjs
// ============================================

// ORIGINAL (for source lookup):
function HX6(A) {
    let { planContent: q, onDismiss: K } = A;
    return XA.createElement(c8, null,
        XA.createElement(dE, { scheme: "warning" }, "Plan Rejected"),
        XA.createElement(I, { marginTop: 1 }, q),
        XA.createElement(HA, null,
            XA.createElement($A, { onPress: K }, "Dismiss")
        )
    )
}

// READABLE (for understanding):
function RejectedPlanViewer({ planContent, onDismiss }) {
    return (
        <Box flexDirection="column">
            <Icon scheme="warning">Plan Rejected</Icon>
            <Box marginTop={1}>
                <Text>{planContent}</Text>
            </Box>
            <Box marginTop={1}>
                <Button onPress={onDismiss}>Dismiss</Button>
            </Box>
        </Box>
    );
}

// Mapping: HX6→RejectedPlanViewer, c8→Container, dE→Icon, I→Box, HA→ButtonContainer, $A→Button
```

---

## 8. Plan File Format UI

### Plan File Preview

```javascript
// ============================================
// Plan file preview rendering
// ============================================

function renderPlanFilePreview(planContent, planFilePath) {
    return (
        <Box flexDirection="column">
            <Box>
                <Text bold>Plan: </Text>
                <Text dimColor>{planFilePath}</Text>
            </Box>

            <Box marginTop={1}>
                <MarkdownRenderer content={planContent} />
            </Box>
        </Box>
    );
}
```

### Plan File Location

```javascript
// Plan file path resolution
function getPlanFilePath(agentId) {
    const baseDir = process.env.CLAUDE_API_PLANS_DIR || path.join(os.homedir(), ".claude_api", "plans");
    const slug = generateSlugFromTask(taskDescription);

    return path.join(baseDir, `${slug}.md`);
}
```

---

## Cross-Module Integration

### Plan Mode ↔ System Reminder (04)

- `plan_mode` attachment injected each turn
- `plan_mode_exit` attachment on exit
- Turn counting for sparse reminder timing

### Plan Mode ↔ Tools (05)

- Tool filtering via `isReadOnly()` check
- Write/Edit path restriction to plan file
- ExitPlanMode as only programmatic exit

### Plan Mode ↔ UI (02)

- Mode indicator in footer
- Interview components in modal layer
- Approval dialogs via modal priority

---

## Quick Reference

### UI Component Symbols

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| Ki6 | EnterPlanModeTool | Mode entry tool |
| zD | ExitPlanModeTool | Mode exit tool |
| $Wq | QuestionForm | Multi-question form |
| YWq | SingleQuestionComponent | Individual question |
| wWq | ReviewAnswersScreen | Answer review |
| KIq | InterviewPhaseComponent | Main interview orchestrator |
| HX6 | RejectedPlanViewer | Rejected plan display |
| FGq | cycleModeWithContext | Mode cycling handler |
| Dp | handlePlanModeTransition | Mode transition hook |

### Mode Configuration

```javascript
const MODE_CONFIG = {
    default: {
        displayName: "",
        statusText: "",
        allowsWrite: true
    },
    plan: {
        displayName: "Plan Mode",
        statusText: "⏸ Plan Mode on (shift+tab)",
        allowsWrite: false,  // except plan file
        allowedTools: ["Read", "Grep", "Glob", "Write", "Edit", "ExitPlanMode", "AskUserQuestion"]
    },
    acceptEdits: {
        displayName: "Auto-accept",
        statusText: "✓ Auto-accept edits (shift+tab)",
        allowsWrite: true,
        autoApproveEdits: true
    }
};
```

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Interview phase enhancements, tab navigation |
| 2.1.72 | /plan command with description argument |
| 2.1.32 | Swarm teammate plan approval |
| 2.1.18 | Shift+Tab mode cycling |