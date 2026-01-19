/**
 * @claudecode/platform - Shell Security Analysis
 *
 * Multi-layer security checker for shell commands.
 * Reconstructed from chunks.121.mjs
 */

import type {
  SecurityCheckResult,
  SecurityContext,
  SecurityChecker,
} from './types.js';
import { SecurityRiskType } from './types.js';
import {
  JQ_SYSTEM_PATTERN,
  JQ_FILE_FLAGS,
  ANSI_C_QUOTE_PATTERN,
  LOCALE_QUOTE_PATTERN,
  EMPTY_SPECIAL_QUOTES_PATTERN,
  EMPTY_QUOTES_PATTERN,
  TAB_INDENT_PATTERN,
  OPERATOR_START_PATTERN,
  HEREDOC_SUBSTITUTION_PATTERN,
  DANGEROUS_PATTERNS,
} from './constants.js';
import {
  removeQuotes,
  stripRedirectionNoise,
  hasUnescapedChar,
  parseShellCommand,
  isMalformedTokens,
} from './tokenizer.js';

// ============================================
// Allow Checkers (Phase 1)
// ============================================

/**
 * Check for empty command.
 * Original: Ti5 in chunks.121.mjs:944-959
 */
export const checkEmptyCommand: SecurityChecker = (context) => {
  if (!context.originalCommand.trim()) {
    return {
      behavior: 'allow',
      message: 'Empty command is safe',
      decisionReason: { type: 'other', reason: 'Empty command is safe' },
      updatedInput: { command: context.originalCommand },
    };
  }
  return { behavior: 'passthrough', message: 'Command is not empty' };
};

/**
 * Check for incomplete command fragments.
 * Original: Pi5 in chunks.121.mjs:961-990
 */
export const checkIncompleteCommand: SecurityChecker = (context) => {
  const { originalCommand } = context;
  const trimmed = originalCommand.trim();

  // Tab-indented fragment
  if (TAB_INDENT_PATTERN.test(originalCommand)) {
    return {
      behavior: 'ask',
      message: 'Command appears incomplete (starts with tab)',
    };
  }

  // Flag-only fragment
  if (trimmed.startsWith('-')) {
    return {
      behavior: 'ask',
      message: 'Command appears incomplete (starts with flags)',
    };
  }

  // Operator-starting fragment
  if (OPERATOR_START_PATTERN.test(originalCommand)) {
    return {
      behavior: 'ask',
      message: 'Command appears to be continuation (starts with operator)',
    };
  }

  return { behavior: 'passthrough', message: 'Command appears complete' };
};

/**
 * Check for safe heredoc in command substitution.
 * Original: xi5 in chunks.121.mjs:1031-1053
 */
export const checkHeredocInSubstitution: SecurityChecker = (context) => {
  const { originalCommand } = context;

  if (!HEREDOC_SUBSTITUTION_PATTERN.test(originalCommand)) {
    return { behavior: 'passthrough', message: 'No heredoc in substitution' };
  }

  // Validate safe heredoc patterns
  if (validateSafeHeredoc(originalCommand)) {
    return {
      behavior: 'allow',
      message: 'Safe command substitution: cat with quoted/escaped heredoc delimiter',
      decisionReason: {
        type: 'other',
        reason: 'Safe command substitution: cat with quoted/escaped heredoc delimiter',
      },
      updatedInput: { command: originalCommand },
    };
  }

  return { behavior: 'passthrough', message: 'Needs further validation' };
};

/**
 * Validate safe heredoc patterns.
 * Original: Si5 in chunks.121.mjs:992-1029
 */
