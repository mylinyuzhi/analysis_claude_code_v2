/**
 * @claudecode/features - Compact Types
 *
 * Type definitions for the compaction system.
 * Reconstructed from chunks.132.mjs, chunks.107.mjs
 */

import type { ConversationMessage } from '@claudecode/core';
import type { ContentBlock } from '@claudecode/shared';

// ============================================
// Constants
// ============================================

/**
 * Compaction threshold constants.
 * Original: chunks.132.mjs
 */
export const COMPACT_CONSTANTS = {
  /** Minimum tokens to preserve after compact */
  MIN_TOKENS_TO_PRESERVE: 13000, // uL0
  /** Warning threshold offset from limit */
  WARNING_THRESHOLD_OFFSET: 20000, // c97
  /** Error threshold offset from limit */
  ERROR_THRESHOLD_OFFSET: 20000, // p97
  /** Minimum blocking limit offset */
  MIN_BLOCKING_OFFSET: 3000, // mL0
  /** Micro-compact minimum savings required */
  MICRO_COMPACT_MIN_SAVINGS: 20000, // T97
  /** Micro-compact default threshold */
  MICRO_COMPACT_THRESHOLD: 40000, // P97
  /** Recent tool results to keep uncompressed */
  RECENT_TOOL_RESULTS_TO_KEEP: 3, // S97
  /** Estimated tokens per image */
  TOKENS_PER_IMAGE: 2000, // _s2
  /** Maximum files to restore after compact */
  MAX_FILES_TO_RESTORE: 5, // I97
  /** Maximum tokens per restored file */
  MAX_TOKENS_PER_FILE: 5000, // W97
  /** Total file token budget for restoration */
  TOTAL_FILE_TOKEN_BUDGET: 50000, // D97
  /** Maximum summary retry attempts */
  MAX_SUMMARY_RETRIES: 2, // K97
  /** Maximum compact output tokens */
  MAX_COMPACT_OUTPUT_TOKENS: 16000, // nU1
} as const;

// ============================================
// Threshold Types
// ============================================

/**
 * Compaction threshold calculation result.
 * Original: ic() return type in chunks.132.mjs
 */
export interface ThresholdResult {
  /** Percentage of context remaining */
  percentLeft: number;
  /** Above warning threshold */
  isAboveWarningThreshold: boolean;
  /** Above error threshold */
  isAboveErrorThreshold: boolean;
  /** Should trigger auto-compact */
  isAboveAutoCompactThreshold: boolean;
  /** At blocking limit (prevent further input) */
  isAtBlockingLimit: boolean;
}

// ============================================
// Compact Result Types
// ============================================

/**
 * Boundary marker for compact events
 */
export interface BoundaryMarker {
  type: 'system';
  subtype: 'compact_boundary';
  content: string;
  isMeta: boolean;
  timestamp: string;
  uuid: string;
  level: 'info';
  compactMetadata: {
    trigger: 'auto' | 'manual';
    preTokens: number;
  };
}

/**
 * Hook result from PreCompact hooks
 */
export interface PreCompactHookResult {
  /** New custom instructions from hooks */
  newCustomInstructions?: string;
  /** Message to display to user */
  userDisplayMessage?: string;
}

/**
 * Token usage statistics
 */
export interface CompactUsageStats {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
}

/**
 * Attachment for restored context
 */
export interface CompactAttachment {
  context: 'post-compact';
  /**
   * Post-compact restored attachments are later converted to system reminders.
   * Their payload shape varies by type (e.g. `todo` has `itemCount`, `plan_file_reference` has `planFilePath`).
   */
  type: 'file' | 'todo' | 'plan_file_reference' | 'invoked_skills' | 'task_status';
  [key: string]: unknown;
}

/**
 * Full compact result.
 * Original: cF1 return type in chunks.132.mjs
 */
