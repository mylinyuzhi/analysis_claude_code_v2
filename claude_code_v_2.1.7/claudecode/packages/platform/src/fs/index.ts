/**
 * @claudecode/platform - File System Operations
 * 
 * File system abstraction layer matching source implementation.
 * Reconstructed from chunks.1.mjs
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { monitoringWrapper } from './monitoring.js';

// ============================================
// Types
// ============================================

export interface MkdirOptions {
  mode?: number;
  recursive?: boolean;
}

export interface ReadSyncOptions {
  length: number;
}

export interface ReadSyncResult {
  buffer: Buffer;
  bytesRead: number;
}

// ============================================
// FileSystemWrapper
// ============================================

/**
 * File system wrapper object (singleton).
 * Original: NT9 in chunks.1.mjs:2929-3040
 */
export const FileSystemWrapper = {
  /**
   * Get current working directory
   */
  cwd(): string {
    return process.cwd();
  },

  /**
   * Check if file exists
   */
  existsSync(filePath: string): boolean {
    return monitoringWrapper(`existsSync(${filePath})`, () =>
      fs.existsSync(filePath)
    );
  },

  /**
   * Get file stat asynchronously
   * Original: CT9 helper used in NT9.stat
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
   * Get lstat synchronously
   */
  lstatSync(filePath: string): fs.Stats {
    return monitoringWrapper(`lstatSync(${filePath})`, () =>
      fs.lstatSync(filePath)
    );
  },

  /**
   * Read file synchronously with encoding
   */
  readFileSync(filePath: string, options: { encoding: BufferEncoding }): string {
    return monitoringWrapper(`readFileSync(${filePath})`, () =>
      fs.readFileSync(filePath, { encoding: options.encoding })
    );
  },

  /**
   * Read file bytes synchronously
   */
  readFileBytesSync(filePath: string): Buffer {
    return monitoringWrapper(`readFileBytesSync(${filePath})`, () =>
      fs.readFileSync(filePath)
    );
  },

  /**
   * Partial read synchronously
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
   * Append to file synchronously
   */
  appendFileSync(
    filePath: string,
    data: string | Buffer,
    options?: { encoding?: BufferEncoding; mode?: number }
  ): void {
    monitoringWrapper(`appendFileSync(${filePath})`, () =>
      fs.appendFileSync(filePath, data, options)
    );
  },

  /**
   * Copy file synchronously
   */
  copyFileSync(src: string, dest: string): void {
    monitoringWrapper(`copyFileSync(${src} -> ${dest})`, () =>
      fs.copyFileSync(src, dest)
    );
  },

  /**
   * Unlink (delete) file synchronously
   */
  unlinkSync(filePath: string): void {
    monitoringWrapper(`unlinkSync(${filePath})`, () =>
      fs.unlinkSync(filePath)
    );
  },

  /**
   * Rename file synchronously
   */
  renameSync(oldPath: string, newPath: string): void {
    monitoringWrapper(`renameSync(${oldPath} -> ${newPath})`, () =>
      fs.renameSync(oldPath, newPath)
    );
  },

  /**
   * Link synchronously
   */
  linkSync(existingPath: string, newPath: string): void {
    monitoringWrapper(`linkSync(${existingPath} -> ${newPath})`, () =>
      fs.linkSync(existingPath, newPath)
    );
  },

  /**
   * Symlink synchronously
   */
  symlinkSync(target: string, linkPath: string): void {
    monitoringWrapper(`symlinkSync(${target} -> ${linkPath})`, () =>
      fs.symlinkSync(target, linkPath)
    );
  },

  /**
   * Read link synchronously
   */
  readlinkSync(filePath: string): string {
    return monitoringWrapper(`readlinkSync(${filePath})`, () =>
      fs.readlinkSync(filePath)
    );
  },

  /**
   * Realpath synchronously
   */
  realpathSync(filePath: string): string {
    return monitoringWrapper(`realpathSync(${filePath})`, () =>
      fs.realpathSync(filePath)
    );
  },

  /**
   * Mkdir synchronously (recursive check)
   */
  mkdirSync(dirPath: string, options?: MkdirOptions): void {
    return monitoringWrapper(`mkdirSync(${dirPath})`, () => {
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
   * Readdir synchronously
   */
  readdirSync(dirPath: string): fs.Dirent[] {
    return monitoringWrapper(`readdirSync(${dirPath})`, () =>
      fs.readdirSync(dirPath, { withFileTypes: true })
    );
  },

  /**
   * Readdir as strings
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
   * Rmdir synchronously
   */
  rmdirSync(dirPath: string): void {
    monitoringWrapper(`rmdirSync(${dirPath})`, () => fs.rmdirSync(dirPath));
  },

  /**
   * Remove synchronously (recursive)
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
    options?: { encoding?: BufferEncoding; mode?: number }
  ): void {
    monitoringWrapper(`writeFileSync(${filePath})`, () => 
      fs.writeFileSync(filePath, data, options)
    );
  }
};

/**
 * Get the file system wrapper.
 * Original: vA in chunks.1.mjs
 */
export const getFileSystem = () => FileSystemWrapper;

// ============================================
// Path Utilities
// ============================================

/**
 * Join path segments.
 * Original: part of chunks.1.mjs path handling
 */
export const joinPath = (...args: string[]) => path.join(...args);

/**
 * Get system temporary directory.
 * Original: part of chunks.1.mjs temp handling
 */
export const getTempDir = () => os.tmpdir();
