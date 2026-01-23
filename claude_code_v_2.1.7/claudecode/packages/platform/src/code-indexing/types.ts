/**
 * @claudecode/platform - Code Indexing Types
 *
 * Type definitions for tree-sitter parsing and file indexing.
 *
 * Reconstructed from chunks.122.mjs, chunks.123.mjs, chunks.136.mjs
 */

// ============================================
// Tree-sitter Types
// ============================================

/**
 * Tree-sitter AST node.
 */
export interface TreeSitterNode {
  /** Node type (e.g., "command", "pipeline", "word") */
  type: string;
  /** Child nodes */
  children: TreeSitterNode[];
  /** Parent node (null for root) */
  parent: TreeSitterNode | null;
  /** Start position in source */
  startIndex: number;
  /** End position in source */
  endIndex: number;
  /** Source text for this node */
  text: string;
  /** Start row (0-indexed) */
  startPosition: { row: number; column: number };
  /** End row (0-indexed) */
  endPosition: { row: number; column: number };
}

/**
 * Tree-sitter syntax tree.
 */
export interface TreeSitterTree {
  /** Root node of the tree */
  rootNode: TreeSitterNode;
  /** Free WASM memory (must call when done) */
  delete(): void;
}

/**
 * Parse command result.
 * Original: Return type of Rn5 (parseCommand)
 */
export interface ParseCommandResult {
  /** Complete AST tree (caller must delete) */
  tree: TreeSitterTree;
  /** Root node of the tree */
  rootNode: TreeSitterNode;
  /** Extracted environment variables (e.g., ["VAR=value"]) */
  envVars: string[];
  /** Main command node */
  commandNode: TreeSitterNode | null;
  /** Original command string */
  originalCommand: string;
}

/**
 * Output redirection info.
 */
export interface RedirectionInfo {
  /** Start position in source */
  startIndex: number;
  /** End position in source */
  endIndex: number;
  /** Target filename */
  target: string;
  /** Operator type: ">" or ">>" */
  operator: '>' | '>>';
}

// ============================================
// Command Types
// ============================================

/**
 * Base command interface.
 */
export interface Command {
  /** Original command string */
  readonly originalCommand: string;
  /** Get string representation */
  toString(): string;
  /** Get pipe-separated segments */
  getPipeSegments(): string[];
  /** Get command without output redirections */
  withoutOutputRedirections(): string;
  /** Get output redirections */
  getOutputRedirections(): RedirectionInfo[];
}

/**
 * Shell command parser interface.
 * Original: cK1 in chunks.123.mjs
 */
export interface ShellCommandParser {
  /** Parse command string into Command object */
  parse(command: string): Promise<Command | null>;
}

// ============================================
// File Index Types
// ============================================

/**
 * File search result from Rust module.
 */
export interface FileSearchResult {
  /** File path */
  path: string;
  /** Relevance score (lower is better) */
  score?: number;
}

/**
 * File index interface (Rust native module).
 * Original: FileIndex from file-index.node
 */
export interface FileIndex {
  /** Load file paths into the index */
  loadFromFileList(paths: string[]): void;
  /** Search for matching paths */
  search(query: string, maxResults: number): FileSearchResult[];
}

/**
 * File suggestion result for UI.
 * Original: Return type of ehA (createFileResult) in chunks.136.mjs
 */
export interface FileSuggestion {
  /** Unique ID */
  id: string;
  /** Display text (path) */
  displayText: string;
  /** Metadata */
  metadata?: {
    score?: number;
  };
}

/**
 * File suggestion command context.
 */
export interface FileSuggestionContext {
  /** Current working directory */
  cwd: string;
  /** Search query */
  query: string;
  /** Additional context */
  [key: string]: unknown;
}

/**
 * Cache entry for file index.
 */
export interface FileIndexCache {
  /** Rust file index instance (if available) */
  fileIndex: FileIndex | null;
  /** Fallback file list */
  fileList: string[];
}

// ============================================
// Constants
// ============================================

/**
 * Maximum command length for tree-sitter parsing.
 * Original: Un5 in chunks.123.mjs:686
 */
export const MAX_COMMAND_LENGTH = 10000;

/**
 * Cache TTL in milliseconds (60 seconds).
 * Original: BY7 in chunks.136.mjs
 */
export const CACHE_TTL = 60000;

/**
 * Maximum number of file suggestions.
 * Original: NzA in chunks.136.mjs
 */
export const MAX_SUGGESTIONS = 15;

/**
 * Declaration keywords for bash commands.
 * Original: qn5 in chunks.123.mjs:689
 */
export const DECLARATION_KEYWORDS = new Set([
  'export',
  'declare',
  'typeset',
  'readonly',
  'local',
  'unset',
  'unsetenv',
]);

/**
 * Valid argument node types.
 * Original: Nn5 in chunks.123.mjs:691
 */
export const ARGUMENT_TYPES = new Set(['word', 'string', 'raw_string', 'number']);

/**
 * Substitution node types (stop traversal).
 * Original: wn5 in chunks.123.mjs:693
 */
export const SUBSTITUTION_TYPES = new Set([
  'command_substitution',
  'process_substitution',
]);

/**
 * Valid command node types.
 * Original: Nq0 in chunks.123.mjs:687
 */
export const COMMAND_NODE_TYPES = new Set(['command', 'declaration_command']);
