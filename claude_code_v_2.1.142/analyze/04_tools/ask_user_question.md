# Tool: AskUserQuestion — Multi-Choice User Prompt

> **Identity:** wire-name `AskUserQuestion`, userFacingName `""`, `isReadOnly: true`, `isConcurrencySafe: true`, `requiresUserInteraction: true`, `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:381961-382200` (declaration), `assets/tools/AskUserQuestion.md` (tool def).

AskUserQuestion presents the user with 1-4 multiple-choice questions and collects their answers. It's the canonical "ask the user before deciding" mechanism — used for clarifying ambiguity, gathering preferences, or offering choices the model can't decide on its own.

This document covers the v2.1.142 tool, including the multi-select option (v2.1.136) and the popup-hide-line fix (v2.1.141).

---

## Overview

The tool's UX is a TUI multiple-choice popup:
- 1-4 questions, each with a 2-4 option list.
- Optional preview text per option (rendered when the option is focused).
- Optional multi-select per question (v2.1.136).
- User navigates with arrow keys, selects with Enter, or types free-text in the "Other" option (always implicitly added).

When the user submits, the tool returns the answers as a `{questionText: answerString}` dict. Multi-select answers are comma-separated.

---

## Input Schema (`st_`)

```javascript
// ============================================
// askUserQuestionInputSchema - Array of questions with options
// Location: cli_inner_pretty.js:382065-382072 (st_)
// ============================================

// ORIGINAL (for source lookup):
st_ = yH(() =>
  y.strictObject({
    questions: y.array(ql7()).min(1).max(4).describe("Questions to ask the user (1-4 questions)"),
    ...at_(),
  }).refine(Hl7.check, { message: Hl7.message }),
);

// READABLE (for understanding):
askUserQuestionInputSchema = lazy(() =>
  z.strictObject({
    questions: z.array(questionSchema()).min(1).max(4).describe("1-4 questions to ask"),
    answers: z.record(z.string(), answerCoercion()).optional().describe("Pre-filled answers (e.g., from permission component)"),
    annotations: annotationsSchema(),
    metadata: z.object({
      source: z.string().optional().describe("Source identifier for analytics"),
    }).optional(),
  }).refine(checkUniqueness, { message: uniquenessErrorMessage }),
);

// Mapping: st_→askUserQuestionInputSchema, ql7→questionSchema, at_→answerCoercionPartial,
//          Hl7→uniquenessCheck, Kl7→annotationsSchema, rt_→optionSchema
```

### Question Schema (`ql7`)

```javascript
// ============================================
// questionSchema & optionSchema - Per-question structure
// Location: cli_inner_pretty.js:381973-382019 (rt_, ql7)
// ============================================

// ORIGINAL (for source lookup):
ql7 = yH(() => y.object({
  question: y.string().describe('The complete question to ask the user. ...'),
  header: y.string().describe(`Very short label displayed as a chip/tag (max ${ClK} chars). ...`),
  options: y.array(rt_()).min(2).max(4).describe("The available choices for this question. Must have 2-4 options. ..."),
  multiSelect: y.boolean().default(!1).describe("Set to true to allow the user to select multiple options instead of just one. ..."),
}));
rt_ = yH(() => y.object({
  label: y.string().describe("The display text for this option that the user will see and select. ..."),
  description: y.string().describe("Explanation of what this option means or what will happen if chosen. ..."),
  preview: y.string().optional().describe("Optional preview content rendered when this option is focused. ..."),
}));

// READABLE (for understanding):
questionSchema = lazy(() =>
  z.object({
    question: z.string().describe('Complete question text, ending with "?"'),
    header: z.string().describe("Short chip/tag label (max N chars)"),
    options: z.array(optionSchema()).min(2).max(4).describe("2-4 distinct options"),
    multiSelect: z.boolean().default(false).describe("Allow multiple selections"),
  }),
);

optionSchema = lazy(() =>
  z.object({
    label: z.string().describe("Display text (1-5 words)"),
    description: z.string().describe("Context/explanation"),
    preview: z.string().optional().describe("Focused-option preview content"),
  }),
);

// Mapping: ql7→questionSchema, rt_→optionSchema, ClK→MAX_HEADER_LENGTH
```

