/**
 * @claudecode/platform - Tree-sitter Integration
 *
 * WASM-based bash command parsing for permission checking.
 * Parses shell commands into ASTs to extract pipes, redirections, and env vars.
 *
 * Reconstructed from chunks.122.mjs, chunks.123.mjs
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import Parser from 'web-tree-sitter';

import { recordTelemetry } from '../telemetry/index.js';
import type {
  TreeSitterNode,
  TreeSitterTree,
  ParseCommandResult,
  RedirectionInfo,
  Command,
  ShellCommandParser,
} from './types.js';

import {
  MAX_COMMAND_LENGTH,
  COMMAND_NODE_TYPES,
  ARGUMENT_TYPES,
  SUBSTITUTION_TYPES,
  DECLARATION_KEYWORDS,
} from './types.js';

// ============================================
// Global State
// ============================================

/** Parser singleton (DEA) */
let globalParser: Parser | null = null;

/** Bash language instance (GfA) */
let globalBashLanguage: Parser.Language | null = null;

/** Initialization promise (wq0) */
let initPromise: Promise<void> | null = null;

// ============================================
// Initialization
// ============================================

/**
 * Check if running in bundled mode (has embedded WASM).
 * Original: LG()
 */
function isBundledMode(): boolean {
  return typeof (globalThis as any).Bun?.embeddedFiles !== 'undefined';
}

/**
 * Load embedded file (Bun runtime).
 * Original: fm2
 */
async function loadEmbeddedFile(filename: string): Promise<Uint8Array | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const embedded = (globalThis as any).Bun?.embeddedFiles;
    if (embedded) {
      // Find file ending with filename
      for (const file of embedded) {
        if (file.name && file.name.endsWith(filename)) {
          return new Uint8Array(await file.arrayBuffer());
        }
      }
    }
  } catch {
    // Ignore errors
  }
  return null;
}

/**
 * Get current module directory.
 * Original: Ln5
 */
function getModuleDir(): string {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd();
  }
}

/**
 * Initialize tree-sitter WASM binaries.
 * Original: Mn5 in chunks.123.mjs:562-593
 */
async function initializeTreeSitter(): Promise<void> {
  // Strategy 1: Embedded WASM (Bun bundled mode)
  if (isBundledMode()) {
    const treeSitterWasm = await loadEmbeddedFile('tree-sitter.wasm');
    const bashWasm = await loadEmbeddedFile('tree-sitter-bash.wasm');

    if (treeSitterWasm && bashWasm) {
      // Initialize with embedded binary
      await Parser.init({
        wasmBinary: treeSitterWasm,
      });
      globalParser = new Parser();
      globalBashLanguage = await Parser.Language.load(bashWasm);
      globalParser.setLanguage(globalBashLanguage);

      // log("tree-sitter: loaded from embedded");
      recordTelemetry('tengu_tree_sitter_load', {
        success: true,
        from_embedded: true,
      });
      return;
    }
  }

  // Strategy 2: Load from disk
  const basePath = getModuleDir();
  // Original code has G = !1, so it looks in basePath directly for .wasm files
  // But in development/node_modules, they might be inside the packages.
  // We'll try to find them.
  
  // Construct paths - assuming adjacent to this file or in node_modules
  // In source: dK1(B, "tree-sitter.wasm")
  const wasmPath = path.join(basePath, 'tree-sitter.wasm');
  const bashWasmPath = path.join(basePath, 'tree-sitter-bash.wasm');

  // Fallback paths for node_modules resolution if not found
  // (This handles the case where we are running from source/dist)
  let finalWasmPath = wasmPath;
  let finalBashWasmPath = bashWasmPath;

  if (!fs.existsSync(finalWasmPath)) {
    // Try to resolve via require/import or typical node_modules locations
    // This part adapts the original logic to work in our reconstructed environment
    try {
        // Attempt to find where web-tree-sitter is
        const webTreeSitterPath = require.resolve('web-tree-sitter');
        finalWasmPath = path.join(path.dirname(webTreeSitterPath), 'tree-sitter.wasm');
    } catch {
        // ignore
    }
  }
  
  // Original logic checks existence:
  if (!fs.existsSync(finalWasmPath) || !fs.existsSync(finalBashWasmPath)) {
      // One last try: check if tree-sitter-bash is in node_modules
      if (!fs.existsSync(finalBashWasmPath)) {
          try {
             // This file is usually inside tree-sitter-bash/tree-sitter-bash.wasm
             // but we need to find it.
             // For now we will assume it is placed correctly or we fail gracefully.
          } catch {
              // ignore
          }
      }
  }

  if (!fs.existsSync(finalWasmPath) || !fs.existsSync(finalBashWasmPath)) {
    // console.log("tree-sitter: WASM files not found");
    recordTelemetry('tengu_tree_sitter_load', { success: false });
    return;
  }

  await Parser.init({
    locateFile: (file: string) => {
        if (file.endsWith('tree-sitter.wasm')) return finalWasmPath;
        return file;
    }
  });

  globalParser = new Parser();
  globalBashLanguage = await Parser.Language.load(fs.readFileSync(finalBashWasmPath));
  globalParser.setLanguage(globalBashLanguage);

  // console.log("tree-sitter: loaded from disk");
  recordTelemetry('tengu_tree_sitter_load', {
    success: true,
    from_embedded: false,
  });
}

