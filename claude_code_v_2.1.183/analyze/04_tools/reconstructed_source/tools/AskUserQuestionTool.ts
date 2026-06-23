/**
 * AskUserQuestionTool — readable-source reconstruction for Claude Code v2.1.183.
 *
 * Asks the user 1-4 multiple-choice questions (each with 2-4 options) to gather
 * information / clarify ambiguity / make a decision. The model-facing `prompt()`
 * is model-gated: lean-prompt models (Opus 4.8 + simple-system-prompt cohort) get
 * an extra "reservation" paragraph telling them to WITHHOLD the tool unless the
 * answer genuinely changes what they do next.
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - 221315-221354  name/chip-width/description consts, reservation `f1i`,
 *                    preview-format map `p1i`, base prompt `f5r` (lazy `YO`)
 *   - 391310-391319  HTML-fragment preview validator `Fwp`
 *   - 391324-391448  schemas: `Pwp` option, `bUa` question, `SUa` annotations,
 *                    `yUa` uniqueness refine, `Mwp` answer coercion, `Rwp` common
 *                    fields, `$wp` input, `Owp` output, `Wlo` sentinel (lazy `G2t`)
 *   - 391449-391582  tool object `sut = pi({...})` (prompt gate, validate, perms,
 *                    call, mapToolResult, render rejected)
 *   - 147759-147799  `Dkt`/`F1r` schemaDescFixes gate (NEW in 2.1.183)
 *   - 147838-147847  `Fmi` default config (schemaDescFixes: false)
 *   - 134268-134273  `Dg` lean-system-prompt predicate (scaffold X3)
 *   -   3238 / 3665 / 3151  `FKt`(questionPreviewFormat) / `qb`(allowedChannels) / `xr`(non-interactive)
 *   - 149995-149997  `pi` tool factory ; 146595 `ct` Statsig gate getter
 *
 * 2.1.88 convention mirror: src/tools/AskUserQuestionTool/{AskUserQuestionTool.tsx,prompt.ts}
 *   (readable names inherited: questionOptionSchema/questionSchema/annotationsSchema/
 *    UNIQUENESS_REFINE/commonFields/inputSchema/outputSchema; buildTool/lazySchema shape).
 * 2.1.156 scaffold: 04_tools/ask_user_question_reservation.md (the X3-gated FUK reservation).
 *
 * Cross-validation note: every const, schema field, `.describe()` string, gate
 * (`Dg`/`F1r`/`ct`/`FKt`), validate/permission/call branch and the reservation +
 * preview text were read verbatim at the lines above in the 2.1.183 bundle.
 * NEW-in-2.1.183: `F1r()` (`schemaDescFixes`, backed by `thistle_skein` in the
 * `juniper_shoal` Statsig config) switches the `options`/`questions` `.describe()`
 * strings to the longer "hard schema constraints" wording (0 hits in the 2.1.156
 * bundle). Confidence: high.
 */

import { z } from 'zod/v4';
import * as React from 'react';
import { Box, Text } from '../../ink.js';
import type { Tool, ToolDef } from '../Tool.js';
import { buildTool } from '../Tool.js';
import { lazySchema } from '../../utils/lazySchema.js';
import { getAllowedChannels, isNonInteractive, getQuestionPreviewFormat } from '../../bootstrap/state.js';
import { getFeatureGate } from '../../utils/featureGate.js';
import { getSchemaDescFixes } from '../../utils/toolConfig.js';     // F1r
import { isLeanSystemPrompt } from '../../utils/leanSystemPrompt.js'; // Dg (scaffold X3)
import { ENTER_PLAN_MODE_TOOL_NAME } from '../EnterPlanModeTool/constants.js'; // A7
import { EXIT_PLAN_MODE_TOOL_NAME } from '../ExitPlanModeTool/constants.js';   // yx
import { AskUserQuestionResultMessage } from './AskUserQuestionResultMessage.js'; // Nwp

// ─────────────────────────────────────────────────────────────────────────────
// Identity + constants
// ─────────────────────────────────────────────────────────────────────────────

// 2.1.183: ASK_USER_QUESTION_TOOL_NAME = Ff @cli_inner_pretty.js:221315
export const ASK_USER_QUESTION_TOOL_NAME = 'AskUserQuestion';

