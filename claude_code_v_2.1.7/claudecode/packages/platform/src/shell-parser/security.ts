/**
 * @claudecode/platform - Shell Security Analysis
 *
 * Multi-layer security checker for shell commands.
 * Reconstructed from chunks.121.mjs
 */

import { recordTelemetry } from '../telemetry/index.js';
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
import {
  type SecurityCheckResult,
  type SecurityContext,
  type SecurityChecker,
  SecurityRiskType,
} from './types.js';

/**
 * Helper to log security triggers.
 * Original: l in chunks.121.mjs
 */
function logSecurityTrigger(checkId: number, subId: number) {
  recordTelemetry('tengu_bash_security_check_triggered', {
    checkId,
    subId,
  });
}

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

  // SubId 1: Tab-indented fragment
  if (TAB_INDENT_PATTERN.test(originalCommand)) {
    logSecurityTrigger(SecurityRiskType.INCOMPLETE_COMMANDS, 1);
    return {
      behavior: 'ask',
      message: 'Command appears incomplete (starts with tab)',
    };
  }

  // SubId 2: Flag-only fragment
  if (trimmed.startsWith('-')) {
    logSecurityTrigger(SecurityRiskType.INCOMPLETE_COMMANDS, 2);
    return {
      behavior: 'ask',
      message: 'Command appears incomplete (starts with flags)',
    };
  }

  // SubId 3: Operator-starting fragment
  if (OPERATOR_START_PATTERN.test(originalCommand)) {
    logSecurityTrigger(SecurityRiskType.INCOMPLETE_COMMANDS, 3);
    return {
      behavior: 'ask',
      message: 'Command appears to be continuation (starts with operator)',
    };
  }

  return { behavior: 'passthrough', message: 'Command appears complete' };
};

/**
 * Validate safe heredoc patterns.
 * Original: Si5 in chunks.121.mjs:992-1029
 */
