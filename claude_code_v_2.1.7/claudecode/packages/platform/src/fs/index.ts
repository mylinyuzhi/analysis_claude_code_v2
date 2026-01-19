/**
 * @claudecode/platform - File System Operations
 *
 * File system abstraction layer with:
 * - Read-before-edit enforcement
 * - File state tracking
 * - Line ending normalization
 * - Encoding detection
 *
 * Reconstructed from chunks.1.mjs, chunks.148.mjs, chunks.86.mjs
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// Types
// ============================================

/**
 * File read record for tracking file state
 */
export interface FileReadRecord {
  /** File content (text or base64) */
  content: string;
  /** File modification time at read (mtimeMs) */
  timestamp: number;
  /** Line offset if partial read (1-based) */
  offset?: number;
  /** Line limit if partial read */
  limit?: number;
}

/**
 * Read file state map type
 */
export type ReadFileState = Map<string, FileReadRecord>;

/**
 * File stat result
 */
export interface FileStat {
  isFile: boolean;
  isDirectory: boolean;
  isSymbolicLink: boolean;
  size: number;
  mtimeMs: number;
  ctimeMs: number;
}

/**
 * Read sync options
 */
export interface ReadSyncOptions {
  length: number;
}

/**
 * Read sync result
 */
export interface ReadSyncResult {
  buffer: Buffer;
  bytesRead: number;
}

/**
 * Mkdir options
 */
export interface MkdirOptions {
  mode?: number;
  recursive?: boolean;
}

// ============================================
// Monitoring Wrapper
// ============================================

/**
 * Wrapper for monitoring file system operations.
 * Original: MW in chunks.1.mjs
 *
 * @param operation - Operation description for logging
 * @param fn - Function to execute
 */
function monitoringWrapper<T>(operation: string, fn: () => T): T {
  // In production, this could log to telemetry
  // For now, just execute the function
  return fn();
}

// ============================================
// FileSystemWrapper
// ============================================

/**
 * File system wrapper that provides unified monitoring and error handling.
 * Original: NT9 (FileSystemWrapper) in chunks.1.mjs:2929-3040
 */
