/**
 * @claudecode/features - Plan Mode State
 *
 * Global state tracking for plan mode.
 * Reconstructed from chunks.1.mjs:2706-2725
 */

import type { PlanModeState, PermissionMode } from './types.js';

// ============================================
// Global State
// ============================================

const globalState: PlanModeState = {
  hasExitedPlanMode: false,
  needsPlanModeExitAttachment: false,
};

// ============================================
// Has Exited Plan Mode
// ============================================

/**
 * Check if user has exited plan mode this session.
 * Original: Xf0 in chunks.1.mjs:2706-2708
 */
export function hasExitedPlanMode(): boolean {
  return globalState.hasExitedPlanMode;
}

/**
 * Set has exited plan mode flag.
 * Original: Iq in chunks.1.mjs:2710-2712
 */
export function setHasExitedPlanMode(value: boolean): void {
  globalState.hasExitedPlanMode = value;
}

// ============================================
// Needs Plan Mode Exit Attachment
// ============================================

/**
 * Check if exit attachment is needed.
 * Original: If0 in chunks.1.mjs:2714-2716
 */
export function needsPlanModeExitAttachment(): boolean {
  return globalState.needsPlanModeExitAttachment;
}

/**
 * Set needs exit attachment flag.
 * Original: lw in chunks.1.mjs:2718-2720
 */
export function setNeedsPlanModeExitAttachment(value: boolean): void {
  globalState.needsPlanModeExitAttachment = value;
}

// ============================================
// Mode Change Handler
// ============================================

/**
 * Handle permission mode changes.
 * Original: Ty in chunks.1.mjs:2722-2725
 *
 * @param oldMode - Previous mode
 * @param newMode - New mode
 */
export function onToolPermissionModeChanged(
  oldMode: PermissionMode,
  newMode: PermissionMode
): void {
  // When entering plan mode from non-plan: clear exit attachment flag
  if (newMode === 'plan' && oldMode !== 'plan') {
    globalState.needsPlanModeExitAttachment = false;
  }

  // When exiting plan mode: set exit attachment flag
  if (oldMode === 'plan' && newMode !== 'plan') {
    globalState.needsPlanModeExitAttachment = true;
  }
}

// ============================================
// Reset State
// ============================================

/**
 * Reset plan mode state.
 * Called on /clear command.
 */
export function resetPlanModeState(): void {
  globalState.hasExitedPlanMode = false;
  globalState.needsPlanModeExitAttachment = false;
}

// ============================================
// Check Mode
// ============================================

/**
 * Check if currently in plan mode.
 */
export function isInPlanMode(mode: PermissionMode): boolean {
  return mode === 'plan';
}
