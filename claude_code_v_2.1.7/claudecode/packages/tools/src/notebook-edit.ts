/**
 * @claudecode/tools - NotebookEdit Tool
 *
 * Completely replaces the contents of a specific cell in a Jupyter notebook (.ipynb file)
 * with new source. Supports replace, insert, and delete operations.
 *
 * Reconstructed from chunks.115.mjs:2075+
 *
 * Key symbols:
 * - tq → NOTEBOOK_EDIT (tool name constant)
 * - qf → NotebookEditTool (tool object)
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  permissionAsk,
  toolSuccess,
  toolError,
  isNotebookExtension,
  isPermissionDeniedPath,
} from './base.js';
import type { ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';

// ============================================
// Constants
// ============================================

const EDIT_MODES = ['replace', 'insert', 'delete'] as const;
const CELL_TYPES = ['code', 'markdown'] as const;

// ============================================
// Input Types
// ============================================

/**
 * Edit mode for notebook cell operations.
 */
export type NotebookEditMode = (typeof EDIT_MODES)[number];

/**
 * Cell type in Jupyter notebook.
 */
export type NotebookCellType = (typeof CELL_TYPES)[number];

/**
 * NotebookEdit input.
 */
export interface NotebookEditInput {
  /** Absolute path to the Jupyter notebook file */
  notebook_path: string;
  /** New source content for the cell */
  new_source: string;
  /** Cell ID to edit (for replace/delete) or insert after */
  cell_id?: string;
  /** Cell type (code or markdown) */
  cell_type?: NotebookCellType;
  /** Edit mode (replace, insert, delete) */
  edit_mode?: NotebookEditMode;
}

/**
 * NotebookEdit output.
 */
export interface NotebookEditOutput {
  /** Whether the operation succeeded */
  success: boolean;
  /** The cell ID that was affected */
  cellId?: string;
  /** Number of cells in notebook after operation */
  totalCells?: number;
  /** Error message if failed */
  error?: string;
}

/**
 * Jupyter notebook cell structure.
 */
interface NotebookCell {
  id?: string;
  cell_type: string;
  source: string | string[];
  metadata?: Record<string, unknown>;
  execution_count?: number | null;
  outputs?: unknown[];
}

/**
 * Jupyter notebook structure.
 */
interface NotebookDocument {
  cells: NotebookCell[];
  metadata?: Record<string, unknown>;
  nbformat: number;
  nbformat_minor: number;
}

// ============================================
// Input Schema
// ============================================

/**
 * NotebookEdit input schema.
 * Original: chunks.115.mjs:2075+
 */
const notebookEditInputSchema = z.object({
  notebook_path: z
    .string()
    .describe(
      'The absolute path to the Jupyter notebook file to edit (must be absolute, not relative)'
    ),
  new_source: z.string().describe('The new source for the cell'),
  cell_id: z
    .string()
    .optional()
    .describe(
      'The ID of the cell to edit. When inserting a new cell, the new cell will be inserted after the cell with this ID, or at the beginning if not specified.'
    ),
  cell_type: z
    .enum(CELL_TYPES)
    .optional()
    .describe(
      'The type of the cell (code or markdown). If not specified, defaults to current cell type. Required for insert mode.'
    ),
  edit_mode: z
    .enum(EDIT_MODES)
    .optional()
    .default('replace')
    .describe('The type of edit to make (replace, insert, delete). Defaults to replace.'),
});

// ============================================
// Output Schema
// ============================================

const notebookEditOutputSchema = z.object({
  success: z.boolean(),
  cellId: z.string().optional(),
  totalCells: z.number().optional(),
  error: z.string().optional(),
});

// ============================================
// Helper Functions
// ============================================

/**
 * Generate a unique cell ID.
 */
function generateCellId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Parse notebook cell source to array format.
 */
function parseSource(source: string | string[]): string[] {
  if (Array.isArray(source)) {
    return source;
  }
  // Split by newlines but preserve them
  const lines = source.split(/(?<=\n)/);
  return lines;
}

/**
 * Find cell index by ID.
 */
function findCellIndexById(cells: NotebookCell[], cellId: string): number {
  return cells.findIndex((cell) => cell.id === cellId);
}

/**
 * Find cell index by number (0-indexed).
 */
function findCellIndexByNumber(cells: NotebookCell[], cellNumber: number): number {
  if (cellNumber >= 0 && cellNumber < cells.length) {
    return cellNumber;
  }
  return -1;
}

// ============================================
// NotebookEdit Tool
// ============================================

/**
 * NotebookEdit tool implementation.
 * Original: qf in chunks.115.mjs:2075+
 *
 * This tool allows editing Jupyter notebook cells:
 * - replace: Replace cell content
 * - insert: Insert new cell after specified cell
 * - delete: Delete specified cell
 */
