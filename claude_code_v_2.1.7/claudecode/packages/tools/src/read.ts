/**
 * @claudecode/tools - Read Tool
 *
 * Reads files from the local filesystem.
 * Supports text files, images, PDFs, and Jupyter notebooks.
 *
 * Reconstructed from chunks.86.mjs:561-827
 *
 * Key symbols:
 * - KY0 → readImageFile (image reading with resize)
 * - TEB → readPDFFile (PDF text extraction)
 * - gA2 → parseNotebookCells (notebook cell parsing)
 */

import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve, extname } from 'path';
import { z } from 'zod';
import { execSync, spawn } from 'child_process';
import {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  permissionDeny,
  toolSuccess,
  toolError,
  isPermissionDeniedPath,
  isUncPath,
  isBinaryExtension,
  isImageExtension,
  isNotebookExtension,
  isPdfExtension,
} from './base.js';
import type {
  ReadInput,
  ReadOutput,
  ReadTextOutput,
  ReadImageOutput,
  ReadNotebookOutput,
  ReadPdfOutput,
  ImageMimeType,
  NotebookCell,
  ToolContext,
} from './types.js';
import { TOOL_NAMES } from './types.js';

// ============================================
// Constants
// ============================================

const DEFAULT_LINE_LIMIT = 2000;
const MAX_LINE_LENGTH = 2000;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_RESULT_SIZE = 30000;

// Image processing constants
// Original: JY0 in chunks.86.mjs
const MAX_IMAGE_DIMENSION = 1568;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB for base64 encoding
const IMAGE_QUALITY = 80;

// PDF processing constants
// Original: YEB in chunks.86.mjs
const MAX_PDF_PAGES = 50;
const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

// ============================================
// Input/Output Schemas
// ============================================

/**
 * Read tool input schema.
 * Original: je8 in chunks.86.mjs:522-526
 */
const readInputSchema = z.object({
  file_path: z.string().describe('The absolute path to the file to read'),
  offset: z
    .number()
    .optional()
    .describe('The line number to start reading from. Only provide if the file is too large.'),
  limit: z
    .number()
    .optional()
    .describe('The number of lines to read. Only provide if the file is too large.'),
});

/**
 * Read tool output schema.
 * Original: Pe8 in chunks.86.mjs:526-561
 */
const readOutputSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    file: z.object({
      filePath: z.string(),
      content: z.string(),
      numLines: z.number(),
      startLine: z.number(),
      totalLines: z.number(),
    }),
  }),
  z.object({
    type: z.literal('image'),
    file: z.object({
      base64: z.string(),
      type: z.enum(['image/png', 'image/jpeg', 'image/gif', 'image/webp']),
      originalSize: z.number(),
      dimensions: z
        .object({
          width: z.number(),
          height: z.number(),
        })
        .optional(),
    }),
  }),
  z.object({
    type: z.literal('notebook'),
    file: z.object({
      filePath: z.string(),
      cells: z.array(
        z.object({
          id: z.string(),
          type: z.enum(['code', 'markdown']),
          source: z.string(),
          outputs: z.array(z.unknown()).optional(),
        })
      ),
    }),
  }),
  z.object({
    type: z.literal('pdf'),
    file: z.object({
      filePath: z.string(),
      base64: z.string(),
      originalSize: z.number(),
    }),
  }),
]);

// ============================================
// Helper Functions
// ============================================

/**
 * Get MIME type for image extension.
 */
function getImageMimeType(filePath: string): ImageMimeType {
  const ext = extname(filePath).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    default:
      return 'image/png';
  }
}

/**
 * Image dimensions interface.
 */
interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Get image dimensions from buffer using file magic bytes.
 * Original: QY0 in chunks.86.mjs
 *
 * Parses image headers to extract dimensions without external dependencies.
 */
