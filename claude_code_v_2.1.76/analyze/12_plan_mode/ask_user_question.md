# AskUserQuestion — Complete Reverse Engineering Analysis (Claude Code 2.1.38)

> Deep analysis of the AskUserQuestion tool: schema, call flow, multi-round interactions, UI components,
> elicitation queue mechanics, and plan mode integration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Plan Mode section
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key symbols in this document:
- `dW1` (chunks.139.mjs:2903) - AskUserQuestion tool object
- `TH` (chunks.89.mjs:566) - constant "AskUserQuestion"
- `Qp7` (chunks.89.mjs:570) - short description
- `gp7` (chunks.89.mjs:572) - full prompt text
- `zCY` (chunks.139.mjs:2875) - option schema (label, description)
- `Xd4` (chunks.139.mjs:2878) - question schema (question, header, options, multiSelect)
- `wCY` (chunks.139.mjs:2883) - input schema with refine validation
- `HCY` (chunks.139.mjs:2902) - output schema
- `$CY` (chunks.139.mjs:2825) - answer display card (result renderer)
- `$Wq` (chunks.181.mjs:1882) - outer question form (permission dialog entry point)
- `YWq` (chunks.181.mjs:1495) - single question component
- `wWq` (chunks.181.mjs:1768) - review answers screen
- `WDz` (chunks.181.mjs:1754) - option→UI format transformer
- `PDz` (chunks.181.mjs:1750) - isNotOther filter
- `f11` (chunks.188.mjs:304) - dialog priority arbiter
- `E1` (chunks.188.mjs) - elicitation queue state
- `RV6` (chunks.156.mjs:1540) - MCP elicitation request handler
- `ezz` (chunks.173.mjs:618) - buildPlanModeInterviewReminder (iterative loop)
- `A2z` (chunks.173.mjs:667) - buildPlanModeSparseReminder (turn-end hint)
- `q2z` (chunks.173.mjs:685) - buildPlanModeSubagentReminder

---

## 1. Tool Overview

**What it does:** AskUserQuestion is a special tool that pauses LLM execution and surfaces a structured, interactive multi-choice dialog to the user in the TUI. Unlike plain text output, this creates a real blocking UI element that forces the user to pick from predefined options (with an "Other" free-text escape hatch).

**Why it exists:**
- In plan mode, the LLM must not guess at requirements — it must ask the user
- Plain text questions have no forced answer mechanism; AskUserQuestion blocks the LLM until the user responds
- The structured format (options with labels + descriptions) ensures the LLM gets well-formed, parseable answers
- Multiple questions per call reduces round-trips for related decision points

**Key properties:**
```
name:                    "AskUserQuestion"
requiresUserInteraction: true   ← blocks until user responds
isConcurrencySafe:       true   ← safe to call alongside other tools
isReadOnly:              true   ← does not write files
maxResultSizeChars:      100000
userFacingName():        ""     ← hidden from tool-use header (no "AskUserQuestion" label shown)
```

---

## 2. Schema Architecture

### Option Schema (`zCY`, chunks.139.mjs:2875)

```javascript
// ============================================
// zCY - Option Schema (each choice in a question)
// Location: chunks.139.mjs:2875
// ============================================

// ORIGINAL (for source lookup):
zCY = u.object({
    label: u.string().describe("The display text for this option..."),
    description: u.string().describe("Explanation of what this option means...")
})

// READABLE (for understanding):
const optionSchema = zod.object({
    label: zod.string(),        // "OAuth 2.0" — shown in selection list
    description: zod.string()   // "Industry standard..." — shown under label as context
})

// Mapping: zCY→optionSchema, u→zod
```

**Important:** There is NO `annotations` field and NO `markdown` preview field in the option schema. Despite what the tool's system prompt says about "previews" (`chunks.177.mjs`), the actual schema only has `label` + `description`.

### Question Schema (`Xd4`, chunks.139.mjs:2878)

```javascript
// ============================================
// Xd4 - Question Schema (one question with options)
// Location: chunks.139.mjs:2878
// ============================================

// ORIGINAL (for source lookup):
Xd4 = u.object({
    question: u.string().describe('...end with a question mark...'),
    header: u.string().describe(`Very short label displayed as a chip/tag (max ${Fp7} chars)...`),
    options: u.array(zCY).min(2).max(4).describe("...2-4 options...no 'Other' option, that will be provided automatically."),
    multiSelect: u.boolean().default(!1).describe("Set to true to allow multiple answers...")
})

// READABLE (for understanding):
const questionSchema = zod.object({
    question: zod.string(),       // "Which auth method should we use?"
    header: zod.string(),         // "Auth method"  ← max 12 chars (Fp7=12)
    options: zod.array(optionSchema).min(2).max(4),
    multiSelect: zod.boolean().default(false)
})

// Mapping: Xd4→questionSchema, Fp7→maxHeaderLength (=12)
```

### Input Schema (`wCY`, chunks.139.mjs:2883)

