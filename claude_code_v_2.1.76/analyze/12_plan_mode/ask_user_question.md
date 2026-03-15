# AskUserQuestion — Complete Reverse Engineering Analysis (Claude Code 2.1.76)

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

---

## 1. Tool Overview

`AskUserQuestion` (`dW1`, chunks.139.mjs:2903) is the tool Claude uses to ask clarifying questions during plan mode. It presents a structured UI dialog where users can select from options or type free-form answers.

### Key Characteristics

- **Permission behavior**: Always requires user interaction (`checkPermissions` returns `{ behavior: "ask" }`)
- **Used in plan mode**: Primary mechanism for Claude to gather user requirements iteratively
- **Multi-question support**: Can ask multiple questions in a single call
- **UI component**: Rendered via `$Wq` (QuestionForm), managed through the elicitation queue

---

## 2. Option Schema (`zCY`, chunks.139.mjs:2875)

```javascript
// ============================================
// zCY - Option schema (label + optional description)
// Location: chunks.139.mjs:2875
// ============================================

// ORIGINAL (for source lookup):
zCY = tH.object({
    label: tH.string().describe("Short option text shown to user"),
    description: tH.string().optional().describe("Optional longer description")
})

// READABLE (for understanding):
const optionSchema = z.object({
    label: z.string().describe("Short option text shown to user"),
    description: z.string().optional().describe("Optional longer description")
});

// Mapping: zCY→optionSchema, tH→z (zod)
```

**Design rationale:** Separating `label` (required) from `description` (optional) allows Claude to provide both a concise option name and an explanatory note. In the UI, the label renders prominently while the description appears as secondary text.

---

## 3. Question Schema (`Xd4`, chunks.139.mjs:2878)

```javascript
// ============================================
// Xd4 - Question schema
// Location: chunks.139.mjs:2878
// ============================================

// ORIGINAL (for source lookup):
Xd4 = tH.object({
    question: tH.string().describe("The question to ask"),
    header: tH.string().optional().describe("Short tab label (≤10 chars recommended)"),
    options: tH.array(zCY).optional().describe("Selectable options (if omitted: free-text)"),
    multiSelect: tH.boolean().optional().describe("Allow multiple selections")
})

// READABLE (for understanding):
const questionSchema = z.object({
    question: z.string().describe("The question to ask"),
    header: z.string().optional().describe("Short tab label (≤10 chars recommended)"),
    options: z.array(optionSchema).optional().describe("Selectable options (if omitted: free-text)"),
    multiSelect: z.boolean().optional().describe("Allow multiple selections")
});

// Mapping: Xd4→questionSchema, zCY→optionSchema
```

**Four question types:**
1. **Free-text** (no `options`): Renders a text input field
2. **Single-select** (`options` provided, `multiSelect` omitted/false): Auto-advances to next question on selection
3. **Multi-select** (`multiSelect: true`): Checkboxes, requires explicit Submit
4. **Options + "Other"**: Always adds an "Other" text field at the bottom of option lists

---

## 4. Input Schema with Validation (`wCY`, chunks.139.mjs:2883)

```javascript
// ============================================
// wCY - Input schema with refine validation
// Location: chunks.139.mjs:2883
// ============================================

// ORIGINAL (for source lookup):
wCY = tH.object({
    questions: tH.array(Xd4).min(1).max(5)
}).refine(
    (A) => A.questions.every((q) => !q.options || q.options.length <= 10),
    { message: "Each question can have at most 10 options" }
)

// READABLE (for understanding):
const inputSchema = z.object({
    questions: z.array(questionSchema).min(1).max(5)
}).refine(
    (input) => input.questions.every((q) => !q.options || q.options.length <= 10),
    { message: "Each question can have at most 10 options" }
);

// Mapping: wCY→inputSchema, Xd4→questionSchema
```

**Constraints:**
- **1–5 questions** per call: Enough for meaningful batch but not overwhelming
- **≤10 options** per question: Keeps the selection list manageable in terminal UI
- The `.refine()` validator catches violations at tool call parse time, before the UI renders

---

## 5. Call Flow: Permission Dialog Routing

When Claude calls `AskUserQuestion`, it triggers the permission system:

```
Claude calls AskUserQuestion({ questions: [...] })
    │
    ├─ checkPermissions() → { behavior: "ask" }   ← always requires user interaction
    │
    ├─ Permission dialog queued in elicitation queue (E1, chunks.188.mjs)
    │
    ├─ f11 (dialog priority arbiter, chunks.188.mjs:304) determines which dialog shows first
    │   • Higher-priority: worker requests (bash approvals)
    │   • Lower-priority: elicitation (AskUserQuestion)
    │
    └─ $Wq (QuestionForm) renders when elicitation queue is at front
```

### Dialog Priority Arbiter (`f11`, chunks.188.mjs:304)

The arbiter prevents multiple dialogs from stacking. AskUserQuestion yields to tool permission requests (Bash, Write, etc.) because those are blocking operations. Once the higher-priority dialog resolves, the elicitation dialog appears.

---

## 6. UI Components

### `$Wq` — QuestionForm (outer permission component, chunks.181.mjs:1882)

The top-level component registered for the AskUserQuestion permission dialog. Manages:
- Multi-question navigation state (`activeQuestionIndex`)
- Answer accumulation (`currentAnswers: Record<string, string | string[]>`)
- Pasted image state (`pastedContentsByQuestion`)
- Submit, "Chat about this", and "Skip interview" callbacks

### `YWq` — SingleQuestionComponent (chunks.181.mjs:1495)

Renders one question at a time. Handles:
- Option list rendering with keyboard navigation (↑/↓/Enter)
- "Other" text input field
- Multi-select checkboxes
- Auto-advance on single-select completion

**As of v2.1.69:** Numeric keypad input (1–9) is supported for option selection. Pressing the digit corresponding to an option number immediately selects it, matching the visual numbering shown in the terminal.

```
  ► 1. passport.js  - Proven ecosystem    ← Press "1" to select
    2. next-auth    - Modern framework     ← Press "2" to select
    3. custom JWT   - Maximum control      ← Press "3" to select
    4. Other        [text input]
```

### `wWq` — ReviewAnswersScreen (chunks.181.mjs:1768)

Shown after all questions are answered. Displays a summary of question/answer pairs and asks the user to confirm before submitting.

### `Sv6` — QuestionProgressTabs (chunks.181.mjs:1367)

Horizontal tab bar showing progress across questions. Each tab shows the question's `header` field (or a truncated version of the question text). Completed questions show a checkmark (☑), pending ones show an empty box (☐).

---

## 7. Keyboard Navigation

### Within `YWq` (SingleQuestionComponent)

| Key | When | Action |
|-----|------|--------|
| `↑` / `Ctrl+P` | option list | Move selection up |
| `↓` / `Ctrl+N` | option list | Move selection down |
| `1`–`9` | option list | Select option by number (v2.1.69+) |
| `Enter` | option list | Confirm selection |
| `Space` | multi-select | Toggle checkbox |
| `Esc` | any | Cancel (reject with no message) |
| `Ctrl+G` | "Other" text input | Open external editor (if configured) |

### Within `$Wq` (QuestionForm navigation)

| Key | When | Action |
|-----|------|--------|
| `Tab` / `→` | question navigator active | Next question |
| `Shift+Tab` / `←` | question navigator active | Previous question |
| `↓` / `Ctrl+N` | on "Chat about this" | Move to "Skip interview" (plan mode only) |
| `↑` / `Ctrl+P` | on "Chat about this" | Back to option selector |
| `Enter` | y=0 (Chat about this) | Submit clarification request |
| `Enter` | y=1 (Skip interview) | Finish plan interview |

**`hideSubmitTab`**: When `questions.length === 1 && !questions[0]?.multiSelect`, a single-select question auto-submits on selection without needing a Tab/Submit step.

---

## 8. Submit Path — `onDone` Callback

When the user submits answers:

```javascript
// ============================================
// onDone - Answer submission (inside $Wq)
// Location: chunks.181.mjs:~1990
// ============================================

// READABLE (for understanding):
const onDone = async () => {
    // Build updated input with answers attached
    const updatedInput = {
        ...originalInput,
        answers: currentAnswers  // { [questionText]: selectedValue | string }
    };

    // Track telemetry
    if (metadataSource) track("tengu_ask_user_question_accepted", {
        source: metadataSource,
        questionCount: questions.length,
        isInPlanMode: isPlanMode,
        interviewPhaseEnabled: isPlanMode && isPlanModeInterviewPhase()
    });

    // Collect pasted images
    const images = await collectPastedImages(pastedContentsByQuestion);

    // APPROVE the AskUserQuestion tool with answers attached
    onDoneClosingDialog();
    toolUseConfirm.onAllow(updatedInput, [], images?.length > 0 ? images : undefined);
};
```