function getImageDimensions(buffer: Buffer, mimeType: ImageMimeType): ImageDimensions | null {
  try {
    if (mimeType === 'image/png') {
      // PNG: width at bytes 16-19, height at bytes 20-23 (big-endian)
      if (buffer.length >= 24 && buffer.slice(0, 8).toString('hex') === '89504e470d0a1a0a') {
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        return { width, height };
      }
    } else if (mimeType === 'image/jpeg') {
      // JPEG: Find SOF0 (0xFFC0) or SOF2 (0xFFC2) marker
      let offset = 2; // Skip SOI marker
      while (offset < buffer.length - 9) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];

        // SOF0 or SOF2 markers contain dimensions
        if (marker === 0xc0 || marker === 0xc2) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }

        // Skip to next marker
        if (marker === 0xd8 || marker === 0xd9) {
          offset += 2;
        } else {
          const segmentLength = buffer.readUInt16BE(offset + 2);
          offset += 2 + segmentLength;
        }
      }
    } else if (mimeType === 'image/gif') {
      // GIF: width at bytes 6-7, height at bytes 8-9 (little-endian)
      if (buffer.length >= 10 && buffer.slice(0, 3).toString() === 'GIF') {
        const width = buffer.readUInt16LE(6);
        const height = buffer.readUInt16LE(8);
        return { width, height };
      }
    } else if (mimeType === 'image/webp') {
      // WebP: Parse RIFF container
      if (buffer.length >= 30 && buffer.slice(0, 4).toString() === 'RIFF' &&
          buffer.slice(8, 12).toString() === 'WEBP') {
        const chunk = buffer.slice(12, 16).toString();
        if (chunk === 'VP8 ' && buffer.length >= 30) {
          // Lossy WebP
          const width = buffer.readUInt16LE(26) & 0x3fff;
          const height = buffer.readUInt16LE(28) & 0x3fff;
          return { width, height };
        } else if (chunk === 'VP8L' && buffer.length >= 25) {
          // Lossless WebP
          const bits = buffer.readUInt32LE(21);
          const width = (bits & 0x3fff) + 1;
          const height = ((bits >> 14) & 0x3fff) + 1;
          return { width, height };
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Calculate resize dimensions to fit within max dimension while preserving aspect ratio.
 * Original: XY0 in chunks.86.mjs
 */
function calculateResizeDimensions(
  width: number,
  height: number,
  maxDimension: number
): { width: number; height: number; needsResize: boolean } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height, needsResize: false };
  }

  const aspectRatio = width / height;
  let newWidth: number;
  let newHeight: number;

  if (width > height) {
    newWidth = maxDimension;
    newHeight = Math.round(maxDimension / aspectRatio);
  } else {
    newHeight = maxDimension;
    newWidth = Math.round(maxDimension * aspectRatio);
  }

  return { width: newWidth, height: newHeight, needsResize: true };
}

/**
 * Resize image using ImageMagick (if available) or return original.
 * Original: KY0 in chunks.86.mjs
 *
 * Uses ImageMagick convert command for resizing as a fallback.
 * If ImageMagick is not available, returns the original buffer.
 */
async function resizeImageIfNeeded(
  buffer: Buffer,
  dimensions: ImageDimensions | null,
  mimeType: ImageMimeType
): Promise<{ buffer: Buffer; dimensions: ImageDimensions | null; wasResized: boolean }> {
  if (!dimensions) {
    return { buffer, dimensions: null, wasResized: false };
  }

  const { width, height, needsResize } = calculateResizeDimensions(
    dimensions.width,
    dimensions.height,
    MAX_IMAGE_DIMENSION
  );

  if (!needsResize) {
    return { buffer, dimensions, wasResized: false };
  }

  // Try using ImageMagick for resizing
  try {
    const format = mimeType.split('/')[1];
    const result = execSync(
      `convert - -resize ${width}x${height} ${format}:-`,
      {
        input: buffer,
        maxBuffer: MAX_IMAGE_SIZE_BYTES,
        timeout: 30000,
      }
    );
    return {
      buffer: result,
      dimensions: { width, height },
      wasResized: true,
    };
  } catch {
    // ImageMagick not available or failed, return original
    return { buffer, dimensions, wasResized: false };
  }
}

/**
 * Read image file with dimension detection and optional resizing.
 * Original: KY0 (readImageFile) in chunks.86.mjs
 */
async function readImageFile(filePath: string): Promise<ReadImageOutput> {
  const buffer = await readFile(filePath);
  const stats = await stat(filePath);
  const mimeType = getImageMimeType(filePath);

  // Get original dimensions
  const originalDimensions = getImageDimensions(buffer, mimeType);

  // Resize if needed
  const { buffer: finalBuffer, dimensions: finalDimensions, wasResized } =
    await resizeImageIfNeeded(buffer, originalDimensions, mimeType);

  return {
    type: 'image',
    file: {
      base64: finalBuffer.toString('base64'),
      type: mimeType,
      originalSize: stats.size,
      dimensions: finalDimensions ?? undefined,
    },
  };
}

