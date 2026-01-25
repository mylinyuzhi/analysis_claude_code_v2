/**
 * @claudecode/tools - LSP Tool
 *
 * Provides code intelligence features via Language Server Protocol.
 * Supports goToDefinition, findReferences, hover, symbols, and call hierarchy.
 *
 * Reconstructed from chunks.119.mjs, chunks.120.mjs
 */

import { z } from 'zod';
import {
  createTool,
  validationSuccess,
  toolSuccess,
  toolError,
} from './base.js';
import type { LspInput, LspOutput, ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';
import {
  getLspManager,
  getLspManagerStatus,
  waitForLspManagerInit,
  buildLspRequest,
  formatLspResult,
} from '@claudecode/integrations';
import { resolvePath, getFileSystem } from '@claudecode/platform';
import { extname } from 'path';

// ============================================
// Constants
// ============================================

const MAX_RESULT_SIZE = 100000;

// ============================================
// Input/Output Schemas
// ============================================

/**
 * LSP tool operations enum for Zod.
 */
const lspOperationEnum = z.enum([
  'goToDefinition',
  'findReferences',
  'hover',
  'documentSymbol',
  'workspaceSymbol',
  'goToImplementation',
  'prepareCallHierarchy',
  'incomingCalls',
  'outgoingCalls',
]);

/**
 * LSP tool input schema.
 * Original: Ol5 in chunks.120.mjs:15-19
 */
const lspInputSchema = z.strictObject({
  operation: lspOperationEnum.describe('The LSP operation to perform'),
  filePath: z.string().describe('The absolute or relative path to the file'),
  line: z.number().int().positive().describe('The line number (1-based, as shown in editors)'),
  character: z.number().int().positive().describe('The character offset (1-based, as shown in editors)'),
}).catchall(z.unknown());

/**
 * LSP tool output schema.
 * Original: Ml5 in chunks.120.mjs:20-25
 */
const lspOutputSchema = z.object({
  operation: lspOperationEnum.describe('The LSP operation that was performed'),
  result: z.string().describe('The formatted result of the LSP operation'),
  filePath: z.string().describe('The file path the operation was performed on'),
  resultCount: z.number().int().nonnegative().optional().describe('Number of results'),
  fileCount: z.number().int().nonnegative().optional().describe('Number of files containing results'),
});

// ============================================
// LSP Tool
// ============================================

/**
 * LSP tool implementation.
 * Original: vU0 in chunks.120.mjs:15-176
 */
export const LspTool = createTool<LspInput, LspOutput>({
  name: TOOL_NAMES.LSP,
  maxResultSizeChars: MAX_RESULT_SIZE,
  strict: true,

  async description() {
    // Original: xU0 in chunks.119.mjs:3122
    return 'Interact with Language Server Protocol (LSP) servers to get code intelligence features.';
  },

  async prompt() {
    // Original: xU0 in chunks.119.mjs:3122-3141
    return `Interact with Language Server Protocol (LSP) servers to get code intelligence features.

Supported operations:
- goToDefinition: Find where a symbol is defined
- findReferences: Find all references to a symbol
- hover: Get hover information (documentation, type info) for a symbol
- documentSymbol: Get all symbols (functions, classes, variables) in a document
- workspaceSymbol: Search for symbols across the entire workspace
- goToImplementation: Find implementations of an interface or abstract method
- prepareCallHierarchy: Get call hierarchy item at a position (functions/methods)
- incomingCalls: Find all functions/methods that call the function at a position
- outgoingCalls: Find all functions/methods called by the function at a position

All operations require:
- filePath: The file to operate on
- line: The line number (1-based, as shown in editors)
- character: The character offset (1-based, as shown in editors)

Note: LSP servers must be configured for the file type. If no server is available, an error will be returned.`;
  },

  inputSchema: lspInputSchema,
  outputSchema: lspOutputSchema,

  userFacingName: 'LSP',

  isEnabled() {
    // Original: chunks.120.mjs:29-45
    const status = getLspManagerStatus();
    if (status.status === 'failed') return false;

    const manager = getLspManager();
    if (!manager) return false;

    const servers = manager.getAllServers();
    if (servers.size === 0) return false;

    // At least one server must not be in error state
    return Array.from(servers.values()).some((s) => s.state !== 'error');
  },

  isConcurrencySafe() {
    return true;
  },

  isReadOnly() {
    return true;
  },

  getPath(input) {
    return resolvePath(input.filePath);
  },

  async validateInput(input, context) {
    return validationSuccess();
  },

  async call(input, context, toolUseId) {
    const resolvedPath = resolvePath(input.filePath);
    const workingDir = context.getCwd();

    // Wait for manager initialization if pending
    if (getLspManagerStatus().status === 'pending') {
      await waitForLspManagerInit();
    }

    const manager = getLspManager();
    if (!manager) {
      return toolError('LSP server manager not initialized when tool was called');
    }

    // Build LSP request from operation
    const { method, params } = buildLspRequest(input, resolvedPath);

    try {
      // Ensure file is opened in LSP server
      if (!manager.isFileOpen(resolvedPath)) {
        const fs = getFileSystem();
        if (fs.existsSync(resolvedPath)) {
          const content = fs.readFileSync(resolvedPath, { encoding: 'utf-8' });
          await manager.openFile(resolvedPath, content);
        }
      }

      let result = await manager.sendRequest(resolvedPath, method, params);

      if (result === undefined) {
        return toolError(`No LSP server available for file type: ${extname(resolvedPath)}`);
      }

      // Call hierarchy requires two requests: prepareCallHierarchy + incomingCalls/outgoingCalls
      if (input.operation === 'incomingCalls' || input.operation === 'outgoingCalls') {
        const callItems = result as any[];
        if (!callItems || callItems.length === 0) {
          return toolSuccess({
            operation: input.operation,
            result: input.operation === 'incomingCalls'
              ? 'No incoming calls found.'
              : 'No outgoing calls found.',
            filePath: input.filePath,
            resultCount: 0,
            fileCount: 0,
          });
        }

        const callMethod =
          input.operation === 'incomingCalls'
            ? 'callHierarchy/incomingCalls'
            : 'callHierarchy/outgoingCalls';
        
        // Use the first item from prepareCallHierarchy
        result = await manager.sendRequest(resolvedPath, callMethod, {
          item: callItems[0],
        });
      }

      // Format result for display
      const { formatted, resultCount, fileCount } = formatLspResult(
        input.operation,
        result,
        workingDir
      );

      return toolSuccess({
        operation: input.operation,
        result: formatted,
        filePath: input.filePath,
        resultCount,
        fileCount,
      });
    } catch (error) {
      const message = (error as Error).message;
      return toolError(`Error performing ${input.operation} on ${input.filePath}: ${message}`);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: result.result,
    };
  },
});
