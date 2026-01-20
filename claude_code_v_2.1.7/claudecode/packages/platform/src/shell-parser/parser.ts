/**
 * @claudecode/platform - Shell Command Parser
 *
 * High-level command parser with tree-sitter fallback.
 * Reconstructed from chunks.123.mjs
 */

import type {
  ParsedCommand,
  OutputRedirection,
  CwdResetResult,
  RedirectionExtractionResult,
  ShellToken,
} from './types.js';
import { CWD_RESET_REGEX, VALID_FILE_DESCRIPTORS } from './constants.js';
import { tokenizeCommand, parseShellCommand } from './tokenizer.js';

// ============================================
// RichCommand (Tree-sitter backed)
// ============================================

/**
 * Command representation when tree-sitter parsing succeeds.
 * Original: mm2 in chunks.123.mjs:768-807
 */
export class RichCommand implements ParsedCommand {
  originalCommand: string;
  pipePositions: number[];
  redirectionNodes: Array<{
    startIndex: number;
    endIndex: number;
    target: string;
    operator: OutputRedirection['operator'];
  }>;

  constructor(
    originalCommand: string,
    pipePositions: number[],
    redirectionNodes: Array<{
      startIndex: number;
      endIndex: number;
      target: string;
      operator: OutputRedirection['operator'];
    }>
  ) {
    this.originalCommand = originalCommand;
    this.pipePositions = pipePositions;
    this.redirectionNodes = redirectionNodes;
  }

  getPipeSegments(): string[] {
    if (this.pipePositions.length === 0) {
      return [this.originalCommand];
    }

    const segments: string[] = [];
    let currentPos = 0;

    for (const pipePos of this.pipePositions) {
      const segment = this.originalCommand.slice(currentPos, pipePos).trim();
      if (segment) segments.push(segment);
      currentPos = pipePos + 1;
    }

    const lastSegment = this.originalCommand.slice(currentPos).trim();
    if (lastSegment) segments.push(lastSegment);

    return segments;
  }

  withoutOutputRedirections(): string {
    if (this.redirectionNodes.length === 0) {
      return this.originalCommand;
    }

    // Sort by reverse position (remove from end first to preserve indices)
    const sortedRedirections = [...this.redirectionNodes].sort(
      (a, b) => b.startIndex - a.startIndex
    );

    let result = this.originalCommand;
    for (const redirection of sortedRedirections) {
      result =
        result.slice(0, redirection.startIndex) +
        result.slice(redirection.endIndex);
    }

    return result.trim().replace(/\s+/g, ' ');
  }

  getOutputRedirections(): OutputRedirection[] {
    return this.redirectionNodes.map(({ target, operator }) => ({
      target,
      operator,
    }));
  }
}

// ============================================
// SimpleCommand (Tokenization-based fallback)
// ============================================

/**
 * Fallback command parser using tokenization.
 * Original: um2 in chunks.123.mjs:695-732
 */
export class SimpleCommand implements ParsedCommand {
  originalCommand: string;

  constructor(originalCommand: string) {
    this.originalCommand = originalCommand;
  }

  getPipeSegments(): string[] {
    try {
      const tokens = tokenizeCommand(this.originalCommand);
      const segments: string[] = [];
      let currentSegment: string[] = [];

      for (const token of tokens) {
        if (token === '|') {
          if (currentSegment.length > 0) {
            segments.push(currentSegment.join(' '));
            currentSegment = [];
          }
        } else {
          currentSegment.push(token);
        }
      }

      if (currentSegment.length > 0) {
        segments.push(currentSegment.join(' '));
      }

      return segments.length > 0 ? segments : [this.originalCommand];
    } catch {
      return [this.originalCommand];
    }
  }

  withoutOutputRedirections(): string {
    if (!this.originalCommand.includes('>')) {
      return this.originalCommand;
    }

    const { commandWithoutRedirections } = extractOutputRedirections(
      this.originalCommand
    );
    return commandWithoutRedirections;
  }

  getOutputRedirections(): OutputRedirection[] {
    const { redirections } = extractOutputRedirections(this.originalCommand);
    return redirections;
  }
}

// ============================================
// Shell Command Parser
// ============================================

/**
 * Tree-sitter availability check (stub).
 * In real implementation, this would check WASM availability.
 */
async function isTreeSitterAvailable(): Promise<boolean> {
  // Tree-sitter requires WASM loading, not always available
  return false;
}

/**
 * High-level command parser.
 * Original: cK1 in chunks.123.mjs:826-841
 */
export const shellCommandParser = {
  async parse(command: string): Promise<ParsedCommand | null> {
    if (!command) return null;

    // Try tree-sitter first (accurate but may not be available)
    if (await isTreeSitterAvailable()) {
      try {
        // In real implementation, this would use tree-sitter WASM parser
        // For now, fall through to SimpleCommand
      } catch {
        // Silently fall back to SimpleCommand
      }
    }

    // Fallback: tokenization-based parsing
    return new SimpleCommand(command);
  },
};

// ============================================
// Output Redirection Extraction
// ============================================