/**
 * PDF page content interface.
 */
interface PDFPageContent {
  pageNumber: number;
  text: string;
}

/**
 * Extract text from PDF using pdftotext (if available).
 * Original: TEB (readPDFFile) in chunks.86.mjs
 *
 * Falls back to returning base64 content if pdftotext is not available.
 */
async function extractPDFText(filePath: string): Promise<PDFPageContent[]> {
  const pages: PDFPageContent[] = [];

  try {
    // Try using pdftotext for text extraction
    const result = execSync(
      `pdftotext -layout "${filePath}" -`,
      {
        maxBuffer: MAX_PDF_SIZE_BYTES,
        timeout: 60000,
        encoding: 'utf-8',
      }
    );

    // Split by form feed characters (page breaks)
    const pageTexts = result.split('\f');
    for (let i = 0; i < pageTexts.length && i < MAX_PDF_PAGES; i++) {
      const text = pageTexts[i]!.trim();
      if (text.length > 0) {
        pages.push({
          pageNumber: i + 1,
          text,
        });
      }
    }
  } catch {
    // pdftotext not available, try pdfinfo for page count
    try {
      const pdfInfo = execSync(
        `pdfinfo "${filePath}"`,
        {
          maxBuffer: 1024 * 1024,
          timeout: 10000,
          encoding: 'utf-8',
        }
      );
      const pageMatch = pdfInfo.match(/Pages:\s+(\d+)/);
      const pageCount = pageMatch?.[1] ? parseInt(pageMatch[1], 10) : 0;

      // Return metadata only if text extraction failed
      pages.push({
        pageNumber: 0,
        text: `[PDF document with ${pageCount} page(s). Text extraction not available - install poppler-utils for text content.]`,
      });
    } catch {
      // Neither pdftotext nor pdfinfo available
      pages.push({
        pageNumber: 0,
        text: '[PDF document. Install poppler-utils for text extraction.]',
      });
    }
  }

  return pages;
}

/**
 * Read PDF file with text extraction.
 * Original: TEB in chunks.86.mjs
 */
async function readPDFFile(filePath: string): Promise<ReadPdfOutput & { pages?: PDFPageContent[] }> {
  const buffer = await readFile(filePath);
  const stats = await stat(filePath);

  // Extract text content
  const pages = await extractPDFText(filePath);

  return {
    type: 'pdf',
    file: {
      filePath,
      base64: buffer.toString('base64'),
      originalSize: stats.size,
    },
    pages,
  };
}

/**
 * Format content with line numbers (cat -n format).
 */
function formatWithLineNumbers(
  content: string,
  startLine: number
): { formatted: string; numLines: number } {
  const lines = content.split('\n');
  const numLines = lines.length;

  const formatted = lines
    .map((line, index) => {
      const lineNum = startLine + index;
      // Truncate long lines
      const truncatedLine =
        line.length > MAX_LINE_LENGTH ? line.substring(0, MAX_LINE_LENGTH) + '...' : line;
      // Format: spaces + line number + tab + content
      return `${String(lineNum).padStart(6)}\t${truncatedLine}`;
    })
    .join('\n');

  return { formatted, numLines };
}

/**
 * Format notebook cell output for display.
 * Original: gA2 helper in chunks.86.mjs
 */
function formatCellOutput(output: unknown): string {
  if (!output || typeof output !== 'object') return '';

  const out = output as {
    output_type?: string;
    text?: string | string[];
    data?: Record<string, string | string[]>;
    ename?: string;
    evalue?: string;
    traceback?: string[];
  };

  switch (out.output_type) {
    case 'stream':
      // Stream output (stdout/stderr)
      if (Array.isArray(out.text)) {
        return out.text.join('');
      }
      return out.text || '';

    case 'execute_result':
    case 'display_data':
      // Display data - prefer text/plain, then text/html
      if (out.data) {
        if (out.data['text/plain']) {
          const text = out.data['text/plain'];
          return Array.isArray(text) ? text.join('') : text;
        }
        if (out.data['text/html']) {
          return '[HTML output]';
        }
        if (out.data['image/png'] || out.data['image/jpeg']) {
          return '[Image output]';
        }
      }
      return '';

    case 'error':
      // Error output
      if (out.traceback) {
        return out.traceback.join('\n');
      }
      return `${out.ename || 'Error'}: ${out.evalue || ''}`;

    default:
      return '';
  }
}