```javascript
// ============================================
// wCY - Input Schema with Validation
// Location: chunks.139.mjs:2883
// ============================================

// ORIGINAL (for source lookup):
wCY = z7(() => u.strictObject({
    questions: u.array(Xd4).min(1).max(4).describe("Questions to ask the user (1-4 questions)"),
    answers: u.record(u.string(), u.string()).optional().describe("User answers collected by the permission component"),
    metadata: u.object({
        source: u.string().optional().describe('Optional identifier...e.g., "remember"...')
    }).optional().describe("Optional metadata for tracking and analytics purposes. Not displayed to user.")
}).refine((A) => {
    let q = A.questions.map((K) => K.question);
    if (q.length !== new Set(q).size) return !1;   // ← unique question texts
    for (let K of A.questions) {
        let Y = K.options.map((z) => z.label);
        if (Y.length !== new Set(Y).size) return !1  // ← unique labels within each question
    }
    return !0
}, {
    message: "Question texts must be unique, option labels must be unique within each question"
}))

// READABLE (for understanding):
const inputSchema = zodLazy(() => zod.strictObject({
    questions: zod.array(questionSchema).min(1).max(4),
    answers: zod.record(zod.string(), zod.string()).optional(),  // populated by UI, not LLM
    metadata: zod.object({
        source: zod.string().optional()  // e.g. "remember" for /remember skill
    }).optional()
}).refine((input) => {
    // Validation 1: all question texts must be unique
    const questionTexts = input.questions.map(q => q.question);
    if (questionTexts.length !== new Set(questionTexts).size) return false;
    // Validation 2: option labels must be unique within each question
    for (const q of input.questions) {
        const labels = q.options.map(o => o.label);
        if (labels.length !== new Set(labels).size) return false;
    }
    return true;
}))

// Mapping: wCY→inputSchema, z7→zodLazy, u→zod
```

**Key constraint summary:**
| Constraint | Value |
|-----------|-------|
| Questions per call | 1 – 4 |
| Options per question | 2 – 4 |
| Header max length | 12 chars |
| Question texts | Must be unique within call |
| Option labels | Must be unique within each question |

### Output Schema (`HCY`, chunks.139.mjs:2902)

```javascript
// ============================================
// HCY - Output Schema
// Location: chunks.139.mjs:2902
// ============================================

// ORIGINAL (for source lookup):
HCY = z7(() => u.object({
    questions: u.array(Xd4).describe("The questions that were asked"),
    answers: u.record(u.string(), u.string()).describe("The answers provided by the user (question text -> answer string; multi-select answers are comma-separated)")
}))

// READABLE (for understanding):
const outputSchema = zodLazy(() => zod.object({
    questions: zod.array(questionSchema),
    answers: zod.record(zod.string(), zod.string())
    // key = question.question text (full text)
    // value = selected label (or comma-separated labels for multiSelect)
    // Example: { "Which auth method?": "OAuth 2.0", "Which features?": "JWT, Refresh" }
}))
```

---

## 3. Tool Lifecycle: checkPermissions → call → mapToolResult

### Phase 1: LLM Calls the Tool

The LLM issues a `tool_use` block:
```json
{
  "type": "tool_use",
  "name": "AskUserQuestion",
  "input": {
    "questions": [
      {
        "question": "Which authentication method should we use?",
        "header": "Auth method",
        "options": [
          { "label": "OAuth 2.0", "description": "Industry standard, supports SSO" },
          { "label": "JWT only", "description": "Simpler, no external dependency" }
        ],
        "multiSelect": false
      }
    ]
  }
}
```

### Phase 2: checkPermissions — Always Asks

```javascript
// ============================================
// dW1.checkPermissions - Always requires user input
// Location: chunks.139.mjs:2933
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions(A) {
    return {
        behavior: "ask",
        message: "Answer questions?",
        updatedInput: A
    }
}

// READABLE (for understanding):
async function checkPermissions(input) {
    // Unlike most tools, this ALWAYS asks
    // The "ask" behavior surfaces the tool to the UI before execution
    return {
        behavior: "ask",
        message: "Answer questions?",
        updatedInput: input
    };
}
```

**Why always "ask"?** The entire purpose of AskUserQuestion is human input — there is no scenario where it should auto-approve. The `behavior: "ask"` triggers the permission dialog system, which renders the `$Wq` component instead of a simple yes/no dialog.

### Phase 3: UI Renders Question Dialog

The permission system renders `$Wq` (outer form) with `YWq` (per-question component). The user navigates questions, selects answers, and submits. See Section 4 for UI details.

The UI writes the user's answers back into the tool input's `answers` field:
```json
{
  "questions": [...],
  "answers": {
    "Which authentication method should we use?": "OAuth 2.0"
  }
}
```

### Phase 4: call() — Trivially Passes Through

```javascript
// ============================================
// dW1.call - Pass-through implementation
// Location: chunks.139.mjs:2964
// ============================================

// ORIGINAL (for source lookup):
async call({
    questions: A,
    answers: q = {}
}, K) {
    return {
        data: {
            questions: A,
            answers: q
        }
    }
}

// READABLE (for understanding):
async function call({ questions, answers = {} }, toolUseContext) {
    // No logic here - answers were already collected by the UI
    // Just pass questions and answers through to the result
    return {
        data: { questions, answers }
    };
}
```

**Key insight:** All the "work" happens in the UI permission component (`$Wq`). By the time `call()` runs, the answers are already in the input. The `call()` method is essentially a no-op data pass-through.

### Phase 5: mapToolResultToToolResultBlockParam — LLM Feedback

```javascript
// ============================================
// dW1.mapToolResultToToolResultBlockParam - Format for LLM
// Location: chunks.139.mjs:2975
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam({
    answers: A
}, q) {
    return {
        type: "tool_result",
        content: `User has answered your questions: ${Object.entries(A).map(([Y,z])=>`"${Y}"="${z}"`).join(", ")}. You can now continue with the user's answers in mind.`,
        tool_use_id: q
    }
}

