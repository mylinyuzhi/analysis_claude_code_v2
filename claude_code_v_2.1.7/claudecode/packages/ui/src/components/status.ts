/**
 * @claudecode/ui - Status Components
 *
 * Status indicator and blinking animation management.
 * Reconstructed from chunks.66.mjs
 */

import type { ToolStatus, BlinkingState } from './types.js';
import { COMPONENT_CONSTANTS } from './types.js';

// ============================================
// Blinking Manager
// ============================================

/**
 * Blinking animation state manager.
 * Original: zW5 (BlinkingManager) in chunks.66.mjs
 *
 * Manages global blinking state for cursor and status indicators.
 * Uses a single interval to sync all blinking elements.
 */
export class BlinkingManager {
  private static instance: BlinkingManager | null = null;

  private isVisible = true;
  private isPaused = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private subscribers: Set<(state: BlinkingState) => void> = new Set();
  private interval: number;

  private constructor(interval = COMPONENT_CONSTANTS.BLINK_INTERVAL) {
    this.interval = interval;
  }

  /**
   * Get singleton instance.
   */
  static getInstance(): BlinkingManager {
    if (!BlinkingManager.instance) {
      BlinkingManager.instance = new BlinkingManager();
    }
    return BlinkingManager.instance;
  }

  /**
   * Start blinking animation.
   */
  start(): void {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        this.isVisible = !this.isVisible;
        this.notifySubscribers();
      }
    }, this.interval);
  }

  /**
   * Stop blinking animation.
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isVisible = true;
    this.notifySubscribers();
  }

  /**
   * Pause blinking (keeps visible).
   */
  pause(): void {
    this.isPaused = true;
    this.isVisible = true;
    this.notifySubscribers();
  }

  /**
   * Resume blinking.
   */
  resume(): void {
    this.isPaused = false;
  }

  /**
   * Subscribe to state changes.
   */
  subscribe(callback: (state: BlinkingState) => void): () => void {
    this.subscribers.add(callback);

    // Start if first subscriber
    if (this.subscribers.size === 1) {
      this.start();
    }

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);

      // Stop if no subscribers
      if (this.subscribers.size === 0) {
        this.stop();
      }
    };
  }

  /**
   * Get current state.
   */
  getState(): BlinkingState {
    return {
      isVisible: this.isVisible,
      isPaused: this.isPaused,
    };
  }

  private notifySubscribers(): void {
    const state = this.getState();
    for (const callback of this.subscribers) {
      callback(state);
    }
  }
}

// ============================================
// Status Utilities
// ============================================

/**
 * Get status icon for a tool status.
 * Original: k4A (StatusIndicator) in chunks.66.mjs
 */
export function getStatusIcon(status: ToolStatus): string {
  return COMPONENT_CONSTANTS.STATUS_ICONS[status] ?? COMPONENT_CONSTANTS.STATUS_ICONS.pending;
}

/**
 * Get status color for a tool status.
 */
export function getStatusColor(status: ToolStatus): string {
  return COMPONENT_CONSTANTS.STATUS_COLORS[status] ?? COMPONENT_CONSTANTS.STATUS_COLORS.pending;
}

/**
 * Format status text with icon.
 */
export function formatStatus(status: ToolStatus, label?: string): string {
  const icon = getStatusIcon(status);
  return label ? `${icon} ${label}` : icon;
}

/**
 * Check if status indicates completion.
 */
export function isTerminalStatus(status: ToolStatus): boolean {
  return status === 'success' || status === 'error' || status === 'cancelled';
}

/**
 * Check if status indicates activity.
 */
export function isActiveStatus(status: ToolStatus): boolean {
  return status === 'running' || status === 'waiting_permission';
}

// ============================================
// Status Text Formatting
// ============================================

/**
 * Format tool execution duration.
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

/**
 * Format tool result for display.
 */
export function formatToolResult(result: unknown, maxLength = COMPONENT_CONSTANTS.DEFAULT_TRUNCATE_LENGTH): string {
  if (result === null || result === undefined) {
    return '(no result)';
  }

  let text: string;

  if (typeof result === 'string') {
    text = result;
  } else if (typeof result === 'object') {
    try {
      text = JSON.stringify(result, null, 2);
    } catch {
      text = String(result);
    }
  } else {
    text = String(result);
  }

  // Truncate if needed
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '... (truncated)';
  }

  return text;
}

/**
 * Format error for display.
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return String(error);
}

// ============================================
// Export
// ============================================

// Note: exports are declared inline above.
