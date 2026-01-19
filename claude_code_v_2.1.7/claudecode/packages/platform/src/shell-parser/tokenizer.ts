/**
 * @claudecode/platform - Shell Tokenizer
 *
 * Shell command tokenization with quote and heredoc handling.
 * Reconstructed from chunks.147.mjs
 */

import type {
  ParseResult,
  ShellToken,
  HeredocExtractionResult,
  QuoteRemovalResult,
} from './types.js';
import { getEscapeMarkers } from './constants.js';

// ============================================
// Heredoc Handling
// ============================================

/**
 * Extract heredocs from command and replace with placeholders.
 * Original: IP0 in chunks.147.mjs
 */
export function extractHeredocs(command: string): HeredocExtractionResult {
  const heredocs = new Map<string, string>();
  let processedCommand = command;

  // Pattern to match heredoc: <<[-]'DELIM' or <<[-]DELIM
  const heredocPattern = /<<-?\s*(?:'([A-Za-z_]\w*)'|"([A-Za-z_]\w*)"|\\([A-Za-z_]\w*)|([A-Za-z_]\w*))/g;

  let match;
  let offset = 0;

  while ((match = heredocPattern.exec(command)) !== null) {
    const delimiter = match[1] || match[2] || match[3] || match[4];
    if (!delimiter) continue;

    // Find the end of the heredoc
    const afterHeredoc = command.slice(match.index + match[0].length);
    const delimiterEndPattern = new RegExp(`\\n${delimiter}(?:\\s|$)`);
    const endMatch = afterHeredoc.match(delimiterEndPattern);

    if (endMatch && endMatch.index !== undefined) {
      const heredocContent = afterHeredoc.slice(0, endMatch.index + 1 + delimiter.length);
      const placeholder = `__HEREDOC_${heredocs.size}__`;
      heredocs.set(placeholder, heredocContent);

      // Replace in processed command
      const fullHeredoc = match[0] + heredocContent;
      const startIndex = match.index - offset;
      processedCommand =
        processedCommand.slice(0, startIndex) +
        placeholder +
        processedCommand.slice(startIndex + fullHeredoc.length);
      offset += fullHeredoc.length - placeholder.length;
    }
  }

  return { processedCommand, heredocs };
}

/**
 * Reconstruct heredocs in token array.
 * Original: YJ9 in chunks.147.mjs
 */
export function reconstructHeredocs(
  tokens: string[],
  heredocs: Map<string, string>
): string[] {
  if (heredocs.size === 0) return tokens;

  return tokens.map((token) => {
    let result = token;
    for (const [placeholder, content] of heredocs) {
      result = result.replace(placeholder, content);
    }
    return result;
  });
}

// ============================================
// Quote Handling
// ============================================

/**
 * Remove quotes from command while tracking context.
 * Original: Ri5 in chunks.121.mjs:892-924
 */
export function removeQuotes(
  command: string,
  preserveDoubleQuotes: boolean = false
): QuoteRemovalResult {
  let withDoubleQuotes = '';
  let fullyUnquoted = '';
  let inSingleQuotes = false;
  let inDoubleQuotes = false;
  let isEscaped = false;

  for (let i = 0; i < command.length; i++) {
    const char = command[i]!;

    // Handle escaped characters
    if (isEscaped) {
      isEscaped = false;
      if (!inSingleQuotes) withDoubleQuotes += char;
      if (!inSingleQuotes && !inDoubleQuotes) fullyUnquoted += char;
      continue;
    }

    // Mark escape
    if (char === '\\') {
      isEscaped = true;
      if (!inSingleQuotes) withDoubleQuotes += char;
      if (!inSingleQuotes && !inDoubleQuotes) fullyUnquoted += char;
      continue;
    }

    // Toggle quote modes
    if (char === "'" && !inDoubleQuotes) {
      inSingleQuotes = !inSingleQuotes;
      continue;
    }
    if (char === '"' && !inSingleQuotes) {
      inDoubleQuotes = !inDoubleQuotes;
      if (!preserveDoubleQuotes) continue;
    }

    // Add character respecting quote modes
    if (!inSingleQuotes) withDoubleQuotes += char;
    if (!inSingleQuotes && !inDoubleQuotes) fullyUnquoted += char;
  }

  return { withDoubleQuotes, fullyUnquoted };
}

/**
 * Check for unescaped character in text.
 * Original: ji5 in chunks.121.mjs:930-942
 */
export function hasUnescapedChar(text: string, character: string): boolean {
  if (character.length !== 1) {
    throw new Error('hasUnescapedChar only works with single characters');
  }

  let pos = 0;
  while (pos < text.length) {
    // Skip escaped pairs
    if (text[pos] === '\\' && pos + 1 < text.length) {
      pos += 2;
      continue;
    }
    if (text[pos] === character) return true;
    pos++;
  }
  return false;
}