**Why max 4 options:** TUI screen real estate. Above 4, the popup gets cramped and the user can't see all options + previews simultaneously. The system also adds an implicit "Other" option, bringing the visible total to 5.

**Why max 4 questions:** Multi-page popups are a UX antipattern. The model is encouraged to bundle related questions ("which library + which version") into one popup, but if it has many independent questions, it should call AskUserQuestion multiple times across turns.

### `multiSelect` Field (v2.1.136)

The pre-v2.1.136 schema didn't have `multiSelect`. Every question was single-select. The v2.1.136 addition lets the model phrase questions like "which features do you want to enable?" and accept multiple checkmarks.

**Why a per-question boolean rather than per-popup:** Different questions in the same popup may need different modes. "Which framework?" should be single-select (mutex). "Which features?" should be multi-select (compatible). Mixing them in one popup is natural.

**The answer encoding for multi-select:**

```javascript
ot_ = yH(() =>
  y.preprocess(
    (H) => (Array.isArray(H) && H.every(($) => typeof $ === "string") ? H.join(", ") : H),
    y.string(),
  ),
);
```

Multi-select answers are stored as comma-separated strings (after the preprocessor). The model receives `"Feature A, Feature B"` rather than `["Feature A", "Feature B"]`. This is for transcript serialization: a single string is unambiguous in the tool_result content, while arrays would require JSON wrapping.

### Uniqueness Refinement (`Hl7`)

```javascript
Hl7 = {
  check: (input) => {
    const questions = input.questions.map(q => q.question);
    if (questions.length !== new Set(questions).size) return false;
    for (const q of input.questions) {
      const labels = q.options.map(o => o.label);
      if (labels.length !== new Set(labels).size) return false;
    }
    return true;
  },
  message: "Question texts must be unique, option labels must be unique within each question",
};
```

Enforces:
- Each question text is unique across the popup.
- Each option's label is unique within its question.

**Why:** The answers are returned keyed by question text. Duplicate questions would collide in the answers dict. Duplicate option labels would make the UI confusing ("Which 'Yes' do you mean?").

---

## Output Schema (`tt_`)

```javascript
// ============================================
// askUserQuestionOutputSchema - Q&A pairs + annotations
// Location: cli_inner_pretty.js:382073-382083 (tt_)
// ============================================

// ORIGINAL (for source lookup):
tt_ = yH(() => y.object({
  questions: y.array(ql7()).describe("The questions that were asked"),
  answers: y.record(y.string(), y.string()).describe("The answers provided by the user ..."),
  annotations: Kl7(),
}));

// READABLE (for understanding):
askUserQuestionOutputSchema = lazy(() =>
  z.object({
    questions: z.array(questionSchema()).describe("Echo of the input questions"),
    answers: z.record(z.string(), z.string()).describe("Answers (question text → answer; multi-select comma-separated)"),
    annotations: annotationsSchema(),
  }),
);

// Mapping: tt_→askUserQuestionOutputSchema, ql7→questionSchema, Kl7→annotationsSchema
```

The output echoes the questions and includes the answers + optional annotations (notes the user added).

---

## validateInput — HTML-Preview Validation

```javascript
// ============================================
// validateAskUserQuestion - HTML preview validation in CCR web mode
// Location: cli_inner_pretty.js:382122-382130 (in yiH.validateInput)
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ questions: H }) {
  if (Cv$() !== "html") return { result: !0 };
  for (let $ of H)
    for (let q of $.options) {
      let K = $e_(q.preview);
      if (K) return { result: !1, message: `Option "${q.label}" in question "${$.question}": ${K}`, errorCode: 1 };
    }
  return { result: !0 };
}

// READABLE (for understanding):
async function validateAskUserQuestion({ questions }) {
  // Only run HTML validation when the client UI mode is "html" (CCR web)
  if (getClientUiMode() !== "html") return { result: true };
  for (const q of questions) {
    for (const option of q.options) {
      const error = validateHtmlPreview(option.preview);
      if (error) {
        return {
          result: false,
          message: `Option "${option.label}" in question "${q.question}": ${error}`,
          errorCode: 1,
        };
      }
    }
  }
  return { result: true };
}

// Mapping: H→questions, $→question, q→option, K→error, Cv$→getClientUiMode, $e_→validateHtmlPreview
```

