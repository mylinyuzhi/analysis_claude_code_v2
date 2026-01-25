/**
 * @claudecode/platform - Shell Parser Constants
 *
 * Constants for shell command parsing and security analysis.
 * Reconstructed from chunks.112.mjs, chunks.121.mjs, chunks.147.mjs
 */

import crypto from 'node:crypto';
import type { EscapeMarkers } from './types.js';

// ============================================
// Escape Markers
// ============================================

/**
 * Generate unique escape markers for tokenization.
 * Original: DJ9 in chunks.147.mjs:750-759
 */
export function getEscapeMarkers(): EscapeMarkers {
  const uid = crypto.randomBytes(8).toString('hex');
  return {
    SINGLE_QUOTE: `__SINGLE_QUOTE_${uid}__`,
    DOUBLE_QUOTE: `__DOUBLE_QUOTE_${uid}__`,
    NEW_LINE: `__NEW_LINE_${uid}__`,
    ESCAPED_OPEN_PAREN: `__ESCAPED_OPEN_PAREN_${uid}__`,
    ESCAPED_CLOSE_PAREN: `__ESCAPED_CLOSE_PAREN_${uid}__`,
  };
}

// ============================================
// Dangerous Patterns
// ============================================

/**
 * Dangerous substitution patterns.
 * Original: Mi5 in chunks.121.mjs:1487-1508
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
 * Original: WJ9 in chunks.147.mjs:1349
 */
export const SHELL_METACHARACTERS = ['&&', '||', ';', ';;', '|'] as const;
export const SHELL_METACHARACTERS_SET = new Set(SHELL_METACHARACTERS);

/**
 * Operators that include redirects and pipes.
 * Original: bz7 in chunks.147.mjs:1349
 */
export const ALL_SHELL_OPERATORS = new Set([...SHELL_METACHARACTERS, '>&', '>', '>>']);

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
 * Original: Dq0 in chunks.121.mjs:1487
 */
export const HEREDOC_SUBSTITUTION_PATTERN = /\$\(.*<</;

/**
 * Heredoc pattern for extraction.
 * Original: jz7 in chunks.147.mjs:747
 */
export const HEREDOC_EXTRACT_PATTERN = /(?<!<)<<(?!<)(-)?(['"])?\\?(\w+)\2?/;

/**
 * Heredoc placeholder markers.
 * Original: Mz7, Rz7 in chunks.147.mjs:740-742
 */
export const HEREDOC_PREFIX = '__HEREDOC_';
export const HEREDOC_SUFFIX = '__';

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
export const OUTPUT_REDIRECT_OPERATORS = ['>', '>>', '>&'] as const;

/**
 * Safe redirections (can be stripped without affecting command analysis).
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
 * Original: UT2 in chunks.112.mjs:118
 */
export const CWD_RESET_REGEX = /(?:^|\n)(Shell cwd was reset to .+)$/;

// ============================================
// Valid File Descriptors
// ============================================

/**
 * Valid file descriptor numbers.
 * Original: LuA in chunks.147.mjs:1193
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
