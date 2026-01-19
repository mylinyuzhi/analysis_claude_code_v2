/**
 * @claudecode/core - Message Types
 *
 * Type definitions for the message abstraction layer.
 * Reconstructed from chunks.147.mjs:2314-2596
 */

import type { ContentBlock } from '@claudecode/shared';
import type { ToolResultBlock } from '../tools/types.js';

// ============================================
// Base Message Fields
// ============================================

/**
 * Common fields for all Claude Code messages
 */
export interface BaseMessage {
  /** Internal UUID (Claude Code generated) */
  uuid: string;
  /** ISO timestamp when created */
  timestamp: string;
}

// ============================================
// Assistant Message
// ============================================

/**
 * API Message structure (Anthropic SDK compatible)
 */
export interface APIMessage {
  /** API-generated message ID */
  id: string;
  /** Container information */
  container: unknown | null;
  /** Model used */
  model: string;
  /** Message role */
  role: 'assistant';
  /** Stop reason */
  stop_reason: string | null;
  /** Stop sequence if applicable */
  stop_sequence: string | null;
  /** Message type */
  type: 'message';
  /** Token usage */
  usage: MessageUsage;
  /** Content blocks */
  content: ContentBlock[];
  /** Context management info */
  context_management: unknown | null;
}

/**
 * Token usage information
 */
export interface MessageUsage {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
  service_tier?: string | null;
  cache_creation?: {
    ephemeral_1h_input_tokens: number;
    ephemeral_5m_input_tokens: number;
  };
}

/**
 * Default usage values
 */
export const DEFAULT_USAGE: MessageUsage = {
  input_tokens: 0,
  output_tokens: 0,
  cache_read_input_tokens: 0,
  cache_creation_input_tokens: 0,
  service_tier: null,
  cache_creation: {
    ephemeral_1h_input_tokens: 0,
    ephemeral_5m_input_tokens: 0,
  },
};

/**
 * Assistant message (Claude's responses)
 */
export interface AssistantMessage extends BaseMessage {
  type: 'assistant';
  /** Wrapped SDK message */
  message: APIMessage;
  /** API request ID for debugging */
  requestId?: string;
  /** Error type if this is an error response */
  apiError?: string;
  /** Error object if execution failed */
  error?: Error;
  /** Whether this is an API error message */
  isApiErrorMessage?: boolean;
  /** Whether this is a meta message */
  isMeta?: boolean;
}

// ============================================
// User Message
// ============================================

/**
 * User message content structure
 */
export interface UserMessageContent {
  role: 'user';
  content: string | ContentBlock[];
}

/**
 * Thinking metadata for extended thinking mode
 */
export interface ThinkingMetadata {
  /** Whether thinking is visible */
  isVisible?: boolean;
  /** Thinking duration */
  duration?: number;
  /** Thinking token count */
  tokens?: number;
}

/**
 * User message (user inputs and tool results)
 */
export interface UserMessage extends BaseMessage {
  type: 'user';
  /** Message content */
  message: UserMessageContent;
  /** Internal/meta message flag */
  isMeta?: boolean;
  /** Visible only in transcript, not chat */
  isVisibleInTranscriptOnly?: boolean;
  /** Whether this is a compaction summary */
  isCompactSummary?: boolean;
  /** Tool execution result */
  toolUseResult?: ToolResultBlock | string;
  /** Extended thinking metadata */
  thinkingMetadata?: ThinkingMetadata;
  /** Current todo list state */
  todos?: unknown[];
  /** Image paste IDs for tracking */
  imagePasteIds?: string[];
  /** Links tool_result to original tool_use */
  sourceToolAssistantUUID?: string;
}

// ============================================
// Progress Message
// ============================================

/**
 * Progress data types
 */
export type ProgressDataType =
  | 'output'
  | 'status'
  | 'hook_progress'
  | 'streaming';

/**
 * Progress data structure
 */
export interface ProgressData {
  type: ProgressDataType;
  content?: string;
  hookEvent?: string;
  hookName?: string;
  percentage?: number;
}

/**
 * Progress message (for long-running operations)
 */