export const NotebookEditTool = createTool<NotebookEditInput, NotebookEditOutput>({
  name: TOOL_NAMES.NOTEBOOK_EDIT,
  strict: false,

  async description() {
    return `Completely replaces the contents of a specific cell in a Jupyter notebook (.ipynb file) with new source. Jupyter notebooks are interactive documents that combine code, text, and visualizations, commonly used for data analysis and scientific computing. The notebook_path parameter must be an absolute path, not a relative path. The cell_number is 0-indexed. Use edit_mode=insert to add a new cell at the index specified by cell_number. Use edit_mode=delete to delete the cell at the index specified by cell_number.`;
  },

  async prompt() {
    return '';
  },

  inputSchema: notebookEditInputSchema,
  outputSchema: notebookEditOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe() {
    // Not safe for concurrent execution - modifies file
    return false;
  },

  isReadOnly() {
    return false;
  },

  async checkPermissions(input, context) {
    const notebookPath = input.notebook_path;

    // Check for permission denied paths
    if (isPermissionDeniedPath(notebookPath)) {
      return permissionAsk(input, `Edit notebook: ${notebookPath}`);
    }

    // Ask permission for notebook edits
    return permissionAsk(input, `Edit notebook cell in: ${notebookPath}`);
  },

  async validateInput(input, context) {
    const { notebook_path, cell_id, cell_type, edit_mode, new_source } = input;

    // Check path is absolute
    if (!path.isAbsolute(notebook_path)) {
      return validationError('notebook_path must be an absolute path', 1);
    }

    // Check it's a notebook file
    if (!isNotebookExtension(notebook_path)) {
      return validationError('File must be a Jupyter notebook (.ipynb)', 2);
    }

    // Check file exists
    try {
      await fs.access(notebook_path);
    } catch {
      return validationError(`Notebook file not found: ${notebook_path}`, 3);
    }

    // For insert mode, cell_type is required
    if (edit_mode === 'insert' && !cell_type) {
      return validationError('cell_type is required when using insert mode', 4);
    }

    // For delete mode, new_source should be empty or will be ignored
    // No validation needed

    return validationSuccess();
  },

  async call(input, context) {
    const {
      notebook_path,
      cell_id,
      cell_type,
      edit_mode = 'replace',
      new_source,
    } = input;

    try {
      // Read notebook
      const content = await fs.readFile(notebook_path, 'utf-8');
      const notebook: NotebookDocument = JSON.parse(content);

      if (!notebook.cells || !Array.isArray(notebook.cells)) {
        return toolError('Invalid notebook format: missing cells array');
      }

      let resultCellId: string | undefined;

      switch (edit_mode) {
        case 'replace': {
          // Find cell to replace
          let cellIndex = -1;
          if (cell_id) {
            cellIndex = findCellIndexById(notebook.cells, cell_id);
            if (cellIndex === -1) {
              // Try parsing as number
              const cellNum = parseInt(cell_id, 10);
              if (!isNaN(cellNum)) {
                cellIndex = findCellIndexByNumber(notebook.cells, cellNum);
              }
            }
          } else {
            // Default to first cell
            cellIndex = 0;
          }

          if (cellIndex === -1 || cellIndex >= notebook.cells.length) {
            return toolError(`Cell not found: ${cell_id}`);
          }

          // Update cell
          const cell = notebook.cells[cellIndex];
          cell.source = parseSource(new_source);
          if (cell_type) {
            cell.cell_type = cell_type;
          }
          // Clear outputs for code cells
          if (cell.cell_type === 'code') {
            cell.outputs = [];
            cell.execution_count = null;
          }
          resultCellId = cell.id || `cell_${cellIndex}`;
          break;
        }

        case 'insert': {
          // Create new cell
          const newCell: NotebookCell = {
            id: generateCellId(),
            cell_type: cell_type || 'code',
            source: parseSource(new_source),
            metadata: {},
          };
          if (newCell.cell_type === 'code') {
            newCell.outputs = [];
            newCell.execution_count = null;
          }

          // Find insertion point
          let insertIndex = 0;
          if (cell_id) {
            const cellIndex = findCellIndexById(notebook.cells, cell_id);
            if (cellIndex !== -1) {
              insertIndex = cellIndex + 1;
            } else {
              // Try parsing as number
              const cellNum = parseInt(cell_id, 10);
              if (!isNaN(cellNum) && cellNum >= 0) {
                insertIndex = Math.min(cellNum + 1, notebook.cells.length);
              }
            }
          }

          notebook.cells.splice(insertIndex, 0, newCell);
          resultCellId = newCell.id;
          break;
        }

        case 'delete': {
          // Find cell to delete
          let cellIndex = -1;
          if (cell_id) {
            cellIndex = findCellIndexById(notebook.cells, cell_id);
            if (cellIndex === -1) {
              const cellNum = parseInt(cell_id, 10);
              if (!isNaN(cellNum)) {
                cellIndex = findCellIndexByNumber(notebook.cells, cellNum);
              }
            }
          }

          if (cellIndex === -1 || cellIndex >= notebook.cells.length) {
            return toolError(`Cell not found for deletion: ${cell_id}`);
          }

          resultCellId = notebook.cells[cellIndex].id || `cell_${cellIndex}`;
          notebook.cells.splice(cellIndex, 1);
          break;
        }
      }

      // Write notebook back
      await fs.writeFile(notebook_path, JSON.stringify(notebook, null, 2), 'utf-8');

      return toolSuccess({
        success: true,
        cellId: resultCellId,
        totalCells: notebook.cells.length,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return toolError(`Failed to edit notebook: ${message}`);
    }
  },

  /**
   * Map tool result to API format.
   */
  mapToolResultToToolResultBlockParam(result, toolUseId) {
    if (result.success) {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: `Successfully edited notebook cell. Cell ID: ${result.cellId}, Total cells: ${result.totalCells}`,
      };
    }

    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: result.error || 'Failed to edit notebook',
      is_error: true,
    };
  },
});

// ============================================
// Export
// ============================================

export { NotebookEditTool };
