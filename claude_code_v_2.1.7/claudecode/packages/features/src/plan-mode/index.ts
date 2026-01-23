/**
 * @claudecode/features - Plan Mode Module
 *
 * Read-only exploration and planning phase for complex tasks.
 *
 * Key components:
 * - EnterPlanMode tool - Enters plan mode
 * - ExitPlanMode tool - Exits plan mode with user approval
 * - Plan file management - Slugs, paths, read/write
 * - State tracking - hasExitedPlanMode, needsPlanModeExitAttachment
 * - System reminders - Full, sparse, and subagent reminders
 *
 */

// ============================================
// Exports
// ============================================

export * from './types.js';
export * from './state.js';
export * from './slug-generator.js';
export * from './plan-file.js';
export * from './enter-plan-mode.js';
export * from './exit-plan-mode.js';
export * from './system-reminders.js';
export * from './attachments.js';

// ============================================
// Agent Definition
// ============================================

import { PlanAgentConfig } from './system-reminders.js';
import { PLAN_MODE_DISALLOWED_TOOLS } from './types.js';

/**
 * Get the Plan Mode agent definition.
 * Original: UY1 in chunks.93.mjs
 */
export function getPlanModeAgent() {
  return {
    ...PlanAgentConfig,
    // Plan agent uses standard read-only tools (injected by system)
    // It explicitly disallows modification tools and ExitPlanMode (only main agent exits)
    disallowedTools: [
      ...PLAN_MODE_DISALLOWED_TOOLS,
      'ExitPlanMode', // Subagents cannot exit plan mode
      'Task',         // Subagents cannot spawn more subagents (usually)
      'KillShell',    // Safety
    ],
  };
}