After `onAllow()`, `AskUserQuestion.call()` executes:
- Returns `{ data: { questions, answers } }`
- The tool result rendered to the terminal shows: `"✓ User answered Claude's questions: · Q1 → A1 · Q2 → A2"`
- The API conversation injects: `"User has answered your questions: "Q1"="A1", "Q2"="A2". You can now continue..."`

---

## 9. "Chat About This" — `onRespondToClaude` Callback

The "Chat about this" option (always option N+1, below all question options) allows the user to have an open conversation with Claude instead of answering structured questions.

```javascript
// ============================================
// onRespondToClaude - "Chat about this" callback
// Location: chunks.181.mjs:~2000
// ============================================

// READABLE (for understanding):
const onRespondToClaude = async () => {
    // Compose clarification context message
    const clarificationMessage = `The user wants to clarify these questions.
This means they may have additional information, context or questions for you.
Take their response into account and then reformulate the questions if appropriate.
Start by asking them what they would like to clarify.

Questions asked:
${questions.map(q => {
    const answer = currentAnswers[q.question];
    if (answer) return `- "${q.question}"\n  Answer: ${answer}`;
    return `- "${q.question}"\n  (No answer provided)`;
}).join('\n')}`;

    const images = await collectPastedImages(pastedContentsByQuestion);
    onDoneClosingDialog();
    // REJECT the AskUserQuestion tool — inject clarification message instead
    toolUseConfirm.onReject(clarificationMessage, images?.length > 0 ? images : undefined);
};

// Mapping: j1→onRespondToClaude, HgA→collectPastedImages, G→pastedContentsByQuestion
// Mapping: Y→onDoneClosingDialog, K→toolUseConfirm, B→currentAnswers, H→questions
// Mapping: Z→isPlanMode, $→metadataSource
```

### Injection Mechanism

Calling `K.onReject(message, images)` triggers the tool rejection path:
1. AskUserQuestion tool result = `renderToolUseRejectedMessage()` → `"✓ User declined to answer questions"`
2. The `message` parameter is injected as a **user message** into the API conversation
3. Images are attached to that user message as `image` content blocks
4. Claude receives this and knows to "start by asking them what they would like to clarify"

---

## 10. "Skip Interview and Plan Immediately" — `onFinishPlanInterview` Callback

This is option N+2 (the last item, **plan mode only**). Selecting it tells Claude to stop asking questions and complete the plan with whatever information it has.

```javascript
// ============================================
// onFinishPlanInterview - "Skip interview" callback
// Location: chunks.181.mjs:2030-2047 (inside $Wq)
// ============================================

// ORIGINAL (for source lookup):
t = async () => {
    let _1 = `The user has indicated they have provided enough answers for the plan interview.
Stop asking clarifying questions and proceed to finish the plan with the information you have.

Questions asked and answers provided:
${H.map((G1) => {
    let L1 = B[G1.question];
    if (L1) return `- "${G1.question}"\n  Answer: ${L1}`;
    return `- "${G1.question}"\n  (No answer provided)`;
}).join(`\n        `)}`;
    if ($) c("tengu_ask_user_question_finish_plan_interview", {
        source: $, questionCount: H.length, isInPlanMode: Z, interviewPhaseEnabled: Z && sO()
    });
    let $1 = await HgA(G);
    Y(), K.onReject(_1, $1 && $1.length > 0 ? $1 : void 0)
}

// READABLE (for understanding):
const onFinishPlanInterview = async () => {
    const finishMessage = `The user has indicated they have provided enough answers for the plan interview.
Stop asking clarifying questions and proceed to finish the plan with the information you have.

