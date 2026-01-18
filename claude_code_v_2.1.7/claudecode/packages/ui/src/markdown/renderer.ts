/**
 * @claudecode/ui - Markdown Renderer
 *
 * Converts markdown tokens to styled terminal output.
 * Reconstructed from chunks.97.mjs
 */

import type {
  MarkdownToken,
  MarkdownRendererOptions,
  StyledText,
  RenderResult,
  HeadingToken,
  CodeBlockToken,
  ListToken,
  TableToken,
  LinkToken,
} from './types.js';
import { MARKDOWN_CONSTANTS } from './types.js';

// ============================================
// Default Options
// ============================================

const DEFAULT_OPTIONS: Required<MarkdownRendererOptions> = {
  width: MARKDOWN_CONSTANTS.DEFAULT_WIDTH,
  syntaxHighlighting: true,
  linkStyle: 'inline',
  headingStyle: 'bold',
  bulletStyle: 'dash',
  codeTheme: 'dark',
  indentSize: MARKDOWN_CONSTANTS.DEFAULT_INDENT,
  preserveHtml: false,
};

// ============================================
// Token Renderer
// ============================================

/**
 * Convert markdown token to styled text.
 * Original: VE (tokenToText) in chunks.97.mjs
 */
export function tokenToStyledText(
  token: MarkdownToken,
  options: MarkdownRendererOptions = {}
): StyledText[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  switch (token.type) {
    case 'heading':
      return renderHeading(token as HeadingToken, opts);

    case 'paragraph':
      return renderParagraph(token, opts);

    case 'fenced_code':
    case 'code':
      return renderCodeBlock(token as CodeBlockToken, opts);

    case 'code_inline':
      return [{ text: token.content ?? '', style: { color: 'cyan' } }];

    case 'blockquote':
      return renderBlockquote(token, opts);

    case 'list':
      return renderList(token as ListToken, opts);

    case 'table':
      return renderTable(token as TableToken, opts);

    case 'link':
      return renderLink(token as LinkToken, opts);

    case 'strong':
      return (token.children ?? []).flatMap((child) => {
        const rendered = tokenToStyledText(child, opts);
        return rendered.map((s) => ({ ...s, style: { ...s.style, bold: true } }));
      });

    case 'em':
      return (token.children ?? []).flatMap((child) => {
        const rendered = tokenToStyledText(child, opts);
        return rendered.map((s) => ({ ...s, style: { ...s.style, italic: true } }));
      });

    case 'hr':
      return [{ text: '─'.repeat(opts.width), style: { dimColor: true } }];

    case 'softbreak':
      return [{ text: ' ' }];

    case 'hardbreak':
      return [{ text: '\n' }];

    case 'text':
    default:
      return [{ text: token.content ?? '' }];
  }
}

// ============================================
// Block Renderers
// ============================================

/**
 * Render heading token.
 */
function renderHeading(token: HeadingToken, options: Required<MarkdownRendererOptions>): StyledText[] {
  const content = token.content;

  switch (options.headingStyle) {
    case 'hash':
      const hashes = '#'.repeat(token.level);
      return [
        { text: `${hashes} `, style: { color: 'blue', bold: true } },
        { text: content, style: { bold: true } },
      ];

    case 'underline':
      const underlineChar = token.level === 1 ? '=' : '-';
      return [
        { text: content, style: { bold: true } },
        { text: '\n' + underlineChar.repeat(content.length), style: { dimColor: true } },
      ];

    case 'bold':
    default:
      const colors = ['magenta', 'blue', 'cyan', 'green', 'yellow', 'white'];
      return [{ text: content, style: { bold: true, color: colors[token.level - 1] } }];
  }
}

/**
 * Render paragraph token.
 */
function renderParagraph(token: MarkdownToken, options: Required<MarkdownRendererOptions>): StyledText[] {
  const children = token.children ?? [];
  return children.flatMap((child) => tokenToStyledText(child, options));
}

/**
 * Render code block.
 */
function renderCodeBlock(token: CodeBlockToken, options: Required<MarkdownRendererOptions>): StyledText[] {
  const language = token.language || token.info || '';
  const code = token.content ?? '';

  const result: StyledText[] = [];

  // Language header
  if (language) {
    result.push({
      text: `\n┌─ ${language} `,
      style: { color: 'gray' },
    });
    result.push({
      text: '─'.repeat(Math.max(0, options.width - language.length - 4)),
      style: { dimColor: true },
    });
    result.push({ text: '\n' });
  }

  // Code content with left border
  const lines = code.split('\n');
  for (const line of lines) {
    result.push({
      text: '│ ',
      style: { dimColor: true },
    });

    if (options.syntaxHighlighting && language) {
      // Simple syntax highlighting
      result.push(...highlightCode(line, language));
    } else {
      result.push({ text: line });
    }
    result.push({ text: '\n' });
  }

  // Bottom border
  result.push({
    text: '└' + '─'.repeat(options.width - 1),
    style: { dimColor: true },
  });

  return result;
}