/**
 * Ensure tree-sitter is loaded (lazy initialization).
 * Original: hm2 in chunks.123.mjs:595-598
 */
export async function ensureTreeSitterLoaded(): Promise<void> {
  if (!initPromise) {
    initPromise = initializeTreeSitter();
  }
  await initPromise;
}

/**
 * Check if tree-sitter is available.
 * Original: xn5 in chunks.123.mjs
 */
export async function isTreeSitterAvailable(): Promise<boolean> {
  await ensureTreeSitterLoaded();
  return globalParser !== null && globalBashLanguage !== null;
}

// ============================================
// AST Traversal & Extraction
// ============================================

/**
 * Traverse AST tree and call visitor on each node.
 * Original: Mq0 in chunks.123.mjs
 */
export function traverseTree(node: TreeSitterNode, visitor: (node: TreeSitterNode) => void): void {
  if (!node) return;

  visitor(node);

  for (const child of node.children) {
    if (child) {
      traverseTree(child, visitor);
    }
  }
}

/**
 * Find command node in AST.
 * Original: gm2 in chunks.123.mjs:620-634
 */
export function findCommandNode(node: TreeSitterNode): TreeSitterNode | null {
  const { type, children, parent } = node;

  if (COMMAND_NODE_TYPES.has(type)) {
    return node;
  }

  // Handle variable assignments: VAR=val cmd -> find 'cmd'
  if (type === 'variable_assignment' && parent) {
    return (
      parent.children.find(
        (sibling) =>
          sibling &&
          COMMAND_NODE_TYPES.has(sibling.type) &&
          sibling.startIndex > node.startIndex
      ) ?? null
    );
  }

  // Handle pipelines and redirected statements
  if (type === 'pipeline' || type === 'redirected_statement') {
    return children.find((child) => child && COMMAND_NODE_TYPES.has(child.type)) ?? null;
  }

  // Recursively search children
  for (const child of children) {
    const found = child && findCommandNode(child);
    if (found) return found;
  }

  return null;
}

/**
 * Extract environment variables from command node.
 * Original: _n5 in chunks.123.mjs:636-645
 */
export function extractEnvironmentVariables(commandNode: TreeSitterNode | null): string[] {
  if (!commandNode || commandNode.type !== 'command') {
    return [];
  }

  const envVars: string[] = [];

  for (const child of commandNode.children) {
    if (!child) continue;

    if (child.type === 'variable_assignment') {
      envVars.push(child.text);
    } else if (child.type === 'command_name' || child.type === 'word') {
      // Stop at the first command/argument
      break;
    }
  }

  return envVars;
}