In the CCR web UI mode, option previews can include HTML/markdown. The validator checks each preview is well-formed (no unclosed tags, no script injection). In TUI mode, previews are plain text and skip the check.

---

## checkPermissions

```javascript
async checkPermissions(H) {
  return { behavior: "ask", message: "Answer questions?", updatedInput: H };
}
```

The tool always asks. There's no "auto-answer" mode — the whole point is to get the user's input. The dialog itself doubles as the permission prompt and the question UI.

---

## call() — Just Echo

```javascript
async call({ questions: H, answers: $ = {}, annotations: q }, K) {
  return { data: { questions: H, answers: $, ...(q && { annotations: q }) } };
}
```

The `call` is trivial: echo the input back. The actual user interaction happens *before* call — during the permission prompt phase. By the time `call` runs, the answers have already been collected (passed in as `answers`).

**Why this split:** Tool calls are atomic transactions in the agent loop. The user interaction must complete (or be rejected) before the tool result is built. The permission system handles the dialog; `call` just packages the user's answers into the tool's output schema.

---

## mapToolResultToToolResultBlockParam

```javascript
// ============================================
// renderAskUserQuestionResult - Format answers for model consumption
// Location: cli_inner_pretty.js:382180-382198
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam({ questions: H, answers: $, annotations: q }, K) {
  return {
    type: "tool_result",
    content: `User has answered your questions: ${H.map(({ question: A }) => {
      let z = $[A], Y = q?.[A], f = z && z !== _E6;
      if (!f && !Y?.notes) return null;
      let O = [f ? `"${A}"="${z}"` : `"${A}"=(no option selected)`];
      if (Y?.preview) O.push(`selected preview:\n${Y.preview}`);
      if (Y?.notes) O.push(`user notes: ${Y.notes}`);
      return O.join(" ");
    }).filter((A) => A !== null).join(", ")}. You can now continue with the user's answers in mind.`,
    tool_use_id: K,
  };
}

// READABLE (for understanding):
function renderResult({ questions, answers, annotations }, toolUseId) {
  const parts = questions
    .map(({ question }) => {
      const answer = answers[question];
      const ann = annotations?.[question];
      const hasAnswer = answer && answer !== "(notes only)";
      if (!hasAnswer && !ann?.notes) return null;

      const segments = [
        hasAnswer
          ? `"${question}"="${answer}"`
          : `"${question}"=(no option selected)`,
      ];
      if (ann?.preview) segments.push(`selected preview:\n${ann.preview}`);
      if (ann?.notes) segments.push(`user notes: ${ann.notes}`);
      return segments.join(" ");
    })
    .filter(p => p !== null)
    .join(", ");

  return {
    type: "tool_result",
    content: `User has answered your questions: ${parts}. You can now continue with the user's answers in mind.`,
    tool_use_id: toolUseId,
  };
}