/**
 * Render blockquote.
 */
function renderBlockquote(token: MarkdownToken, options: Required<MarkdownRendererOptions>): StyledText[] {
  const children = token.children ?? [];
  const content = children.flatMap((child) => tokenToStyledText(child, options));

  // Add quote prefix
  return [
    { text: '│ ', style: { color: 'gray' } },
    ...content.map((s) => ({ ...s, style: { ...s.style, dimColor: true } })),
  ];
}

/**
 * Render list.
 */
function renderList(token: ListToken, options: Required<MarkdownRendererOptions>): StyledText[] {
  const result: StyledText[] = [];
  const items = token.children ?? [];

  items.forEach((item, index) => {
    // Bullet or number
    const marker = token.ordered
      ? `${(token.start ?? 1) + index}. `
      : `${getBulletChar(options.bulletStyle)} `;

    result.push({ text: marker, style: { color: 'cyan' } });

    // Item content
    const content = (item.children ?? []).flatMap((child) => tokenToStyledText(child, options));
    result.push(...content);
    result.push({ text: '\n' });
  });

  return result;
}

/**
 * Render table.
 * Original: gG2 (TableRenderer) in chunks.97.mjs
 */
function renderTable(token: TableToken, options: Required<MarkdownRendererOptions>): StyledText[] {
  const result: StyledText[] = [];

  // Calculate column widths
  const allRows = [token.header, ...token.rows];
  const colWidths = calculateColumnWidths(allRows, options.width);

  // Header
  result.push({ text: '\n' });
  result.push(...renderTableRow(token.header, colWidths, true, token.align));
  result.push({ text: '\n' });

  // Separator
  result.push({
    text: colWidths.map((w) => '─'.repeat(w + 2)).join('┼'),
    style: { dimColor: true },
  });
  result.push({ text: '\n' });

  // Data rows
  for (const row of token.rows) {
    result.push(...renderTableRow(row, colWidths, false, token.align));
    result.push({ text: '\n' });
  }

  return result;
}

/**
 * Render table row.
 */
function renderTableRow(
  row: { cells: { children?: MarkdownToken[] }[] },
  colWidths: number[],
  isHeader: boolean,
  align?: ('left' | 'center' | 'right' | null)[]
): StyledText[] {
  const result: StyledText[] = [];

  row.cells.forEach((cell, i) => {
    const content = (cell.children ?? [])
      .map((c) => c.content ?? '')
      .join('');
    const width = colWidths[i] ?? 10;
    const padded = padCell(content, width, align?.[i] ?? 'left');

    if (i > 0) {
      result.push({ text: ' │ ', style: { dimColor: true } });
    }

    result.push({
      text: padded,
      style: isHeader ? { bold: true } : undefined,
    });
  });

  return result;
}

/**
 * Render link.
 */
