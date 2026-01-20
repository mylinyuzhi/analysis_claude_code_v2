/**
 * @claudecode/ui - Markdown Types
 *
 * Types for markdown tokenization and rendering.
 * Reconstructed from chunks.97.mjs
 */

// ============================================
// Token Types
// ============================================

/**
 * Markdown token types.
 */
export type MarkdownTokenType =
  // Block tokens
  | 'heading'
  | 'paragraph'
  | 'code'
  | 'fenced_code'
  | 'blockquote'
  | 'list'
  | 'list_item'
  | 'hr'
  | 'table'
  | 'table_row'
  | 'table_cell'
  // Inline tokens
  | 'text'
  | 'strong'
  | 'em'
  | 'code_inline'
  | 'link'
  | 'image'
  | 'softbreak'
  | 'hardbreak'
  | 'html_inline';

/**
 * Base markdown token.
 */
export interface MarkdownTokenBase {
  type: MarkdownTokenType;
  content?: string;
  children?: MarkdownToken[];
  nesting?: number; // 1 = open, -1 = close, 0 = self-closing
}

/**
 * Heading token.
 */
export interface HeadingToken extends MarkdownTokenBase {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: string;
}

/**
 * Code block token.
 */
export interface CodeBlockToken extends MarkdownTokenBase {
  type: 'fenced_code' | 'code';
  content: string;
  language?: string;
  info?: string;
}

/**
 * Link token.
 */
export interface LinkToken extends MarkdownTokenBase {
  type: 'link';
  href: string;
  title?: string;
  children?: MarkdownToken[];
}

/**
 * List token.
 */
export interface ListToken extends MarkdownTokenBase {
  type: 'list';
  ordered: boolean;
  start?: number;
  children: ListItemToken[];
}

/**
 * List item token.
 */
export interface ListItemToken extends MarkdownTokenBase {
  type: 'list_item';
  children?: MarkdownToken[];
}

/**
 * Table token.
 */
export interface TableToken extends MarkdownTokenBase {
  type: 'table';
  header: TableRowToken;
  rows: TableRowToken[];
  align?: ('left' | 'center' | 'right' | null)[];
}

/**
 * Table row token.
 */
export interface TableRowToken extends MarkdownTokenBase {
  type: 'table_row';
  cells: TableCellToken[];
}

/**
 * Table cell token.
 */
export interface TableCellToken extends MarkdownTokenBase {
  type: 'table_cell';
  isHeader?: boolean;
  align?: 'left' | 'center' | 'right' | null;
  children?: MarkdownToken[];
}

/**
 * Union type for all markdown tokens.
 */
export type MarkdownToken =
  | MarkdownTokenBase
  | HeadingToken
  | CodeBlockToken
  | LinkToken
  | ListToken
  | ListItemToken
  | TableToken
  | TableRowToken
  | TableCellToken;

// ============================================
// Renderer Types
// ============================================

/**
 * Markdown renderer options.
 */
export interface MarkdownRendererOptions {
  // Terminal width for word wrapping
  width?: number;

  // Code block syntax highlighting
  syntaxHighlighting?: boolean;

  // Link style: 'inline' shows URL, 'styled' uses terminal hyperlinks
  linkStyle?: 'inline' | 'styled' | 'hidden';

  // Heading decoration
  headingStyle?: 'hash' | 'underline' | 'bold';

  // List style
  bulletStyle?: 'dash' | 'asterisk' | 'plus' | 'circle';

  // Code block theme
  codeTheme?: 'dark' | 'light' | 'none';

  // Indentation size for nested content
  indentSize?: number;

  // Whether to preserve HTML
  preserveHtml?: boolean;
}

/**
 * Rendered output with style information.
 */
export interface StyledText {
  text: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    color?: string;
    bgColor?: string;
    dimColor?: boolean;
  };
}

/**
 * Render result.
 */
export interface RenderResult {
  lines: StyledText[][];
  links: { url: string; text: string }[];
}

// ============================================
// Syntax Highlighting Types
// ============================================

/**
 * Supported languages for syntax highlighting.
 */
export type HighlightLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'rust'
  | 'go'
  | 'java'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'ruby'
  | 'php'
  | 'swift'
  | 'kotlin'
  | 'shell'
  | 'bash'
  | 'json'
  | 'yaml'
  | 'toml'
  | 'xml'
  | 'html'
  | 'css'
  | 'sql'
  | 'markdown'
  | 'plaintext';

/**
 * Syntax token for highlighting.
 */
export interface SyntaxToken {
  type: 'keyword' | 'string' | 'number' | 'comment' | 'operator' | 'punctuation' | 'function' | 'variable' | 'type' | 'constant' | 'plain';
  value: string;
}

// ============================================
// Constants
// ============================================

export const MARKDOWN_CONSTANTS = {
  // Default terminal width
  DEFAULT_WIDTH: 80,

  // Default indent size
  DEFAULT_INDENT: 2,

  // Code block delimiters
  CODE_FENCE: '```',

  // Heading markers
  HEADING_CHARS: ['#', '##', '###', '####', '#####', '######'],

  // List markers
  LIST_MARKERS: {
    unordered: ['-', '*', '+'],
    ordered: /^\d+\./,
  },

  // Color scheme for syntax highlighting
  SYNTAX_COLORS: {
    keyword: 'magenta',
    string: 'green',
    number: 'yellow',
    comment: 'gray',
    operator: 'cyan',
    punctuation: 'white',
    function: 'blue',
    variable: 'white',
    type: 'yellow',
    constant: 'yellow',
    plain: 'white',
  } as const,

  // Language aliases
  LANGUAGE_ALIASES: {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    rb: 'ruby',
    sh: 'shell',
    yml: 'yaml',
    md: 'markdown',
  } as const,
} as const;

// Note: exports are declared inline above.