export interface FullCompactResult {
  /** Boundary marker for UI */
  boundaryMarker: BoundaryMarker;
  /** Summary messages to replace original conversation */
  summaryMessages: ConversationMessage[];
  /** Optional tail of recent messages to preserve verbatim (session-memory compact) */
  messagesToKeep?: ConversationMessage[];
  /** Restored context attachments */
  attachments: CompactAttachment[];
  /** SessionStart hook results */
  hookResults: unknown[];
  /** Message to display to user from hooks */
  userDisplayMessage?: string;
  /** Token count before compact */
  preCompactTokenCount?: number;
  /** Token count after compact */
  postCompactTokenCount: number;
  /** Token usage from LLM call */
  compactionUsage?: CompactUsageStats;
}

/**
 * Session memory compact result.
 * Original: sF1 return type in chunks.132.mjs
 */
export interface SessionMemoryCompactResult extends FullCompactResult {
  /** Whether this was from session memory cache */
  fromSessionMemory: true;
}

/**
 * Auto-compact dispatcher result
 */
export interface AutoCompactResult {
  /** Whether compaction was performed */
  wasCompacted: boolean;
  /** Compaction result if performed */
  compactionResult?: FullCompactResult | SessionMemoryCompactResult;
}

// ============================================
// Session Memory Types
// ============================================

/**
 * Session memory types
 */
export type SessionMemoryType = 'ephemeral' | 'persistent' | 'none';

/**
 * Session memory config
 */
export interface SessionMemoryConfig {
  type: SessionMemoryType;
  summaryPath?: string;
  lastSummarizedId?: string;
}

// ============================================
// Micro-Compact Types
// ============================================

/**
 * Micro-compact options
 */
export interface MicroCompactOptions {
  /** Minimum token savings required */
  minSavings?: number;
  /** Number of recent tool results to keep */
  recentToKeep?: number;
  /** Current token threshold */
  threshold?: number;
}

/**
 * Micro-compact result
 */
export interface MicroCompactResult {
  /** Modified messages */
  messages: ConversationMessage[];
  /** Tokens saved */
  tokensSaved: number;
  /** Number of tool results cleared */
  resultsCleared: number;
}

// ============================================
// Context Types
// ============================================

/**
 * Compact session context
 */
export interface CompactSessionContext {
  /** Agent ID */
  agentId?: string;
  /** Get app state */
  getAppState: () => Promise<unknown>;
  /** Set app state */
  setAppState?: (updater: (state: unknown) => unknown) => void;
  /** Abort controller */
  abortController: AbortController;
  /** Read file state for context restoration */
  readFileState: Map<string, { content: string; timestamp: number }>;
  /** Options */
  options: {
    mainLoopModel?: string;
    isNonInteractiveSession?: boolean;
    appendSystemPrompt?: string;
    agentDefinitions?: { activeAgents: unknown[] };
  };
  /** UI callbacks */
  setSpinnerColor?: (color: string | null) => void;
  setSpinnerShimmerColor?: (color: string | null) => void;
  setSpinnerMessage?: (message: string | null) => void;
  setSDKStatus?: (status: string | null) => void;
  setStreamMode?: (mode: string) => void;
  setResponseLength?: (updater: (current: number) => number) => void;
}

// ============================================
// Error Types
// ============================================

/**
 * Compact error codes
 */
export enum CompactErrorCode {
  NOT_ENOUGH_MESSAGES = 'NOT_ENOUGH_MESSAGES',
  SUMMARY_FAILED = 'SUMMARY_FAILED',
  API_ERROR = 'API_ERROR',
  PROMPT_TOO_LONG = 'PROMPT_TOO_LONG',
  COMPACTION_INTERRUPTED = 'COMPACTION_INTERRUPTED',
}

/**
 * Compact error
 */
export class CompactError extends Error {
  code: CompactErrorCode;

  constructor(code: CompactErrorCode, message: string) {
    super(message);
    this.name = 'CompactError';
    this.code = code;
  }
}

// ============================================
// Export
// ============================================

// NOTE: 类型/常量已在声明处导出；移除重复聚合导出。
