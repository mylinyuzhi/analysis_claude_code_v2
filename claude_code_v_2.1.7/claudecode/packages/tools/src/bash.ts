/**
 * @claudecode/tools - Bash Tool
 *
 * Executes bash commands in a persistent shell session.
 * Supports timeout, background execution, and sandbox mode.
 *
 * Reconstructed from chunks.124.mjs:1505-1752
 */

import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';
import {
  createTool,
  validationSuccess,
  permissionAllow,
  permissionAsk,
  toolSuccess,
  toolError,
} from './base.js';
import type { BashInput, BashOutput, ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';
import {
  sandboxManager,
  isBashSandboxed,
  SANDBOX_CONSTANTS,
  getSandboxConfig,
  type SandboxConfig,
} from '@claudecode/platform';

// ============================================
// Constants
// ============================================

const MAX_RESULT_SIZE = 30000;
const DEFAULT_TIMEOUT = 120000; // 2 minutes
const MAX_TIMEOUT = 600000; // 10 minutes

/**
 * Read-only search commands.
 * Original: Ma5 in chunks.124.mjs:1469
 */
const SEARCH_COMMANDS = new Set([
  'find',
  'grep',
  'rg',
  'ag',
  'ack',
  'locate',
  'which',
  'whereis',
]);

/**
 * Read-only read commands.
 * Original: Ra5 in chunks.124.mjs
 */
const READ_COMMANDS = new Set([
  'cat',
  'head',
  'tail',
  'less',
  'more',
  'wc',
  'stat',
  'file',
  'strings',
  'ls',
  'tree',
  'du',
]);

/**
 * Read-only output commands.
 * Original: _a5 in chunks.124.mjs
 */
const OUTPUT_COMMANDS = new Set(['echo', 'true', 'false', ':']);

// ============================================
// Input/Output Schemas
// ============================================

/**
 * Bash tool input schema.
 * Original: YV1 / wd2 in chunks.124.mjs:1470-1492
 */
const bashInputSchema = z.object({
  command: z.string().describe('The command to execute'),
  timeout: z
    .number()
    .max(MAX_TIMEOUT)
    .optional()
    .describe(`Optional timeout in milliseconds (max ${MAX_TIMEOUT})`),
  description: z.string().optional().describe('Clear, concise description of what this command does'),
  run_in_background: z.boolean().optional().describe('Set to true to run this command in the background'),
  dangerouslyDisableSandbox: z
    .boolean()
    .optional()
    .describe('Set to true to dangerously override sandbox mode'),
  _simulatedSedEdit: z
    .object({
      filePath: z.string(),
      newContent: z.string(),
    })
    .optional()
    .describe('Internal: pre-computed sed edit result from preview'),
});

/**
 * Bash tool output schema.
 * Original: rq0 in chunks.124.mjs:1493-1504
 */
const bashOutputSchema = z.object({
  stdout: z.string(),
  stderr: z.string(),
  rawOutputPath: z.string().optional(),
  interrupted: z.boolean(),
  isImage: z.boolean().optional(),
  backgroundTaskId: z.string().optional(),
  backgroundedByUser: z.boolean().optional(),
  dangerouslyDisableSandbox: z.boolean().optional(),
  returnCodeInterpretation: z.string().optional(),
  structuredContent: z.array(z.any()).optional(),
});

// ============================================
// Helper Functions
// ============================================

/**
 * Parse command to get the base command name.
 */
function parseCommand(command: string): string {
  const trimmed = command.trim();
  // Handle env, sudo, etc.
  const parts = trimmed.split(/\s+/);
  for (const part of parts) {
    if (part === 'env' || part === 'sudo' || part.includes('=')) {
      continue;
    }
    return part;
  }
  return parts[0] || '';
}

/**
 * Check if command is read-only.
 */
function isReadOnlyCommand(command: string): boolean {
  const baseCommand = parseCommand(command);
  return (
    SEARCH_COMMANDS.has(baseCommand) ||
    READ_COMMANDS.has(baseCommand) ||
    OUTPUT_COMMANDS.has(baseCommand)
  );
}

/**
 * Execute a command with timeout.
 */
async function executeCommand(
  command: string,
  cwd: string,
  timeout: number,
  abortSignal?: AbortSignal,
  env?: NodeJS.ProcessEnv
): Promise<{ stdout: string; stderr: string; interrupted: boolean; exitCode: number }> {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let interrupted = false;
    let killed = false;

    const proc = spawn(command, [], {
      cwd,
      shell: true,
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const timeoutId = setTimeout(() => {
      if (!killed) {
        killed = true;
        interrupted = true;
        proc.kill('SIGTERM');
      }
    }, timeout);

    // Handle abort signal
    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        if (!killed) {
          killed = true;
          interrupted = true;
          proc.kill('SIGTERM');
        }
      });
    }

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
      // Truncate if too large
      if (stdout.length > MAX_RESULT_SIZE * 2) {
        stdout = stdout.slice(-MAX_RESULT_SIZE);
      }
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
      if (stderr.length > MAX_RESULT_SIZE) {
        stderr = stderr.slice(-MAX_RESULT_SIZE);
      }
    });

    proc.on('close', (code) => {
      clearTimeout(timeoutId);
      resolve({
        stdout: stdout.slice(0, MAX_RESULT_SIZE),
        stderr: stderr.slice(0, MAX_RESULT_SIZE / 2),
        interrupted,
        exitCode: code ?? 0,
      });
    });

    proc.on('error', (error) => {
      clearTimeout(timeoutId);
      resolve({
        stdout,
        stderr: stderr + '\n' + error.message,
        interrupted: false,
        exitCode: 1,
      });
    });
  });
}

