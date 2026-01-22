import React, { createContext } from 'react';
import type { TerminalDimensions } from './types.js';

/**
 * TerminalDimensionsContext - Terminal size (columns, rows)
 * Original: l_A in chunks.67.mjs
 */
export const TerminalDimensionsContext = createContext<TerminalDimensions>({
  columns: 80,
  rows: 24,
});

/**
 * InkContext - Flag for Ink v2 features (renderer v2)
 * Original: k_ in chunks.67.mjs
 */
export const InkContext = createContext<boolean>(false);

/**
 * ExitContext - Application exit handler
 * Original: K21 in chunks.67.mjs
 */
export interface ExitContextValue {
  exit: (error?: Error) => void;
}
export const ExitContext = createContext<ExitContextValue>({
  exit: () => {},
});

/**
 * StdinContext - Input stream, raw mode control
 * Original: V21 in chunks.67.mjs
 */
export interface StdinContextValue {
  stdin: NodeJS.ReadStream;
  setRawMode: (enabled: boolean) => void;
  isRawModeSupported: boolean;
  internal_exitOnCtrlC: boolean;
  internal_eventEmitter: any;
}
export const StdinContext = createContext<StdinContextValue | null>(null);

/**
 * FocusContext - Focus navigation state
 * Original: F21 in chunks.67.mjs
 */
export interface FocusContextValue {
  activeId: string | undefined;
  add: (id: string, options: { autoFocus?: boolean }) => void;
  remove: (id: string) => void;
  activate: (id: string) => void;
  deactivate: (id: string) => void;
  enableFocus: () => void;
  disableFocus: () => void;
  focusNext: () => void;
  focusPrevious: () => void;
  focus: (id: string) => void;
}
export const FocusContext = createContext<FocusContextValue | null>(null);

/**
 * TerminalFocusContext - Terminal window focus state
 * Original: E21 in chunks.67.mjs
 */
export interface TerminalFocusContextValue {
  isTerminalFocused: boolean;
}
export const TerminalFocusContext = createContext<TerminalFocusContextValue>({
  isTerminalFocused: true,
});

/**
 * ThemeContext - Theme state
 * Original: part of xQ0 in chunks.67.mjs
 */
export interface ThemeContextValue {
  theme: any;
  setTheme: (theme: any) => void;
}
export const ThemeContext = createContext<ThemeContextValue | null>(null);