/**
 * Parse Jupyter notebook cells with enhanced output handling.
 * Original: gA2 (parseNotebookCells) in chunks.86.mjs
 */
function parseNotebookCells(content: string): NotebookCell[] {
  try {
    const notebook = JSON.parse(content);
    const cells: NotebookCell[] = [];

    if (notebook.cells && Array.isArray(notebook.cells)) {
      for (let i = 0; i < notebook.cells.length; i++) {
        const cell = notebook.cells[i];

        // Parse source
        const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source || '';

        // Parse outputs for code cells
        let outputs: unknown[] | undefined;
        if (cell.cell_type === 'code' && cell.outputs && Array.isArray(cell.outputs)) {
          outputs = cell.outputs.map((output: unknown) => {
            const formatted = formatCellOutput(output);
            if (formatted) {
              return { formatted };
            }
            return output;
          });
        }

        cells.push({
          id: cell.id || `cell_${i}`,
          type: cell.cell_type === 'code' ? 'code' : 'markdown',
          source,
          outputs,
        });
      }
    }

    return cells;
  } catch {
    return [];
  }
}

// ============================================
// Read Tool
// ============================================

/**
 * Read tool implementation.
 * Original: v5 (ReadTool) in chunks.86.mjs:561-827
 */
export const ReadTool = createTool<ReadInput, ReadOutput>({
  name: TOOL_NAMES.READ,
  maxResultSizeChars: MAX_RESULT_SIZE,
  strict: true,

  async description() {
    return `Reads a file from the local filesystem. You can access any file directly by using this tool.
Assume this tool is able to read all files on the machine. If the User provides a path to a file assume that path is valid.`;
  },

  async prompt() {
    return `Usage:
- The file_path parameter must be an absolute path, not a relative path
- By default, it reads up to ${DEFAULT_LINE_LIMIT} lines starting from the beginning
- You can optionally specify a line offset and limit for long files
- Any lines longer than ${MAX_LINE_LENGTH} characters will be truncated
- Results are returned using cat -n format, with line numbers starting at 1
- This tool allows reading images (PNG, JPG, etc), PDFs, and Jupyter notebooks`;
  },

  inputSchema: readInputSchema,
  outputSchema: readOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe() {
    return true;
  },

  isReadOnly() {
    return true;
  },

  isSearchOrReadCommand() {
    return { isSearch: false, isRead: true };
  },

  getPath(input) {
    return input.file_path;
  },

  async checkPermissions(input) {
    // Check permission denied paths
    if (isPermissionDeniedPath(input.file_path)) {
      return permissionDeny(`Access to ${input.file_path} is not allowed for security reasons`);
    }
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    const filePath = resolve(input.file_path);

    // Check permission denied paths (errorCode: 1)
    if (isPermissionDeniedPath(filePath)) {
      return validationError(
        `Access to ${filePath} is not allowed for security reasons`,
        1
      );
    }

    // Allow UNC paths without existence check
    if (isUncPath(filePath)) {
      return validationSuccess();
    }

    // Check file existence (errorCode: 2)
    if (!existsSync(filePath)) {
      return validationError(`File not found: ${filePath}`, 2);
    }

    // Reject binary files (errorCode: 4)
    if (isBinaryExtension(filePath) && !isImageExtension(filePath) && !isPdfExtension(filePath)) {
      return validationError(
        `Cannot read binary file: ${filePath}. Only text, image, PDF, and notebook files are supported.`,
        4
      );
    }

    // Check file size (errorCode: 6)
    try {
      const stats = await stat(filePath);
      if (stats.size > MAX_FILE_SIZE && !isImageExtension(filePath) && !isPdfExtension(filePath)) {
        return validationError(
          `File too large: ${filePath} (${stats.size} bytes). Maximum size is ${MAX_FILE_SIZE} bytes.`,
          6
        );
      }
    } catch {
      // Ignore stat errors
    }

    return validationSuccess();
  },

  async call(input, context) {
    const filePath = resolve(input.file_path);
    const offset = input.offset ?? 1;
    const limit = input.limit ?? DEFAULT_LINE_LIMIT;

    try {
      // Handle images with dimension detection and resizing
      if (isImageExtension(filePath)) {
        const stats = await stat(filePath);

        // Check for empty image (errorCode: 5)
        if (stats.size === 0) {
          return toolError('Empty image file', 5);
        }

        // Use enhanced image reading with dimensions and optional resizing
        const result = await readImageFile(filePath);

        // Store read state for edit validation
        context.readFileState.set(filePath, {
          content: '',
          timestamp: Date.now(),
          totalLines: 0,
        });

        return toolSuccess(result);
      }

      // Handle PDFs with text extraction
      if (isPdfExtension(filePath)) {
        const stats = await stat(filePath);

        // Check file size
        if (stats.size > MAX_PDF_SIZE_BYTES) {
          return toolError(`PDF too large: ${stats.size} bytes (max ${MAX_PDF_SIZE_BYTES})`, 6);
        }

        // Use enhanced PDF reading with text extraction
        const result = await readPDFFile(filePath);

        return toolSuccess(result);
      }

      // Handle Jupyter notebooks
      if (isNotebookExtension(filePath)) {
        const content = await readFile(filePath, 'utf-8');
        const cells = parseNotebookCells(content);

        const result: ReadNotebookOutput = {
          type: 'notebook',
          file: {
            filePath,
            cells,
          },
        };

        // Store read state
        context.readFileState.set(filePath, {
          content,
          timestamp: Date.now(),
          totalLines: content.split('\n').length,
        });

        return toolSuccess(result);
      }

      // Handle text files
      const content = await readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      const totalLines = lines.length;

      // Apply offset and limit
      const startIndex = Math.max(0, offset - 1);
      const endIndex = Math.min(lines.length, startIndex + limit);
      const selectedLines = lines.slice(startIndex, endIndex);
      const selectedContent = selectedLines.join('\n');

      // Format with line numbers
      const { formatted, numLines } = formatWithLineNumbers(selectedContent, offset);

      const result: ReadTextOutput = {
        type: 'text',
        file: {
          filePath,
          content: formatted,
          numLines,
          startLine: offset,
          totalLines,
        },
      };

      // Store read state for edit validation
      context.readFileState.set(filePath, {
        content,
        timestamp: Date.now(),
        totalLines,
      });

      return toolSuccess(result);
    } catch (error) {
      return toolError(`Failed to read file: ${(error as Error).message}`);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    if (result.type === 'text') {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: result.file.content,
      };
    }

    if (result.type === 'image') {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: result.file.type,
              data: result.file.base64,
            },
          },
        ],
      };
    }

    if (result.type === 'notebook') {
      const cellsText = result.file.cells
        .map((cell, i) => {
          let cellContent = `[Cell ${i + 1} (${cell.type})]:\n${cell.source}`;

          // Include formatted outputs for code cells
          if (cell.type === 'code' && cell.outputs && cell.outputs.length > 0) {
            const outputTexts = cell.outputs
              .map((output) => {
                if (typeof output === 'object' && output !== null && 'formatted' in output) {
                  return (output as { formatted: string }).formatted;
                }
                return null;
              })
              .filter(Boolean);

            if (outputTexts.length > 0) {
              cellContent += `\n\n[Output]:\n${outputTexts.join('\n')}`;
            }
          }

          return cellContent;
        })
        .join('\n\n---\n\n');
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: cellsText,
      };
    }

    if (result.type === 'pdf') {
      // Check if we have extracted text pages
      const pdfResult = result as ReadPdfOutput & { pages?: PDFPageContent[] };
      if (pdfResult.pages && pdfResult.pages.length > 0) {
        // Format pages as text content
        const pagesText = pdfResult.pages
          .map((page) => {
            if (page.pageNumber === 0) {
              // Metadata-only page
              return page.text;
            }
            return `[Page ${page.pageNumber}]\n${page.text}`;
          })
          .join('\n\n---\n\n');

        return {
          tool_use_id: toolUseId,
          type: 'tool_result',
          content: `PDF: ${result.file.filePath} (${result.file.originalSize} bytes)\n\n${pagesText}`,
        };
      }

      // Fallback: just return metadata
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: `PDF file: ${result.file.filePath} (${result.file.originalSize} bytes)`,
      };
    }

    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: JSON.stringify(result),
    };
  },
});

// ============================================
// Export
// ============================================

// NOTE: ReadTool 已在声明处导出；避免重复导出。
