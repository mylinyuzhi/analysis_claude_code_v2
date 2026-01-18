/**
 * @claudecode/shared - Utility Functions
 *
 * Common utility functions used throughout Claude Code.
 * Reconstructed from chunks.1.mjs
 */

import { randomUUID } from 'crypto';
import {
  DEFAULT_CONTEXT_WINDOW,
  EXTENDED_CONTEXT_WINDOW,
  DEFAULT_MAX_OUTPUT_TOKENS,
  BETA_CONTEXT_1M,
  TYPE_TAGS,
} from '../constants/index.js';

// ============================================
// Type Checking Utilities
// ============================================

/**
 * Check if value is an object (not null)
 * Original: lX (LM9) in chunks.1.mjs:145-148
 */
export function isObject(value: unknown): value is object {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

/**
 * Get the type tag of a value
 * Original: cw (wM9) in chunks.1.mjs:124-127
 */
export function getTypeTag(value: unknown): string {
  if (value == null) {
    return value === undefined ? TYPE_TAGS.UNDEFINED : TYPE_TAGS.NULL;
  }
  const tag = Object.prototype.toString.call(value);
  return tag;
}

/**
 * Check if value is a function
 * Original: w5A (jM9) in chunks.1.mjs:156-160
 */
export function isFunction(value: unknown): value is Function {
  if (!isObject(value)) return false;
  const tag = getTypeTag(value);
  return (
    tag === TYPE_TAGS.FUNCTION ||
    tag === TYPE_TAGS.ASYNC_FUNCTION ||
    tag === TYPE_TAGS.GENERATOR_FUNCTION ||
    tag === TYPE_TAGS.PROXY
  );
}

// ============================================
// String Parsing Utilities
// ============================================

/**
 * Parse a boolean from string or environment variable
 * Original: Y0 in analysis docs (parseBoolean)
 */
export function parseBoolean(value: string | undefined | null): boolean {
  if (value == null) return false;
  const normalized = String(value).toLowerCase().trim();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

/**
 * Parse an integer with default value
 */
export function parseInteger(
  value: string | undefined | null,
  defaultValue: number
): number {
  if (value == null) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// ============================================
// UUID Utilities
// ============================================

/**
 * Generate a new random UUID
 * Original: Nb0 in chunks.1.mjs (uses crypto.randomUUID)
 */
export function generateUUID(): string {
  return randomUUID();
}

// ============================================
// Model Utilities
// ============================================

/**
 * Check if model is a Sonnet 4 variant
 * Original: HT9 in chunks.1.mjs:1231-1233
 */
export function isSonnet4Model(modelId: string): boolean {
  return modelId.toLowerCase().includes('claude-sonnet-4');
}

/**
 * Get context window for a model
 * Original: Jq in chunks.1.mjs:1235-1238
 */
export function getContextWindow(
  modelId: string,
  betas?: string[] | null
): number {
  // Check for 1M context beta
  if (modelId.includes('[1m]')) {
    return EXTENDED_CONTEXT_WINDOW;
  }

  // Check if beta includes 1M context and model is Sonnet 4
  if (betas?.includes(BETA_CONTEXT_1M) && isSonnet4Model(modelId)) {
    return EXTENDED_CONTEXT_WINDOW;
  }

  return DEFAULT_CONTEXT_WINDOW;
}

/**
 * Get max output tokens for a model
 * Original: o5A in chunks.1.mjs:1240-1252
 */
export function getMaxOutputTokens(modelId: string): number {
  const modelLower = modelId.toLowerCase();

  if (modelLower.includes('3-5')) return 8192;
  if (modelLower.includes('claude-3-opus')) return 4096;
  if (modelLower.includes('claude-3-sonnet')) return 8192;
  if (modelLower.includes('claude-3-haiku')) return 4096;
  if (modelLower.includes('opus-4-5')) return 64000;
  if (modelLower.includes('opus-4')) return 32000;
  if (modelLower.includes('sonnet-4') || modelLower.includes('haiku-4')) {
    return 64000;
  }

  return DEFAULT_MAX_OUTPUT_TOKENS;
}

// ============================================
// Array Utilities
// ============================================

/**
 * Sum a specific field from an array of objects
 * Original: i5A in chunks.1.mjs (used in qdA, NdA, etc.)
 */
export function sumField<T extends Record<string, number>>(
  items: T[],
  field: keyof T
): number {
  return items.reduce((sum, item) => sum + (item[field] ?? 0), 0);
}

/**
 * Shallow equality check for two values
 * Original: SG7 (shallowEqual) in chunks.135.mjs:1225-1233
 */
export function shallowEqual<T>(a: T, b: T): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (a === null || b === null) return false;

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      (a as Record<string, unknown>)[key] !== (b as Record<string, unknown>)[key]
    ) {
      return false;
    }
  }

  return true;
}

// ============================================
// Memoization Utilities
// ============================================

/**
 * Simple memoization wrapper for zero-argument functions
 */
export function memoize<T>(fn: () => T): () => T {
  let cached: T | undefined;
  let hasRun = false;

  return () => {
    if (!hasRun) {
      cached = fn();
      hasRun = true;
    }
    return cached as T;
  };
}

/**
 * Memoization with WeakMap for object keys
 */
export function memoizeWeak<K extends object, V>(
  fn: (key: K) => V
): (key: K) => V {
  const cache = new WeakMap<K, V>();

  return (key: K) => {
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(key);
    cache.set(key, result);
    return result;
  };
}

// ============================================
// Path Utilities
// ============================================

/**
 * Normalize path separators to forward slashes
 */
export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}

/**
 * Check if a path is absolute
 */
export function isAbsolutePath(path: string): boolean {
  // Unix absolute path
  if (path.startsWith('/')) return true;
  // Windows absolute path (C:\, D:\, etc.)
  if (/^[a-zA-Z]:[\\/]/.test(path)) return true;
  return false;
}

// ============================================
// Async Utilities
// ============================================

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a deferred promise
 */
export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
}

export function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

/**
 * Timeout wrapper for promises
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

// ============================================
// Escape Utilities
// ============================================

/**
 * Escape special regex characters
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Escape string for use in shell commands
 */
export function escapeShell(str: string): string {
  return `'${str.replace(/'/g, "'\\''")}'`;
}

// ============================================
// Truncation Utilities
// ============================================

/**
 * Truncate string to max length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Truncate from middle of string
 */
export function truncateMiddle(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  const half = Math.floor((maxLength - 3) / 2);
  return str.slice(0, half) + '...' + str.slice(-half);
}

