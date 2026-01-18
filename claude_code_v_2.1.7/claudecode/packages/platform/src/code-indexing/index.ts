/**
 * @claudecode/platform - Code Indexing Module
 *
 * Provides tree-sitter bash parsing and file path autocomplete.
 *
 * Components:
 * - Tree-sitter: WASM-based bash AST parsing for permission checking
 * - FileIndex: File path autocomplete with Rust/Fuse.js backend
 *
 * Reconstructed from chunks.122.mjs, chunks.123.mjs, chunks.136.mjs
 */

// Types
export * from './types.js';

// Tree-sitter (Bash AST parsing)
export {
  // Initialization
  ensureTreeSitterLoaded,
  isTreeSitterAvailable,

  // Parsing
  parseCommand,
  findCommandNode,
  extractEnvironmentVariables,
  extractPipePositions,
  extractRedirections,
  traverseTree,
  tokenizeCommand,

  // Command classes
  SimpleCommand,
  RichCommand,
  shellCommandParser,
} from './tree-sitter.js';

// File Index (autocomplete)
export {
  // Index management
  getFileSuggestions,
  clearFileIndexCache,
  refreshIndexCache,
  initializeFileIndex,

  // File discovery
  isGitRepo,
  getFilesUsingGit,
  getFilesUsingRipgrep,
  getProjectFiles,
  extractDirectoryPrefixes,

  // Search
  performSearch,
  createFileResult,

  // Custom command
  executeFileSuggestionCommand,
} from './file-index.js';