// READABLE (for understanding):
function mapToolResultToToolResultBlockParam({ answers }, toolUseId) {
    const answerPairs = Object.entries(answers)
        .map(([question, answer]) => `"${question}"="${answer}"`)
        .join(", ");
    return {
        type: "tool_result",
        content: `User has answered your questions: ${answerPairs}. You can now continue with the user's answers in mind.`,
        tool_use_id: toolUseId
    };
}
```

**Example LLM receives:**
```
User has answered your questions: "Which authentication method should we use?"="OAuth 2.0", "Which features should we include?"="JWT, Refresh tokens". You can now continue with the user's answers in mind.
```

### Phase 6: renderToolResultMessage — Result Card

```javascript
// ============================================
// $CY - Answer display card
// Location: chunks.139.mjs:2825
// ============================================

// ORIGINAL (for source lookup):
function $CY(A) {
    let { answers: K } = A;
    // Header: "✓ User answered Claude's questions:"
    // Per-pair: "· question → answer"
}

function OCY(A) {
    let [q, K] = A;
    return aO.createElement(V, {
        key: q, color: "inactive"
    }, "· ", q, " → ", K)
}

// READABLE (for understanding):
function AnswerDisplayCard({ answers }) {
    return (
        <Box flexDirection="column" marginTop={1}>
            <Box flexDirection="row">
                <Text color={defaultThemeColor}>✓ </Text>
                <Text>User answered Claude's questions:</Text>
            </Box>
            <Details>
                <Box flexDirection="column">
                    {Object.entries(answers).map(([question, answer]) => (
                        <Text key={question} color="inactive">
                            · {question} → {answer}
                        </Text>
                    ))}
                </Box>
            </Details>
        </Box>
    );
}

// Mapping: $CY→AnswerDisplayCard, OCY→answerLine renderer
```

**Terminal output:**
```
✓ User answered Claude's questions:
  · Which authentication method should we use? → OAuth 2.0
  · Which features should we include? → JWT, Refresh tokens
```

### Phase 7: renderToolUseRejectedMessage — Cancelled Dialog

```javascript
// ORIGINAL (for source lookup):
renderToolUseRejectedMessage() {
    return aO.createElement(I, {
        flexDirection: "row",
        marginTop: 1
    }, aO.createElement(V, {
        color: cP("default")
    }, gY, " "), aO.createElement(V, null, "User declined to answer questions"))
}
```

**Terminal output:**
```
✓ User declined to answer questions
```

### Phase 8: onReject Special Cases — Interview Phase Callbacks

When in plan mode with `isPlanModeInterviewPhase()=true`, the `toolUseConfirm.onReject(message, images)` path is used for TWO special callbacks that are **not** simple cancellations:

**A. "Chat about this" (`onRespondToClaude`):**

Injects a clarification request into the conversation, telling the LLM to ask what the user wants to clarify:
```
"The user wants to clarify these questions.
This means they may have additional information, context or questions for you.
Take their response into account and then reformulate the questions if appropriate.
Start by asking them what they would like to clarify.

Questions asked:
- "Which auth library?"
  Answer: passport.js
- "Social login needed?"
  (No answer provided)"
```

**B. "Skip interview and plan immediately" (`onFinishPlanInterview`):**

Tells the LLM to stop asking questions and complete the plan with current information:
```
"The user has indicated they have provided enough answers for the plan interview.
Stop asking clarifying questions and proceed to finish the plan with the information you have.

Questions asked and answers provided:
- "Which auth library?"
  Answer: passport.js
- "Social login needed?"
  (No answer provided)"
```

Both paths call `K.onReject(injectionMessage, images)` which:
1. Renders `renderToolUseRejectedMessage()` → "✓ User declined to answer questions"
2. Injects the `injectionMessage` as a **user message** in the API conversation
3. Attaches any `images` (pasted into "Other" field) to that user message

> Deep analysis: [interview_phase.md](./interview_phase.md) — complete callback mechanics, image support, and flow diagrams

---

## 4. UI Component Architecture

### 4.1 Elicitation Queue — System-Level Integration

AskUserQuestion renders inside the **elicitation queue** system, not the standard permission dialog.

**Queue state** (`chunks.156.mjs:1540`):
```javascript
// ============================================
// RV6 - Elicitation request handler (MCP layer)
// Location: chunks.156.mjs:1540
// ============================================

// ORIGINAL (for source lookup):
K((_) => ({
    ..._,
    elicitation: {
        queue: [..._.elicitation.queue, {
            serverName: q,
            params: Y.params,
            signal: z.signal,
            respond: (J) => {
                z.signal.removeEventListener("abort", O), c("tengu_mcp_elicitation_response", {
                    mode: w,
                    action: J.action
                }), $(J)
            }
        }]
    }
}))