export const FileSystemWrapper = {
  /**
   * Get current working directory
   */
  cwd(): string {
    return process.cwd();
  },

  /**
   * Check if file/directory exists
   */
  existsSync(filePath: string): boolean {
    return monitoringWrapper(`existsSync(${filePath})`, () =>
      fs.existsSync(filePath)
    );
  },

  /**
   * Get file stat asynchronously
   */
  async stat(filePath: string): Promise<fs.Stats> {
    return monitoringWrapper(`stat(${filePath})`, () =>
      fs.promises.stat(filePath)
    );
  },

  /**
   * Get file stat synchronously
   */
  statSync(filePath: string): fs.Stats {
    return monitoringWrapper(`statSync(${filePath})`, () =>
      fs.statSync(filePath)
    );
  },

  /**
   * Get symlink stat synchronously
   */
  lstatSync(filePath: string): fs.Stats {
    return monitoringWrapper(`lstatSync(${filePath})`, () =>
      fs.lstatSync(filePath)
    );
  },

  /**
   * Read file with encoding
   */
  readFileSync(filePath: string, options: { encoding: BufferEncoding }): string {
    return monitoringWrapper(`readFileSync(${filePath})`, () =>
      fs.readFileSync(filePath, { encoding: options.encoding })
    );
  },

  /**
   * Read file as raw bytes (Buffer)
   */
  readFileBytesSync(filePath: string): Buffer {
    return monitoringWrapper(`readFileBytesSync(${filePath})`, () =>
      fs.readFileSync(filePath)
    );
  },

  /**
   * Partial read with buffer
   */
  readSync(filePath: string, options: ReadSyncOptions): ReadSyncResult {
    return monitoringWrapper(
      `readSync(${filePath}, ${options.length} bytes)`,
      () => {
        let fd: number | undefined;
        try {
          fd = fs.openSync(filePath, 'r');
          const buffer = Buffer.alloc(options.length);
          const bytesRead = fs.readSync(fd, buffer, 0, options.length, 0);
          return { buffer, bytesRead };
        } finally {
          if (fd !== undefined) {
            fs.closeSync(fd);
          }
        }
      }
    );
  },

  /**
   * Append to file
   */
  appendFileSync(
    filePath: string,
    data: string | Buffer,
    options?: { encoding?: BufferEncoding }
  ): void {
    monitoringWrapper(`appendFileSync(${filePath})`, () =>
      fs.appendFileSync(filePath, data, options)
    );
  },

  /**
   * Copy file
   */
  copyFileSync(src: string, dest: string): void {
    monitoringWrapper(`copyFileSync(${src} -> ${dest})`, () =>
      fs.copyFileSync(src, dest)
    );
  },

  /**
   * Delete file
   */
  unlinkSync(filePath: string): void {
    monitoringWrapper(`unlinkSync(${filePath})`, () =>
      fs.unlinkSync(filePath)
    );
  },

  /**
   * Rename/move file
   */
  renameSync(oldPath: string, newPath: string): void {
    monitoringWrapper(`renameSync(${oldPath} -> ${newPath})`, () =>
      fs.renameSync(oldPath, newPath)
    );
  },

  /**
   * Create hard link
   */
  linkSync(existingPath: string, newPath: string): void {
    monitoringWrapper(`linkSync(${existingPath} -> ${newPath})`, () =>
      fs.linkSync(existingPath, newPath)
    );
  },

  /**
   * Create symbolic link
   */
  symlinkSync(target: string, linkPath: string): void {
    monitoringWrapper(`symlinkSync(${target} -> ${linkPath})`, () =>
      fs.symlinkSync(target, linkPath)
    );
  },

  /**
   * Read symlink target
   */
  readlinkSync(filePath: string): string {
    return monitoringWrapper(`readlinkSync(${filePath})`, () =>
      fs.readlinkSync(filePath)
    );
  },

  /**
   * Resolve real path
   */
  realpathSync(filePath: string): string {
    return monitoringWrapper(`realpathSync(${filePath})`, () =>
      fs.realpathSync(filePath)
    );
  },

  /**
   * Create directory (recursive by default)
   */
  mkdirSync(dirPath: string, options?: MkdirOptions): void {
    monitoringWrapper(`mkdirSync(${dirPath})`, () => {
      if (!fs.existsSync(dirPath)) {
        const mkdirOptions: fs.MakeDirectoryOptions = { recursive: true };
        if (options?.mode !== undefined) {
          mkdirOptions.mode = options.mode;
        }
        fs.mkdirSync(dirPath, mkdirOptions);
      }
    });
  },

  /**
   * List directory with file types
   */
  readdirSync(dirPath: string): fs.Dirent[] {
    return monitoringWrapper(`readdirSync(${dirPath})`, () =>
      fs.readdirSync(dirPath, { withFileTypes: true })
    );
  },

  /**
   * List directory as string array
   */
  readdirStringSync(dirPath: string): string[] {
    return monitoringWrapper(`readdirStringSync(${dirPath})`, () =>
      fs.readdirSync(dirPath)
    );
  },

  /**
   * Check if directory is empty
   */
  isDirEmptySync(dirPath: string): boolean {
    return monitoringWrapper(`isDirEmptySync(${dirPath})`, () => {
      const files = fs.readdirSync(dirPath);
      return files.length === 0;
    });
  },

  /**
   * Remove empty directory
   */
  rmdirSync(dirPath: string): void {
    monitoringWrapper(`rmdirSync(${dirPath})`, () => fs.rmdirSync(dirPath));
  },

  /**
   * Remove file or directory recursively
   */
  rmSync(filePath: string, options?: { recursive?: boolean; force?: boolean }): void {
    monitoringWrapper(`rmSync(${filePath})`, () => fs.rmSync(filePath, options));
  },

  /**
   * Create write stream
   */
  createWriteStream(filePath: string): fs.WriteStream {
    return fs.createWriteStream(filePath);
  },

  /**
   * Write file synchronously
   */
  writeFileSync(
    filePath: string,
    data: string | Buffer,
    options?: { encoding?: BufferEncoding }
  ): void {
    monitoringWrapper(`writeFileSync(${filePath})`, () =>
      fs.writeFileSync(filePath, data, options)
    );
  },

  /**
   * Write file asynchronously
   */
  async writeFile(
    filePath: string,
    data: string | Buffer,
    options?: { encoding?: BufferEncoding }
  ): Promise<void> {
    return monitoringWrapper(`writeFile(${filePath})`, () =>
      fs.promises.writeFile(filePath, data, options)
    );
  },

  /**
   * Read file asynchronously
   */
  async readFile(
    filePath: string,
    options?: { encoding?: BufferEncoding }
  ): Promise<string | Buffer> {
    return monitoringWrapper(`readFile(${filePath})`, () =>
      fs.promises.readFile(filePath, options)
    );
  },
};