export interface ProgressMessage extends BaseMessage {
  type: 'progress';
  /** Progress data */
  data: ProgressData;
  /** Tool use ID this progress is for */
  toolUseID: string;
  /** Parent tool use ID if nested */
  parentToolUseID?: string;
}

// ============================================
// Attachment Message
// ============================================

/**
 * Attachment types
 */
export type AttachmentType =
  | 'file'
  | 'image'
  | 'url'
  | 'error'
  | 'interrupted'
  | 'structured_output'
  | 'hook_blocking_error'
  | 'hook_cancelled'
  | 'hook_error_during_execution'
  | 'hook_non_blocking_error'
  | 'hook_success'
  | 'hook_system_message'
  | 'hook_additional_context'
  | 'hook_stopped_continuation';

/**
 * Attachment structure
 */
export interface Attachment {
  type: AttachmentType;
  /** File path or URL */
  path?: string;
  /** Attachment content */
  content?: string | string[];
  /** Hook event type */
  hookEvent?: 'PreToolUse' | 'PostToolUse' | 'SubagentStart';
  /** Hook name */
  hookName?: string;
  /** Associated tool use ID */
  toolUseID?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Attachment message
 */
export interface AttachmentMessage {
  type: 'attachment';
  /** The attachment data */
  attachment: Attachment;
  /** Attachments array (for multiple) */
  attachments?: Attachment[];
}

// ============================================
// System Message
// ============================================

/**
 * System message subtypes
 */
export type SystemMessageSubtype =
  | 'api_error'
  | 'local_command'
  | 'notification'
  | 'warning';

/**
 * System message (internal system notifications)
 */
export interface SystemMessage extends BaseMessage {
  type: 'system';
  /** System message content */
  content: string;
  /** Subtype for categorization */
  subtype?: SystemMessageSubtype;
}

// ============================================
// Union Type
// ============================================

/**
 * Conversation message union type
 */
export type ConversationMessage =
  | AssistantMessage
  | UserMessage
  | ProgressMessage
  | AttachmentMessage
  | SystemMessage;

// ============================================
// Message Input Types (for factory functions)
// ============================================

/**
 * Input for creating assistant messages
 */
export interface CreateAssistantMessageInput {
  content: ContentBlock[];
  isApiErrorMessage?: boolean;
  apiError?: string;
  error?: Error;
  usage?: MessageUsage;
}

/**
 * Input for creating user messages
 */
export interface CreateUserMessageInput {
  content: string | ContentBlock[];
  isMeta?: boolean;
  isVisibleInTranscriptOnly?: boolean;
  isCompactSummary?: boolean;
  toolUseResult?: ToolResultBlock | string;
  isHookOutput?: boolean;
  uuid?: string;
  thinkingMetadata?: ThinkingMetadata;
  timestamp?: string;
  todos?: unknown[];
  imagePasteIds?: string[];
  sourceToolAssistantUUID?: string;
}

/**
 * Input for creating error messages
 */
export interface CreateErrorMessageInput {
  content: string;
  apiError?: string;
  error?: Error;
}

/**
 * Input for creating progress messages
 */
export interface CreateProgressMessageInput {
  toolUseID: string;
  parentToolUseID?: string;
  data: ProgressData;
}

// ============================================
// Tool Use Analysis Types
// ============================================

/**
 * Tool use group for reordering
 */
export interface ToolUseGroup {
  toolUse: AssistantMessage | null;
  preHooks: AttachmentMessage[];
  toolResult: UserMessage | null;
  postHooks: AttachmentMessage[];
}

/**
 * Message analysis cache
 */
export interface MessageAnalysisCache {
  /** Map of tool use IDs to sibling IDs */
  siblingToolUseIDs: Map<string, Set<string>>;
  /** Progress messages grouped by tool use ID */
  progressMessagesByToolUseID: Map<string, ProgressMessage[]>;
  /** In-progress hook counts */
  inProgressHookCounts: Map<string, Map<string, number>>;
  /** Resolved hook counts */
  resolvedHookCounts: Map<string, Map<string, number>>;
}

// ============================================
// Export
// ============================================

// NOTE: 类型已在声明处导出；移除重复聚合导出以避免 TS2484。