export function safeHeredocValidator(command: string): boolean {
  if (!HEREDOC_SUBSTITUTION_PATTERN.test(command)) return false;

  const heredocRegex = /\$\(cat\s*<<-?\s*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g;
  const heredocs: { start: number; delimiter: string }[] = [];
  let match;

  while ((match = heredocRegex.exec(command)) !== null) {
    const delimiter = match[1] || match[2];
    if (delimiter) {
      heredocs.push({ start: match.index, delimiter });
    }
  }

  if (heredocs.length === 0) return false;

  for (const { start, delimiter } of heredocs) {
    const substring = command.substring(start);
    const escapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Check for closing delimiter on its own line followed by )
    if (!new RegExp(`(?:\n|^[^\\n]*\n)${escapedDelimiter}\\s*\\)`).test(substring)) {
      return false;
    }

    // Match complete heredoc structure
    const completePattern = new RegExp(
      `^\\$\\(cat\\s*<<-?\\s*(?:'+${escapedDelimiter}'+|\\\\${escapedDelimiter})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${escapedDelimiter}\\s*\\)`
    );
    if (!substring.match(completePattern)) return false;
  }

  let withoutHeredocs = command;
  for (const { delimiter } of heredocs) {
    const escapedDelim = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const heredocPattern = new RegExp(
      `\\$\\(cat\\s*<<-?\\s*(?:'+${escapedDelim}'+|\\\\${escapedDelim})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${escapedDelim}\\s*\\)`
    );
    withoutHeredocs = withoutHeredocs.replace(heredocPattern, '');
  }

  if (/\$\(/.test(withoutHeredocs)) return false;
  if (/\${/.test(withoutHeredocs)) return false;

  return true;
}

/**
 * Check for safe heredoc in command substitution.
 * Original: xi5 in chunks.121.mjs:1031-1053
 */
export const checkHeredocInSubstitution: SecurityChecker = (context) => {
  const { originalCommand } = context;

  if (!HEREDOC_SUBSTITUTION_PATTERN.test(originalCommand)) {
    return { behavior: 'passthrough', message: 'No heredoc in substitution' };
  }

  if (safeHeredocValidator(originalCommand)) {
    return {
      behavior: 'allow',
      updatedInput: { command: originalCommand },
      decisionReason: {
        type: 'other',
        reason: 'Safe command substitution: cat with quoted/escaped heredoc delimiter',
      },
    };
  }

  return { behavior: 'passthrough', message: 'Command substitution needs validation' };
};

/**
 * Check for safe heredoc patterns.
 * Original: vi5 in chunks.121.mjs:1102-1126
 */
export const checkHeredocPatterns: SecurityChecker = (context) => {
  const { originalCommand } = context;

  if (HEREDOC_SUBSTITUTION_PATTERN.test(originalCommand)) {
    return { behavior: 'passthrough', message: 'Heredoc in substitution' };
  }

  const quotedDelim = /<<-?\s*'[^']+'/;
  const escapedDelim = /<<-?\s*\\\w+/;

  if (quotedDelim.test(originalCommand) || escapedDelim.test(originalCommand)) {
    return {
      behavior: 'allow',
      updatedInput: { command: originalCommand },
      decisionReason: {
        type: 'other',
        reason: 'Heredoc with quoted/escaped delimiter is safe',
      },
    };
  }

  return { behavior: 'passthrough', message: 'No safe heredoc patterns' };
};

/**
 * Check for safe git commit message.
 * Original: yi5 in chunks.121.mjs:1055-1100
 */
export const checkGitCommitMessage: SecurityChecker = (context) => {
  const { originalCommand, baseCommand } = context;

  if (baseCommand !== 'git' || !/^git\s+commit\s+/.test(originalCommand)) {
    return { behavior: 'passthrough', message: 'Not a git commit' };
  }

  const match = originalCommand.match(/^git\s+commit\s+.*-m\s+(["'])([\s\S]*?)\1(.*)$/);
  if (match) {
    const [, quoteType, message] = match;

    if (quoteType === '"' && message && /\$\(|`|\$\{/.test(message)) {
      logSecurityTrigger(SecurityRiskType.GIT_COMMIT_SUBSTITUTION, 1);
      return { behavior: 'ask', message: 'Git commit message contains command substitution' };
    }

    if (message && message.startsWith('-')) {
      logSecurityTrigger(SecurityRiskType.OBFUSCATED_FLAGS, 5);
      return { behavior: 'ask', message: 'Command contains quoted flag-like content' };
    }

    return {
      behavior: 'allow',
      updatedInput: { command: originalCommand },
      decisionReason: { type: 'other', reason: 'Git commit with simple quoted message' },
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

  if (JQ_SYSTEM_PATTERN.test(originalCommand)) {
    logSecurityTrigger(SecurityRiskType.JQ_SYSTEM_FUNCTION, 1);
    return { behavior: 'ask', message: 'jq contains system() which executes commands' };
  }

  const flags = originalCommand.substring(3).trim();
  if (JQ_FILE_FLAGS.test(flags)) {
    logSecurityTrigger(SecurityRiskType.JQ_FILE_ARGUMENTS, 1);
    return { behavior: 'ask', message: 'jq contains file access flags' };
  }

  return { behavior: 'passthrough', message: 'jq command is safe' };
};

/**
 * Check for obfuscated flags using character state machine.
 * Original: ci5 in chunks.121.mjs:1328-1444
 */
export const checkObfuscatedFlags: SecurityChecker = (context) => {
  const { originalCommand, baseCommand, fullyUnquotedContent } = context;
  const hasMetachars = /[|&;]/.test(originalCommand);

  if (baseCommand === 'echo' && !hasMetachars) {
    return { behavior: 'passthrough', message: 'echo command is safe and has no dangerous flags' };
  }

  if (ANSI_C_QUOTE_PATTERN.test(originalCommand)) {
    logSecurityTrigger(SecurityRiskType.OBFUSCATED_FLAGS, 5);
    return { behavior: 'ask', message: 'Command contains ANSI-C quoting which can hide characters' };
  }

  if (LOCALE_QUOTE_PATTERN.test(originalCommand)) {
    logSecurityTrigger(SecurityRiskType.OBFUSCATED_FLAGS, 6);
    return { behavior: 'ask', message: 'Command contains locale quoting which can hide characters' };
  }

  if (EMPTY_SPECIAL_QUOTES_PATTERN.test(originalCommand)) {
    logSecurityTrigger(SecurityRiskType.OBFUSCATED_FLAGS, 9);
    return { behavior: 'ask', message: 'Command contains empty special quotes before dash (potential bypass)' };
  }

  if (EMPTY_QUOTES_PATTERN.test(originalCommand)) {
    logSecurityTrigger(SecurityRiskType.OBFUSCATED_FLAGS, 7);
    return { behavior: 'ask', message: 'Command contains empty quotes before dash (potential bypass)' };
  }

  // State machine loop for manual quote/flag parsing
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let isEscaped = false;

  for (let i = 0; i < originalCommand.length - 1; i++) {
    const char = originalCommand[i]!;
    const nextChar = originalCommand[i + 1]!;

    if (isEscaped) {
      isEscaped = false;
      continue;
    }

    if (char === '\\') {
      isEscaped = true;
      continue;
    }

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }

    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    if (inSingleQuote || inDoubleQuote) continue;

    // SubId 4: Encapsulated quoted flags
    if (char && nextChar && /\s/.test(char) && /['"`]/.test(nextChar)) {
      const quoteChar = nextChar;
      let k = i + 2;
      let content = '';
      while (k < originalCommand.length && originalCommand[k] !== quoteChar) {
        content += originalCommand[k];
        k++;
      }
      if (k < originalCommand.length && originalCommand[k] === quoteChar && content.startsWith('-')) {
        logSecurityTrigger(SecurityRiskType.OBFUSCATED_FLAGS, 4);
        return { behavior: 'ask', message: 'Command contains quoted characters in flag names' };
      }
    }

    // SubId 1: Quotes embedded in flag names
    if (char && nextChar && /\s/.test(char) && nextChar === '-') {
      let k = i + 1;
      let flag = '';
      while (k < originalCommand.length) {
        const c = originalCommand[k]!;
        if (!c || /[\s=]/.test(c)) break;
        if (/['"`]/.test(c)) {
          if (baseCommand === 'cut' && flag === '-d') break;
          // Lookahead for valid char
          if (k + 1 < originalCommand.length) {
            const lookahead = originalCommand[k + 1]!;
            if (lookahead && !/[a-zA-Z0-9_'"-]/.test(lookahead)) break;
          }
        }
        flag += c;
        k++;
      }
      if (flag.includes('"') || flag.includes("'")) {
        logSecurityTrigger(SecurityRiskType.OBFUSCATED_FLAGS, 1);
        return { behavior: 'ask', message: 'Command contains quoted characters in flag names' };
      }
    }
  }

  // SubId 2: Space + Quote + Dash in fully unquoted
  if (/\s['"`]-/.test(fullyUnquotedContent)) {
    logSecurityTrigger(SecurityRiskType.OBFUSCATED_FLAGS, 2);
    return { behavior: 'ask', message: 'Command contains quoted characters in flag names' };
  }

  // SubId 3: consecutive quotes + dash in fully unquoted
  if (/['"`]{2}-/.test(fullyUnquotedContent)) {
    logSecurityTrigger(SecurityRiskType.OBFUSCATED_FLAGS, 3);
    return { behavior: 'ask', message: 'Command contains quoted characters in flag names' };
  }

  return { behavior: 'passthrough', message: 'No obfuscated flags detected' };
};

/**
 * Check for shell metacharacters in arguments.
 * Original: bi5 in chunks.121.mjs:1158-1187
 */
export const checkShellMetacharacters: SecurityChecker = (context) => {
  const { unquotedContent } = context;

  if (/(?:^|\s)["'][^"']*[;&][^"']*["'](?:\s|$)/.test(unquotedContent)) {
    logSecurityTrigger(SecurityRiskType.SHELL_METACHARACTERS, 1);
    return { behavior: 'ask', message: 'Command contains shell metacharacters in arguments' };
  }

  const findPatterns = [
    /-name\s+["'][^"']*[;|&][^"']*["']/,
    /-path\s+["'][^"']*[;|&][^"']*["']/,
    /-iname\s+["'][^"']*[;|&][^"']*["']/,
  ];
  if (findPatterns.some((p) => p.test(unquotedContent))) {
    logSecurityTrigger(SecurityRiskType.SHELL_METACHARACTERS, 2);
    return { behavior: 'ask', message: 'find command contains metacharacters' };
  }

  if (/-regex\s+["'][^"']*[;&][^"']*["']/.test(unquotedContent)) {
    logSecurityTrigger(SecurityRiskType.SHELL_METACHARACTERS, 3);
    return { behavior: 'ask', message: 'find -regex contains metacharacters' };
  }

  return { behavior: 'passthrough', message: 'No metacharacters' };
};

/**
 * Check for dangerous variables near redirects/pipes.
 * Original: fi5 in chunks.121.mjs:1189-1204
 */
export const checkDangerousVariables: SecurityChecker = (context) => {
  const { fullyUnquotedContent } = context;

  if (
    /[<>|]\s*\$[A-Za-z_]/.test(fullyUnquotedContent) ||
    /\$[A-Za-z_][A-Za-z0-9_]*\s*[|<>]/.test(fullyUnquotedContent)
  ) {
    logSecurityTrigger(SecurityRiskType.DANGEROUS_VARIABLES, 1);
    return { behavior: 'ask', message: 'Variables in dangerous contexts (redirections/pipes)' };
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

  if (/[\n\r]\s*[a-zA-Z/.~]/.test(fullyUnquotedContent)) {
    logSecurityTrigger(SecurityRiskType.NEWLINES, 1);
    return { behavior: 'ask', message: 'Newlines could separate multiple commands' };
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
    logSecurityTrigger(SecurityRiskType.IFS_INJECTION, 1);
    return { behavior: 'ask', message: 'IFS variable could bypass security validation' };
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
    logSecurityTrigger(SecurityRiskType.PROC_ENVIRON_ACCESS, 1);
    return { behavior: 'ask', message: '/proc/*/environ could expose sensitive env vars' };
  }

  return { behavior: 'passthrough', message: 'No /proc/environ access' };
};

/**
 * Check for dangerous substitution patterns.
 * Original: hi5 in chunks.121.mjs:1206-1245
 */
export const checkDangerousSubstitution: SecurityChecker = (context) => {
  const { unquotedContent, fullyUnquotedContent } = context;

  if (hasUnescapedChar(unquotedContent, '`')) {
    return { behavior: 'ask', message: 'Command contains backticks for substitution' };
  }

  for (const { pattern, message } of DANGEROUS_PATTERNS) {
    if (pattern.test(unquotedContent)) {
      logSecurityTrigger(SecurityRiskType.DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION, 1);
      return { behavior: 'ask', message: `Command contains ${message}` };
    }
  }

  if (/</.test(fullyUnquotedContent)) {
    logSecurityTrigger(SecurityRiskType.DANGEROUS_PATTERNS_INPUT_REDIRECTION, 1);
    return { behavior: 'ask', message: 'Input redirection could read sensitive files' };
  }

  if (/>/.test(fullyUnquotedContent)) {
    logSecurityTrigger(SecurityRiskType.DANGEROUS_PATTERNS_OUTPUT_REDIRECTION, 1);
    return { behavior: 'ask', message: 'Output redirection could write to files' };
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

  const tokens = parseResult.tokens;
  const hasSeparators = tokens.some(
    (t) =>
      typeof t === 'object' &&
      t !== null &&
      'op' in t &&
      (t.op === ';' || t.op === '&&' || t.op === '||')
  );

  if (!hasSeparators) {
    return { behavior: 'passthrough', message: 'No command separators' };
  }

  if (isMalformedTokens(tokens)) {
    logSecurityTrigger(SecurityRiskType.MALFORMED_TOKEN_INJECTION, 1);
    return {
      behavior: 'ask',
      message: 'Command contains ambiguous syntax with command separators that could be misinterpreted',
    };
  }

  return { behavior: 'passthrough', message: 'No malformed token injection detected' };
};

// ============================================
// Main Security Checker
// ============================================

/**
 * Tier 1 Checkers (Safe commands skip approval).
 */
const allowCheckers: SecurityChecker[] = [
  checkEmptyCommand,
  checkIncompleteCommand,
  checkHeredocInSubstitution,
  checkHeredocPatterns,
  checkGitCommitMessage,
];

/**
 * Tier 2 Checkers (Require user confirmation).
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
  const baseCommand = command.split(' ')[0] || '';

  const { withDoubleQuotes, fullyUnquoted } = removeQuotes(command, baseCommand === 'jq');

  const context: SecurityContext = {
    originalCommand: command,
    baseCommand,
    unquotedContent: withDoubleQuotes,
    fullyUnquotedContent: stripRedirectionNoise(fullyUnquoted),
  };

  for (const checker of allowCheckers) {
    const result = checker(context);
    if (result.behavior === 'allow') {
      return {
        behavior: 'passthrough',
        message: result.decisionReason?.reason || 'Command allowed',
      };
    }
    if (result.behavior !== 'passthrough') return result;
  }

  for (const checker of askCheckers) {
    const result = checker(context);
    if (result.behavior === 'ask') return result;
  }

  return { behavior: 'passthrough', message: 'Command passed all security checks' };
}
