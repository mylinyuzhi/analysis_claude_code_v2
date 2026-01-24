/**
 * @claudecode/platform - Sandbox Violation Store
 *
 * Tracks sandbox violations for reporting and debugging.
 * Reconstructed from chunks.53.mjs:2675-2709
 */

import type {
  SandboxViolation,
  SandboxViolationStore as ISandboxViolationStore,
  ViolationListener,
} from './types.js';
import { SANDBOX_CONSTANTS } from './types.js';

// ============================================
// Base64 Encoding (for command correlation)
// ============================================

/**
 * Encode string to base64
 */
function encodeToBase64(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64');
}

/**
 * Decode base64 to string
 */
function decodeFromBase64(base64: string): string {
  return Buffer.from(base64, 'base64').toString('utf-8');
}

// ============================================
// SandboxViolationStore Class
// ============================================

/**
 * In-memory store for sandbox violations.
 * Original: nMA class in chunks.53.mjs:2675-2709
 */
export class SandboxViolationStore implements ISandboxViolationStore {
  private violations: SandboxViolation[] = [];
  private totalCount = 0;
  private maxSize = SANDBOX_CONSTANTS.MAX_VIOLATIONS;
  private listeners = new Set<ViolationListener>();

  /**
   * Add a violation to the store.
   * Original: addViolation method
   */
  addViolation(violation: SandboxViolation): void {
    this.violations.push(violation);
    this.totalCount++;

    // Prune old violations if over max size
    if (this.violations.length > this.maxSize) {
      this.violations = this.violations.slice(-this.maxSize);
    }

    this.notifyListeners();
  }

  /**
   * Get recent violations.
   *
   * @param limit - Maximum number of violations to return
   * @returns Array of violations (most recent last)
   */
  getViolations(limit?: number): SandboxViolation[] {
    if (limit === undefined) {
      return [...this.violations];
    }
    return this.violations.slice(-limit);
  }

  /**
   * Get current violation count in store.
   */
  getCount(): number {
    return this.violations.length;
  }

  /**
   * Get total violation count (including pruned).
   */
  getTotalCount(): number {
    return this.totalCount;
  }

  /**
   * Get violations for a specific command.
   * Original: getViolationsForCommand method
   *
   * @param command - Command to filter by
   * @returns Violations for the command
   */
  getViolationsForCommand(command: string): SandboxViolation[] {
    const encodedCmd = encodeToBase64(command);
    return this.violations.filter((v) => v.encodedCommand === encodedCmd);
  }

  /**
   * Clear all violations.
   */
  clear(): void {
    this.violations = [];
    // Note: totalCount is not reset to track historical count
    this.notifyListeners();
  }

