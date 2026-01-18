/**
 * @claudecode/ui - Spinner Component
 *
 * Animated spinner for loading states.
 * Reconstructed from chunks.66.mjs
 */

import type { SpinnerConfig } from './types.js';
import { COMPONENT_CONSTANTS } from './types.js';

// ============================================
// Spinner State Management
// ============================================

/**
 * Spinner state manager.
 * Manages frame cycling for animated spinners.
 */
export class SpinnerState {
  private frameIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private config: SpinnerConfig;
  private onFrame: (frame: string) => void;

  constructor(
    type: keyof typeof COMPONENT_CONSTANTS.SPINNERS = 'dots',
    onFrame: (frame: string) => void
  ) {
    this.config = COMPONENT_CONSTANTS.SPINNERS[type] ?? COMPONENT_CONSTANTS.SPINNERS.dots;
    this.onFrame = onFrame;
  }

  /**
   * Start the spinner animation.
   */
  start(): void {
    if (this.intervalId) return;

    this.frameIndex = 0;
    this.onFrame(this.config.frames[0]);

    this.intervalId = setInterval(() => {
      this.frameIndex = (this.frameIndex + 1) % this.config.frames.length;
      this.onFrame(this.config.frames[this.frameIndex]);
    }, this.config.interval);
  }

  /**
   * Stop the spinner animation.
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Get current frame.
   */
  getCurrentFrame(): string {
    return this.config.frames[this.frameIndex];
  }

  /**
   * Check if running.
   */
  isRunning(): boolean {
    return this.intervalId !== null;
  }
}

// ============================================
// Spinner Utilities
// ============================================

/**
 * Get spinner frames for a type.
 */
export function getSpinnerFrames(type: keyof typeof COMPONENT_CONSTANTS.SPINNERS = 'dots'): string[] {
  return COMPONENT_CONSTANTS.SPINNERS[type]?.frames ?? COMPONENT_CONSTANTS.SPINNERS.dots.frames;
}

/**
 * Get spinner interval for a type.
 */
export function getSpinnerInterval(type: keyof typeof COMPONENT_CONSTANTS.SPINNERS = 'dots'): number {
  return COMPONENT_CONSTANTS.SPINNERS[type]?.interval ?? COMPONENT_CONSTANTS.SPINNERS.dots.interval;
}

/**
 * Create a simple text spinner that yields frames.
 */
export async function* createSpinnerGenerator(
  type: keyof typeof COMPONENT_CONSTANTS.SPINNERS = 'dots',
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  const config = COMPONENT_CONSTANTS.SPINNERS[type] ?? COMPONENT_CONSTANTS.SPINNERS.dots;
  let frameIndex = 0;

  while (!signal?.aborted) {
    yield config.frames[frameIndex];
    frameIndex = (frameIndex + 1) % config.frames.length;
    await new Promise((resolve) => setTimeout(resolve, config.interval));
  }
}

// ============================================
// Export
// ============================================

export { SpinnerState, getSpinnerFrames, getSpinnerInterval, createSpinnerGenerator };
