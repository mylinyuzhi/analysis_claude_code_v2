/**
 * @claudecode/ui - Component Types
 *
 * Type definitions for UI components.
 * Reconstructed from chunks.66.mjs, chunks.67.mjs
 */

import type { ReactNode } from 'react';

export type { BlinkingState } from '../types.js';

// ============================================
// Status Types
// ============================================

/**
 * Tool execution status.
 */
export type ToolStatus =
  | 'pending'
  | 'running'
  | 'success'
  | 'error'
  | 'cancelled'
  | 'waiting_permission';

/**
 * Status indicator props.
 * Original: k4A (StatusIndicator) in chunks.66.mjs
 */
export interface StatusIndicatorProps {
  /** Whether the dot should blink. */
  shouldAnimate: boolean;
  /** Whether the operation is unresolved (in-progress). */
  isUnresolved: boolean;
  /** Whether this tool use is errored (dot stays visible). */
  isError: boolean;
}

// ============================================
// Spinner Types
// ============================================

/**
 * Spinner props.
 */
export interface SpinnerProps {
  type?: 'dots' | 'line' | 'arc' | 'bounce';
  color?: string;
  label?: string;
}

/**
 * Spinner frame configuration.
 */
export interface SpinnerConfig {
  frames: string[];
  interval: number;
}

// ============================================
// Tool Display Types
// ============================================

/**
 * Tool use display props.
 * Original: VZ2 (ToolUseDisplay) in chunks.66.mjs
 */
export interface ToolUseDisplayProps {
  /** Tool use block from model output */
  param: { type?: 'tool_use'; id: string; name: string; input: unknown };
  /** Available tool definitions (duck-typed) */
  tools: unknown[];
  /** Tool use IDs that errored */
  erroredToolUseIDs?: Set<string>;
  /** Tool use IDs currently in progress */
  inProgressToolUseIDs?: Set<string>;
  /** Tool use IDs resolved */
  resolvedToolUseIDs?: Set<string>;
  /** Progress messages associated with the parent assistant message */
  progressMessagesForMessage?: unknown[];
  /** Whether blinking animations should run */
  shouldAnimate?: boolean;
  /** Whether to render the status dot */
  shouldShowDot?: boolean;
}

/**
 * Tool result display props.
 */
export interface ToolResultDisplayProps {
  result: unknown;
  truncateAt?: number;
  showFull?: boolean;
}

// ============================================
// Message Types
// ============================================

/**
 * Message display props.
 */
export interface MessageDisplayProps {
  role: 'user' | 'assistant' | 'system';
  content: string | ReactNode;
  timestamp?: Date;
  isStreaming?: boolean;
}

/**
 * Assistant message props with tool uses.
 */
export interface AssistantMessageProps {
  content: string;
  toolUses?: ToolUseDisplayProps[];
  isStreaming?: boolean;
  model?: string;
}

// ============================================
// Input Types
// ============================================

/**
 * Multi-line text input props.
 */
export interface MultilineInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLines?: number;
  historyEnabled?: boolean;
}

/**
 * Autocomplete suggestion.
 */
export interface AutocompleteSuggestion {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

/**
 * Autocomplete input props.
 */
export interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: AutocompleteSuggestion) => void;
  suggestions: AutocompleteSuggestion[];
  placeholder?: string;
}

// ============================================
// Permission Types
// ============================================

/**
 * Question prompt props (for AskUserQuestion).
 */
export interface QuestionPromptProps {
  question: string;
  header?: string;
  options: Array<{
    label: string;
    description?: string;
  }>;
  multiSelect?: boolean;
  onAnswer: (answers: string[]) => void;
}

// ============================================
// Progress Types
// ============================================

/**
 * Progress bar props.
 */
export interface ProgressBarProps {
  value: number; // 0-100
  maxValue?: number;
  width?: number;
  showPercentage?: boolean;
  color?: string;
  label?: string;
}

/**
 * Task progress props.
 */
export interface TaskProgressProps {
  tasks: Array<{
    id: string;
    label: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
  }>;
  showCompleted?: boolean;
}

// ============================================
// Layout Types
// ============================================

/**
 * Panel props.
 */
export interface PanelProps {
  title?: string;
  children: ReactNode;
  borderStyle?: 'single' | 'double' | 'round' | 'bold';
  borderColor?: string;
  padding?: number;
}

/**
 * Divider props.
 */
export interface DividerProps {
  title?: string;
  width?: number;
  style?: 'single' | 'double' | 'dashed';
  color?: string;
}

/**
 * Scrollable area props.
 */
export interface ScrollAreaProps {
  children: ReactNode;
  height: number;
  showScrollbar?: boolean;
}

// ============================================
// Animation Types
// ============================================

/**
 * Blinking text props.
 */
export interface BlinkingTextProps {
  children: ReactNode;
  interval?: number;
  showWhenPaused?: boolean;
}

/**
 * Fade in/out props.
 */
export interface FadeProps {
  children: ReactNode;
  visible: boolean;
  duration?: number;
}

// ============================================
// Table Types
// ============================================

/**
 * Table props.
 * Original: gG2 (TableRenderer) in chunks.97.mjs
 */
export interface TableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    header: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
    render?: (value: T[keyof T], row: T) => ReactNode;
  }>;
  maxWidth?: number;
  showHeader?: boolean;
  borderStyle?: 'single' | 'double' | 'none';
}

// ============================================
// Constants
// ============================================

export const COMPONENT_CONSTANTS = {
  // Spinner configurations
  SPINNERS: {
    dots: {
      frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
      interval: 80,
    },
    line: {
      frames: ['-', '\\', '|', '/'],
      interval: 100,
    },
    arc: {
      frames: ['◜', '◠', '◝', '◞', '◡', '◟'],
      interval: 100,
    },
    bounce: {
      frames: ['⠁', '⠂', '⠄', '⠂'],
      interval: 120,
    },
  } satisfies Record<string, SpinnerConfig>,

  // Status icons
  STATUS_ICONS: {
    pending: '○',
    running: '◐',
    success: '✓',
    error: '✗',
    cancelled: '⊘',
    waiting_permission: '?',
  } as const,

  // Status colors
  STATUS_COLORS: {
    pending: 'gray',
    running: 'blue',
    success: 'green',
    error: 'red',
    cancelled: 'yellow',
    waiting_permission: 'magenta',
  } as const,

  // Default truncation length
  DEFAULT_TRUNCATE_LENGTH: 500,

  // Animation intervals
  BLINK_INTERVAL: 500,
  SPINNER_INTERVAL: 80,
} as const;

// Note: exports are declared inline above.