Questions asked and answers provided:
${questions.map(q => {
    const answer = currentAnswers[q.question];
    if (answer) return `- "${q.question}"\n  Answer: ${answer}`;
    return `- "${q.question}"\n  (No answer provided)`;
}).join('\n')}`;

    if (metadataSource) track("tengu_ask_user_question_finish_plan_interview", {
        source: metadataSource, questionCount: questions.length,
        isInPlanMode: isPlanMode, interviewPhaseEnabled: isPlanMode && isPlanModeInterviewPhase()
    });

    const images = await collectPastedImages(pastedContentsByQuestion);
    onDoneClosingDialog();
    toolUseConfirm.onReject(finishMessage, images?.length > 0 ? images : undefined);
};
```

Same mechanism as "Chat about this" — calls `K.onReject()` which:
1. Shows "✓ User declined to answer questions" in the terminal
2. Injects the finish message + partial answers as a user message in the API conversation
3. Claude receives this and writes the final plan using whatever it has, then calls `ExitPlanMode`

---

## 11. Image Support: `HgA` (`collectPastedImages`)

Images can be pasted into any text field in the AskUserQuestion dialog and are transmitted alongside the answer or rejection message.

```javascript
// ============================================
// HgA - collectPastedImages (image-to-API-block converter)
// Location: chunks.181.mjs:2176
// ============================================

// ORIGINAL (for source lookup):
async function HgA(A) {
    if (A.length === 0) return;
    return Promise.all(A.map(async (q) => {
        let K = {
            type: "image",
            source: {
                type: "base64",
                media_type: q.mediaType || "image/png",
                data: q.content
            }
        };
        return (await Aq1(K)).block
    }))
}

// READABLE (for understanding):
async function collectPastedImages(imageArray) {
    if (imageArray.length === 0) return undefined;
    return Promise.all(imageArray.map(async (img) => {
        const rawImageBlock = {
            type: "image",
            source: {
                type: "base64",
                media_type: img.mediaType || "image/png",
                data: img.content  // base64 data
            }
        };
        return (await normalizeImageBlock(rawImageBlock)).block;
    }));
}

// Mapping: HgA→collectPastedImages, Aq1→normalizeImageBlock
```

**Image lifecycle:**
1. User pastes image into "Other" text field → `onImagePaste()` called
2. State updated: `pastedContents[questionKey][imageId] = imageObj`
3. On submit/reject: `HgA(allImages)` → convert all to API blocks
4. Images sent alongside answer or rejection message

---

## 12. Telemetry Events

All plan mode telemetry events include `interviewPhaseEnabled: sO()` when applicable:

| Event | Trigger | Interview-specific field |
|-------|---------|--------------------------|
| `tengu_plan_exit` | Any ExitPlanMode approval/rejection | `interviewPhaseEnabled: sO()` |
| `tengu_ask_user_question_accepted` | User submits answers | `interviewPhaseEnabled: isPlanMode && sO()` |
| `tengu_ask_user_question_rejected` | User cancels dialog | `interviewPhaseEnabled: isPlanMode && sO()` |
| `tengu_ask_user_question_respond_to_claude` | "Chat about this" | `interviewPhaseEnabled: isPlanMode && sO()` |
| `tengu_ask_user_question_finish_plan_interview` | "Skip interview" | `interviewPhaseEnabled: isPlanMode && sO()` |
| `tengu_plan_external_editor_used` | Ctrl+G in dialog | (no interview-specific field) |

---

## 13. MCP Elicitation Integration (`RV6`, chunks.156.mjs:1540)

The same elicitation queue and dialog system that handles `AskUserQuestion` also handles MCP server elicitation requests. Both flow through the `E1` (elicitation queue state, chunks.188.mjs) and render via `$Wq`.

The MCP elicitation handler `RV6` converts MCP protocol elicitation events into the same internal format, allowing the UI to display them consistently regardless of source.

---

## Summary

`AskUserQuestion` is the primary bidirectional communication tool between Claude and the user during plan mode. Key design points:

1. **Schema validation** enforces 1–5 questions and ≤10 options per question at parse time
2. **Option numbering** supports keyboard shortcuts including numeric keypad (1–9) for rapid selection (v2.1.69+)
3. **Three exit paths**: Submit (onAllow with answers), Chat (onReject with clarification message), Skip (onReject with finish signal)
4. **Image support** throughout — any text field accepts pasted images
5. **Multi-round**: Claude can call AskUserQuestion multiple times in a planning session; the sparse reminder keeps it in the loop
6. **Elicitation queue**: Ensures only one dialog shows at a time, with tool permissions taking higher priority