// ============================================
// Bash Tool
// ============================================

/**
 * Bash tool implementation.
 * Original: o2 (BashTool) in chunks.124.mjs:1505-1752
 */
export const BashTool = createTool<BashInput, BashOutput>({
  name: TOOL_NAMES.BASH,
  maxResultSizeChars: MAX_RESULT_SIZE,
  strict: true,

  async description() {
    return `Executes a given bash command in a persistent shell session with optional timeout, ensuring proper handling and security measures.

IMPORTANT: This tool is for terminal operations like git, npm, docker, etc. DO NOT use it for file operations (reading, writing, editing, searching, finding files) - use the specialized tools for this instead.`;
  },

  async prompt() {
    return `Usage notes:
- The command argument is required
- You can specify an optional timeout in milliseconds (up to ${MAX_TIMEOUT}ms / 10 minutes)
- Default timeout is ${DEFAULT_TIMEOUT}ms (2 minutes)
- If output exceeds ${MAX_RESULT_SIZE} characters, it will be truncated
- Use run_in_background for long-running commands
- Avoid using Bash for file operations - use dedicated tools instead`;
  },

  inputSchema: bashInputSchema,
  outputSchema: bashOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe(input) {
    if (!input) return false;
    return isReadOnlyCommand(input.command);
  },

  isReadOnly(input) {
    if (!input) return false;
    return isReadOnlyCommand(input.command);
  },

  async checkPermissions(input, context) {
    // Read-only commands are auto-allowed
    if (isReadOnlyCommand(input.command)) {
      return permissionAllow(input);
    }

    // Other commands need permission
    return permissionAsk(`Execute command: ${input.command}`);
  },

  async validateInput(input, context) {
    return validationSuccess();
  },

  async call(input, context) {
    const { command, timeout = DEFAULT_TIMEOUT, run_in_background } = input;
    const cwd = context.getCwd();

    try {
      // Handle background execution
      if (run_in_background) {
        // In a real implementation, this would create a background task
        const taskId = `bash_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        // Start process in background (simplified)
        const proc = spawn(command, [], {
          cwd,
          shell: true,
          detached: true,
          stdio: 'ignore',
        });
        proc.unref();

        const result: BashOutput = {
          stdout: '',
          stderr: '',
          interrupted: false,
          backgroundTaskId: taskId,
        };

        return toolSuccess(result);
      }

      // Sandbox wrapping (if enabled)
      const shouldSandbox = isBashSandboxed(command, Boolean(input.dangerouslyDisableSandbox));

      let wrappedCommand = command;
      let env: NodeJS.ProcessEnv | undefined = undefined;

      if (shouldSandbox) {
        // Ensure sandbox temp dir exists
        try {
          fs.mkdirSync(SANDBOX_CONSTANTS.SANDBOX_TEMP_DIR, { recursive: true });
        } catch {
          // ignore
        }

        // Best-effort initialize if caller hasn't already
        await ensureSandboxInitialized(cwd).catch(() => {});

        const readConfig = sandboxManager.getFsReadConfig();
        const writeConfig = sandboxManager.getFsWriteConfig();
        const netConfig = sandboxManager.getNetworkRestrictionConfig();
        const needsNetworkRestriction = Boolean(
          netConfig && ((netConfig.allowedDomains?.length ?? 0) > 0 || (netConfig.deniedDomains?.length ?? 0) > 0)
        );

        wrappedCommand = await sandboxManager.wrapWithSandbox({
          command,
          needsNetworkRestriction,
          httpSocketPath: sandboxManager.getLinuxHttpSocketPath(),
          socksSocketPath: sandboxManager.getLinuxSocksSocketPath(),
          httpProxyPort: sandboxManager.getProxyPort(),
          socksProxyPort: sandboxManager.getSocksProxyPort(),
          readConfig: readConfig,
          writeConfig: writeConfig,
          enableWeakerNestedSandbox: sandboxManager.getEnableWeakerNestedSandbox(),
          allowUnixSockets: sandboxManager.getAllowUnixSockets(),
          allowLocalBinding: sandboxManager.getAllowLocalBinding(),
          abortSignal: context.abortSignal,
        });

        env = {
          ...process.env,
          TMPDIR: SANDBOX_CONSTANTS.SANDBOX_TEMP_DIR,
          CLAUDE_CODE_TMPDIR: SANDBOX_CONSTANTS.SANDBOX_TEMP_DIR,
          SANDBOX_RUNTIME: '1',
        };
      }

      // Execute command synchronously
      const { stdout, stderr, interrupted, exitCode } = await executeCommand(
        wrappedCommand,
        cwd,
        Math.min(timeout, MAX_TIMEOUT),
        context.abortSignal,
        env
      );

      const annotatedStderr = shouldSandbox
        ? sandboxManager.annotateStderrWithSandboxFailures(stderr, command)
        : stderr;

      const result: BashOutput = {
        stdout,
        stderr: annotatedStderr,
        interrupted,
        dangerouslyDisableSandbox: input.dangerouslyDisableSandbox,
      };

      // Add interpretation for non-zero exit codes
      if (exitCode !== 0 && !interrupted) {
        result.returnCodeInterpretation = `Command exited with code ${exitCode}`;
      }

      return toolSuccess(result);
    } catch (error) {
      return toolError(`Command execution failed: ${(error as Error).message}`);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    let content = '';

    if (result.backgroundTaskId) {
      content = `Command started in background with task ID: ${result.backgroundTaskId}`;
    } else {
      if (result.stdout) {
        content += result.stdout;
      }
      if (result.stderr) {
        content += (content ? '\n\n' : '') + `stderr:\n${result.stderr}`;
      }
      if (result.interrupted) {
        content += (content ? '\n\n' : '') + '(command was interrupted due to timeout)';
      }
      if (!content) {
        content = '(no output)';
      }
    }

    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content,
    };
  },
});

// ============================================
// Sandbox bootstrap (best-effort)
// ============================================

async function ensureSandboxInitialized(cwd: string): Promise<void> {
  if (!sandboxManager.isSandboxingEnabled()) return;
  // Already initialized
  const existing = await sandboxManager.waitForNetworkInitialization();
  if (existing) return;

  // Prefer config provided by the CLI (via @claudecode/platform global config)
  let cfg = getSandboxConfig();
  if (!cfg) {
    // Conservative defaults (align with analyze/18_sandbox/configuration.md)
    cfg = {
      network: { allowedDomains: [], deniedDomains: [] },
      filesystem: {
        denyRead: [],
        allowWrite: [cwd, SANDBOX_CONSTANTS.SANDBOX_TEMP_DIR],
        denyWrite: [],
      },
      mandatoryDenySearchDepth: SANDBOX_CONSTANTS.DEFAULT_MANDATORY_DENY_SEARCH_DEPTH,
    } satisfies SandboxConfig;
  }

  // Non-interactive environments should not prompt; default to deny when callback is used.
  const permissionCallback = async () => false;
  await sandboxManager.initialize(cfg, permissionCallback, true);
}

// ============================================
// Export
// ============================================

// NOTE: BashTool 已在声明处导出；避免重复导出。
