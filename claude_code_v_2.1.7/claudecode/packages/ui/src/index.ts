/**
 * @claudecode/ui
 *
 * Terminal UI components for Claude Code (Ink-based).
 *
 * Key features:
 * - Ink-based React components for terminal rendering
 * - Markdown tokenization and styled output
 * - Status indicators and spinners
 * - Blinking animation management
 *
 * Reconstructed from chunks.66.mjs, chunks.67.mjs, chunks.97.mjs
 */

// ============================================
// Core Types
// ============================================

export * from './types.js';
export * from './contexts.js';

// ============================================
// Components
// ============================================

export * from './components/index.js';

// Re-export commonly used components at top level
export {
  SpinnerState,
  getSpinnerFrames,
  getSpinnerInterval,
  createSpinnerGenerator,
  BlinkingManager,
  getStatusIcon,
  getStatusColor,
  formatStatus,
  formatDuration,
  formatToolResult,
  formatError,
} from './components/index.js';

// ============================================
// Markdown
// ============================================

export * from './markdown/index.js';

// Re-export commonly used markdown functions at top level
export {
  tokenToStyledText,
  renderMarkdown,
  MARKDOWN_CONSTANTS,
} from './markdown/index.js';
