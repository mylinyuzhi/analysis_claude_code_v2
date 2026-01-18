/**
 * @claudecode/features - Plan Mode Types
 *
 * Type definitions for plan mode.
 * Reconstructed from chunks.86.mjs, chunks.119.mjs, chunks.120.mjs
 */

// ============================================
// Tool Input/Output Types
// ============================================

/**
 * EnterPlanMode tool input (empty).
 * Original: fl5 in chunks.120.mjs
 */
export interface EnterPlanModeInput {
  // No input parameters
}

/**
 * EnterPlanMode tool output.
 * Original: hl5 in chunks.120.mjs
 */
export interface EnterPlanModeOutput {
  message: string;
}

/**
 * Allowed prompt for Bash commands.
 * Original: Zl5 in chunks.119.mjs
 */
export interface AllowedPrompt {
  /** The tool this prompt applies to */
  tool: 'Bash';
  /** Semantic description of the action, e.g. "run tests" */
  prompt: string;
}

/**
 * ExitPlanMode tool input.
 * Original: Yl5 in chunks.119.mjs
 */
export interface ExitPlanModeInput {
  /** Prompt-based permissions needed to implement the plan */
  allowedPrompts?: AllowedPrompt[];
}

/**
 * ExitPlanMode tool output.
 * Original: Jl5 in chunks.119.mjs
 */
export interface ExitPlanModeOutput {
  /** Plan content */
  plan?: string;
  /** Whether from agent context */
  isAgent?: boolean;
  /** Plan file path */
  filePath?: string;
  /** Awaiting team lead approval (enterprise) */
  awaitingLeaderApproval?: boolean;
}

// ============================================
// Permission Action Types
// ============================================

/**
 * Permission mode.
 */
export type PermissionMode = 'default' | 'plan' | 'acceptEdits' | 'bypassPermissions';

/**
 * Set mode action.
 */
export interface SetModeAction {
  type: 'setMode';
  mode: PermissionMode;
  destination: 'session' | 'permanent';
}

/**
 * Tool permission context.
 */
export interface ToolPermissionContext {
  mode: PermissionMode;
  allowedPrompts?: AllowedPrompt[];
}

// ============================================
// Plan File Types
// ============================================

/**
 * Plan slug cache entry.
 */
export interface PlanSlugCache {
  sessionId: string;
  slug: string;
}

// ============================================
// Global State Types
// ============================================

/**
 * Plan mode global state.
 */
export interface PlanModeState {
  /** True if user exited plan mode this session */
  hasExitedPlanMode: boolean;
  /** True if exit attachment needed */
  needsPlanModeExitAttachment: boolean;
}

// ============================================
// System Reminder Types
// ============================================

/**
 * Plan mode reminder type.
 */
export type PlanReminderType = 'full' | 'sparse' | 'subagent';

/**
 * Plan mode attachment data.
 */
export interface PlanModeAttachmentData {
  /** Whether plan file exists */
  planExists: boolean;
  /** Plan file path */
  filePath: string;
  /** Current phase (1-5) */
  currentPhase?: number;
  /** Reminder type */
  reminderType: PlanReminderType;
}

// ============================================
// Re-entry Detection Types
// ============================================

/**
 * Plan mode re-entry attachment.
 */
export interface PlanModeReentryData {
  /** Previous plan content */
  previousPlan: string;
  /** Previous plan file path */
  filePath: string;
}

// ============================================
// Attachment Types
// ============================================

/**
 * Plan mode attachment.
 * Original: j27 output in chunks.131.mjs
 */
export interface PlanModeAttachment {
  type: 'plan_mode';
  reminderType: PlanReminderType;
  isSubAgent: boolean;
  planFilePath: string;
  planExists: boolean;
}

/**
 * Plan mode re-entry attachment.
 */
export interface PlanModeReentryAttachment {
  type: 'plan_mode_reentry';
  planFilePath: string;
}

/**
 * Plan mode exit attachment.
 * Original: T27 output in chunks.131.mjs
 */
export interface PlanModeExitAttachment {
  type: 'plan_mode_exit';
  planFilePath: string;
  planExists: boolean;
}

/**
 * Union of all plan mode attachment types.
 */
export type PlanModeAttachmentUnion =
  | PlanModeAttachment
  | PlanModeReentryAttachment
  | PlanModeExitAttachment;

/**
 * Result from findPlanModeAttachmentInfo.
 * Original: R27 output in chunks.131.mjs
 */
export interface PlanModeAttachmentInfo {
  turnCount: number;
  foundPlanModeAttachment: boolean;
}

/**
 * Message type for attachment search.
 */
export interface AttachmentMessage {
  type?: string;
  attachment?: {
    type?: string;
  };
}

/**
 * Tool use context for attachment building.
 */
export interface AttachmentToolUseContext {
  agentId?: string;
  getAppState: () => Promise<{
    toolPermissionContext: {
      mode: PermissionMode;
    };
  }>;
}

// ============================================
// Constants
// ============================================

/**
 * Plan mode constants.
 */
export const PLAN_MODE_CONSTANTS = {
  /** Max retries for unique slug generation */
  MAX_SLUG_RETRIES: 10,
  /** Turns between plan mode attachments */
  TURNS_BETWEEN_ATTACHMENTS: 5,
  /** Full reminder every N attachments */
  FULL_REMINDER_EVERY_N_ATTACHMENTS: 3,
  /** Max Plan agents */
  DEFAULT_PLAN_AGENT_COUNT: 1,
  /** Max Explore agents */
  DEFAULT_EXPLORE_AGENT_COUNT: 3,
} as const;

/**
 * Disallowed tools in plan mode.
 */
export const PLAN_MODE_DISALLOWED_TOOLS = [
  'Edit',
  'Write',
  'NotebookEdit',
  'MultiEdit',
  // Task tool for Plan agent type only allows certain subagent types
] as const;

// ============================================
// Export
// ============================================

export {
  EnterPlanModeInput,
  EnterPlanModeOutput,
  AllowedPrompt,
  ExitPlanModeInput,
  ExitPlanModeOutput,
  PermissionMode,
  SetModeAction,
  ToolPermissionContext,
  PlanSlugCache,
  PlanModeState,
  PlanReminderType,
  PlanModeAttachmentData,
  PlanModeReentryData,
  PlanModeAttachment,
  PlanModeReentryAttachment,
  PlanModeExitAttachment,
  PlanModeAttachmentUnion,
  PlanModeAttachmentInfo,
  AttachmentMessage,
  AttachmentToolUseContext,
  PLAN_MODE_CONSTANTS,
  PLAN_MODE_DISALLOWED_TOOLS,
};
