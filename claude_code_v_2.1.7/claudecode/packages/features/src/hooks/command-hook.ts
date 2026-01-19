/**
 * @claudecode/features - Command Hook Execution
 *
 * Execute shell command hooks.
 * Reconstructed from chunks.120.mjs:1319-1416
 */

import { spawn } from 'child_process';
import type { CommandHook, CommandHookResult, HookEventType } from './types.js';
import { getProjectDirectory, getCurrentWorkingDirectory, getEnvFilePath } from './context.js';

// ============================================
// Logging Placeholder
// ============================================

function logDebug(message: string): void {
  if (process.env.CLAUDE_DEBUG) {
    console.log(`[Hooks] ${message}`);
  }
}

// ============================================
// Command Prefix
// ============================================

/**
 * Prefix command with shell prefix.
 * Original: o51 in chunks.120.mjs
 */
function prefixCommand(prefix: string, command: string): string {
  return `${prefix} ${command}`;
}

// ============================================
// Execute Command Hook
// ============================================

/**
 * Execute shell command hook.
 * Original: CK1 in chunks.120.mjs:1319-1416
 *
 * @param hook - Command hook configuration
 * @param eventType - Hook event type
 * @param hookName - Display name for the hook
 * @param inputJson - JSON string of hook input
 * @param signal - Abort signal
 * @param hookIndex - Index for environment file (SessionStart)
 * @param pluginRoot - Plugin root directory (if plugin hook)
 * @returns Promise with stdout, stderr, status, and aborted flag
 */
export async function executeCommandHook(
  hook: CommandHook,
  eventType: HookEventType,
  hookName: string,
  inputJson: string,
  signal?: AbortSignal,
  hookIndex?: number,
  pluginRoot?: string
): Promise<CommandHookResult> {
  const projectDir = getProjectDirectory();
  let command = hook.command;

  // Replace plugin root placeholder
  if (pluginRoot) {
    command = command.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, pluginRoot);
  }

  // Apply shell prefix if configured
  const shellPrefix = process.env.CLAUDE_CODE_SHELL_PREFIX;
  const shellCommand = shellPrefix ? prefixCommand(shellPrefix, command) : command;

  // Hook timeout (default 60s, or hook-specific)
  const timeoutMs = hook.timeout ? hook.timeout * 1000 : 60000;

  // Build environment variables
  const env: Record<string, string> = {
    ...process.env as Record<string, string>,
    CLAUDE_PROJECT_DIR: projectDir,
  };

  if (pluginRoot) {
    env.CLAUDE_PLUGIN_ROOT = pluginRoot;
  }

  if (eventType === 'SessionStart' && hookIndex !== undefined) {
    env.CLAUDE_ENV_FILE = getEnvFilePath(hookIndex);
  }

  logDebug(`Executing command hook: ${shellCommand}`);

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let aborted = false;
    let timedOut = false;

    // Spawn shell process
    const childProcess = spawn(shellCommand, [], {
      env,
      cwd: getCurrentWorkingDirectory(),
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Write hook input to stdin
    if (childProcess.stdin) {
      childProcess.stdin.write(inputJson);
      childProcess.stdin.end();
    }

    // Capture stdout
    if (childProcess.stdout) {
      childProcess.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });
    }

    // Capture stderr
    if (childProcess.stderr) {
      childProcess.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });
    }

    // Set up timeout
    const timeoutId = setTimeout(() => {
      timedOut = true;
      childProcess.kill('SIGTERM');
    }, timeoutMs);

    // Set up abort signal listener
    const abortHandler = () => {
      aborted = true;
      childProcess.kill('SIGTERM');
    };

    if (signal) {
      signal.addEventListener('abort', abortHandler);
    }

    // Handle process exit
    childProcess.on('close', (code: number | null) => {
      clearTimeout(timeoutId);
      if (signal) {
        signal.removeEventListener('abort', abortHandler);
      }

      if (timedOut) {
        stderr += `\nHook timed out after ${timeoutMs}ms`;
      }

      resolve({
        stdout,
        stderr,
        status: code ?? 1,
        aborted: aborted || timedOut,
      });
    });

    // Handle spawn error
    childProcess.on('error', (error: Error) => {
      clearTimeout(timeoutId);
      if (signal) {
        signal.removeEventListener('abort', abortHandler);
      }

      stderr += `\nSpawn error: ${error.message}`;
      resolve({
        stdout,
        stderr,
        status: 1,
        aborted: false,
      });
    });
  });
}

/**
 * Execute command hook and process result.
 * Returns structured result with outcome.
 */
export async function executeCommandHookWithResult(
  hook: CommandHook,
  eventType: HookEventType,
  hookName: string,
  inputJson: string,
  signal?: AbortSignal,
  hookIndex?: number,
  pluginRoot?: string
): Promise<{
  succeeded: boolean;
  output: string;
  command: string;
  aborted: boolean;
}> {
  const result = await executeCommandHook(
    hook,
    eventType,
    hookName,
    inputJson,
    signal,
    hookIndex,
    pluginRoot
  );

  return {
    succeeded: result.status === 0 && !result.aborted,
    output: result.stdout + (result.stderr ? `\n${result.stderr}` : ''),
    command: hook.command,
    aborted: result.aborted,
  };
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复导出。