// ============================================
// Tokenization
// ============================================

/**
 * Simple shell command tokenizer.
 * This is a simplified implementation; the original uses shell-parse library.
 * Original: bY in chunks.20.mjs:2044-2057
 */
export function parseShellCommand(command: string): ParseResult {
  try {
    const tokens: ShellToken[] = [];
    let current = '';
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let isEscaped = false;

    for (let i = 0; i < command.length; i++) {
      const char = command[i]!;

      if (isEscaped) {
        current += char;
        isEscaped = false;
        continue;
      }

      if (char === '\\') {
        isEscaped = true;
        current += char;
        continue;
      }

      if (char === "'" && !inDoubleQuote) {
        inSingleQuote = !inSingleQuote;
        current += char;
        continue;
      }

      if (char === '"' && !inSingleQuote) {
        inDoubleQuote = !inDoubleQuote;
        current += char;
        continue;
      }

      if (!inSingleQuote && !inDoubleQuote) {
        // Check for operators
        const twoChar = command.slice(i, i + 2);
        if (twoChar === '&&' || twoChar === '||' || twoChar === '>>' || twoChar === '>&') {
          if (current.trim()) tokens.push(current.trim());
          tokens.push({ op: twoChar });
          current = '';
          i++;
          continue;
        }

        if (char === '|' || char === ';' || char === '>' || char === '<' || char === '&') {
          if (current.trim()) tokens.push(current.trim());
          tokens.push({ op: char });
          current = '';
          continue;
        }

        if (/\s/.test(char)) {
          if (current.trim()) tokens.push(current.trim());
          current = '';
          continue;
        }
      }

      current += char;
    }

    if (current.trim()) tokens.push(current.trim());

    return { success: true, tokens };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parse error',
    };
  }
}

/**
 * Tokenize command with quote and heredoc handling.
 * Original: ZfA in chunks.147.mjs:765-817
 */
export function tokenizeCommand(command: string): string[] {
  const escapeMarkers = getEscapeMarkers();
  const { processedCommand, heredocs } = extractHeredocs(command);

  // Normalize line continuations
  const normalizedCommand = processedCommand.replace(/\\+\n/g, (seq) => {
    const escapedCount = seq.length - 1;
    return escapedCount % 2 === 1 ? '\\'.repeat(escapedCount - 1) : seq;
  });

  // Parse the command
  const parseResult = parseShellCommand(normalizedCommand);

  if (!parseResult.success || !parseResult.tokens) {
    // Fall back to single-token array
    return [command];
  }

  // Filter out operators and flatten to string array
  const tokens: string[] = [];
  for (const token of parseResult.tokens) {
    if (typeof token === 'string') {
      tokens.push(token);
    }
  }

  // Reconstruct heredocs
  return reconstructHeredocs(tokens, heredocs);
}

// ============================================
// Helper Functions
// ============================================

/**
 * Strip benign redirects from content.
 * Original: _i5 in chunks.121.mjs:926-928
 */
export function stripRedirectionNoise(content: string): string {
  let result = content;
  result = result.replace(/\s+2\s*>&\s*1(?=\s|$)/g, ''); // 2>&1
  result = result.replace(/[012]?\s*>\s*\/dev\/null/g, ''); // >/dev/null
  result = result.replace(/\s*<\s*\/dev\/null/g, ''); // </dev/null
  return result;
}

/**
 * Check for malformed tokens (unbalanced delimiters).
 * Original: Oi5 in chunks.121.mjs:874-890
 */
export function isMalformedTokens(tokens: ShellToken[]): boolean {
  for (const token of tokens) {
    if (typeof token !== 'string') continue;

    // Count braces
    const openBraces = (token.match(/{/g) || []).length;
    const closeBraces = (token.match(/}/g) || []).length;
    if (openBraces !== closeBraces) return true;

    // Count parentheses
    const openParens = (token.match(/\(/g) || []).length;
    const closeParens = (token.match(/\)/g) || []).length;
    if (openParens !== closeParens) return true;

    // Count square brackets
    const openBrackets = (token.match(/\[/g) || []).length;
    const closeBrackets = (token.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) return true;

    // Count unescaped quotes (must be even)
    const doubleQuotes = (token.match(/(?<!\\)"/g) || []).length;
    const singleQuotes = (token.match(/(?<!\\)'/g) || []).length;
    if (doubleQuotes % 2 !== 0 || singleQuotes % 2 !== 0) return true;
  }

  return false;
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