function validateSafeHeredoc(command: string): boolean {
  if (!HEREDOC_SUBSTITUTION_PATTERN.test(command)) return false;

  const heredocRegex =
    /\$\(cat\s*<<-?\s*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g;
  let match;
  const heredocs: { start: number; delimiter: string }[] = [];

  while ((match = heredocRegex.exec(command)) !== null) {
    const delimiter = match[1] || match[2];
    if (delimiter) {
      heredocs.push({ start: match.index, delimiter });
    }
  }

  if (heredocs.length === 0) return false;

  // Validate each heredoc structure
  for (const { start, delimiter } of heredocs) {
    const substring = command.substring(start);
    const escapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Check for closing delimiter
    const closingPattern = new RegExp(`(?:\n|^[^\n]*\n)${escapedDelimiter}\\s*\\)`);
    if (!closingPattern.test(substring)) return false;
  }

  // After removing heredocs, check for other dangerous patterns
  let withoutHeredocs = command;
  for (const { delimiter } of heredocs) {
    const escapedDelim = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const heredocPattern = new RegExp(
      `\\$\\(cat\\s*<<-?\\s*(?:'+${escapedDelim}'+|\\\\${escapedDelim})` +
        `[^\n]*\n(?:[\\s\\S]*?\n)?${escapedDelim}\\s*\\)`
    );
    withoutHeredocs = withoutHeredocs.replace(heredocPattern, '');
  }

  if (/\$\(/.test(withoutHeredocs)) return false;
  if (/\${/.test(withoutHeredocs)) return false;

  return true;
}

/**
 * Check for safe git commit message.
 * Original: yi5 in chunks.121.mjs:1055-1100
 */
export const checkGitCommitMessage: SecurityChecker = (context) => {
  const { originalCommand, baseCommand } = context;

  if (baseCommand !== 'git' || !/^git\s+commit\s+/.test(originalCommand)) {
    return { behavior: 'passthrough', message: 'Not a git commit' };
  }

  // Extract -m quoted message
  const match = originalCommand.match(/^git\s+commit\s+.*-m\s+(["'])([\s\S]*?)\1(.*)$/);

  if (match) {
    const [, quoteType, message] = match;

    // Double-quoted with substitution = dangerous
    if (quoteType === '"' && message && /\$\(|`|\$\{/.test(message)) {
      return {
        behavior: 'ask',
        message: 'Git commit message contains command substitution',
      };
    }

    // Message starts with dash = flag confusion
    if (message && message.startsWith('-')) {
      return {
        behavior: 'ask',
        message: 'Command contains quoted flag-like content',
      };
    }

    return {
      behavior: 'allow',
      message: 'Git commit with simple quoted message',
      decisionReason: { type: 'other', reason: 'Git commit with simple quoted message' },
      updatedInput: { command: originalCommand },
    };
  }

  return { behavior: 'passthrough', message: 'Git commit needs validation' };
};

// ============================================
// Ask Checkers (Phase 2)
// ============================================

/**
 * Check for jq dangers.
 * Original: ki5 in chunks.121.mjs:1128-1156
 */
export const checkJqDanger: SecurityChecker = (context) => {
  const { originalCommand, baseCommand } = context;

  if (baseCommand !== 'jq') {
    return { behavior: 'passthrough', message: 'Not jq' };
  }

  // jq system() function
  if (JQ_SYSTEM_PATTERN.test(originalCommand)) {
    return {
      behavior: 'ask',
      message: 'jq contains system() which executes commands',
    };
  }

  // File access flags
  const flags = originalCommand.substring(3).trim();
  if (JQ_FILE_FLAGS.test(flags)) {
    return {
      behavior: 'ask',
      message: 'jq contains file access flags',
    };
  }

  return { behavior: 'passthrough', message: 'jq command is safe' };
};

/**
 * Check for obfuscated flags.
 * Original: ci5 in chunks.121.mjs:1328-1444
 */
export const checkObfuscatedFlags: SecurityChecker = (context) => {
  const { originalCommand, baseCommand, fullyUnquotedContent } = context;
  const hasMetachars = /[|&;]/.test(originalCommand);

  // Special case: echo without pipes/separators is safe
  if (baseCommand === 'echo' && !hasMetachars) {
    return { behavior: 'passthrough', message: 'echo command is safe' };
  }

  // ANSI-C Quoting ($'...')
  if (ANSI_C_QUOTE_PATTERN.test(originalCommand)) {
    return {
      behavior: 'ask',
      message: 'Command contains ANSI-C quoting which can hide characters',
    };
  }

  // Locale Quoting ($"...")
  if (LOCALE_QUOTE_PATTERN.test(originalCommand)) {
    return {
      behavior: 'ask',
      message: 'Command contains locale quoting which can hide characters',
    };
  }

  // Empty Special Quotes Before Dash
  if (EMPTY_SPECIAL_QUOTES_PATTERN.test(originalCommand)) {
    return {
      behavior: 'ask',
      message: 'Command contains empty special quotes before dash (potential bypass)',
    };
  }

  // Empty Regular Quotes Before Dash
  if (EMPTY_QUOTES_PATTERN.test(originalCommand)) {
    return {
      behavior: 'ask',
      message: 'Command contains empty quotes before dash (potential bypass)',
    };
  }

  // Simplified quote-dash pattern on unquoted content
  if (/\s['"`]-/.test(fullyUnquotedContent)) {
    return {
      behavior: 'ask',
      message: 'Command contains quoted characters in flag names',
    };
  }

  // Multiple consecutive quotes before dash
  if (/['"`]{2}-/.test(fullyUnquotedContent)) {
    return {
      behavior: 'ask',
      message: 'Command contains quoted characters in flag names',
    };
  }

  return { behavior: 'passthrough', message: 'No obfuscated flags detected' };
};

/**
 * Check for shell metacharacters.
 * Original: bi5 in chunks.121.mjs:1158-1187
 */
export const checkShellMetacharacters: SecurityChecker = (context) => {
  const { unquotedContent } = context;

  // Generic quoted arg with metacharacters
  if (/(?:^|\s)["'][^"']*[;&][^"']*["'](?:\s|$)/.test(unquotedContent)) {
    return {
      behavior: 'ask',
      message: 'Command contains shell metacharacters in arguments',
    };
  }

  // find with -name/-path/-iname containing metacharacters
  const findPatterns = [
    /-name\s+["'][^"']*[;|&][^"']*["']/,
    /-path\s+["'][^"']*[;|&][^"']*["']/,
    /-iname\s+["'][^"']*[;|&][^"']*["']/,
  ];
  if (findPatterns.some((p) => p.test(unquotedContent))) {
    return {
      behavior: 'ask',
      message: 'find command contains metacharacters',
    };
  }

  // find -regex with metacharacters
  if (/-regex\s+["'][^"']*[;&][^"']*["']/.test(unquotedContent)) {
    return {
      behavior: 'ask',
      message: 'find -regex contains metacharacters',
    };
  }

  return { behavior: 'passthrough', message: 'No metacharacters' };
};

/**
 * Check for dangerous variables.
 * Original: fi5 in chunks.121.mjs:1189-1204
 */
export const checkDangerousVariables: SecurityChecker = (context) => {
  const { fullyUnquotedContent } = context;

  // Pattern: < $VAR or > $VAR or | $VAR or $VAR < or $VAR > or $VAR |
  if (
    /[<>|]\s*\$[A-Za-z_]/.test(fullyUnquotedContent) ||
    /\$[A-Za-z_][A-Za-z0-9_]*\s*[|<>]/.test(fullyUnquotedContent)
  ) {
    return {
      behavior: 'ask',
      message: 'Variables in dangerous contexts (redirections/pipes)',
    };
  }

  return { behavior: 'passthrough', message: 'No dangerous variables' };
};

/**
 * Check for newline injection.
 * Original: gi5 in chunks.121.mjs:1247-1266
 */
export const checkNewlineInjection: SecurityChecker = (context) => {
  const { fullyUnquotedContent } = context;

  if (!/[\n\r]/.test(fullyUnquotedContent)) {
    return { behavior: 'passthrough', message: 'No newlines' };
  }

  // Newline followed by command char
  if (/[\n\r]\s*[a-zA-Z/.~]/.test(fullyUnquotedContent)) {
    return {
      behavior: 'ask',
      message: 'Newlines could separate multiple commands',
    };
  }

  return { behavior: 'passthrough', message: 'Newlines appear to be within data' };
};

/**
 * Check for IFS injection.
 * Original: ui5 in chunks.121.mjs:1268-1283
 */
export const checkIfsInjection: SecurityChecker = (context) => {
  const { originalCommand } = context;

  if (/\$IFS|\$\{[^}]*IFS/.test(originalCommand)) {
    return {
      behavior: 'ask',
      message: 'IFS variable could bypass security validation',
    };
  }

  return { behavior: 'passthrough', message: 'No IFS injection' };
};

/**
 * Check for /proc/environ access.
 * Original: mi5 in chunks.121.mjs:1285-1300
 */
export const checkProcEnvironAccess: SecurityChecker = (context) => {
  const { originalCommand } = context;

  if (/\/proc\/.*\/environ/.test(originalCommand)) {
    return {
      behavior: 'ask',
      message: '/proc/*/environ could expose sensitive env vars',
    };
  }

  return { behavior: 'passthrough', message: 'No /proc/environ access' };
};

/**
 * Check for dangerous substitution patterns.
 * Original: hi5 in chunks.121.mjs:1206-1245
 */
export const checkDangerousSubstitution: SecurityChecker = (context) => {
  const { unquotedContent, fullyUnquotedContent } = context;

  // Backticks
  if (hasUnescapedChar(unquotedContent, '`')) {
    return {
      behavior: 'ask',
      message: 'Command contains backticks for substitution',
    };
  }

  // Dangerous patterns
  for (const { pattern, message } of DANGEROUS_PATTERNS) {
    if (pattern.test(unquotedContent)) {
      return {
        behavior: 'ask',
        message: `Command contains ${message}`,
      };
    }
  }

  // Input redirection
  if (/</.test(fullyUnquotedContent)) {
    return {
      behavior: 'ask',
      message: 'Input redirection could read sensitive files',
    };
  }

  // Output redirection
  if (/>/.test(fullyUnquotedContent)) {
    return {
      behavior: 'ask',
      message: 'Output redirection could write to files',
    };
  }

  return { behavior: 'passthrough', message: 'No dangerous patterns' };
};

/**
 * Check for malformed tokens.
 * Original: di5 in chunks.121.mjs:1302-1326
 */
export const checkMalformedTokens: SecurityChecker = (context) => {
  const { originalCommand } = context;

  const parseResult = parseShellCommand(originalCommand);
  if (!parseResult.success || !parseResult.tokens) {
    return { behavior: 'passthrough', message: 'Parse failed, handled elsewhere' };
  }

  // Check for separators
  const hasSeparators = parseResult.tokens.some(
    (t) =>
      typeof t === 'object' &&
      t !== null &&
      'op' in t &&
      (t.op === ';' || t.op === '&&' || t.op === '||')
  );

  if (!hasSeparators) {
    return { behavior: 'passthrough', message: 'No command separators' };
  }

  // Check for unbalanced tokens
  if (isMalformedTokens(parseResult.tokens)) {
    return {
      behavior: 'ask',
      message: 'Ambiguous syntax with separators',
    };
  }

  return { behavior: 'passthrough', message: 'No malformed token injection' };
};

// ============================================
// Main Security Checker
// ============================================

/**
 * Allow checkers (pass-through safe commands).
 */
const allowCheckers: SecurityChecker[] = [
  checkEmptyCommand,
  checkIncompleteCommand,
  checkHeredocInSubstitution,
  checkGitCommitMessage,
];

/**
 * Ask checkers (require user confirmation).
 */
const askCheckers: SecurityChecker[] = [
  checkJqDanger,
  checkObfuscatedFlags,
  checkShellMetacharacters,
  checkDangerousVariables,
  checkNewlineInjection,
  checkIfsInjection,
  checkProcEnvironAccess,
  checkDangerousSubstitution,
  checkMalformedTokens,
];

/**
 * Main shell operator security checker.
 * Original: Mf in chunks.121.mjs:1446-1476
 */
export function shellOperatorChecker(command: string): SecurityCheckResult {
  // Extract base command (first word)
  const baseCommand = command.split(' ')[0] || '';

  // Strip quotes (preserve double quotes for jq)
  const { withDoubleQuotes, fullyUnquoted } = removeQuotes(
    command,
    baseCommand === 'jq'
  );

  // Build context
  const context: SecurityContext = {
    originalCommand: command,
    baseCommand,
    unquotedContent: withDoubleQuotes,
    fullyUnquotedContent: stripRedirectionNoise(fullyUnquoted),
  };

  // Phase 1: Allow checkers
  for (const checker of allowCheckers) {
    const result = checker(context);
    if (result.behavior === 'allow') {
      return {
        behavior: 'passthrough',
        message: result.decisionReason?.reason || 'Command allowed',
      };
    }
    if (result.behavior !== 'passthrough') {
      return result;
    }
  }

  // Phase 2: Ask checkers
  for (const checker of askCheckers) {
    const result = checker(context);
    if (result.behavior === 'ask') {
      return result;
    }
  }

  return { behavior: 'passthrough', message: 'Passed all security checks' };
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
