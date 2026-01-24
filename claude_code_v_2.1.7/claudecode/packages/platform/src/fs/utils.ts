/**
 * @claudecode/platform - File System Utilities
 * 
 * Utilities for encoding detection, line ending normalization, and file state tracking.
 * Reconstructed from chunks.148.mjs and chunks.86.mjs
 */

import * as fs from 'fs';
import * as path from 'path';
import { FileSystemWrapper } from './index.js';

// ============================================
// Encoding Detection
// ============================================

/**
 * Detect file encoding from BOM or content.
 * Original: RW in chunks.148.mjs:2720-2741
 * 
 * @param filePath - Path to the file
 * @returns 'utf8' | 'utf16le'
 */
export function detectEncoding(filePath: string): BufferEncoding {
  try {
    const { buffer, bytesRead } = FileSystemWrapper.readSync(filePath, {
      length: 4,
    });

    if (bytesRead < 2) {
      return 'utf-8';
    }

    // Check for UTF-16LE BOM (FF FE)
    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
      return 'utf-16le';
    }

    // Check for UTF-8 BOM (EF BB BF)
    if (bytesRead >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
      return 'utf-8';
    }

    // Default to UTF-8
    return 'utf-8';
  } catch {
    return 'utf-8';
  }
}

// ============================================
// Line Ending Utilities
// ============================================

/**
 * Normalize line endings to LF (\n).
 */
export function normalizeLineEndings(content: string): string {
  return content.replace(/\r\n/g, '\n');
}

/**
 * Count line ending types to determine dominant style.
 * Original: XC7 in chunks.148.mjs
 */
function countLineEndingTypes(content: string): 'CRLF' | 'LF' {
  let crlfCount = 0;
  let lfCount = 0;
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '\n') {
      if (i > 0 && content[i - 1] === '\r') crlfCount++;
      else lfCount++;
    }
  }
  return crlfCount > lfCount ? 'CRLF' : 'LF';
}

/**
 * Detect line ending style in file.
 * Original: _c in chunks.148.mjs:2743-2771
 */
export function detectLineEnding(filePath: string): 'CRLF' | 'LF' {
  try {
    // Read first 4KB to detect line endings
    const { buffer, bytesRead } = FileSystemWrapper.readSync(filePath, { length: 4096 });
    const content = buffer.toString('utf8', 0, bytesRead);
    return countLineEndingTypes(content);
  } catch {
    return 'LF';
  }
}

/**
 * Write file preserving or converting line endings.
 * Original: ns in chunks.148.mjs:2710-2717
 */
export function writeFileWithLineEndings(
  filePath: string,
  content: string,
  encoding: BufferEncoding,
  lineEnding: 'CRLF' | 'LF'
): void {
  let processedContent = content;
  // Convert to CRLF if requested
  if (lineEnding === 'CRLF') {
    processedContent = content.split('\n').join('\r\n');
  }
  FileSystemWrapper.writeFileSync(filePath, processedContent, { encoding });
}

// ============================================
// Path Utilities
// ============================================

/**
 * Resolve path to absolute.
 * Original: Y4 (resolvePath)
 */
export function resolvePath(filePath: string): string {
  return path.resolve(filePath);
}

// ============================================
// Text Reading Utilities
// ============================================

/**
 * Read text file with line number support.
 * Original: L12 in chunks.86.mjs (implied)
 */
export function readTextFileWithLineNumbers(
  filePath: string,
  startLine: number = 0,
  limit?: number
): { content: string; lineCount: number; totalLines: number } {
  const content = FileSystemWrapper.readFileSync(filePath, { encoding: 'utf-8' });
  const lines = content.split(/\r?\n/);
  const totalLines = lines.length;
  
  let endLine = totalLines;
  if (limit !== undefined) {
    endLine = Math.min(startLine + limit, totalLines);
  }
  
  // If startLine is beyond end of file, return empty
  if (startLine >= totalLines) {
    return { content: '', lineCount: 0, totalLines };
  }
  
  const slicedLines = lines.slice(startLine, endLine);
  
  // Add line numbers
  const numberedContent = slicedLines
    .map((line, index) => {
      const lineNumber = startLine + index + 1;
      return `${lineNumber.toString().padStart(4, ' ')} | ${line}`;
    })
    .join('\n');
    
  return {
    content: numberedContent,
    lineCount: slicedLines.length,
    totalLines
  };
}