function renderLink(token: LinkToken, options: Required<MarkdownRendererOptions>): StyledText[] {
  const text = (token.children ?? []).map((c) => c.content ?? '').join('');

  switch (options.linkStyle) {
    case 'styled':
      // OSC 8 hyperlink (if terminal supports)
      return [
        { text, style: { color: 'blue', underline: true } },
      ];

    case 'hidden':
      return [{ text, style: { color: 'blue' } }];

    case 'inline':
    default:
      return [
        { text: `${text} (`, style: { color: 'blue' } },
        { text: token.href, style: { dimColor: true } },
        { text: ')', style: { color: 'blue' } },
      ];
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get bullet character for list style.
 */
function getBulletChar(style: string): string {
  switch (style) {
    case 'asterisk':
      return '*';
    case 'plus':
      return '+';
    case 'circle':
      return '○';
    case 'dash':
    default:
      return '-';
  }
}

/**
 * Calculate column widths for table.
 */
function calculateColumnWidths(
  rows: { cells: { children?: MarkdownToken[] }[] }[],
  maxWidth: number
): number[] {
  if (rows.length === 0) return [];

  const numCols = rows[0].cells.length;
  const widths = new Array(numCols).fill(0);

  // Find max width for each column
  for (const row of rows) {
    row.cells.forEach((cell, i) => {
      const content = (cell.children ?? []).map((c) => c.content ?? '').join('');
      widths[i] = Math.max(widths[i], content.length);
    });
  }

  // Cap at available width
  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + (numCols - 1) * 3;
  if (totalWidth > maxWidth) {
    const scale = (maxWidth - (numCols - 1) * 3) / widths.reduce((sum, w) => sum + w, 0);
    return widths.map((w) => Math.max(5, Math.floor(w * scale)));
  }

  return widths;
}

/**
 * Pad cell content for alignment.
 */
function padCell(content: string, width: number, align: 'left' | 'center' | 'right' | null): string {
  if (content.length >= width) return content.slice(0, width);

  const padding = width - content.length;

  switch (align) {
    case 'right':
      return ' '.repeat(padding) + content;
    case 'center':
      const left = Math.floor(padding / 2);
      const right = padding - left;
      return ' '.repeat(left) + content + ' '.repeat(right);
    case 'left':
    default:
      return content + ' '.repeat(padding);
  }
}

/**
 * Simple syntax highlighting.
 */
function highlightCode(line: string, language: string): StyledText[] {
  // Basic keyword highlighting
  const keywords = getLanguageKeywords(language);
  if (keywords.length === 0) {
    return [{ text: line }];
  }

  const result: StyledText[] = [];
  const keywordPattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  let lastIndex = 0;
  let match;

  while ((match = keywordPattern.exec(line)) !== null) {
    // Text before keyword
    if (match.index > lastIndex) {
      result.push({ text: line.slice(lastIndex, match.index) });
    }
    // Keyword
    result.push({
      text: match[0],
      style: { color: MARKDOWN_CONSTANTS.SYNTAX_COLORS.keyword },
    });
    lastIndex = keywordPattern.lastIndex;
  }

  // Remaining text
  if (lastIndex < line.length) {
    result.push({ text: line.slice(lastIndex) });
  }

  return result.length > 0 ? result : [{ text: line }];
}

/**
 * Get language keywords for highlighting.
 */
function getLanguageKeywords(language: string): string[] {
  const lang = language.toLowerCase();

  const keywords: Record<string, string[]> = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'extends', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined'],
    typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'extends', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined', 'interface', 'type', 'enum', 'implements', 'private', 'public', 'protected', 'readonly'],
    python: ['def', 'return', 'if', 'elif', 'else', 'for', 'while', 'class', 'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'lambda', 'yield', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'pass', 'break', 'continue', 'async', 'await'],
    rust: ['fn', 'let', 'mut', 'const', 'if', 'else', 'match', 'for', 'while', 'loop', 'struct', 'enum', 'impl', 'trait', 'use', 'mod', 'pub', 'return', 'self', 'Self', 'true', 'false', 'async', 'await', 'move', 'ref', 'where', 'type', 'unsafe', 'extern', 'crate'],
    go: ['func', 'return', 'if', 'else', 'for', 'range', 'switch', 'case', 'default', 'struct', 'interface', 'type', 'package', 'import', 'var', 'const', 'go', 'defer', 'chan', 'select', 'map', 'make', 'new', 'nil', 'true', 'false', 'break', 'continue', 'fallthrough'],
  };

  // Handle aliases
  const resolved = (MARKDOWN_CONSTANTS.LANGUAGE_ALIASES as Record<string, string>)[lang] ?? lang;
  return keywords[resolved] ?? [];
}

// ============================================
// Main Renderer
// ============================================

/**
 * Render markdown tokens to styled text.
 * Original: JV (MarkdownRenderer) in chunks.97.mjs
 */
export function renderMarkdown(
  tokens: MarkdownToken[],
  options: MarkdownRendererOptions = {}
): RenderResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const lines: StyledText[][] = [];
  const links: { url: string; text: string }[] = [];
  let currentLine: StyledText[] = [];

  for (const token of tokens) {
    const rendered = tokenToStyledText(token, opts);

    for (const segment of rendered) {
      if (segment.text.includes('\n')) {
        const parts = segment.text.split('\n');
        parts.forEach((part, i) => {
          if (i > 0) {
            lines.push(currentLine);
            currentLine = [];
          }
          if (part) {
            currentLine.push({ ...segment, text: part });
          }
        });
      } else {
        currentLine.push(segment);
      }

      // Collect links
      if (token.type === 'link') {
        const linkToken = token as LinkToken;
        const text = (linkToken.children ?? []).map((c) => c.content ?? '').join('');
        links.push({ url: linkToken.href, text });
      }
    }
  }

  // Push final line
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return { lines, links };
}

// ============================================
// Export
// ============================================

export { tokenToStyledText, renderMarkdown };
