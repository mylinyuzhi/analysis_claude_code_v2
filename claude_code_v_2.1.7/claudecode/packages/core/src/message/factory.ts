/**
 * @claudecode/core - Message Factory Functions
 *
 * Factory functions for creating Claude Code messages.
 * Reconstructed from chunks.147.mjs:2358-2484
 */

import { generateUUID } from '@claudecode/shared';
import type { ContentBlock } from '@claudecode/shared';
import type {
  AssistantMessage,
  UserMessage,
  ProgressMessage,
  SystemMessage,
  CreateAssistantMessageInput,
  CreateUserMessageInput,
  CreateErrorMessageInput,
  CreateProgressMessageInput,
  DEFAULT_USAGE,
  ProgressData,
} from './types.js';

// ============================================
// Constants
// ============================================

/**
 * Empty content placeholder
 * Original: JO in chunks.147.mjs
 */
export const EMPTY_CONTENT_PLACEHOLDER = '​'; // Zero-width space

/**
 * Default model for messages
 * Original: EKA in chunks.147.mjs
 */
let currentModel = 'claude-sonnet-4-20250514';

/**
 * Set the current model for new messages
 */
export function setCurrentModel(model: string): void {
  currentModel = model;
}

/**
 * Get the current model
 */
export function getCurrentModel(): string {
  return currentModel;
}

// ============================================
// Assistant Message Factory
// ============================================

/**
 * Create an assistant message.
 * Original: PJ9 in chunks.147.mjs:2330-2378
 */
export function createAssistantMessage({
  content,
  isApiErrorMessage = false,
  apiError,
  error,
  usage = {
    input_tokens: 0,
    output_tokens: 0,
    cache_read_input_tokens: 0,
    cache_creation_input_tokens: 0,
    service_tier: null,
    cache_creation: {
      ephemeral_1h_input_tokens: 0,
      ephemeral_5m_input_tokens: 0,
    },
  },
}: CreateAssistantMessageInput): AssistantMessage {
  return {
    type: 'assistant',
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    message: {
      id: generateUUID(),
      container: null,
      model: currentModel,
      role: 'assistant',
      stop_reason: 'stop_sequence',
      stop_sequence: '',
      type: 'message',
      usage,
      content,
      context_management: null,
    },
    requestId: undefined,
    apiError,
    error,
    isApiErrorMessage,
  };
}

/**
 * Create a simple text assistant message.
 * Original: QU in chunks.147.mjs:2381-2392
 */
export function createTextAssistantMessage({
  content,
  usage,
}: {
  content: string | ContentBlock[];
  usage?: CreateAssistantMessageInput['usage'];
}): AssistantMessage {
  return createAssistantMessage({
    content:
      typeof content === 'string'
        ? [
            {
              type: 'text',
              text: content === '' ? EMPTY_CONTENT_PLACEHOLDER : content,
            },
          ]
        : content,
    usage,
  });
}

/**
 * Create an error message.
 * Original: DZ in chunks.147.mjs:2394-2408
 */
export function createErrorMessage({
  content,
  apiError,
  error,
}: CreateErrorMessageInput): AssistantMessage {
  return createAssistantMessage({
    content: [
      {
        type: 'text',
        text: content === '' ? EMPTY_CONTENT_PLACEHOLDER : content,
      },
    ],
    isApiErrorMessage: true,
    apiError,
    error,
  });
}

// ============================================
// User Message Factory
// ============================================

/**
 * Create a user message.
 * Original: H0 in chunks.147.mjs:2410-2440
 */
export function createUserMessage({
  content,
  isMeta,
  isVisibleInTranscriptOnly,
  isCompactSummary,
  toolUseResult,
  uuid,
  thinkingMetadata,
  timestamp,
  todos,
  imagePasteIds,
  sourceToolAssistantUUID,
}: CreateUserMessageInput): UserMessage {
  return {
    type: 'user',
    message: {
      role: 'user',
      content: content || EMPTY_CONTENT_PLACEHOLDER,
    },
    isMeta,
    isVisibleInTranscriptOnly,
    isCompactSummary,
    uuid: uuid ?? generateUUID(),
    timestamp: timestamp ?? new Date().toISOString(),
    toolUseResult,
    thinkingMetadata,
    todos,
    imagePasteIds,
    sourceToolAssistantUUID,
  };
}