// 2.1.183: ASK_USER_QUESTION_TOOL_CHIP_WIDTH = u1i @cli_inner_pretty.js:221316
export const ASK_USER_QUESTION_TOOL_CHIP_WIDTH = 12;

// 2.1.183: DESCRIPTION = d1i @cli_inner_pretty.js:221317-221318
export const DESCRIPTION =
  'Asks the user multiple choice questions to gather information, clarify ambiguity, understand preferences, make decisions or offer them choices.';

// Sentinel stored as an "answer" meaning the user selected no structured option
// (so only notes were captured). // 2.1.183: Wlo @cli_inner_pretty.js:391330
const NO_OPTION_SELECTED_SENTINEL = '(notes only)';

// ─────────────────────────────────────────────────────────────────────────────
// Reservation paragraph — appended to the prompt ONLY for lean models (Dg/X3).
// 2.1.183: ASK_USER_QUESTION_RESERVATION_PROMPT = f1i @cli_inner_pretty.js:221321-221323
// Verbatim (leading + trailing newline are intentional so it reads as its own paragraph).
// ─────────────────────────────────────────────────────────────────────────────
export const ASK_USER_QUESTION_RESERVATION_PROMPT = `
Reserve this for decisions where the user's answer changes what you do next — not for choices with a conventional default or facts you can verify in the codebase yourself. In those cases pick the obvious option, mention it in your response, and proceed.
`;

