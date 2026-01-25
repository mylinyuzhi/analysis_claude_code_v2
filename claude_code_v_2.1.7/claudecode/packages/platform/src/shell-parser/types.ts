/**
 * @claudecode/platform - Shell Parser Type Definitions
 *
 * Type definitions for the shell command parsing system.
 * Reconstructed from chunks.121.mjs, chunks.123.mjs, chunks.147.mjs
 */

// ============================================
// Command Parsing
// ============================================

/**
 * Parsed command interface.
 */
export interface ParsedCommand {
  /** Get pipe segments from the command */
  getPipeSegments(): string[];
  /** Get command without output redirections */
  withoutOutputRedirections(): string;
  /** Get output redirections */
  getOutputRedirections(): OutputRedirection[];
  /** Original command string */
  originalCommand: string;
}

/**
 * Output redirection.
 */
export interface OutputRedirection {
  target: string;
  operator: '>' | '>>' | '>&' | '2>' | '2>>';
}

/**
 * Token from shell parsing.
 */
export type ShellToken =
  | string
  | { op: string; [key: string]: unknown }
  | { comment: string }
  | { op: 'glob'; pattern: string };

/**
 * Parse result from shell tokenization.
 */
export interface ParseResult {
  success: boolean;
  tokens?: ShellToken[];
  error?: string;
}

// ============================================
// Security Analysis
// ============================================

/**
 * Security check behavior.
 */
export type SecurityBehavior = 'passthrough' | 'allow' | 'ask' | 'deny';

/**
 * Security check result.
 */
export interface SecurityCheckResult {
  behavior: SecurityBehavior;
  message?: string;
  decisionReason?: DecisionReason;
  updatedInput?: { command: string };
}

/**
 * Decision reason for security checks.
 */
export interface DecisionReason {
  type: 'other' | 'risk' | 'pattern' | 'rule';
  reason?: string;
  rule?: string;
}

/**
 * Security check context.
 */
export interface SecurityContext {
  originalCommand: string;
  baseCommand: string;
  unquotedContent: string;
  fullyUnquotedContent: string;
}

/**
 * Security risk types.
 * Original: eY in chunks.121.mjs:1508-1523
 */
export enum SecurityRiskType {
  INCOMPLETE_COMMANDS = 1,
  JQ_SYSTEM_FUNCTION = 2,
  JQ_FILE_ARGUMENTS = 3,
  OBFUSCATED_FLAGS = 4,
  SHELL_METACHARACTERS = 5,
  DANGEROUS_VARIABLES = 6,
  NEWLINES = 7,
  DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION = 8,
  DANGEROUS_PATTERNS_INPUT_REDIRECTION = 9,
  DANGEROUS_PATTERNS_OUTPUT_REDIRECTION = 10,
  IFS_INJECTION = 11,
  GIT_COMMIT_SUBSTITUTION = 12,
  PROC_ENVIRON_ACCESS = 13,
  MALFORMED_TOKEN_INJECTION = 14,
}

// ============================================
// Pipe Permission
// ============================================

/**
 * Permission request for pipe commands.
 */
export interface PipePermissionRequest {
  command: string;
}

/**
 * Permission checker function type.
 */
export type PermissionChecker = (
  segment: string
) => Promise<SecurityCheckResult>;

// ============================================
// Quote Handling
// ============================================

/**
 * Quote removal result.
 */
export interface QuoteRemovalResult {
  withDoubleQuotes: string;
  fullyUnquoted: string;
}

// ============================================
// CWD Detection
// ============================================

/**
 * CWD reset extraction result.
 */
export interface CwdResetResult {
  cleanedStderr: string;
  cwdResetWarning: string | null;
}

// ============================================
// Heredoc Handling
// ============================================

/**
 * Heredoc extraction result.
 */
export interface HeredocExtractionResult {
  processedCommand: string;
  heredocs: Map<string, HeredocInfo>;
}

/**
 * Heredoc information.
 */
export interface HeredocInfo {
  operatorStartIndex: number;
  operatorEndIndex: number;
  contentStartIndex: number;
  contentEndIndex: number;
  delimiter: string;
  fullText: string;
}

// ============================================
// Escape Markers
// ============================================

/**
 * Escape markers for tokenization.
 */
export interface EscapeMarkers {
  SINGLE_QUOTE: string;
  DOUBLE_QUOTE: string;
  NEW_LINE: string;
  ESCAPED_OPEN_PAREN: string;
  ESCAPED_CLOSE_PAREN: string;
}

// ============================================
// Redirection Extraction
// ============================================

/**
 * Redirection extraction result.
 */
export interface RedirectionExtractionResult {
  commandWithoutRedirections: string;
  redirections: OutputRedirection[];
}

// ============================================
// Checker Functions
// ============================================

/**
 * Security checker function type.
 */
export type SecurityChecker = (context: SecurityContext) => SecurityCheckResult;