/**
 * Extract pipe operator positions from AST.
 * Original: Pn5 in chunks.123.mjs:741-749
 */
export function extractPipePositions(rootNode: TreeSitterNode): number[] {
  const positions: number[] = [];

  traverseTree(rootNode, (node) => {
    if (node.type === 'pipeline') {
      for (const child of node.children) {
        if (child && child.type === '|') {
          positions.push(child.startIndex);
        }
      }
    }
  });

  return positions;
}

/**
 * Extract output redirections from AST.
 * Original: Sn5 in chunks.123.mjs:751-766
 */
export function extractRedirections(rootNode: TreeSitterNode): RedirectionInfo[] {
  const redirections: RedirectionInfo[] = [];

  traverseTree(rootNode, (node) => {
    if (node.type === 'file_redirect') {
      const children = node.children;

      // Find redirection operator
      const operatorNode = children.find(
        (child) => child && (child.type === '>' || child.type === '>>')
      );

      // Find target filename
      const targetNode = children.find((child) => child && child.type === 'word');

      if (operatorNode && targetNode) {
        redirections.push({
          startIndex: node.startIndex,
          endIndex: node.endIndex,
          target: targetNode.text,
          operator: operatorNode.type as '>' | '>>',
        });
      }
    }
  });

  return redirections;
}

// ============================================
// Core Parsing
// ============================================

/**
 * Parse command string into AST.
 * Original: Rn5 in chunks.123.mjs:600-618
 */
export async function parseCommand(commandString: string): Promise<ParseCommandResult | null> {
  await ensureTreeSitterLoaded();

  if (
    !commandString ||
    commandString.length > MAX_COMMAND_LENGTH ||
    !globalParser ||
    !globalBashLanguage
  ) {
    return null;
  }

  try {
    const tree = globalParser.parse(commandString);
    const rootNode = tree?.rootNode;

    if (!rootNode) return null;

    const commandNode = findCommandNode(rootNode as unknown as TreeSitterNode);
    const envVars = extractEnvironmentVariables(commandNode);

    return {
      tree: tree as unknown as TreeSitterTree,
      rootNode: rootNode as unknown as TreeSitterNode,
      envVars,
      commandNode,
      originalCommand: commandString,
    };
  } catch {
    return null;
  }
}

// ============================================
// Command Classes
// ============================================

/**
 * Simple tokenizer for fallback parsing.
 * Original: ZfA in chunks.147.mjs
 */