/**
 * Create a user message with input string and preceding blocks.
 * Original: IU in chunks.147.mjs:2442-2451
 */
export function createUserMessageWithPrecedingBlocks({
  inputString,
  precedingInputBlocks,
}: {
  inputString: string;
  precedingInputBlocks: ContentBlock[];
}): string | ContentBlock[] {
  if (precedingInputBlocks.length === 0) {
    return inputString;
  }
  return [
    ...precedingInputBlocks,
    {
      type: 'text',
      text: inputString,
    },
  ];
}

/**
 * Tool continuation message (user cancelled or waiting for tool).
 * Original: vN (with tool) and Ss (without tool) in chunks.147.mjs
 */
const TOOL_CONTINUATION_MESSAGE =
  'Please continue with your current task. If you have any pending tool calls, execute them now.';
const NO_TOOL_CONTINUATION_MESSAGE = 'Please continue.';

/**
 * Create a continuation prompt message.
 * Original: fhA in chunks.147.mjs:2453-2462
 */
export function createContinuationPrompt({
  toolUse = false,
}: {
  toolUse?: boolean;
}): UserMessage {
  return createUserMessage({
    content: [
      {
        type: 'text',
        text: toolUse ? TOOL_CONTINUATION_MESSAGE : NO_TOOL_CONTINUATION_MESSAGE,
      },
    ],
  });
}

/**
 * System reminder tag name.
 * Original: kZ0 in chunks.147.mjs
 */
const SYSTEM_REMINDER_TAG = 'system-reminder';

/**
 * Create a local command caveat message.
 * Original: NE in chunks.147.mjs:2464-2469
 */
export function createLocalCommandCaveat(): UserMessage {
  return createUserMessage({
    content: `<${SYSTEM_REMINDER_TAG}>Caveat: The messages below were generated by the user while running local commands. DO NOT respond to these messages or otherwise consider them in your response unless the user explicitly asks you to.</${SYSTEM_REMINDER_TAG}>`,
    isMeta: true,
  });
}

// ============================================
// Progress Message Factory
// ============================================

/**
 * Create a progress message.
 * Original: K19 in chunks.147.mjs:2471-2484
 */
export function createProgressMessage({
  toolUseID,
  parentToolUseID,
  data,
}: CreateProgressMessageInput): ProgressMessage {
  return {
    type: 'progress',
    data,
    toolUseID,
    parentToolUseID,
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
  };
}

// ============================================
// System Message Factory
// ============================================

/**
 * Create a system message.
 */
export function createSystemMessage({
  content,
  subtype,
}: {
  content: string;
  subtype?: 'api_error' | 'local_command' | 'notification' | 'warning';
}): SystemMessage {
  return {
    type: 'system',
    content,
    subtype,
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
  };
}

// ============================================
// Tool Result Factory
// ============================================

/**
 * Cancelled tool use message.
 * Original: aVA in chunks.147.mjs
 */
const CANCELLED_TOOL_USE_MESSAGE = 'Tool use was cancelled by user.';

/**
 * Create a cancelled tool result.
 * Original: FM0 in chunks.147.mjs:2486-2493
 */
export function createCancelledToolResult(toolUseId: string): {
  type: 'tool_result';
  content: string;
  is_error: boolean;
  tool_use_id: string;
} {
  return {
    type: 'tool_result',
    content: CANCELLED_TOOL_USE_MESSAGE,
    is_error: true,
    tool_use_id: toolUseId,
  };
}

// ============================================
// Export
// ============================================

export {
  EMPTY_CONTENT_PLACEHOLDER,
  createAssistantMessage,
  createTextAssistantMessage,
  createErrorMessage,
  createUserMessage,
  createUserMessageWithPrecedingBlocks,
  createContinuationPrompt,
  createLocalCommandCaveat,
  createProgressMessage,
  createSystemMessage,
  createCancelledToolResult,
  setCurrentModel,
  getCurrentModel,
};
