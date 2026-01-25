/**
 * @claudecode/platform - Shell Parser Tree-sitter Integration
 *
 * Tree-sitter based shell parsing logic.
 * Reconstructed from chunks.123.mjs
 */

import Parser from 'web-tree-sitter';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let parser: Parser | null = null;
let language: Parser.Language | null = null;
let initPromise: Promise<void> | null = null;

const MAX_COMMAND_LENGTH = 10000;

const IGNORED_NODE_TYPES = new Set(['command', 'declaration_command']);
const WORD_TYPES = new Set(['word', 'string', 'raw_string', 'number']);
const STOP_TYPES = new Set(['command_substitution', 'process_substitution']);
const DECLARATION_COMMANDS = new Set([
  'export',
  'declare',
  'typeset',
  'readonly',
  'local',
  'unset',
  'unsetenv',
]);

/**
 * Get the directory of the current module.
 * Original: Ln5 logic
 */
function getModuleDir(): string {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd();
  }
}

/**
 * Initialize Tree-sitter and load Bash language.
 * Original: Mn5 in chunks.123.mjs
 */
async function initializeTreeSitter(): Promise<void> {
  if (parser && language) return;

  const moduleDir = getModuleDir();
  // Try to locate WASM files. This logic tries to adapt to different build structures.
  // In source, it looks for 'tree-sitter.wasm' and 'tree-sitter-bash.wasm'.
  
  // Note: We assume the WASM files are available or this will fail and we fallback.
  // Standard location for web-tree-sitter wasm is often next to the package or in a known location.
  
  const wasmPath = require.resolve('web-tree-sitter/tree-sitter.wasm');
  const bashWasmPath = require.resolve('tree-sitter-bash/tree-sitter-bash.wasm');

  await Parser.init({
    locateFile: (scriptName: string) => {
      if (scriptName === 'tree-sitter.wasm') return wasmPath;
      return scriptName;
    },
  });

  parser = new Parser();
  // Load Bash language
  if (fs.existsSync(bashWasmPath)) {
      language = await Parser.Language.load(bashWasmPath);
  } else {
      // Try finding it relative to module if require.resolve fails (though unlikely for dependencies)
      // or if tree-sitter-bash is not installed as expected.
      // Fallback logic from source Ln5/Mn5 involves checking specific paths.
      // For now, we rely on standard resolution.
      throw new Error('tree-sitter-bash.wasm not found');
  }
  
  parser.setLanguage(language);
}

/**
 * Ensure Tree-sitter is initialized.
 * Original: hm2 in chunks.123.mjs
 */
async function ensureTreeSitter(): Promise<void> {
  if (!initPromise) {
    initPromise = initializeTreeSitter();
  }
  await initPromise;
}

/**
 * Check if Tree-sitter is working.
 * Original: xn5 in chunks.123.mjs
 */
export async function isTreeSitterSupported(): Promise<boolean> {
  try {
    await ensureTreeSitter();
    if (!parser) return false;
    const tree = parser.parse('echo test');
    if (!tree) return false;
    tree.delete();
    return true;
  } catch (e) {
    // console.error('Tree-sitter check failed:', e);
    return false;
  }
}

/**
 * Parse a command using Tree-sitter.
 * Original: Rn5 in chunks.123.mjs
 */
export async function parseCommand(command: string) {
  await ensureTreeSitter();
  if (!command || command.length > MAX_COMMAND_LENGTH || !parser || !language) {
    return null;
  }

  try {
    const tree = parser.parse(command);
    const rootNode = tree.rootNode;
    if (!rootNode) return null;

    const commandNode = findCommandNode(rootNode);
    const envVars = extractEnvVars(commandNode);

    return {
      tree,
      rootNode,
      envVars,
      commandNode,
      originalCommand: command,
    };
  } catch {
    return null;
  }
}

/**
 * Find the main command node.
 * Original: gm2 in chunks.123.mjs
 */
function findCommandNode(node: Parser.SyntaxNode): Parser.SyntaxNode | null {
  const { type, children, parent } = node;

  if (IGNORED_NODE_TYPES.has(type)) return node;

  if (type === 'variable_assignment' && parent) {
    return (
      parent.children.find(
        (child) => child && IGNORED_NODE_TYPES.has(child.type) && child.startIndex > node.startIndex
      ) ?? null
    );
  }

  if (type === 'pipeline' || type === 'redirected_statement') {
    return children.find((child) => child && IGNORED_NODE_TYPES.has(child.type)) ?? null;
  }

  for (const child of children) {
    const found = child && findCommandNode(child);
    if (found) return found;
  }

  return null;
}

/**
 * Extract environment variables from command node.
 * Original: _n5 in chunks.123.mjs
 */
function extractEnvVars(node: Parser.SyntaxNode | null): string[] {
  if (!node || node.type !== 'command') return [];

  const envVars: string[] = [];
  for (const child of node.children) {
    if (!child) continue;
    if (child.type === 'variable_assignment') {
      envVars.push(child.text);
    } else if (child.type === 'command_name' || child.type === 'word') {
      break;
    }
  }
  return envVars;
}

/**
 * Extract pipe positions from root node.
 * Original: Pn5 in chunks.123.mjs
 */
export function extractPipePositions(rootNode: Parser.SyntaxNode): number[] {
  const positions: number[] = [];
  traverse(rootNode, (node) => {
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
 * Extract redirection nodes from root node.
 * Original: Sn5 in chunks.123.mjs
 */
export function extractRedirectionNodes(rootNode: Parser.SyntaxNode): Array<{
  startIndex: number;
  endIndex: number;
  target: string;
  operator: '>' | '>>' | '>&' | '2>' | '2>>';
}> {
  const redirections: Array<{
    startIndex: number;
    endIndex: number;
    target: string;
    operator: any;
  }> = [];

  traverse(rootNode, (node) => {
    if (node.type === 'file_redirect') {
      const children = node.children;
      const operatorNode = children.find(
        (child) => child && (child.type === '>' || child.type === '>>')
      );
      const wordNode = children.find((child) => child && child.type === 'word');

      if (operatorNode && wordNode) {
        redirections.push({
          startIndex: node.startIndex,
          endIndex: node.endIndex,
          target: wordNode.text,
          operator: operatorNode.type,
        });
      }
    }
  });

  return redirections;
}

/**
 * Helper to traverse the syntax tree.
 * Original: Mq0 in chunks.123.mjs
 */
function traverse(node: Parser.SyntaxNode, callback: (node: Parser.SyntaxNode) => void) {
  callback(node);
  for (const child of node.children) {
    if (child) traverse(child, callback);
  }
}