  /**
   * Subscribe to violation updates.
   * Original: subscribe method
   *
   * @param callback - Function to call when violations change
   * @returns Unsubscribe function
   */
  subscribe(callback: ViolationListener): () => void {
    this.listeners.add(callback);
    // Immediately call with current state
    callback(this.getViolations());
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of updates.
   */
  private notifyListeners(): void {
    const violations = this.getViolations();
    this.listeners.forEach((callback) => callback(violations));
  }
}

// ============================================
// Command Tag Encoding/Decoding
// ============================================

/**
 * Unique tag for sandbox log correlation.
 * This is generated per-session to filter log stream.
 * Original: VHB in chunks.53.mjs:2672
 */
let uniqueSandboxTag: string | undefined;

/**
 * Get or generate unique sandbox tag.
 * Original: zHB initializer in chunks.53.mjs:2672
 */
export function getUniqueSandboxTag(): string {
  if (!uniqueSandboxTag) {
    uniqueSandboxTag = `_${Math.random().toString(36).slice(2, 11)}_SBX`;
  }
  return uniqueSandboxTag;
}

/**
 * Encode command for log correlation.
 * Original: w58() in chunks.53.mjs:2454-2456
 *
 * @param command - Command to encode
 * @returns Encoded command tag for sandbox profile
 */
export function encodeCommandTag(command: string): string {
  // Format: CMD64_<base64_encoded_command>_END_<unique_session_tag>
  return `CMD64_${encodeToBase64(command)}_END_${getUniqueSandboxTag()}`;
}

/**
 * Decode command from tag.
 * Original: rFB() in chunks.53.mjs
 *
 * @param encodedCommand - Base64-encoded command from tag
 * @returns Decoded command
 */
export function decodeCommandFromTag(encodedCommand: string): string {
  return decodeFromBase64(encodedCommand);
}

// ============================================
// Violation Parsing
// ============================================

/**
 * Regex patterns for violation parsing.
 */
const CMD64_PATTERN = /CMD64_(.+?)_END/;
const SANDBOX_DENY_PATTERN = /Sandbox:\s+(.+)$/;

/**
 * Parse violation from log line.
 *
 * @param logLine - Log line from sandbox monitor
 * @returns Parsed violation or null
 */
export function parseViolationFromLog(logLine: string): SandboxViolation | null {
  // Check for sandbox deny message
  if (!logLine.includes('Sandbox:') || !logLine.includes('deny')) {
    return null;
  }

  // Extract violation message
  const denyMatch = logLine.match(SANDBOX_DENY_PATTERN);
  if (!denyMatch?.[1]) {
    return null;
  }

  const violationMsg = denyMatch[1];

  // Try to extract encoded command
  const cmdMatch = logLine.match(CMD64_PATTERN);
  let decodedCommand: string | undefined;
  let encodedCommand: string | undefined;

  if (cmdMatch?.[1]) {
    encodedCommand = cmdMatch[1];
    try {
      decodedCommand = decodeCommandFromTag(encodedCommand);
    } catch {
      // Ignore decode errors
    }
  }

  return {
    line: violationMsg,
    command: decodedCommand,
    encodedCommand,
    timestamp: new Date(),
  };
}

/**
 * Check if violation should be ignored.
 *
 * @param violation - Violation to check
 * @param ignoreRules - Ignore rules from config
 * @returns Whether violation should be ignored
 */
export function shouldIgnoreViolation(
  violation: SandboxViolation,
  ignoreRules?: Record<string, string[] | undefined>
): boolean {
  const { line: violationMsg, command } = violation;

  // Always ignore known safe system service violations
  if (
    violationMsg.includes('mDNSResponder') ||
    violationMsg.includes('mach-lookup com.apple.diagnosticd') ||
    violationMsg.includes('mach-lookup com.apple.analyticsd')
  ) {
    return true;
  }

  if (!ignoreRules) {
    return false;
  }

  // Check wildcard rules (apply to all commands)
  const wildcardRules = ignoreRules['*'] || [];
  if (wildcardRules.some((rule) => violationMsg.includes(rule))) {
    return true;
  }

  // Check command-specific rules
  if (command) {
    for (const [cmdPattern, rules] of Object.entries(ignoreRules)) {
      if (cmdPattern === '*') continue;
      if (!rules) continue;

      if (command.includes(cmdPattern)) {
        if (rules.some((rule) => violationMsg.includes(rule))) {
          return true;
        }
      }
    }
  }

  return false;
}

// ============================================
// Global Store Instance
// ============================================

/**
 * Global violation store instance.
 * Original: P01 in chunks.53.mjs
 */
let globalViolationStore: SandboxViolationStore | undefined;

/**
 * Get or create global violation store.
 */
export function getGlobalViolationStore(): SandboxViolationStore {
  if (!globalViolationStore) {
    globalViolationStore = new SandboxViolationStore();
  }
  return globalViolationStore;
}

/**
 * Reset global violation store.
 */
export function resetGlobalViolationStore(): void {
  globalViolationStore = undefined;
}

// ============================================
// Stderr Annotation
// ============================================

/**
 * Annotate stderr with sandbox violation information.
 * Original: annotateStderrWithSandboxFailures in chunks.55.mjs
 *
 * @param stderr - Original stderr output
 * @param command - Command that was executed
 * @returns Annotated stderr
 */
export function annotateStderrWithSandboxFailures(
  stderr: string,
  command: string
): string {
  const store = getGlobalViolationStore();
  const violations = store.getViolationsForCommand(command);

  if (violations.length === 0) {
    return stderr;
  }

  const violationLines = violations.map((v) => v.line).join('\n');

  // Embed in a structured tag so UIs can hide/show it.
  // Matches the bundled runtime behavior described in analyze/18_sandbox/tool_integration.md.
  return (
    stderr +
    `\n\n<sandbox_violations>\n${violationLines}\n</sandbox_violations>`
  );
}

/**
 * Clean sandbox violation tags from stderr for display.
 * Original: Vb5() in chunks.124.mjs
 *
 * @param stderr - Stderr with potential tags
 * @returns Cleaned stderr
 */
export function cleanSandboxViolations(stderr: string): string {
  // Remove violation XML blocks (if present)
  let out = stderr.replace(/<sandbox_violations>[\s\S]*?<\/sandbox_violations>/g, '');
  // Remove CMD64_xxx_END tags
  out = out.replace(/CMD64_[A-Za-z0-9+/=]+_END_[A-Za-z0-9_]+/g, '');
  return out;
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
