/**
 * @claudecode/platform - Shell Tokenizer
 *
 * Shell command tokenization with quote and heredoc handling.
 * Reconstructed from chunks.121.mjs, chunks.147.mjs
 */

import crypto from 'node:crypto';
import type {
  ParseResult,
  ShellToken,
  HeredocExtractionResult,
  QuoteRemovalResult,
  HeredocInfo,
  EscapeMarkers,
} from './types.js';
import {
  HEREDOC_PREFIX,
  HEREDOC_SUFFIX,
  HEREDOC_EXTRACT_PATTERN,
  getEscapeMarkers,
} from './constants.js';

// ============================================
// Heredoc Handling
// ============================================

/**
 * Check if a position is inside quotes.
 * Original: Tz7 in chunks.147.mjs:623-635
 */
export function isInsideQuotes(text: string, pos: number): boolean {
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < pos; i++) {
    const char = text[i];
    let escapeCount = 0;
    for (let j = i - 1; j >= 0 && text[j] === '\\'; j--) {
      escapeCount++;
    }

    if (escapeCount % 2 === 1) continue;

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    }
  }

  return inSingleQuote || inDoubleQuote;
}

/**
 * Check if a position is inside a comment on the same line.
 * Original: Pz7 in chunks.147.mjs:637-652
 */
export function isInsideComment(text: string, pos: number): boolean {
  const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = lineStart; i < pos; i++) {
    const char = text[i];
    let escapeCount = 0;
    for (let j = i - 1; j >= lineStart && text[j] === '\\'; j--) {
      escapeCount++;
    }

    if (escapeCount % 2 === 1) continue;

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    } else if (char === '#' && !inSingleQuote && !inDoubleQuote) {
      return true;
    }
  }

  return false;
}

/**
 * Extract heredocs from command and replace with placeholders.
 * Original: IP0 in chunks.147.mjs:654-727
 */
export function extractHeredocs(command: string): HeredocExtractionResult {
  const heredocs = new Map<string, HeredocInfo>();
  if (!command.includes('<<')) {
    return { processedCommand: command, heredocs };
  }

  const pattern = new RegExp(HEREDOC_EXTRACT_PATTERN.source, 'g');
  const candidates: HeredocInfo[] = [];
  let match;

  while ((match = pattern.exec(command)) !== null) {
    const startIndex = match.index;
    if (isInsideQuotes(command, startIndex)) continue;
    if (isInsideComment(command, startIndex)) continue;

    const fullMatch = match[0];
    const delimiter = match[3] || match[4] || match[1] || match[2]; // The word part of the delimiter
    if (!delimiter) continue;
    const operatorEndIndex = startIndex + fullMatch.length;

    const nextNewLine = command.indexOf('\n', operatorEndIndex);
    if (nextNewLine === -1) continue;

    const contentStartIndex = operatorEndIndex + 1;
    const lines = command.slice(contentStartIndex).split('\n');
    let closingLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i]?.trim() === delimiter) {
        closingLineIndex = i;
        break;
      }
    }

    if (closingLineIndex === -1) continue;

    const contentText = lines.slice(0, closingLineIndex + 1).join('\n');
    const contentEndIndex = contentStartIndex + contentText.length;

    candidates.push({
      fullText: command.slice(startIndex, operatorEndIndex) + command.slice(nextNewLine, contentEndIndex),
      delimiter,
      operatorStartIndex: startIndex,
      operatorEndIndex,
      contentStartIndex: nextNewLine,
      contentEndIndex,
    });
  }

  if (candidates.length === 0) {
    return { processedCommand: command, heredocs };
  }

  // Filter overlapping heredocs (nested heredocs)
  const filtered = candidates.filter((c, i, all) => {
    for (const other of all) {
      if (c === other) continue;
      if (
        c.operatorStartIndex > other.contentStartIndex &&
        c.operatorStartIndex < other.contentEndIndex
      ) {
        return false;
      }
    }
    return true;
  });

  if (filtered.length === 0) {
    return { processedCommand: command, heredocs };
  }

  // Check for duplicate content start indices
  if (new Set(filtered.map((c) => c.contentStartIndex)).size < filtered.length) {
    return { processedCommand: command, heredocs };
  }

  // Sort by reverse position to replace from end to start
  filtered.sort((a, b) => b.contentEndIndex - a.contentEndIndex);

  const uid = crypto.randomBytes(8).toString('hex');
  let processedCommand = command;

  filtered.forEach((info, index) => {
    const placeholderIdx = filtered.length - 1 - index;
    const placeholder = `${HEREDOC_PREFIX}${placeholderIdx}_${uid}${HEREDOC_SUFFIX}`;
    heredocs.set(placeholder, info);

    processedCommand =
      processedCommand.slice(0, info.operatorStartIndex) +
      placeholder +
      processedCommand.slice(info.operatorEndIndex, info.contentStartIndex) +
      processedCommand.slice(info.contentEndIndex);
  });

  return { processedCommand, heredocs };
}