// Mapping: H→questions, $→answers, q→annotations, K→toolUseId, A→question, z→answer,
//          Y→ann, f→hasAnswer, O→segments, _E6→NOTES_ONLY_SENTINEL
```

Sample output:
```
User has answered your questions: "Which library?"="Day.js" selected preview:
... preview content ..., "Which API design?"="REST" user notes: prefer simple endpoints. You can now continue with the user's answers in mind.
```

**The "(notes only)" sentinel:** When the user adds notes but doesn't select an option, the answer string is `"(notes only)"`. The renderer detects this and renders `(no option selected)` plus the notes — distinguishing "user explicitly chose nothing but commented" from "user didn't see the question."

---

## Render Methods

### renderToolUseRejectedMessage

```javascript
// User declined the popup — render question list with no answers
renderToolUseRejectedMessage({ questions: H }) {
  return ...
  // Shows: "· Which library? (React / Vue / Svelte / Other)"
  //        "· Which API design? (REST / GraphQL / Other)"
}
```

If the user closes the popup without answering (Esc), the tool returns the questions with no answers. The model sees this rendering and knows the user opted out.

### renderToolUseMessage / renderToolUseProgressMessage

```javascript
renderToolUseMessage() { return null; }
renderToolUseProgressMessage() { return null; }
```

Both null. The popup *is* the UI — rendering a "Asking questions..." header above the popup would be redundant.

### renderToolResultMessage

```javascript
renderToolResultMessage({ answers: H }, $) {
  return t3.createElement(et_, { answers: H });
}
```

The result UI shows a compact summary: chip-style headers with selected answer values. This appears in the conversation transcript after the popup closes, so the user can see the past Q&A.

---

## The v2.1.141 Popup-Hide-Line Fix

Pre-v2.1.141, the popup rendering had a layout bug: opening the popup hid the *last line* of preceding chat content. The popup was painted slightly above where it should have been, overwriting the bottom row of the previous turn's output.

The v2.1.141 changelog entry:
> Fixed AskUserQuestion popup hiding the last line of preceding chat content

The fix was in the popup component's positioning calculation — the popup now uses correct row-offset arithmetic that accounts for the dynamic chat height. The fix is in the rendering layer (Ink layout), not the tool itself, but the popup is functionally an AskUserQuestion artifact so the fix is attributed here.

**Why this was hard to spot:** The hidden line was the *last line* of chat — typically a small final response or an empty line. Users would see "the popup appeared" without noticing one line was now missing. The bug only became visible when reviewing the transcript after closing the popup.

---

## isEnabled

```javascript
isEnabled() {
  if (jj().length > 0 && T6()) return !1;
  return !0;
}
```

Same gate as EnterPlanMode: disabled when another interactive dialog is open in a TTY context. In SDK/non-TTY contexts, always enabled (the SDK handles the dialog itself).

---

## Key Insights

- **The "Other" option is automatic**: The tool's prompt explicitly tells the model *not* to include an "Other" option — the system always adds one. Including a manual "Other" would conflict with the system's auto-add.

- **Per-question multiSelect is opt-in**: Default is single-select (false). The model chooses per question. The schema's `default(!1)` documents this — the field is required but defaults to false when omitted.

- **Multi-select returns comma-separated**: The preprocessor in `ot_` joins arrays with `, `. Models that expect JSON arrays would need to parse the string themselves — but the comma-string format is simpler for the model to read in tool_result text.

- **Annotations are per-question, free-text**: The user can add freeform notes alongside any answer. These appear in the result as "user notes: ..." — the model gets the structured answer + the unstructured note.

- **Uniqueness check at schema level**: Duplicate questions or option labels fail validation before `call` runs. This prevents the popup from rendering nonsensical UI.

- **HTML preview validation only for CCR web mode**: TUI doesn't render HTML, so `validateInput` skips the check there. The HTML validator catches XSS-style attempts in option previews when rendered in browser.

- **`call` is a pure echo**: The interesting logic is all in the permission/UI layer. `call` doesn't fetch, compute, or mutate — it just packages the answers.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.114 | Tool introduced as canonical multi-choice prompt. |
| v2.1.117 | Option `preview` field for focused-option rendering. |
| v2.1.121 | Annotations field for per-question user notes. |
| v2.1.125 | Auto-added "Other" option (system-managed, not model-managed). |
| v2.1.129 | `metadata.source` for analytics tracking. |
| v2.1.133 | Question text uniqueness + option label uniqueness refinement. |
| v2.1.136 | **`multiSelect` field** — questions can accept multiple answers, returned comma-separated. |
| v2.1.141 | **Popup-hide-line fix** — popup positioning no longer overwrites the last line of preceding chat content. |
| v2.1.142 | No changes. |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 plan/worktree/AskUserQuestion additions

Key functions in this document:
- `askUserQuestionInputSchema` (st_) - {questions, answers?, annotations?, metadata?}
- `askUserQuestionOutputSchema` (tt_) - {questions, answers, annotations}
- `askUserQuestionTool` (yiH) - Tool definition
- `questionSchema` (ql7) - {question, header, options, multiSelect}
- `optionSchema` (rt_) - {label, description, preview?}
- `annotationsSchema` (Kl7) - Per-question notes
- `answerCoercion` (ot_) - Array → comma-string preprocessor
- `uniquenessCheck` (Hl7) - Question/label uniqueness validator
- `validateHtmlPreview` ($e_) - HTML preview validator
- `getClientUiMode` (Cv$) - "html" vs "tui" detection
- `MULTI_SELECT_DEFAULT` - false (the `.default(!1)`)
- `ASK_USER_QUESTION_TOOL_NAME` (Gz) - "AskUserQuestion"
- `NOTES_ONLY_SENTINEL` (_E6) - "(notes only)" answer marker