// READABLE (for understanding):
updateState(state => ({
    ...state,
    elicitation: {
        queue: [...state.elicitation.queue, {
            serverName: mcpServerName,
            params: request.params,
            signal: abortController.signal,
            respond: (response) => {
                abortController.signal.removeEventListener("abort", onAbort);
                trackTelemetry("tengu_mcp_elicitation_response", { mode, action: response.action });
                resolvePromise(response);
            }
        }]
    }
}));
```

**Queue item fields:**
| Field | Type | Description |
|-------|------|-------------|
| `serverName` | string | MCP server name (or internal for built-in tools) |
| `params` | object | Full request parameters including schema |
| `signal` | AbortSignal | Allows cancellation from the server side |
| `respond` | function | Call with `{ action, content }` to unblock the server |

**Dialog priority arbiter** (`f11`, chunks.188.mjs:304):
```javascript
// ============================================
// f11 - Dialog priority arbiter
// Location: chunks.188.mjs:304
// ============================================

// ORIGINAL (for source lookup):
function f11() {
    if (s_ || fz) return;
    if (o_) return "message-selector";
    if (W$) return;
    if (oq[0]) return "sandbox-permission";
    let k6 = !vK || vK.shouldContinueAnimation;
    if (k6 && F7[0]) return "tool-permission";
    if (k6 && Z1.queue[0]) return "worker-sandbox-permission";
    if (k6 && E1.queue[0]) return "elicitation";  // ← AskUserQuestion lives here
    if (k6 && Yx) return "cost";
    if (k6 && k1) return "ide-onboarding";
    if (k6 && w6) return "lsp-recommendation";
    return
}

// READABLE (for understanding):
function detectActiveDialog() {
    if (isMinimized || isHidden) return undefined;
    if (isRewindSelectorOpen) return "message-selector";
    if (isLoading) return undefined;
    if (sandboxPermissionQueue[0]) return "sandbox-permission";
    const animationAllowed = !reducedMotion || reducedMotion.shouldContinueAnimation;
    if (animationAllowed && toolPermissionQueue[0]) return "tool-permission";
    if (animationAllowed && workerSandboxQueue.queue[0]) return "worker-sandbox-permission";
    if (animationAllowed && elicitationQueue.queue[0]) return "elicitation";  // ← priority 6
    if (animationAllowed && showCostWarning) return "cost";
    if (animationAllowed && isOnboarding) return "ide-onboarding";
    if (animationAllowed && showLspRec) return "lsp-recommendation";
    return undefined;
}
```

**Priority chain (highest to lowest):**
```
1. minimized/hidden → no dialog
2. message-selector (rewind)
3. loading state → no dialog
4. sandbox-permission
5. tool-permission (regular permission prompts)
6. worker-sandbox-permission
7. ELICITATION (← AskUserQuestion appears here)
8. cost warning
9. ide-onboarding
10. lsp-recommendation
```

**Key insight:** AskUserQuestion is shown AFTER all permission dialogs but BEFORE cost warnings. This means if there's a pending tool permission AND a pending AskUserQuestion, the tool permission is resolved first.

### 4.2 Dialog Rendering in REPL (`chunks.188.mjs:1247`)

```javascript
// ============================================
// Dialog renderer - elicitation branch
// Location: chunks.188.mjs:1247
// ============================================

// ORIGINAL (for source lookup):
XO === "elicitation" && V7.createElement(WWq, {
    event: E1.queue[0],
    onResponse: (k6, q8) => {
        let FA = E1.queue[0];
        if (FA) A1((Yq) => ({
            ...Yq,
            elicitation: {
                queue: Yq.elicitation.queue.slice(1)  // ← remove current item
            }
        })), FA.respond({
            action: k6,
            content: q8
        })
    }
})

// READABLE (for understanding):
activeDialog === "elicitation" && React.createElement(ElicitationDialog, {
    event: elicitationQueue.queue[0],            // current pending request
    onResponse: (action, content) => {
        const currentEvent = elicitationQueue.queue[0];
        if (currentEvent) {
            updateAppState(state => ({
                ...state,
                elicitation: {
                    queue: state.elicitation.queue.slice(1)  // dequeue
                }
            }));
            currentEvent.respond({ action, content });  // unblock MCP/tool
        }
    }
});
```

### 4.3 Outer Question Form (`$Wq`, chunks.181.mjs:1882)

This is the "permission component" that gets rendered by the standard permission dialog framework. It receives the `toolUseConfirm` object and extracts questions/metadata:

```javascript
// ============================================
// $Wq - Outer question form component
// Location: chunks.181.mjs:1882
// ============================================