/**
 * Extract output redirections from command.
 * Original: Hx in chunks.147.mjs:909-957
 */
export function extractOutputRedirections(
  command: string
): RedirectionExtractionResult {
  const redirections: OutputRedirection[] = [];
  const parseResult = parseShellCommand(command);

  if (!parseResult.success || !parseResult.tokens) {
    return {
      commandWithoutRedirections: command,
      redirections: [],
    };
  }

  const tokens = parseResult.tokens;
  const subshellRedirections = new Set<number>();
  const parenStack: { index: number; isSubshellStart: boolean }[] = [];

  // Track which redirections belong to subshells
  tokens.forEach((token, index) => {
    if (isOpenParen(token)) {
      const prevToken = tokens[index - 1];
      const isSubshellStart =
        index === 0 ||
        (typeof prevToken === 'object' &&
          prevToken !== null &&
          'op' in prevToken &&
          ['&&', '||', ';', '|'].includes(prevToken.op as string));
      parenStack.push({ index, isSubshellStart });
    } else if (isCloseParen(token) && parenStack.length > 0) {
      const openParen = parenStack.pop()!;
      const nextToken = tokens[index + 1];

      if (openParen.isSubshellStart && isRedirectOperator(nextToken)) {
        subshellRedirections.add(openParen.index);
        subshellRedirections.add(index);
      }
    }
  });

  // Extract and validate redirections
  const filteredTokens: ShellToken[] = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i]!;

    // Skip subshell boundary tokens
    if (subshellRedirections.has(i)) {
      filteredTokens.push(token);
      i++;
      continue;
    }

    const redirectResult = processRedirectToken(
      token,
      tokens[i - 1],
      tokens[i + 1]
    );

    if (redirectResult.skip > 0) {
      if (redirectResult.redirection) {
        redirections.push(redirectResult.redirection);
      }
      i += redirectResult.skip;
    } else {
      filteredTokens.push(token);
      i++;
    }
  }

  return {
    commandWithoutRedirections: reconstructCommand(filteredTokens),
    redirections,
  };
}

/**
 * Check if token is an open parenthesis.
 */
function isOpenParen(token: ShellToken): boolean {
  return typeof token === 'string' && token === '(';
}

/**
 * Check if token is a close parenthesis.
 */
function isCloseParen(token: ShellToken): boolean {
  return typeof token === 'string' && token === ')';
}

/**
 * Check if token is a redirect operator.
 */
function isRedirectOperator(token: ShellToken | undefined): boolean {
  if (!token) return false;
  if (typeof token === 'object' && 'op' in token) {
    const op = token.op as string;
    return ['>', '>>', '>&', '2>', '2>>'].includes(op);
  }
  return false;
}

/**
 * Process redirect token and extract redirection info.
 */
function processRedirectToken(
  token: ShellToken,
  _prevToken: ShellToken | undefined,
  nextToken: ShellToken | undefined
): { skip: number; redirection?: OutputRedirection } {
  if (typeof token !== 'object' || !('op' in token)) {
    return { skip: 0 };
  }

  const op = token.op as string;

  if (op === '>' || op === '>>' || op === '>&' || op === '2>' || op === '2>>') {
    if (typeof nextToken === 'string') {
      // Validate file descriptor targets
      if (op === '>&') {
        if (!VALID_FILE_DESCRIPTORS.has(nextToken)) {
          return { skip: 0 }; // Invalid FD, don't extract
        }
      }

      return {
        skip: 2, // Skip operator and target
        redirection: {
          target: nextToken,
          operator: op as OutputRedirection['operator'],
        },
      };
    }
  }

  return { skip: 0 };
}

/**
 * Reconstruct command from filtered tokens.
 */
function reconstructCommand(tokens: ShellToken[]): string {
  return tokens
    .map((token) => {
      if (typeof token === 'string') return token;
      if (typeof token === 'object' && 'op' in token) return token.op as string;
      return '';
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================
// CWD Reset Detection
// ============================================

/**
 * Extract CWD reset warning from stderr.
 * Original: Fb5 in chunks.112.mjs:53-64
 */
export function extractCwdReset(stderr: string): CwdResetResult {
  const match = stderr.match(CWD_RESET_REGEX);
  if (!match) {
    return { cleanedStderr: stderr, cwdResetWarning: null };
  }

  const newCwd = match[1] ?? null;

  return {
    cleanedStderr: stderr.replace(CWD_RESET_REGEX, '').trim(),
    cwdResetWarning: newCwd,
  };
}

// ============================================
// Utility Functions
// ============================================

/**
 * Check if command has shell operators.
 * Original: lm2 in chunks.123.mjs
 */
export function hasShellOperators(command: string): boolean {
  return /[|&;]/.test(command);
}

/**
 * Strip output redirections from a single command segment.
 * Original: vn5 in chunks.123.mjs
 */
export async function stripOutputRedirections(segment: string): Promise<string> {
  const parsedCommand = await shellCommandParser.parse(segment);
  if (!parsedCommand) return segment;
  return parsedCommand.withoutOutputRedirections();
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
