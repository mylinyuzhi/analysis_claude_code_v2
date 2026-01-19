/**
 * @claudecode/features - Hook Output Parser
 *
 * Parse and validate hook JSON output.
 * Reconstructed from chunks.120.mjs:1179-1207
 */

import type { HookOutput, SyncHookOutput, AsyncHookResponse } from './types.js';

// ============================================
// Logging Placeholder
// ============================================

function logDebug(message: string): void {
  if (process.env.CLAUDE_DEBUG) {
    console.log(`[Hooks] ${message}`);
  }
}

// ============================================
// Output Validation
// ============================================

/**
 * Validate async hook response.
 */
function isValidAsyncResponse(obj: unknown): obj is AsyncHookResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (obj as { async?: unknown }).async === true
  );
}

/**
 * Validate sync hook output.
 */
function isValidSyncOutput(obj: unknown): obj is SyncHookOutput {
  if (typeof obj !== 'object' || obj === null) return false;

  const o = obj as Record<string, unknown>;

  // All fields are optional, so empty object is valid
  // Check types of fields if present
  if ('continue' in o && typeof o.continue !== 'boolean') return false;
  if ('suppressOutput' in o && typeof o.suppressOutput !== 'boolean') return false;
  if ('stopReason' in o && typeof o.stopReason !== 'string') return false;
  if ('decision' in o && o.decision !== 'approve' && o.decision !== 'block') return false;
  if ('reason' in o && typeof o.reason !== 'string') return false;
  if ('systemMessage' in o && typeof o.systemMessage !== 'string') return false;

  return true;
}

/**
 * Validate hook output.
 */
function isValidHookOutput(obj: unknown): obj is HookOutput {
  return isValidAsyncResponse(obj) || isValidSyncOutput(obj);
}

// ============================================
// Parse Hook Output
// ============================================

/**
 * Parsed hook output result.
 */
export interface ParsedHookOutput {
  /** Parsed JSON output if valid */
  json?: HookOutput;
  /** Plain text if not JSON */
  plainText?: string;
  /** Validation error message if JSON but invalid */
  validationError?: string;
}

/**
 * Parse and validate hook JSON output.
 * Original: Mu2 in chunks.120.mjs:1179-1207
 *
 * @param rawOutput - Raw output string from hook
 * @returns Parsed output with either json, plainText, or error
 */
export function parseHookOutput(rawOutput: string): ParsedHookOutput {
  const trimmed = rawOutput.trim();

  // Not JSON - return as plain text
  if (!trimmed.startsWith('{')) {
    logDebug('Hook output does not start with {, treating as plain text');
    return { plainText: rawOutput };
  }

  try {
    const parsed = JSON.parse(trimmed);

    if (isValidHookOutput(parsed)) {
      logDebug('Successfully parsed and validated hook JSON output');
      return { json: parsed };
    }

    // JSON but failed validation
    const errorMessage = 'Hook JSON output failed validation against expected schema';
    logDebug(errorMessage);
    return { plainText: rawOutput, validationError: errorMessage };
  } catch (parseError) {
    logDebug(`Failed to parse hook output as JSON: ${parseError}`);
    return { plainText: rawOutput };
  }
}

/**
 * Substitute $ARGUMENTS placeholder in prompt.
 * Original: BY1 in chunks.92.mjs
 *
 * @param prompt - Prompt template with $ARGUMENTS placeholder
 * @param inputJson - JSON string to substitute
 * @returns Prompt with substituted arguments
 */
export function substituteArguments(prompt: string, inputJson: string): string {
  return prompt.replace(/\$ARGUMENTS/g, inputJson);
}

/**
 * Extract text content from hook output.
 */
export function extractTextFromOutput(output: HookOutput): string | undefined {
  if ('async' in output) {
    return undefined;
  }

  // Sync output might have various fields with text
  if (output.stopReason) return output.stopReason;
  if (output.reason) return output.reason;
  if (output.systemMessage) return output.systemMessage;

  return undefined;
}

/**
 * Check if output indicates blocking.
 */
export function isBlockingOutput(output: HookOutput): boolean {
  if ('async' in output) return false;

  return output.continue === false || output.decision === 'block';
}

/**
 * Check if output should suppress transcript.
 */
export function shouldSuppressOutput(output: HookOutput): boolean {
  if ('async' in output) return false;

  return output.suppressOutput === true;
}

// ============================================
// Prompt Hook Response Validation
// ============================================

/**
 * Prompt hook response (ok/reason).
 * Original: WyA schema
 */
export interface PromptHookResponseData {
  ok: boolean;
  reason?: string;
}

/**
 * Validate prompt hook response.
 */
export function isValidPromptHookResponse(obj: unknown): obj is PromptHookResponseData {
  if (typeof obj !== 'object' || obj === null) return false;

  const o = obj as Record<string, unknown>;

  if (typeof o.ok !== 'boolean') return false;
  if ('reason' in o && typeof o.reason !== 'string') return false;

  return true;
}

/**
 * Parse prompt hook response.
 */
export function parsePromptHookResponse(
  jsonString: string
): { success: true; data: PromptHookResponseData } | { success: false; error: string } {
  try {
    const parsed = JSON.parse(jsonString);

    if (isValidPromptHookResponse(parsed)) {
      return { success: true, data: parsed };
    }

    return { success: false, error: 'Invalid prompt hook response schema' };
  } catch (error) {
    return { success: false, error: `Failed to parse JSON: ${error}` };
  }
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
