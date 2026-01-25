/**
 * @claudecode/platform - Shell Command Parser
 *
 * High-level command parser with tree-sitter fallback.
 * Reconstructed from chunks.112.mjs, chunks.123.mjs, chunks.147.mjs
 */

import type {
  ParsedCommand,
  OutputRedirection,
  CwdResetResult,
  RedirectionExtractionResult,
  ShellToken,
  PermissionChecker,
  SecurityCheckResult,
  PipePermissionRequest,
} from './types.js';
import {
  CWD_RESET_REGEX,
  VALID_FILE_DESCRIPTORS,
  ALL_SHELL_OPERATORS,
} from './constants.js';
import {
  tokenizeCommand,
  parseShellCommand,
} from './tokenizer.js';
import { shellOperatorChecker } from './security.js';
import {
  isTreeSitterSupported,
  parseCommand,
  extractPipePositions,
  extractRedirectionNodes,
} from './tree-sitter.js';

// ============================================
// Helpers
// ============================================

/**
 * Check if token is a specific operator.
 * Original: NV in chunks.147.mjs:959-961
 */
function isOperator(token: ShellToken, op: string): boolean {
  return typeof token === 'object' && token !== null && 'op' in token && token.op === op;
}

/**
 * Check if a token is a valid redirection target.
 * Original: xj in chunks.147.mjs:963-965
 */
function isTarget(token: ShellToken): boolean {
  return (
    typeof token === 'string' &&
    !token.startsWith('!') &&
    !token.startsWith('~') &&
    !token.includes('$') &&
    !token.includes('`') &&
    !token.includes('*') &&
    !token.includes('?') &&
    !token.includes('[') &&
    !token.includes('{')
  );
}

/**
 * Reconstruct command from tokens.
 * Simplified version of uz7 in chunks.147.mjs:1101-1120
 */
