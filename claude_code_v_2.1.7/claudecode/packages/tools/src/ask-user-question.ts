/**
 * @claudecode/tools - AskUserQuestion Tool
 *
 * Allows Claude to ask the user questions during execution
 * for clarification or decisions.
 *
 * Reconstructed from chunks.119.mjs:2283-2680
 *
 * Key symbols:
 * - zY → ASK_USER_QUESTION (tool name constant)
 * - Rt → AskUserQuestionTool (tool object)
 */

import { z } from 'zod';
import {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  toolSuccess,
  toolError,
} from './base.js';
import type { ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';

// ============================================
// Constants
// ============================================

const MAX_QUESTIONS = 4;
const MIN_QUESTIONS = 1;
const MAX_OPTIONS = 4;
const MIN_OPTIONS = 2;
const MAX_HEADER_LENGTH = 12;

// ============================================
// Input Types
// ============================================

/**
 * Question option.
 */
export interface QuestionOption {
  /** Display text (1-5 words) */
  label: string;
  /** Explanation of option */
  description: string;
}

/**
 * Question definition.
 */
export interface Question {
  /** The complete question text */
  question: string;
  /** Short label (max 12 chars) for chip/tag display */
  header: string;
  /** Available choices (2-4 options) */
  options: QuestionOption[];
  /** Allow multiple selections */
  multiSelect: boolean;
}

/**
 * AskUserQuestion input.
 */
export interface AskUserQuestionInput {
  /** Questions to ask (1-4) */
  questions: Question[];
  /** Collected answers from previous invocation */
  answers?: Record<string, string>;
  /** Optional metadata for tracking */
  metadata?: {
    source?: string;
  };
}

/**
 * AskUserQuestion output.
 */
export interface AskUserQuestionOutput {
  /** Whether answers were collected */
  answered: boolean;
  /** Collected answers by question header */
  answers: Record<string, string | string[]>;
  /** Raw selection indices */
  selections?: Record<string, number[]>;
}

// ============================================
// Input Schema
// ============================================

/**
 * Option schema.
 * Original: chunks.119.mjs:2290-2296
 */
const optionSchema = z.object({
  label: z
    .string()
    .describe('The display text for this option (1-5 words)'),
  description: z
    .string()
    .describe('Explanation of what this option means or what will happen if chosen'),
});

/**
 * Question schema.
 * Original: chunks.119.mjs:2298-2320
 */
const questionSchema = z.object({
  question: z
    .string()
    .describe('The complete question to ask the user'),
  header: z
    .string()
    .max(MAX_HEADER_LENGTH)
    .describe(`Short label (max ${MAX_HEADER_LENGTH} chars) for chip/tag display`),
  options: z
    .array(optionSchema)
    .min(MIN_OPTIONS)
    .max(MAX_OPTIONS)
    .describe(`Available choices (${MIN_OPTIONS}-${MAX_OPTIONS} options)`),
  multiSelect: z
    .boolean()
    .default(false)
    .describe('Allow multiple selections'),
});

/**
 * AskUserQuestion input schema.
 * Original: chunks.119.mjs:2283-2330
 */
const askUserQuestionInputSchema = z.object({
  questions: z
    .array(questionSchema)
    .min(MIN_QUESTIONS)
    .max(MAX_QUESTIONS)
    .describe(`Questions to ask the user (${MIN_QUESTIONS}-${MAX_QUESTIONS})`),
  answers: z
    .record(z.string())
    .optional()
    .describe('Collected answers from UI'),
  metadata: z
    .object({
      source: z.string().optional().describe('Source identifier for tracking'),
    })
    .optional()
    .describe('Optional metadata for tracking'),
});

// ============================================
// Output Schema
// ============================================

const askUserQuestionOutputSchema = z.object({
  answered: z.boolean(),
  answers: z.record(z.union([z.string(), z.array(z.string())])),
  selections: z.record(z.array(z.number())).optional(),
});

// ============================================
// AskUserQuestion Tool
// ============================================

/**
 * AskUserQuestion tool implementation.
 * Original: Rt in chunks.119.mjs:2283-2680
 *
 * This tool is unique in that it:
 * 1. Returns a special response that triggers UI rendering
 * 2. Gets called again with answers after user responds
 * 3. Uses requiresUserInteraction to always prompt
 */
export const AskUserQuestionTool = createTool<AskUserQuestionInput, AskUserQuestionOutput>({
  name: TOOL_NAMES.ASK_USER_QUESTION,
  strict: false, // Allows flexible input handling

  async description() {
    return `Use this tool when you need to ask the user questions during execution. This allows you to:
1. Gather user preferences or requirements
2. Clarify ambiguous instructions
3. Get decisions on implementation choices as you work
4. Offer choices to the user about what direction to take.`;
  },

  async prompt() {
    return `Usage notes:
- Users will always be able to select "Other" to provide custom text input
- Use multiSelect: true to allow multiple answers to be selected for a question
- If you recommend a specific option, make that the first option in the list and add "(Recommended)" at the end of the label

Plan mode note: In plan mode, use this tool to clarify requirements or choose between approaches BEFORE finalizing your plan. Do NOT use this tool to ask "Is my plan ready?" or "Should I proceed?" - use ExitPlanMode for plan approval.`;
  },

  inputSchema: askUserQuestionInputSchema,
  outputSchema: askUserQuestionOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe() {
    // Not safe for concurrent execution - requires sequential user interaction
    return false;
  },

  isReadOnly() {
    return true;
  },

  /**
   * This tool always requires user interaction.
   * Original: chunks.119.mjs:2345
   */
  requiresUserInteraction() {
    return true;
  },

  async checkPermissions(input) {
    // Always allow - user interaction will happen regardless
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    // Validate question count
    if (!input.questions || input.questions.length === 0) {
      return validationError('At least one question is required', 1);
    }

    if (input.questions.length > MAX_QUESTIONS) {
      return validationError(`Maximum ${MAX_QUESTIONS} questions allowed`, 2);
    }

    // Validate each question
    for (let i = 0; i < input.questions.length; i++) {
      const q = input.questions[i];

      if (!q.question || q.question.trim().length === 0) {
        return validationError(`Question ${i + 1} must have text`, 3);
      }

      if (!q.header || q.header.length > MAX_HEADER_LENGTH) {
        return validationError(
          `Question ${i + 1} header must be ${MAX_HEADER_LENGTH} chars or less`,
          4
        );
      }

      if (!q.options || q.options.length < MIN_OPTIONS) {
        return validationError(
          `Question ${i + 1} must have at least ${MIN_OPTIONS} options`,
          5
        );
      }

      if (q.options.length > MAX_OPTIONS) {
        return validationError(
          `Question ${i + 1} can have at most ${MAX_OPTIONS} options`,
          6
        );
      }

      // Validate options
      for (let j = 0; j < q.options.length; j++) {
        const opt = q.options[j];
        if (!opt.label || opt.label.trim().length === 0) {
          return validationError(
            `Question ${i + 1}, option ${j + 1} must have a label`,
            7
          );
        }
      }
    }

    return validationSuccess();
  },

  async call(input, context) {
    // If answers are already provided (from UI callback), return them
    if (input.answers && Object.keys(input.answers).length > 0) {
      // Parse answers - handle both single and multi-select
      const parsedAnswers: Record<string, string | string[]> = {};
      const selections: Record<string, number[]> = {};

      for (const [key, value] of Object.entries(input.answers)) {
        // Check if this is a multi-select response (comma-separated)
        const question = input.questions.find((q) => q.header === key);

        if (question?.multiSelect && value.includes(',')) {
          parsedAnswers[key] = value.split(',').map((v) => v.trim());
        } else {
          parsedAnswers[key] = value;
        }

        // Try to map to selection indices
        if (question) {
          const values = Array.isArray(parsedAnswers[key])
            ? parsedAnswers[key]
            : [parsedAnswers[key]];
          const indices = (values as string[])
            .map((v) => question.options.findIndex((opt) => opt.label === v))
            .filter((i) => i >= 0);
          if (indices.length > 0) {
            selections[key] = indices;
          }
        }
      }

      return toolSuccess({
        answered: true,
        answers: parsedAnswers,
        selections: Object.keys(selections).length > 0 ? selections : undefined,
      });
    }

    // No answers yet - this is the initial call
    // The tool result will trigger the UI to display questions
    // The UI will call the tool again with answers

    return toolSuccess({
      answered: false,
      answers: {},
    });
  },

  /**
   * Map tool result to API format.
   * Original: chunks.119.mjs:2600-2680
   *
   * When answered=false, returns a special format that triggers UI rendering.
   */
  mapToolResultToToolResultBlockParam(result, toolUseId) {
    if (result.answered) {
      // Format answers for the model
      const answerLines = Object.entries(result.answers)
        .map(([key, value]) => {
          const displayValue = Array.isArray(value) ? value.join(', ') : value;
          return `${key}: ${displayValue}`;
        })
        .join('\n');

      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: `User answered:\n${answerLines}`,
      };
    }

    // Not answered yet - return placeholder that UI will intercept
    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: '[Waiting for user response...]',
    };
  },
});

// ============================================
// Export
// ============================================

export { AskUserQuestionTool };