// ORIGINAL (for source lookup):
function $Wq(A) {
    let q = e(89),
        { toolUseConfirm: K, onDone: Y, onReject: z } = A,
        w = dW1.inputSchema.safeParse(K.input),    // validate input
        H = w.success ? w.data.questions || [] : [], // extract questions
        $ = w.success ? w.data.metadata?.source : void 0, // metadata.source
        ...
        Z = v6(VDz) === "plan",   // isPlanMode
        N = Z ? uW() : void 0,   // plan file path (if in plan mode)
        { currentQuestionIndex: y, answers: B, ... } = k  // useQuestionNav() hook
```

**Plan mode detection:** The outer form checks `toolPermissionContext.mode === "plan"` and if true, retrieves the plan file path via `uW()` (`getPlanFilePath`). This is passed down to enable the "Skip interview" option in plan mode (`$Wq → YWq → "Skip interview and plan immediately"`).

**Image paste support:** The form supports pasting images into the "Other" text field (via `onImagePaste`/`pastedContents`/`onRemoveImage` props). Pasted images are shown as inline previews and sent alongside text.

### 4.4 Single Question Component (`YWq`, chunks.181.mjs:1495)

Renders a single question at a time with its options list.

**Props:**
```typescript
{
    question: QuestionSchema,         // current question object
    questions: QuestionSchema[],      // all questions (for navigation tabs)
    currentQuestionIndex: number,
    answers: Record<string, string>,  // current answer state
    questionStates: Record<...>,      // UI state per question
    hideSubmitTab: boolean,
    planFilePath?: string,            // if in plan mode
    onUpdateQuestionState: Function,
    onAnswer: Function,               // called when user selects an option
    onTextInputFocus: Function,       // called when "Other" text field focused
    onCancel: Function,
    onSubmit: Function,               // called to advance to next question
    onRespondToClaude: Function,      // called to submit all answers to the LLM
    onFinishPlanInterview: Function,  // "Skip interview" callback (plan mode only)
    onImagePaste, pastedContents, onRemoveImage  // image support
}
```

**Rendering (single vs multi-select):**

```javascript
// READABLE (for understanding):
const renderedSelector = question.multiSelect
    ? React.createElement(MultiSelectComponent, {   // A_4
        key: question.question,
        options: allOptionsWithOther,
        defaultValue: userAnswers[question.question]?.selectedValue,
        onChange: (selectedValues) => {
            updateUIState(questionKey, { selectedValue: selectedValues }, true);
            // Filter "Other" out, add text input value if selected
            const otherText = selectedValues.includes("__other__")
                ? userAnswers[questionKey]?.textInputValue : undefined;
            const finalAnswers = selectedValues.filter(isNotOther)
                .concat(otherText ? [otherText] : []);
            updateAnswer(questionKey, finalAnswers, undefined, false);
        },
        submitButtonText: isLastQuestion ? "Submit" : "Next",
        onSubmit: advanceToNextQuestion,
        ...
    })
    : React.createElement(SingleSelectComponent, {  // kA
        key: question.question,
        options: allOptionsWithOther,
        defaultValue: userAnswers[question.question]?.selectedValue,
        onChange: (selectedValue) => {
            updateUIState(questionKey, { selectedValue: selectedValue }, false);
            const otherText = selectedValue === "__other__"
                ? userAnswers[questionKey]?.textInputValue : undefined;
            updateAnswer(questionKey, selectedValue, otherText);  // ← auto-advance on selection
        },
        layout: "compact-vertical",
        ...
    });
```

**Key behavioral difference:**
- **Single-select** (`multiSelect: false`): Selecting an option immediately advances to the next question (no separate submit step)
- **Multi-select** (`multiSelect: true`): User selects multiple options, then explicitly presses "Submit" or "Next"

### 4.5 "Other" Option — Auto-Injection

The "Other" free-text option is **not in the schema** — it's always auto-injected by the UI:

```javascript
// ============================================
// Other option construction
// Location: chunks.181.mjs:1643-1658
// ============================================

let otherOption = {
    type: "input",
    value: "__other__",
    label: "Other",
    placeholder: question.multiSelect ? "Type something" : "Type something.",
    initialValue: userAnswers[questionKey]?.textInputValue ?? "",
    onChange: (newText) => updateUIState(questionKey, { textInputValue: newText }, question.multiSelect ?? false)
};

// All options = defined options + Other
const allOptions = [...question.options.map(transformToUIFormat), otherOption];
```

**Behavior:**
- Selecting "Other" shows a text input inline
- In single-select: the text must be non-empty to advance (otherwise user stays on "Other")
- In multi-select: can select "Other" alongside regular options; text is appended to answer list
- `PDz(value)` = `value !== "__other__"` — used to filter the sentinel from final answer arrays

**Answer format for "Other":**
- Single-select: answer = the typed text (replaces `"__other__"` with text)
- Multi-select: answer = `"Option1, Option2, typed text"` (comma-joined)

### 4.6 Question Navigation Tabs

When multiple questions are present, a horizontal tab bar shows progress:

```javascript
// READABLE (for understanding):
const navigationTabs = questions.map((q, index) => {
    const isCurrentQuestion = index === currentQuestionIndex;
    const checkmark = hasAnswer(q.question) ? checkboxOn : checkboxOff;
    const headerText = truncatedHeaders[index] || q.header || `Q${index + 1}`;

    return createElement(Box, { key: q.question || `question-${index}` },
        isCurrentQuestion
            ? createElement(Text, { backgroundColor: "permission", color: "inverseText" },
                " ", checkmark, " ", headerText, " ")  // ← highlighted current question
            : createElement(Text, null,
                " ", checkmark, " ", headerText, " ")  // ← dimmed other questions
    );
});
```

**Visual output for 3 questions, 2nd active:**
```
← ☐ Auth method  [✓ Library]  ☐ Approach  ✓ Submit →
```
- `←` / `→` navigation arrows (hidden for single question)
- Checkboxes: `☑` (answered) or `☐` (not yet)
- Current question highlighted with `permission` background color
- `Submit` tab is the final item

**Tab navigation:**
- `Tab` / `→` / `Ctrl+N` → next question
- `Shift+Tab` / `←` / `Ctrl+P` → previous question
- `Enter` on a question tab → jump to that question

### 4.7 "Skip Interview" Option (Plan Mode Only)

When in plan mode (`mode === "plan"`), an extra option appears at the bottom of the question list:

```javascript
// ORIGINAL (for source lookup):
G1 = N && tY.default.createElement(I, {
    flexDirection: "row", gap: 1
}, T && y === 1 ? tY.default.createElement(V, {
    color: "suggestion"
}, l1.pointer) : tY.default.createElement(V, null, " "),
tY.default.createElement(V, {
    color: T && y === 1 ? "suggestion" : void 0
}, t.length + 2, ". Skip interview and plan immediately"))

// READABLE (for understanding):
const skipInterviewOption = isPlanMode && createElement(Box, { flexDirection: "row", gap: 1 },
    isSelected
        ? createElement(Text, { color: "suggestion" }, "▶")  // pointer
        : createElement(Text, null, " "),
    createElement(Text, { color: isSelected ? "suggestion" : undefined },
        questionCount + 2, ". Skip interview and plan immediately"
    )
);
```

This allows the user to bypass the AskUserQuestion dialog entirely and let Claude proceed to create the plan without the interview phase. When selected, it calls `onFinishPlanInterview()`.

### 4.8 Review Screen (`wWq`, chunks.181.mjs:1768)

After all questions are answered, a review screen summarizes all Q&A pairs before final submission:

```javascript
// ============================================
// wWq - Review answers screen
// Location: chunks.181.mjs:1768
// ============================================

// READABLE (for understanding):
function ReviewAnswersScreen({ questions, currentQuestionIndex, answers, allQuestionsAnswered, permissionResult, onFinalResponse }) {
    return (
        <Box flexDirection="column" marginTop={1}>
            <Divider dividerColor="inactive" />
            <QuestionProgressIndicator questions={questions} currentIndex={currentQuestionIndex} answers={answers} />
            <SectionHeader title="Review your answers" color="text" />

            {!allQuestionsAnswered && (
                <Box marginBottom={1}>
                    <Text color="warning">⚠ You have not answered all questions</Text>
                </Box>
            )}

            {Object.keys(answers).length > 0 && (
                <Box flexDirection="column" marginBottom={1}>
                    {questions.filter(q => q?.question && answers[q.question]).map(q => (
                        <Box key={q.question} flexDirection="column" marginLeft={1}>
                            <Text>• {q.question}</Text>
                            <Box marginLeft={2}>
                                <Text color="success">→ {answers[q.question]}</Text>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            <PermissionBar permissionResult={permissionResult} toolType="tool" />

            <Text color="inactive">Ready to submit your answers?</Text>
            <Box marginTop={1}>
                <SingleSelect
                    options={[
                        { type: "text", label: "Submit answers", value: "submit" },
                        { type: "text", label: "Cancel", value: "cancel" }
                    ]}
                    onChange={(value) => onFinalResponse(value)}
                    onCancel={() => onFinalResponse("cancel")}
                />
            </Box>
        </Box>
    );
}
```

**Terminal output:**
```
─────────────────────────────────────
Q1 ← Auth method  ✓ Library  ✓ Approach  ✓ Submit →

Review your answers
  • Which authentication method should we use?
      → OAuth 2.0
  • Which library for JWT?
      → jsonwebtoken
  • Main approach?
      → Middleware-based

Ready to submit your answers?
► Submit answers
  Cancel
```

---

## 5. Multi-Round Interaction in Plan Mode

### 5.1 The Iterative Planning Loop (Explore → Update → Ask)

Plan mode has two prompt variants. The **iterative workflow** (`ezz`, chunks.173.mjs:618) enables multi-round AskUserQuestion usage:

```javascript
// ============================================
// ezz - buildPlanModeInterviewReminder
// Location: chunks.173.mjs:618-664
// ============================================

// Key excerpt (ORIGINAL):
Y = `Plan mode is active...
## Iterative Planning Workflow

You are pair-planning with the user. Explore the code to build context, ask the user questions when you hit decisions you can't make alone, and write your findings into the plan file as you go...

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

### Ending Your Turn

Your turn should only end by either:
- Using ${TH} to gather more information
- Calling ${Nj.name} when the plan is ready for approval

**Important:** Use ${Nj.name} to request plan approval. Do NOT ask about plan approval via text or AskUserQuestion.`
```

**The loop state diagram:**
```
┌─────────────────────────────────────────────────────────────────┐
│                   Iterative Planning Loop                        │
│                                                                  │
│   ┌──────────────┐    ┌──────────────┐    ┌───────────────┐    │
│   │   EXPLORE    │───►│  UPDATE PLAN │───►│ ASK USER (?)  │    │
│   │              │    │  (file edit) │    │ AskUserQuestion│    │
│   └──────────────┘    └──────────────┘    └───────┬───────┘    │
│          ▲                                          │            │
│          │           more questions                 │            │
│          └──────────────────────────────────────────┘            │
│                              │                                   │
│                         no more questions                        │
│                              ▼                                   │
│                   ┌──────────────────┐                          │
│                   │  ExitPlanMode    │                          │
│                   │  (submit plan)   │                          │
│                   └──────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Multi-Round Example Timeline

A realistic multi-round interaction for "Add user authentication":

```
Turn 1: LLM
  → Reads: package.json, src/routes/*, src/middleware/*
  → Writes: plan.md (skeleton)
  → Calls AskUserQuestion:
      Q1: "Which auth library to use?"  [header: "Auth lib"]
          Options: ["passport.js", "next-auth", "custom JWT"]
      Q2: "Social login needed?"        [header: "Social login"]
          Options: ["Yes - Google+GitHub", "Google only", "No - local only"]

Turn 1: User (via dialog)
  → Q1: "passport.js"
  → Q2: "Yes - Google+GitHub"

Turn 2: LLM receives:
  "User has answered your questions:
   "Which auth library to use?"="passport.js",
   "Social login needed?"="Yes - Google+GitHub"."
  → Reads: passport docs, existing session config
  → Updates plan.md with passport approach
  → Calls AskUserQuestion:
      Q1: "Session storage?"            [header: "Storage"]
          Options: ["Redis (persistent)", "Memory (dev only)"]

Turn 2: User
  → Q1: "Redis (persistent)"

Turn 3: LLM receives:
  "User has answered your questions: "Session storage?"="Redis (persistent)"."
  → Finishes plan.md
  → Calls ExitPlanMode (plan is complete)

Turn 3: User
  → Reviews plan in "Ready to code?" dialog
  → Selects "Yes, auto-accept edits"
  → Implementation begins
```

### 5.3 Sparse Reminder (`A2z`) — Turn-End Enforcement

After the initial full plan mode reminder, subsequent turns show a shortened "sparse" reminder:

```javascript
// ============================================
// A2z - buildPlanModeSparseReminder
// Location: chunks.173.mjs:667
// ============================================

// ORIGINAL (for source lookup):
function A2z(A) {
    let q = sO() ? "Follow iterative workflow: explore codebase, interview user, write to plan incrementally." : "Follow 5-phase workflow.",
        K = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${A.planFilePath}). ${q} End turns with ${TH} (for clarifications) or ${Nj.name} (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
    return _9([c6({ content: K, isMeta: !0 })])
}

// READABLE (for understanding):
// Output: "Plan mode still active (...). Read-only except plan file (path).
// Follow iterative workflow: .... End turns with AskUserQuestion (for clarifications)
// or ExitPlanMode (for plan approval). Never ask about plan approval via text or AskUserQuestion."
```

This compact reminder reinforces two critical rules on every turn:
1. **Must end turn** with `AskUserQuestion` OR `ExitPlanMode` (never just text)
2. **Never ask about plan approval** via text or AskUserQuestion

### 5.4 Sub-agent Reminder (`q2z`) — Agent Mode

When `isSubAgent = true` (inside a Task agent spawned during plan mode):

```javascript
// ============================================
// q2z - buildPlanModeSubagentReminder
// Location: chunks.173.mjs:685
// ============================================

// READABLE (for understanding):
// The sub-agent reminder:
// 1. Restricts all file edits (only plan file allowed)
// 2. Explicitly allows AskUserQuestion: "...using the AskUserQuestion tool if you need to ask clarifying questions"
// 3. Requires ALL clarifying questions be asked before proceeding
```

**Key line:** `"If you do use the AskUserQuestion tool, make sure to ask all clarifying questions you need to fully understand the user's intent before proceeding."`

This prevents sub-agents from doing partial exploration and missing critical clarifications.

---

## 6. AskUserQuestion Restrictions in Plan Mode

### 6.1 What CAN be Asked

From `chunks.173.mjs:602`:
```
- Clarify requirements or approach choices
- Batch related questions together
- Ask things only the user can answer: requirements, preferences, tradeoffs, edge case priorities
```

From `chunks.89.mjs:572` (tool prompt):
```
Plan mode note: In plan mode, use this tool to clarify requirements or choose
between approaches BEFORE finalizing your plan.
```

### 6.2 What CANNOT be Asked

**Forbidden patterns — explicitly blocked by system prompt:**

```
DO NOT use AskUserQuestion to ask:
- "Is my plan ready?"
- "Should I proceed?"
- "How does this plan look?"
- "Any changes before we start?"
- Or similar plan-approval phrases
```

This is enforced by three distinct reminder messages:
1. `ezz` (full interview reminder, chunks.173.mjs:662): `"Do NOT ask about plan approval via text or AskUserQuestion."`
2. `A2z` (sparse reminder, chunks.173.mjs:668): `"Never ask about plan approval via text or AskUserQuestion."`
3. `ep4` (ExitPlanMode prompt, chunks.139.mjs:2470): `"Do NOT use AskUserQuestion to ask 'Is my plan okay?' or 'Should I proceed?'"`

**Why the triple enforcement?** The LLM tends to naturally want to confirm before submitting — asking "Does this look good?" feels polite. The system must override this instinct because `ExitPlanMode` already provides the approval mechanism. Using AskUserQuestion for approval would create confusion (two approval dialogs) and bypass the purpose-built approval flow.

### 6.3 Good Questions vs. Bad Questions

| ✅ Good (Use AskUserQuestion) | ❌ Bad (Use ExitPlanMode instead) |
|------------------------------|----------------------------------|
| "Which auth library?" | "Does this plan look good?" |
| "Should I use Redis or Memory?" | "Is this approach correct?" |
| "Which features for phase 1?" | "Ready to start coding?" |
| "TypeScript or JavaScript?" | "Any feedback on my plan?" |
| "REST or GraphQL API?" | "Should I proceed with this?" |

---

## 7. `metadata.source` Parameter

The `metadata.source` field in the input schema allows skill code to tag question calls for analytics:

```json
{
  "questions": [...],
  "metadata": {
    "source": "remember"
  }
}
```

From `/remember` skill (`QOz`, chunks.177.mjs:1146):
```json
{
  "questions": [{
    "question": "Add to CLAUDE.local.md: 'Prefer bun over npm for all commands'?",
    "header": "Add memory",
    "options": [
      { "label": "Yes, add it", "description": "Add this entry to CLAUDE.local.md" },
      { "label": "No, skip", "description": "Don't add this entry" },
      { "label": "Edit first", "description": "Let me modify the entry before adding" }
    ],
    "multiSelect": false
  }],
  "metadata": { "source": "remember" }
}
```

The `source` field is used in telemetry (`tengu_mcp_elicitation_shown`) but not displayed to the user.

---

## 8. Complete UI Event Flow Diagram

```
User enters plan mode (Shift+Tab or EnterPlanMode tool)
    │
    ▼
LLM explores codebase (Glob, Read, Grep, Task agents)
    │
    ▼
LLM calls AskUserQuestion
    │
    ▼
checkPermissions() → { behavior: "ask" }
    │
    ▼
Permission system queues in elicitationQueue
    │
    ▼
Dialog arbiter (f11): is this the highest-priority dialog?
    │
    │ Yes (no pending tool permissions, sandbox permissions, etc.)
    ▼
ElicitationDialog (WWq) renders with event.params
    │
    ▼
$Wq (outer form) instantiated
    │
    ├─ reads: questions[], metadata.source
    ├─ checks: isPlanMode → gets planFilePath
    └─ uses: useQuestionNavigation() hook
    │
    ▼
YWq (single question) renders question[0]
    │
    ├─ Shows: question.question text
    ├─ Shows: header tabs for navigation
    ├─ Renders: SingleSelect or MultiSelect based on multiSelect
    ├─ Auto-injects: "Other" option with text input
    └─ [Plan mode only] Shows: "Skip interview" option
    │
    ▼ (user selects option)
    │
    ├─ Single-select: auto-advances to next question
    └─ Multi-select: user must press "Submit"/"Next"
    │
    ▼ (all questions answered OR user reaches Submit tab)
    │
wWq (review screen) shows Q&A summary
    │
    ├─ Lists all answers as bullet pairs
    ├─ Warns if not all questions answered
    └─ Offers: "Submit answers" or "Cancel"
    │
    ▼ (user presses "Submit answers")
    │
onResponse("accept", answers)
    │
    ├─ elicitationQueue.queue.slice(1) → remove current item
    └─ event.respond({ action: "accept", content: answers })
    │
    ▼
Permission framework runs dW1.call({ questions, answers })
    │
    └─ Returns { data: { questions, answers } }
    │
    ▼
dW1.mapToolResultToToolResultBlockParam → formats for LLM
    │
    └─ Returns: "User has answered your questions: ..."
    │
    ▼
dW1.renderToolResultMessage → renders $CY card
    │
    └─ "✓ User answered Claude's questions: · Q → A · Q → A..."
    │
    ▼
LLM receives answers in API conversation
    │
    ├─ Continues exploring with answers in mind
    ├─ Updates plan file
    └─ May call AskUserQuestion AGAIN (multi-round)
    │
    ▼ (when plan complete)
    │
LLM calls ExitPlanMode
    │
    └─ User sees "Ready to code?" dialog
```

---

## 9. Prompt Suggestion Blocking

During an active AskUserQuestion dialog, **inline prompt suggestions are suppressed** (`EhA`, chunks.151.mjs:149):

```javascript
function getPromptSuggestionBlocker(appState) {
    // ...
    if (appState.elicitation.queue.length > 0) return "elicitation_active";
    // ...
}
```

While the dialog is open, the suggestion engine returns `"elicitation_active"` and stops generating completions. This prevents the suggestion box from appearing behind/over the AskUserQuestion dialog.

---

## 10. Symbol Summary for Symbol Index

New symbols discovered in this analysis (to add to `symbol_index_core_features.md`):

Key functions in this document:
- `dW1` (chunks.139.mjs:2903) - AskUserQuestion tool object
- `TH` (chunks.89.mjs:566) - "AskUserQuestion" constant
- `Qp7` (chunks.89.mjs:570) - short description
- `gp7` (chunks.89.mjs:572) - full prompt text
- `zCY` (chunks.139.mjs:2875) - option schema
- `Xd4` (chunks.139.mjs:2878) - question schema
- `wCY` (chunks.139.mjs:2883) - input schema
- `HCY` (chunks.139.mjs:2902) - output schema
- `$CY` (chunks.139.mjs:2825) - answer display card
- `OCY` (chunks.139.mjs:2840) - single answer line renderer
- `$Wq` (chunks.181.mjs:1882) - outer question form
- `YWq` (chunks.181.mjs:1495) - single question component
- `wWq` (chunks.181.mjs:1768) - review answers screen
- `WDz` (chunks.181.mjs:1754) - option→UI format transformer
- `PDz` (chunks.181.mjs:1750) - isNotOther filter (`value !== "__other__"`)
- `RV6` (chunks.156.mjs:1540) - MCP elicitation request handler
- `ezz` (chunks.173.mjs:618) - buildPlanModeInterviewReminder
- `A2z` (chunks.173.mjs:667) - buildPlanModeSparseReminder
- `q2z` (chunks.173.mjs:685) - buildPlanModeSubagentReminder
- `ep4` (chunks.139.mjs:2458) - ExitPlanMode tool prompt text
- `Fp7` (chunks.89.mjs) - maxHeaderLength constant (= 12)