/**
 * Helper to replace placeholders in a string.
 * Original: Sz7 in chunks.147.mjs:729-733
 */
function replaceHeredocPlaceholders(text: string, heredocs: Map<string, HeredocInfo>): string {
  let result = text;
  for (const [placeholder, info] of heredocs) {
    result = result.replaceAll(placeholder, info.fullText);
  }
  return result;
}

/**
 * Reconstruct heredocs in token array.
 * Original: YJ9 in chunks.147.mjs:735-738
 */
export function reconstructHeredocs(
  tokens: string[],
  heredocs: Map<string, HeredocInfo>
): string[] {
  if (heredocs.size === 0) return tokens;
  return tokens.map((t) => replaceHeredocPlaceholders(t, heredocs));
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

    if (isEscaped) {
      isEscaped = false;
      if (!inSingleQuotes) withDoubleQuotes += char;
      if (!inSingleQuotes && !inDoubleQuotes) fullyUnquoted += char;
      continue;
    }

    if (char === '\\') {
      isEscaped = true;
      if (!inSingleQuotes) withDoubleQuotes += char;
      if (!inSingleQuotes && !inDoubleQuotes) fullyUnquoted += char;
      continue;
    }

    if (char === "'" && !inDoubleQuotes) {
      inSingleQuotes = !inSingleQuotes;
      continue;
    }

    if (char === '"' && !inSingleQuotes) {
      inDoubleQuotes = !inDoubleQuotes;
      if (!preserveDoubleQuotes) continue;
    }

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
 * Wrapper for shell parsing.
 * Reconstructed from chunks.20.mjs:2044-2057
 */
export function parseShellCommand(
  command: string,
  handler?: (v: string) => string
): ParseResult {
  try {
    // This is a manual implementation of shell-parse behavior
    const tokens: ShellToken[] = [];
    let current = '';
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let isEscaped = false;

    const flush = () => {
      if (current.length > 0) {
        let val = current;
        if (handler) {
          // Simplistic handler simulation for variable substitution
          // Original: (I) => `$${I}`
          // We won't fully replicate the library's expansion logic here,
          // but we ensure strings are pushed.
        }
        tokens.push(val);
        current = '';
      }
    };

    for (let i = 0; i < command.length; i++) {
      const char = command[i]!;

      // 1. Handle escaped character
      if (isEscaped) {
        current += char;
        isEscaped = false;
        continue;
      }

      // 2. Handle Single Quotes (Literal content, NO escaping inside)
      if (inSingleQuote) {
        if (char === "'") {
          inSingleQuote = false;
        } else {
          current += char;
        }
        continue;
      }

      // 3. Handle Backslash (Escape next char)
      if (char === '\\') {
        isEscaped = true;
        continue;
      }

      // 4. Handle Double Quotes
      if (char === '"') {
        inDoubleQuote = !inDoubleQuote;
        continue;
      }

      // 5. Handle Single Quote start (only if not in double quote)
      if (char === "'" && !inDoubleQuote) {
        inSingleQuote = true;
        continue;
      }

      // 6. Handle separators (only if not in quotes)
      if (!inDoubleQuote) {
        if (/\s/.test(char)) {
          flush();
          continue;
        }

        // Operators
        const twoChar = command.slice(i, i + 2);
        if (['&&', '||', '>>', '>&', ';;'].includes(twoChar)) {
          flush();
          tokens.push({ op: twoChar });
          i++;
          continue;
        }

        if (['|', ';', '>', '<', '&', '(', ')'].includes(char)) {
          flush();
          tokens.push({ op: char });
          continue;
        }
      }

      // 7. Append regular char
      current += char;
    }
    flush();

    return { success: true, tokens };
  } catch (error) {
    console.error('parseShellCommand error:', error);
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
  const markers = getEscapeMarkers();
  const { processedCommand, heredocs } = extractHeredocs(command);

  // Normalize line continuations: Original ZfA regex: /\\+\n/g
  const normalized = processedCommand.replace(/\\+\n/g, (match) => {
    const backslashCount = match.length - 1;
    return backslashCount % 2 === 1 ? '\\'.repeat(backslashCount - 1) : match;
  });

  // Prepare for parsing by masking special characters
  const masked = normalized
    .replaceAll('"', `"${markers.DOUBLE_QUOTE}`)
    .replaceAll("'", `'${markers.SINGLE_QUOTE}`)
    .replaceAll('\n', `\n${markers.NEW_LINE}\n`)
    .replaceAll('\\(', markers.ESCAPED_OPEN_PAREN)
    .replaceAll('\\)', markers.ESCAPED_CLOSE_PAREN);

  const parseResult = parseShellCommand(masked, (v) => `$${v}`);
  if (!parseResult.success || !parseResult.tokens) {
    return [command];
  }

  const rawTokens = parseResult.tokens;
  if (rawTokens.length === 0) return [];

  try {
    const intermediate: (ShellToken | null)[] = [];
    for (const t of rawTokens) {
      if (typeof t === 'string') {
        const last = intermediate[intermediate.length - 1];
        if (intermediate.length > 0 && typeof last === 'string') {
          if (t === markers.NEW_LINE) {
            intermediate.push(null);
          } else {
            intermediate[intermediate.length - 1] = last + ' ' + t;
          }
          continue;
        }
      } else if (typeof t === 'object' && t !== null && 'op' in t && t.op === 'glob') {
        const last = intermediate[intermediate.length - 1];
        if (intermediate.length > 0 && typeof last === 'string') {
          intermediate[intermediate.length - 1] = last + ' ' + (t as any).pattern;
          continue;
        }
      }
      intermediate.push(t);
    }

    const finalTokens = intermediate
      .map((t) => {
        if (t === null) return null;
        if (typeof t === 'string') return t;
        if ('comment' in t) return '#' + t.comment;
        if (typeof t === 'object' && t !== null && 'op' in t) {
          if (t.op === 'glob') return (t as any).pattern;
          return t.op as string;
        }
        return null;
      })
      .filter((t): t is string => t !== null)
      .map((t) => {
        return t
          .replaceAll(markers.SINGLE_QUOTE, "'")
          .replaceAll(markers.DOUBLE_QUOTE, '"')
          .replaceAll(`\n${markers.NEW_LINE}\n`, '\n')
          .replaceAll(markers.ESCAPED_OPEN_PAREN, '\\(')
          .replaceAll(markers.ESCAPED_CLOSE_PAREN, '\\)');
      });

    return reconstructHeredocs(finalTokens, heredocs);
  } catch (error) {
    console.error('tokenizeCommand error:', error);
    return [command];
  }
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
