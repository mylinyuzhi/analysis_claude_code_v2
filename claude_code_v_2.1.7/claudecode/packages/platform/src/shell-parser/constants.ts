/**
 * @claudecode/platform - Shell Parser Constants
 *
 * Constants for shell command parsing and security analysis.
 * Reconstructed from chunks.121.mjs, chunks.123.mjs
 */

import type { EscapeMarkers } from './types.js';

// ============================================
// Escape Markers
// ============================================

/**
 * Generate unique escape markers for tokenization.
 * Original: DJ9 in chunks.147.mjs
 */
export function getEscapeMarkers(): EscapeMarkers {
  const uid = Math.random().toString(36).slice(2, 10);
  return {
    DOUBLE_QUOTE: `__DQ_${uid}__`,
    SINGLE_QUOTE: `__SQ_${uid}__`,
    NEW_LINE: `__NL_${uid}__`,
    ESCAPED_OPEN_PAREN: `__EOP_${uid}__`,
    ESCAPED_CLOSE_PAREN: `__ECP_${uid}__`,
  };
}

// ============================================
// Dangerous Patterns
// ============================================

/**
 * Dangerous substitution patterns.
 */
export const DANGEROUS_PATTERNS = [
  { pattern: /<\(/, message: 'process substitution <()' },
  { pattern: />\(/, message: 'process substitution >()' },
  { pattern: /\$\(/, message: '$() command substitution' },
  { pattern: /\$\{/, message: '${} parameter substitution' },
  { pattern: /~\[/, message: 'Zsh-style parameter expansion' },
  { pattern: /\(e:/, message: 'Zsh-style glob qualifiers' },
  { pattern: /<#/, message: 'PowerShell comment syntax' },
] as const;

/**
 * Shell metacharacters that require special handling.
 */
export const SHELL_METACHARACTERS = ['&', '|', '&&', '||', ';'] as const;

/**
 * Dangerous environment variables.
 */
export const DANGEROUS_ENV_VARS = ['IFS', 'LD_PRELOAD', 'LD_LIBRARY_PATH'] as const;

/**
 * Sensitive file paths.
 */
export const SENSITIVE_PATHS = [
  '/proc/self/environ',
  '/proc/*/environ',
  '/etc/passwd',
  '/etc/shadow',
] as const;

// ============================================
// JQ Dangerous Patterns
// ============================================

/**
 * JQ system function pattern.
 */
export const JQ_SYSTEM_PATTERN = /\bsystem\s*\(/;

/**
 * JQ file access flags.
 */
export const JQ_FILE_FLAGS =
  /(?:^|\s)(?:-f\b|--from-file|--rawfile|--slurpfile|-L\b|--library-path)/;

// ============================================
// Heredoc Patterns
// ============================================

/**
 * Heredoc detection pattern.
 */
export const HEREDOC_SUBSTITUTION_PATTERN = /\$\(.*<<-?/;

/**
 * Safe heredoc pattern (quoted/escaped delimiter).
 */
export const SAFE_HEREDOC_PATTERN =
  /\$\(cat\s*<<-?\s*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g;

// ============================================
// Obfuscated Flag Patterns
// ============================================

/**
 * ANSI-C quoting pattern ($'...').
 */
export const ANSI_C_QUOTE_PATTERN = /\$'[^']*'/;

/**
 * Locale quoting pattern ($"...").
 */
export const LOCALE_QUOTE_PATTERN = /\$"[^"]*"/;

/**
 * Empty special quotes before dash.
 */
export const EMPTY_SPECIAL_QUOTES_PATTERN = /\$['"]{2}\s*-/;

/**
 * Empty regular quotes before dash.
 */
export const EMPTY_QUOTES_PATTERN = /(?:^|\s)(?:''|"")+\s*-/;

// ============================================
// Incomplete Command Patterns
// ============================================

/**
 * Tab-indented fragment.
 */
export const TAB_INDENT_PATTERN = /^\s*\t/;

/**
 * Operator-starting fragment.
 */
export const OPERATOR_START_PATTERN = /^\s*(&&|\|\||;|>>?|<)/;

// ============================================
// Redirection Patterns
// ============================================

/**
 * Output redirection operators.
 */
export const OUTPUT_REDIRECT_OPERATORS = ['>', '>>', '>&', '2>', '2>>'] as const;

/**
 * Safe redirections (can be stripped without affecting command).
 */
export const SAFE_REDIRECTIONS = [
  /\s+2\s*>&\s*1(?=\s|$)/g, // 2>&1
  /[012]?\s*>\s*\/dev\/null/g, // >/dev/null
  /\s*<\s*\/dev\/null/g, // </dev/null
] as const;

// ============================================
// CWD Reset Detection
// ============================================

/**
 * CWD reset regex pattern.
 * Original: UT2 in chunks.112.mjs
 */
export const CWD_RESET_REGEX =
  /\[claude-code-cwd-reset:\s*([^\]]*)\]/;

// ============================================
// Valid File Descriptors
// ============================================

/**
 * Valid file descriptor numbers.
 */
export const VALID_FILE_DESCRIPTORS = new Set(['0', '1', '2']);

// ============================================
// Safe Commands
// ============================================

/**
 * Commands that are generally safe and bypass further checks.
 */
export const SAFE_COMMANDS = new Set([
  'ls',
  'pwd',
  'whoami',
  'hostname',
  'uname',
  'date',
  'uptime',
  'which',
  'type',
  'echo',
  'printf',
  'true',
  'false',
]);

/**
 * Read-only package manager commands.
 */
export const READONLY_PACKAGE_COMMANDS = [
  'npm list',
  'npm ls',
  'npm show',
  'npm view',
  'pip list',
  'pip show',
  'pip freeze',
  'cargo tree',
  'cargo metadata',
  'gem list',
  'gem info',
] as const;

// ============================================
// Export
// ============================================

export {
  getEscapeMarkers,
  DANGEROUS_PATTERNS,
  SHELL_METACHARACTERS,
  DANGEROUS_ENV_VARS,
  SENSITIVE_PATHS,
  JQ_SYSTEM_PATTERN,
  JQ_FILE_FLAGS,
  HEREDOC_SUBSTITUTION_PATTERN,
  SAFE_HEREDOC_PATTERN,
  ANSI_C_QUOTE_PATTERN,
  LOCALE_QUOTE_PATTERN,
  EMPTY_SPECIAL_QUOTES_PATTERN,
  EMPTY_QUOTES_PATTERN,
  TAB_INDENT_PATTERN,
  OPERATOR_START_PATTERN,
  OUTPUT_REDIRECT_OPERATORS,
  SAFE_REDIRECTIONS,
  CWD_RESET_REGEX,
  VALID_FILE_DESCRIPTORS,
  SAFE_COMMANDS,
  READONLY_PACKAGE_COMMANDS,
};