function reconstructCommand(tokens: ShellToken[]): string {
  return tokens
    .map((t) => {
      if (typeof t === 'string') return t;
      if (typeof t === 'object' && t !== null && 'op' in t) return t.op as string;
      return '';
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if token is numeric (file descriptor).
 */
function isNumeric(token: ShellToken | undefined): boolean {
  return typeof token === 'string' && /^\d+$/.test(token.trim());
}

/**
 * Helper for processing redirect tokens.
 * Original: hz7 in chunks.147.mjs:967-1047
 */
function processRedirect(
  token: ShellToken,
  prev: ShellToken | undefined,
  next: ShellToken | undefined,
  next2: ShellToken | undefined,
  next3: ShellToken | undefined,
  redirections: OutputRedirection[]
): { skip: number } {
  if (!isOperator(token, '>') && !isOperator(token, '>>') && !isOperator(token, '>&')) {
    return { skip: 0 };
  }

  const op = (token as any).op;

  // Handle n> or n>>
  if (isNumeric(prev)) {
    // If it's 1> or 2>, we extract it
    if (next && isTarget(next)) {
      redirections.push({ target: next as string, operator: op });
      return { skip: 1 };
    }
  }

  // Handle >&n or >&target
  if (op === '>&') {
    if (next && isNumeric(next)) {
      if (VALID_FILE_DESCRIPTORS.has(next as string)) {
        redirections.push({ target: next as string, operator: op });
        return { skip: 1 };
      }
    } else if (next && isTarget(next)) {
      redirections.push({ target: next as string, operator: '>' });
      return { skip: 1 };
    }
  }

  // Standard > file or >> file
  if (op === '>' || op === '>>') {
    if (next && isTarget(next)) {
      redirections.push({ target: next as string, operator: op });
      return { skip: 1 };
    }
  }

  return { skip: 0 };
}

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

    const sorted = [...this.redirectionNodes].sort((a, b) => b.startIndex - a.startIndex);
    let result = this.originalCommand;
    for (const node of sorted) {
      result = result.slice(0, node.startIndex) + result.slice(node.endIndex);
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
      let current: string[] = [];

      for (const t of tokens) {
        if (t === '|') {
          if (current.length > 0) {
            segments.push(current.join(' '));
            current = [];
          }
        } else {
          current.push(t);
        }
      }

      if (current.length > 0) {
        segments.push(current.join(' '));
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

    const { commandWithoutRedirections } = extractOutputRedirections(this.originalCommand);
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
 * High-level command parser.
 * Original: cK1 in chunks.123.mjs:826-841
 */
export const shellCommandParser = {
  async parse(command: string): Promise<ParsedCommand | null> {
    if (!command) return null;

    // Tree-sitter check
    if (await isTreeSitterSupported()) {
      try {
        const result = await parseCommand(command);
        if (result) {
          const pipePositions = extractPipePositions(result.rootNode);
          const redirectionNodes = extractRedirectionNodes(result.rootNode);
          result.tree.delete();
          return new RichCommand(command, pipePositions, redirectionNodes);
        }
      } catch {
        // Fallback to SimpleCommand
      }
    }

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
export function extractOutputRedirections(command: string): RedirectionExtractionResult {
  const redirections: OutputRedirection[] = [];
  const parseResult = parseShellCommand(command, (v) => `$${v}`);

  if (!parseResult.success || !parseResult.tokens) {
    return {
      commandWithoutRedirections: command,
      redirections: [],
    };
  }

  const tokens = parseResult.tokens;
  const subshellRedirections = new Set<number>();
  const parenStack: { index: number; isStart: boolean }[] = [];

  // Identify subshell redirections (e.g. (cmd) > file)
  tokens.forEach((t, i) => {
    if (isOperator(t, '(')) {
      const prev = tokens[i - 1];
      const isStart =
        i === 0 ||
        (typeof prev === 'object' &&
          prev !== null &&
          'op' in prev &&
          ['&&', '||', ';', '|'].includes((prev as any).op));
      parenStack.push({ index: i, isStart });
    } else if (isOperator(t, ')') && parenStack.length > 0) {
      const open = parenStack.pop()!;
      const next = tokens[i + 1];
      if (open.isStart && next && (isOperator(next, '>') || isOperator(next, '>>'))) {
        subshellRedirections.add(open.index).add(i);
      }
    }
  });

  const filtered: ShellToken[] = [];
  let depth = 0;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;

    if (subshellRedirections.has(i)) {
      filtered.push(t);
      continue;
    }

    if (isOperator(t, '(')) {
      const prev = tokens[i - 1];
      if (typeof prev === 'string' && prev.endsWith('$')) {
        depth++;
      }
    } else if (isOperator(t, ')') && depth > 0) {
      depth--;
    }

    if (depth === 0) {
      const { skip } = processRedirect(
        t,
        tokens[i - 1],
        tokens[i + 1],
        tokens[i + 2],
        tokens[i + 3],
        redirections
      );
      if (skip > 0) {
        i += skip;
        continue;
      }
    }

    filtered.push(t);
  }

  return {
    commandWithoutRedirections: reconstructCommand(filtered),
    redirections,
  };
}

// ============================================
// Pipe Permission Checking
// ============================================

/**
 * Check if command has shell operators.
 * Original: lm2 in chunks.147.mjs:894-900
 */
export function hasShellOperators(command: string): boolean {
  try {
    // This is a simplified check based on source logic
    // Original calls FK(A) which tokenizes and filters redirects.
    return /[|&;]/.test(command);
  } catch {
    return true;
  }
}

/**
 * Strip output redirections from a segment.
 * Original: vn5 in chunks.123.mjs:904-907
 */
export async function stripOutputRedirections(segment: string): Promise<string> {
  if (!segment.includes('>')) return segment;
  const parsed = await shellCommandParser.parse(segment);
  return parsed ? parsed.withoutOutputRedirections() : segment;
}

/**
 * Validate pipe segments independently.
 * Original: yn5 in chunks.123.mjs:844-902
 */
async function validatePipeSegments(
  request: PipePermissionRequest,
  segments: string[],
  permissionChecker: PermissionChecker
): Promise<SecurityCheckResult> {
  const cdRegex = /^cd(?:\s|$)/;
  if (segments.filter((s) => cdRegex.test(s.trim())).length > 1) {
    return {
      behavior: 'ask',
      message: 'Multiple directory changes in one command require approval for clarity',
      decisionReason: {
        type: 'other',
        reason: 'Multiple directory changes in one command require approval for clarity',
      },
    };
  }

  const results = new Map<string, SecurityCheckResult>();
  for (const s of segments) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    const res = await permissionChecker(trimmed);
    results.set(trimmed, res);
  }

  const denied = Array.from(results.entries()).find(([, r]) => r.behavior === 'deny');
  if (denied) {
    const [seg, res] = denied;
    return {
      behavior: 'deny',
      message: res.message || `Permission denied for: ${seg}`,
      decisionReason: { type: 'risk', reason: `Permission denied for segment: ${seg}` },
    };
  }

  if (Array.from(results.values()).every((r) => r.behavior === 'allow')) {
    return {
      behavior: 'allow',
      message: 'All pipe segments allowed',
      updatedInput: request,
    };
  }

  const suggestions: string[] = [];
  for (const r of results.values()) {
    if (r.behavior !== 'allow' && (r as any).suggestions) {
      suggestions.push(...(r as any).suggestions);
    }
  }

  return {
    behavior: 'ask',
    message: 'This command uses pipes that require individual segment approval',
    decisionReason: { type: 'other', reason: 'Piped command segments need validation' },
    // suggestions: suggestions.length > 0 ? suggestions : undefined
  };
}

/**
 * Main pipe permission checker.
 * Original: cm2 in chunks.123.mjs:909-934
 */
export async function pipePermissionChecker(
  request: PipePermissionRequest,
  permissionChecker: PermissionChecker
): Promise<SecurityCheckResult> {
  if (hasShellOperators(request.command)) {
    const shellCheck = shellOperatorChecker(request.command);
    if (shellCheck.behavior === 'ask') {
      return shellCheck;
    }
  }

  const parsed = await shellCommandParser.parse(request.command);
  if (!parsed) {
    return { behavior: 'passthrough', message: 'Failed to parse command' };
  }

  const segments = parsed.getPipeSegments();
  if (segments.length <= 1) {
    return { behavior: 'passthrough', message: 'No pipes found in command' };
  }

  const strippedSegments = await Promise.all(segments.map((s) => stripOutputRedirections(s)));

  return validatePipeSegments(request, strippedSegments, permissionChecker);
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

  const warning = match[1] ?? null;

  return {
    cleanedStderr: stderr.replace(CWD_RESET_REGEX, '').trim(),
    cwdResetWarning: warning,
  };
}