// ============================================
// Encoding Detection
// ============================================

/**
 * Detect file encoding from BOM or content
 * Original: RW in analysis docs
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
 * Normalize line endings to LF
 */
export function normalizeLineEndings(content: string): string {
  return content.replace(/\r\n/g, '\n');
}

/**
 * Detect line ending style in content
 */
export function detectLineEnding(content: string): '\r\n' | '\n' {
  const crlfCount = (content.match(/\r\n/g) || []).length;
  const lfCount = (content.match(/(?<!\r)\n/g) || []).length;
  return crlfCount > lfCount ? '\r\n' : '\n';
}

// ============================================
// File Modified Time
// ============================================

/**
 * Get file modified time in milliseconds
 * Original: mz (getFileModifiedTime) in chunks.86.mjs
 */
export function getFileModifiedTime(filePath: string): number {
  try {
    const stat = FileSystemWrapper.statSync(filePath);
    return stat.mtimeMs;
  } catch {
    return 0;
  }
}

// ============================================
// Path Utilities
// ============================================

/**
 * Resolve path to absolute
 * Original: Y4 in chunks.115.mjs
 */
export function resolvePath(filePath: string): string {
  return path.resolve(filePath);
}

/**
 * Check if path is absolute
 */
export function isAbsolutePath(filePath: string): boolean {
  return path.isAbsolute(filePath);
}

/**
 * Join path components
 */
export function joinPath(...parts: string[]): string {
  return path.join(...parts);
}

/**
 * Get directory name
 */
export function dirname(filePath: string): string {
  return path.dirname(filePath);
}

/**
 * Get base name
 */
export function basename(filePath: string, ext?: string): string {
  return path.basename(filePath, ext);
}

/**
 * Get file extension
 */
export function extname(filePath: string): string {
  return path.extname(filePath);
}

// ============================================
// Read File State Management
// ============================================

/**
 * Record a file read in the state map
 * Original: from chunks.86.mjs:764-768
 */
export function recordFileRead(
  readFileState: ReadFileState,
  filePath: string,
  content: string,
  offset?: number,
  limit?: number
): void {
  const resolvedPath = resolvePath(filePath);
  readFileState.set(resolvedPath, {
    content,
    timestamp: getFileModifiedTime(resolvedPath),
    offset,
    limit,
  });
}

/**
 * Check if file was read
 */
export function wasFileRead(
  readFileState: ReadFileState,
  filePath: string
): boolean {
  const resolvedPath = resolvePath(filePath);
  return readFileState.has(resolvedPath);
}

/**
 * Get file read record
 */
export function getFileReadRecord(
  readFileState: ReadFileState,
  filePath: string
): FileReadRecord | undefined {
  const resolvedPath = resolvePath(filePath);
  return readFileState.get(resolvedPath);
}

/**
 * Check if file was modified since read
 */
export function wasFileModifiedSinceRead(
  readFileState: ReadFileState,
  filePath: string
): boolean {
  const record = getFileReadRecord(readFileState, filePath);
  if (!record) return false;

  const resolvedPath = resolvePath(filePath);
  const currentMtime = getFileModifiedTime(resolvedPath);

  if (currentMtime <= record.timestamp) {
    return false;
  }

  // If full file was read, compare content
  if (record.offset === undefined && record.limit === undefined) {
    try {
      const currentContent = normalizeLineEndings(
        FileSystemWrapper.readFileSync(resolvedPath, {
          encoding: detectEncoding(resolvedPath),
        })
      );
      return currentContent !== record.content;
    } catch {
      return true;
    }
  }

  // Partial read - can only use timestamp
  return true;
}

// Note: exports are declared inline above.
