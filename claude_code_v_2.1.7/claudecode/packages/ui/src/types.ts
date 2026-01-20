/**
 * @claudecode/ui - Type Definitions
 *
 * Core types for the terminal UI framework.
 * Reconstructed from chunks.66.mjs, chunks.97.mjs
 */

import type { ReactNode } from 'react';

// ============================================
// Ink Element Types
// ============================================

/**
 * Ink element types.
 */
export type InkElementType =
  | 'ink-box'
  | 'ink-text'
  | 'ink-virtual-text'
  | 'ink-link'
  | 'ink-root';

/**
 * Ink node for terminal rendering.
 */
export interface InkNode {
  nodeName: InkElementType;
  childNodes: InkNode[];
  parentNode: InkNode | null;
  yogaNode?: unknown; // Yoga layout node
  style?: InkStyle;
  textStyles?: TextStyle;
  internal_static?: boolean;
  textContent?: string;
}

// ============================================
// Style Types
// ============================================

/**
 * Ink box style properties (maps to Yoga flexbox).
 */
export interface InkStyle {
  // Display
  display?: 'flex' | 'none';

  // Flexbox
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | string;
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';

  // Dimensions
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;

  // Padding
  padding?: number;
  paddingX?: number;
  paddingY?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;

  // Margin
  margin?: number;
  marginX?: number;
  marginY?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;

  // Border
  borderStyle?: 'single' | 'double' | 'round' | 'bold' | 'singleDouble' | 'doubleSingle' | 'classic';
  borderColor?: string;
  borderTopColor?: string;
  borderRightColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderDimColor?: boolean;

  // Position
  position?: 'absolute' | 'relative';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;

  // Overflow
  overflow?: 'visible' | 'hidden';
  overflowX?: 'visible' | 'hidden';
  overflowY?: 'visible' | 'hidden';

  // Gap (spacing between children)
  gap?: number;
  columnGap?: number;
  rowGap?: number;
}

/**
 * Text style properties.
 */
export interface TextStyle {
  // Color
  color?: string;
  backgroundColor?: string;

  // Font style
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  inverse?: boolean;
  dimColor?: boolean;

  // Wrapping
  wrap?: 'wrap' | 'truncate' | 'truncate-start' | 'truncate-middle' | 'truncate-end';
}

// ============================================
// Component Props
// ============================================

/**
 * Box component props.
 */
export interface BoxProps extends InkStyle {
  children?: ReactNode;
}

/**
 * Text component props.
 */
export interface TextProps extends TextStyle {
  children?: ReactNode;
}

/**
 * Link component props.
 */
export interface LinkProps extends TextStyle {
  url: string;
  children?: ReactNode;
}

/**
 * Static component props (for non-updating content).
 */
export interface StaticProps<T> {
  items: T[];
  children: (item: T, index: number) => ReactNode;
  style?: InkStyle;
}

// ============================================
// Input Types
// ============================================

/**
 * Key input event.
 */
export interface KeyInput {
  // Arrow keys
  upArrow: boolean;
  downArrow: boolean;
  leftArrow: boolean;
  rightArrow: boolean;

  // Special keys
  return: boolean;
  escape: boolean;
  ctrl: boolean;
  shift: boolean;
  meta: boolean;
  tab: boolean;
  backspace: boolean;
  delete: boolean;
  pageUp: boolean;
  pageDown: boolean;
}

/**
 * Text input props.
 */
export interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  focus?: boolean;
  mask?: string;
  showCursor?: boolean;
  highlightPastedText?: boolean;
}

// ============================================
// Animation Types
// ============================================

/**
 * Blinking animation state.
 * Original: BlinkingManager (zW5) in chunks.66.mjs
 */
export interface BlinkingState {
  isVisible: boolean;
  isPaused: boolean;
}

/**
 * Spinner types.
 */
export type SpinnerType =
  | 'dots'
  | 'dots2'
  | 'dots3'
  | 'line'
  | 'arc'
  | 'clock'
  | 'bounce'
  | 'triangle'
  | 'pipe';

// ============================================
// Layout Types
// ============================================

/**
 * Terminal dimensions.
 */
export interface TerminalDimensions {
  columns: number;
  rows: number;
}

/**
 * Measure function for custom layout.
 */
export type MeasureFunction = (
  maxWidth: number | undefined,
  maxHeight: number | undefined
) => { width: number; height: number };

// ============================================
// Render Types
// ============================================

/**
 * Render options.
 */
export interface RenderOptions {
  stdout?: NodeJS.WriteStream;
  stdin?: NodeJS.ReadStream;
  stderr?: NodeJS.WriteStream;
  debug?: boolean;
  exitOnCtrlC?: boolean;
  patchConsole?: boolean;
}

/**
 * Render instance returned by render().
 */
export interface RenderInstance {
  rerender: (element: ReactNode) => void;
  unmount: () => void;
  waitUntilExit: () => Promise<void>;
  cleanup: () => void;
  clear: () => void;
}

// ============================================
// UI Constants
// ============================================

export const UI_CONSTANTS = {
  // Default blinking interval
  BLINK_INTERVAL_MS: 500,

  // Spinner frame rate
  SPINNER_INTERVAL_MS: 80,

  // Default terminal width if not detected
  DEFAULT_TERMINAL_WIDTH: 80,

  // Margin for word wrapping
  WRAP_MARGIN: 2,

  // Status indicator colors
  STATUS_COLORS: {
    success: 'green',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    pending: 'gray',
  } as const,

  // Border characters
  BORDER_CHARS: {
    single: { topLeft: '┌', topRight: '┐', bottomLeft: '└', bottomRight: '┘', horizontal: '─', vertical: '│' },
    double: { topLeft: '╔', topRight: '╗', bottomLeft: '╚', bottomRight: '╝', horizontal: '═', vertical: '║' },
    round: { topLeft: '╭', topRight: '╮', bottomLeft: '╰', bottomRight: '╯', horizontal: '─', vertical: '│' },
  } as const,
} as const;

// Note: exports are declared inline above.
