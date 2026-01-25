/**
 * @claudecode/platform - Shell Parser Module
 *
 * Multi-layer shell command parsing, tokenization, and security analysis.
 * Used by the Bash tool for safe command execution.
 *
 * Reconstructed from chunks.112.mjs, chunks.121.mjs, chunks.123.mjs, chunks.147.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Constants
// ============================================

export {
  getEscapeMarkers,
  DANGEROUS_PATTERNS,
  SHELL_METACHARACTERS,
  SHELL_METACHARACTERS_SET,
  ALL_SHELL_OPERATORS,
  DANGEROUS_ENV_VARS,
  SENSITIVE_PATHS,
  JQ_SYSTEM_PATTERN,
  JQ_FILE_FLAGS,
  HEREDOC_SUBSTITUTION_PATTERN,
  HEREDOC_EXTRACT_PATTERN,
  HEREDOC_PREFIX,
  HEREDOC_SUFFIX,
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
} from './constants.js';

// ============================================
// Tokenizer
// ============================================

export {
  isInsideQuotes,
  isInsideComment,
  extractHeredocs,
  reconstructHeredocs,
  removeQuotes,
  hasUnescapedChar,
  parseShellCommand,
  tokenizeCommand,
  stripRedirectionNoise,
  isMalformedTokens,
} from './tokenizer.js';

// ============================================
// Security Analysis
// ============================================

export {
  // Allow checkers
  checkEmptyCommand,
  checkIncompleteCommand,
  checkHeredocInSubstitution,
  checkHeredocPatterns,
  checkGitCommitMessage,
  safeHeredocValidator,

  // Ask checkers
  checkJqDanger,
  checkObfuscatedFlags,
  checkShellMetacharacters,
  checkDangerousVariables,
  checkNewlineInjection,
  checkIfsInjection,
  checkProcEnvironAccess,
  checkDangerousSubstitution,
  checkMalformedTokens,

  // Main checker
  shellOperatorChecker,
} from './security.js';

// ============================================
// Command Parser
// ============================================

export {
  RichCommand,
  SimpleCommand,
  shellCommandParser,
  extractOutputRedirections,
  pipePermissionChecker,
  extractCwdReset,
  hasShellOperators,
  stripOutputRedirections,
} from './parser.js';