// ─────────────────────────────────────────────────────────────────────────────
// Optional preview-feature guidance, keyed by the host's preview render format.
// Appended last when getQuestionPreviewFormat() is "markdown" | "html".
// 2.1.183: PREVIEW_FEATURE_PROMPT = p1i @cli_inner_pretty.js:221325-221345
// ─────────────────────────────────────────────────────────────────────────────
export const PREVIEW_FEATURE_PROMPT = {
  // @221326
  markdown: `
Preview feature:
Use the optional \`preview\` field on options when presenting concrete artifacts that users need to visually compare:
- ASCII mockups of UI layouts or components
- Code snippets showing different implementations
- Diagram variations
- Configuration examples

Preview content is rendered as markdown in a monospace box. Multi-line text with newlines is supported. When any option has a preview, the UI switches to a side-by-side layout with a vertical option list on the left and preview on the right. Do not use previews for simple preference questions where labels and descriptions suffice. Note: previews are only supported for single-select questions (not multiSelect).
`,
  // @221336
  html: `
Preview feature:
Use the optional \`preview\` field on options when presenting concrete artifacts that users need to visually compare:
- HTML mockups of UI layouts or components
- Formatted code snippets showing different implementations
- Visual comparisons or diagrams

Preview content must be a self-contained HTML fragment (no <html>/<body> wrapper, no <script> or <style> tags — use inline style attributes instead). Do not use previews for simple preference questions where labels and descriptions suffice. Note: previews are only supported for single-select questions (not multiSelect).
`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Base prompt body — ships to EVERY model (the tightened "only when you are
// blocked" framing). The reservation above is concatenated after this for lean
// models; preview guidance is concatenated last when a format is set.
// 2.1.183: ASK_USER_QUESTION_BASE_PROMPT = f5r @cli_inner_pretty.js:221346-221354
// ─────────────────────────────────────────────────────────────────────────────
export const ASK_USER_QUESTION_BASE_PROMPT = `Use this tool only when you are blocked on a decision that is genuinely the user's to make: one you cannot resolve from the request, the code, or sensible defaults.

Usage notes:
- Users will always be able to select "Other" to provide custom text input
- Use multiSelect: true to allow multiple answers to be selected for a question
- If you recommend a specific option, make that the first option in the list and add "(Recommended)" at the end of the label

Plan mode note: To switch into plan mode, use ${ENTER_PLAN_MODE_TOOL_NAME} (not this tool). Once in plan mode, use this tool to clarify requirements or choose between approaches BEFORE finalizing your plan. Do NOT use this tool to ask "Is my plan ready?", "Should I proceed?", or otherwise reference "the plan" in questions — the user cannot see the plan until you call ${EXIT_PLAN_MODE_TOOL_NAME} for approval.
`;

// ─────────────────────────────────────────────────────────────────────────────
// HTML-fragment preview validator — only consulted when previewFormat === "html".
// Rejects full documents, script/style tags, and non-HTML content. Returns an
// error string, or null when the fragment is acceptable.
// 2.1.183: validateHtmlPreviewFragment = Fwp @cli_inner_pretty.js:391310-391319
// Mapping: Fwp→validateHtmlPreviewFragment, e→preview
// ─────────────────────────────────────────────────────────────────────────────
function validateHtmlPreviewFragment(preview: string | undefined): string | null {
  if (preview === undefined) return null;
  // @391312-391313
  if (/<\s*(html|body|!doctype)\b/i.test(preview))
    return 'preview must be an HTML fragment, not a full document (no <html>, <body>, or <!DOCTYPE>)';
  // @391314-391315
  if (/<\s*(script|style)\b/i.test(preview))
    return 'preview must not contain <script> or <style> tags. Use inline styles via the style attribute if needed.';
  // @391316-391317
  if (!/<[a-z][^>]*>/i.test(preview))
    return 'preview must contain HTML (previewFormat is set to "html"). Wrap content in a tag like <div> or <pre>.';
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Schemas (lazy — `we(() => …)` / `lazySchema` in 2.1.88).
// ─────────────────────────────────────────────────────────────────────────────

// 2.1.183: questionOptionSchema = Pwp @cli_inner_pretty.js:391346-391359
const questionOptionSchema = lazySchema(() =>
  z.object({
    label: z
      .string()
      .describe(
        'The display text for this option that the user will see and select. Should be concise (1-5 words) and clearly describe the choice.',
      ),
    description: z
      .string()
      .describe(
        'Explanation of what this option means or what will happen if chosen. Useful for providing context about trade-offs or implications.',
      ),
    preview: z
      .string()
      .optional()
      .describe(
        'Optional preview content rendered when this option is focused. Use for mockups, code snippets, or visual comparisons that help users compare options. See the tool description for the expected content format.',
      ),
  }),
);

// 2.1.183: questionSchema = bUa @cli_inner_pretty.js:391361-391382
// NOTE: the `options` .describe() is gated by F1r() (schemaDescFixes — NEW in 2.1.183):
//   F1r() true  → the longer "this cap applies to multiSelect too … group or split" wording
//   F1r() false → the original short "Must have 2-4 options." wording
const questionSchema = lazySchema(() =>
  z.object({
    question: z
      .string()
      .describe(
        // @391364
        'The complete question to ask the user. Should be clear, specific, and end with a question mark. Example: "Which library should we use for date formatting?" If multiSelect is true, phrase it accordingly, e.g. "Which features do you want to enable?"',
      ),
    header: z
      .string()
      // @391367 — interpolates the chip-width const into the describe text
      .describe(
        `Very short label displayed as a chip/tag (max ${ASK_USER_QUESTION_TOOL_CHIP_WIDTH} chars). Examples: "Auth method", "Library", "Approach".`,
      ),
    options: z
      .array(questionOptionSchema())
      .min(2)
      .max(4)
      // @391373-391375 — F1r() (schemaDescFixes) selects the describe text
      .describe(
        getSchemaDescFixes()
          ? "The available choices for this question. Must have 2-4 options (this cap applies to multiSelect too — group or split if you have more). Each option should be a distinct choice; mutually exclusive unless multiSelect is enabled. There should be no 'Other' option, that will be provided automatically."
          : "The available choices for this question. Must have 2-4 options. Each option should be a distinct, mutually exclusive choice (unless multiSelect is enabled). There should be no 'Other' option, that will be provided automatically.",
      ),
    multiSelect: z
      .boolean()
      .default(false)
      .describe(
        // @391379
        'Set to true to allow the user to select multiple options instead of just one. Use when choices are not mutually exclusive.',
      ),
  }),
);

// Per-question annotations the permission component attaches to the answers
// (notes on a preview selection, free-text notes). Keyed by question text.
// 2.1.183: annotationsSchema = SUa @cli_inner_pretty.js:391384-391396
const annotationsSchema = lazySchema(() => {
  const annotationSchema = z.object({
    preview: z
      .string()
      .optional()
      .describe('The preview content of the selected option, if the question used previews.'),
    notes: z.string().optional().describe('Free-text notes the user added to their selection.'),
  });
  return z
    .record(z.string(), annotationSchema)
    .optional()
    .describe(
      'Optional per-question annotations from the user (e.g., notes on preview selections). Keyed by question text.',
    );
});

// Refinement: question texts must be unique, and option labels must be unique
// within each question. // 2.1.183: UNIQUENESS_REFINE = yUa @cli_inner_pretty.js:391397-391408
const UNIQUENESS_REFINE = {
  check: (data: { questions: { question: string; options: { label: string }[] }[] }) => {
    const questions = data.questions.map((q) => q.question);
    if (questions.length !== new Set(questions).size) return false;
    for (const question of data.questions) {
      const labels = question.options.map((opt) => opt.label);
      if (labels.length !== new Set(labels).size) return false;
    }
    return true;
  },
  // @391407
  message: 'Question texts must be unique, option labels must be unique within each question',
} as const;

// Answer-value coercion: if the permission component supplies a string[] (e.g. a
// multiSelect answer) it is joined into a comma-separated string before storage.
// 2.1.183: answerValueSchema = Mwp @cli_inner_pretty.js:391409-391411
const answerValueSchema = lazySchema(() =>
  z.preprocess(
    (v) => (Array.isArray(v) && v.every((x) => typeof x === 'string') ? v.join(', ') : v),
    z.string(),
  ),
);

// Fields spread into the input schema beyond `questions`: the collected answers,
// annotations, and an analytics-only metadata bag.
// 2.1.183: commonFields = Rwp @cli_inner_pretty.js:391412-391423
const commonFields = lazySchema(() => ({
  answers: z
    .record(z.string(), answerValueSchema())
    .optional()
    .describe('User answers collected by the permission component'),
  annotations: annotationsSchema(),
  metadata: z
    .object({
      source: z
        .string()
        .optional()
        .describe(
          // @391419
          'Optional identifier for the source of this question (e.g., "remember" for /remember command). Used for analytics tracking.',
        ),
    })
    .optional()
    .describe('Optional metadata for tracking and analytics purposes. Not displayed to user.'),
}));

// 2.1.183: inputSchema = $wp @cli_inner_pretty.js:391425-391436
// NOTE: the `questions` .describe() is ALSO F1r()-gated (schemaDescFixes — NEW in 2.1.183).
const inputSchema = lazySchema(() =>
  z
    .strictObject({
      questions: z
        .array(questionSchema())
        .min(1)
        .max(4)
        // @391430-391433 — F1r() (schemaDescFixes) selects the describe text
        .describe(
          getSchemaDescFixes()
            ? 'Questions to ask the user (1-4 questions). The 1-4 questions and 2-4 options bounds are hard schema constraints; do not exceed them even if the user requests more — split into multiple calls instead.'
            : 'Questions to ask the user (1-4 questions)',
        ),
      ...commonFields(),
    })
    .refine(UNIQUENESS_REFINE.check, { message: UNIQUENESS_REFINE.message }),
);
type InputSchema = ReturnType<typeof inputSchema>;

// 2.1.183: outputSchema = Owp @cli_inner_pretty.js:391438-391448
const outputSchema = lazySchema(() =>
  z.object({
    questions: z.array(questionSchema()).describe('The questions that were asked'),
    answers: z
      .record(z.string(), z.string())
      .describe(
        'The answers provided by the user (question text -> answer string; multi-select answers are comma-separated)',
      ),
    response: z
      .string()
      .optional()
      .describe('Freeform text the user typed instead of selecting a structured option'),
    annotations: annotationsSchema(),
  }),
);
type OutputSchema = ReturnType<typeof outputSchema>;

export type Question = z.infer<ReturnType<typeof questionSchema>>;
export type QuestionOption = z.infer<ReturnType<typeof questionOptionSchema>>;
export type Output = z.infer<OutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Tool object — 2.1.183: AskUserQuestionTool = sut = pi({...}) @cli_inner_pretty.js:391450-391582
// ─────────────────────────────────────────────────────────────────────────────
export const AskUserQuestionTool: Tool<InputSchema, Output> = buildTool({
  name: ASK_USER_QUESTION_TOOL_NAME,
  // @391452
  searchHint: 'prompt the user with a multiple-choice question',
  // @391453
  maxResultSizeChars: 100_000,

  // @391454-391456
  async description() {
    return DESCRIPTION;
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Model-facing prompt — composes base + (reservation for lean models) + (preview).
  // 2.1.183: prompt @cli_inner_pretty.js:391457-391470
  //
  // Gate 1 (reservation): Dg(model) — the lean/simple-system-prompt predicate
  //   (scaffold X3, @134268). Lean models (Opus 4.8 + simple-prompt cohort) get the
  //   reservation tail; a `tengu_cinder_plover` Statsig override (@391460) replaces
  //   the default `f1i` text when non-empty. An empty/blank override falls back to
  //   f1i — you suppress the reservation by making the model non-lean, not by
  //   blanking the gate.
  // Gate 2 (preview): FKt() = Ot.questionPreviewFormat (@391467) — appends the
  //   markdown/html preview block when the host opted into a preview format.
  //
  // Mapping: e→model, t→reservation, r→override, n→previewFormat
  // ───────────────────────────────────────────────────────────────────────────
  async prompt({ model }) {
    let reservation = '';
    if (isLeanSystemPrompt(model)) {
      // @391460 — runtime override of the reservation wording
      const override = getFeatureGate('tengu_cinder_plover', '').trim();
      // @391461-391465 — wrap a single-line override in newlines to match f1i's shape
      reservation = override ? `\n${override}\n` : ASK_USER_QUESTION_RESERVATION_PROMPT;
    }
    const previewFormat = getQuestionPreviewFormat();
    // @391468 — SDK consumer with no preview format: omit preview guidance
    if (previewFormat === undefined) return ASK_USER_QUESTION_BASE_PROMPT + reservation;
    // @391469
    return ASK_USER_QUESTION_BASE_PROMPT + reservation + PREVIEW_FEATURE_PROMPT[previewFormat];
  },

  // @391471-391473
  get inputSchema() {
    return inputSchema();
  },
  // @391474-391476
  get outputSchema() {
    return outputSchema();
  },

  // @391477-391479 — no user-facing verb (rendered via custom messages)
  userFacingName() {
    return '';
  },

  // Disabled only when a --channels MCP allowlist is active AND the session is
  // non-interactive (a headless/print session with no TUI to render the prompt).
  // 2.1.183: isEnabled @cli_inner_pretty.js:391480-391483
  // qb = getAllowedChannels @3665 ; xr = isNonInteractive (!Ot.isInteractive) @3151
  isEnabled() {
    if (getAllowedChannels().length > 0 && isNonInteractive()) return false;
    return true;
  },

  // @391484-391486
  isConcurrencySafe() {
    return true;
  },
  // @391487-391489
  isReadOnly() {
    return true;
  },

  // Auto-classifier input: the question texts joined by " | ".
  // 2.1.183: toAutoClassifierInput @cli_inner_pretty.js:391490-391492
  toAutoClassifierInput(input) {
    return input.questions.map((q) => q.question).join(' | ');
  },

  // @391493-391495
  requiresUserInteraction() {
    return true;
  },

  // ───────────────────────────────────────────────────────────────────────────
  // validateInput — only enforced when the host renders previews as HTML.
  // For each option's `preview`, runs validateHtmlPreviewFragment; first failure
  // returns a per-option error scoped to the option label + question text.
  // 2.1.183: validateInput @cli_inner_pretty.js:391496-391504
  // Mapping: e→questions, t→question, n→option, r→error
  // ───────────────────────────────────────────────────────────────────────────
  async validateInput({ questions }) {
    if (getQuestionPreviewFormat() !== 'html') return { result: true };
    for (const question of questions)
      for (const option of question.options) {
        const error = validateHtmlPreviewFragment(option.preview);
        if (error)
          return {
            result: false,
            // @391501
            message: `Option "${option.label}" in question "${question.question}": ${error}`,
            errorCode: 1,
          };
      }
    return { result: true };
  },

  // Always asks the user; the permission UI is what actually presents the
  // multiple-choice prompt and collects the answers. Strips everything but
  // `questions` (and `metadata`, when present) from the echoed input.
  // 2.1.183: checkPermissions @cli_inner_pretty.js:391505-391511
  async checkPermissions(input) {
    return {
      behavior: 'ask',
      // @391507
      message: 'Answer questions?',
      updatedInput: {
        questions: input.questions,
        ...(input.metadata && { metadata: input.metadata }),
      },
    };
  },

  // @391512-391514 / @391515-391517 — no static use / progress messages
  renderToolUseMessage() {
    return null;
  },
  renderToolUseProgressMessage() {
    return null;
  },

  // @391518-391520 — result rendered via the React component (Nwp)
  renderToolResultMessage({ answers, response }) {
    return React.createElement(AskUserQuestionResultMessage, { answers, response });
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Rejected-message — "User declined to answer questions" + a bullet per question
  // listing its options. // 2.1.183: renderToolUseRejectedMessage @cli_inner_pretty.js:391521-391551
  // ───────────────────────────────────────────────────────────────────────────
  renderToolUseRejectedMessage({ questions }) {
    return React.createElement(
      Box,
      { flexDirection: 'column', marginTop: 1 },
      React.createElement(
        Box,
        { flexDirection: 'row' },
        // @391528-391529 — leading figure (mc) + the decline line
        React.createElement(Text, null, 'User declined to answer questions'),
      ),
      React.createElement(
        Box,
        { flexDirection: 'column' },
        questions.map((q) =>
          React.createElement(
            Text,
            { key: q.question, color: 'inactive' },
            // @391541-391545 — "· <question> (<opt> / <opt> …)"
            `· ${q.question} (${q.options.map((o) => o.label).join(' / ')})`,
          ),
        ),
      ),
    );
  },

  // @391552-391554
  renderToolUseErrorMessage() {
    return null;
  },

  // ───────────────────────────────────────────────────────────────────────────
  // call — pure echo. The actual question/answer round-trip happens in the
  // permission component (checkPermissions returns "ask"); by the time `call`
  // runs the answers are already on the input. Emits questions + answers and,
  // when present, the freeform `response` and `annotations`.
  // 2.1.183: call @cli_inner_pretty.js:391555-391559
  // Mapping: n→questions, r→answers (default {}), o→annotations, s→response
  // ───────────────────────────────────────────────────────────────────────────
  async call(input) {
    const { questions, answers = {}, annotations } = input;
    const { response } = input;
    return {
      data: {
        questions,
        answers,
        ...(response?.trim() && { response }),
        ...(annotations && { annotations }),
      },
    };
  },

  // ───────────────────────────────────────────────────────────────────────────
  // mapToolResultToToolResultBlockParam — serializes the answers back to the model.
  // Per question, emits `"<question>"="<answer>"` (or `=(no option selected)` when
  // the answer is the NO_OPTION_SELECTED_SENTINEL), plus optional `selected
  // preview:` and `notes:` from annotations; questions with neither a real answer
  // nor notes are dropped. A freeform `response` overrides everything with
  // "The user responded: …".
  // 2.1.183: mapToolResultToToolResultBlockParam @cli_inner_pretty.js:391560-391581
  // Mapping: e→questions, t→answers, n→response, r→annotations, s→formattedPairs, i→content
  // ───────────────────────────────────────────────────────────────────────────
  mapToolResultToToolResultBlockParam({ questions, answers, response, annotations }, toolUseId) {
    const formattedPairs = questions
      .map(({ question }) => {
        const answer = answers[question];
        const annotation = annotations?.[question];
        const hasRealAnswer = answer && answer !== NO_OPTION_SELECTED_SENTINEL;
        if (!hasRealAnswer && !annotation?.notes) return null;
        const parts = [hasRealAnswer ? `"${question}"="${answer}"` : `"${question}"=(no option selected)`];
        if (annotation?.preview) parts.push(`selected preview:\n${annotation.preview}`);
        if (annotation?.notes) parts.push(`notes: ${annotation.notes}`);
        return parts.join(' ');
      })
      .filter((p) => p !== null)
      .join(', ');

    let content: string;
    // @391577 — freeform response takes precedence
    if (response?.trim()) content = `The user responded: ${response}`;
    // @391578 — structured answers present
    else if (formattedPairs)
      content = `Your questions have been answered: ${formattedPairs}. You can now continue with these answers in mind.`;
    // @391579 — nothing answered
    else content = 'The user did not answer the questions.';

    return { type: 'tool_result', content, tool_use_id: toolUseId };
  },
} satisfies ToolDef<InputSchema, Output>);