export function tokenizeCommand(command: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escape = false;

  for (const char of command) {
    if (escape) {
      current += char;
      escape = false;
      continue;
    }

    if (char === '\\') {
      escape = true;
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
      if (char === ' ' || char === '\t') {
        if (current) {
          tokens.push(current);
          current = '';
        }
        continue;
      }

      if (char === '|' || char === '>' || char === '<' || char === ';' || char === '&') {
        if (current) {
          tokens.push(current);
          current = '';
        }
        tokens.push(char);
        continue;
      }
    }

    current += char;
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Extract output redirections from command string.
 * Original: Hx in chunks.147.mjs
 */
function extractOutputRedirectionsFromString(command: string): {
  commandWithoutRedirections: string;
  redirections: RedirectionInfo[];
} {
  const redirections: RedirectionInfo[] = [];

  // Simple regex-based extraction
  const redirectPattern = /\s*(>>?)\s*(\S+)/g;
  let match;
  let lastIndex = 0;
  let result = '';

  while ((match = redirectPattern.exec(command)) !== null) {
    result += command.slice(lastIndex, match.index);
    redirections.push({
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      target: match[2]!,
      operator: match[1] as '>' | '>>',
    });
    lastIndex = match.index + match[0].length;
  }

  result += command.slice(lastIndex);

  return {
    commandWithoutRedirections: result.trim(),
    redirections,
  };
}

/**
 * SimpleCommand - Fallback command wrapper (string-based).
 * Original: um2 in chunks.123.mjs:695-732
 */
export class SimpleCommand implements Command {
  readonly originalCommand: string;

  constructor(commandString: string) {
    this.originalCommand = commandString;
  }

  toString(): string {
    return this.originalCommand;
  }

  getPipeSegments(): string[] {
    try {
      const tokens = tokenizeCommand(this.originalCommand);
      const segments: string[] = [];
      let current: string[] = [];

      for (const token of tokens) {
        if (token === '|') {
          if (current.length > 0) {
            segments.push(current.join(' '));
            current = [];
          }
        } else {
          current.push(token);
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

    const { commandWithoutRedirections, redirections } = extractOutputRedirectionsFromString(
      this.originalCommand
    );

    return redirections.length > 0 ? commandWithoutRedirections : this.originalCommand;
  }

  getOutputRedirections(): RedirectionInfo[] {
    const { redirections } = extractOutputRedirectionsFromString(this.originalCommand);
    return redirections;
  }
}

/**
 * RichCommand - AST-backed command wrapper.
 * Original: mm2 in chunks.123.mjs:768-807
 */
export class RichCommand implements Command {
  readonly originalCommand: string;
  readonly pipePositions: number[];
  readonly redirectionNodes: RedirectionInfo[];

  constructor(
    commandString: string,
    pipePositions: number[],
    redirectionNodes: RedirectionInfo[]
  ) {
    this.originalCommand = commandString;
    this.pipePositions = pipePositions;
    this.redirectionNodes = redirectionNodes;
  }

  toString(): string {
    return this.originalCommand;
  }

  getPipeSegments(): string[] {
    if (this.pipePositions.length === 0) {
      return [this.originalCommand];
    }

    const segments: string[] = [];
    let currentPos = 0;

    for (const pipePos of this.pipePositions) {
      const segment = this.originalCommand.slice(currentPos, pipePos).trim();
      if (segment) {
        segments.push(segment);
      }
      currentPos = pipePos + 1;
    }

    const lastSegment = this.originalCommand.slice(currentPos).trim();
    if (lastSegment) {
      segments.push(lastSegment);
    }

    return segments;
  }

  withoutOutputRedirections(): string {
    if (this.redirectionNodes.length === 0) {
      return this.originalCommand;
    }

    // Sort by startIndex descending to avoid offset corruption
    const sorted = [...this.redirectionNodes].sort((a, b) => b.startIndex - a.startIndex);
    let result = this.originalCommand;

    // Remove from highest index to lowest
    for (const redirection of sorted) {
      result = result.slice(0, redirection.startIndex) + result.slice(redirection.endIndex);
    }

    return result.trim().replace(/\s+/g, ' ');
  }

  getOutputRedirections(): RedirectionInfo[] {
    return this.redirectionNodes.map(({ target, operator }) => ({
      startIndex: 0,
      endIndex: 0,
      target,
      operator,
    }));
  }
}

// ============================================
// Shell Command Parser
// ============================================

/**
 * Shell command parser facade.
 * Original: cK1 in chunks.123.mjs:826-841
 */
export const shellCommandParser: ShellCommandParser = {
  async parse(command: string): Promise<Command | null> {
    if (!command) return null;

    // Try tree-sitter parsing
    if (await isTreeSitterAvailable()) {
      try {
        const result = await parseCommand(command);
        if (result) {
          const pipes = extractPipePositions(result.rootNode);
          const redirects = extractRedirections(result.rootNode);

          // Free WASM memory
          result.tree.delete();

          return new RichCommand(command, pipes, redirects);
        }
      } catch {
        // Fall through to SimpleCommand
      }
    }

    // Fallback to simple string parser
    return new SimpleCommand(command);
  },
};
