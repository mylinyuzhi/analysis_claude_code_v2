/**
 * @claudecode/features - Slash Command Execution
 *
 * Command execution and dispatch system.
 * Reconstructed from chunks.112.mjs
 */

import type {
  SlashCommand,
  LocalCommand,
  LocalJSXCommand,
  PromptCommand,
  CommandExecutionResult,
  CommandExecutionContext,
  CommandDisplayOptions,
  CommandMessage,
  CommandContent,
} from './types.js';
import { COMMAND_CONSTANTS } from './types.js';
import {
  extractCommandParts,
  isValidCommandName,
  isFilePath,
  commandExists,
  findCommand,
  classifyCommand,
  createUserMessage,
  createFormatError,
  createUnknownSkillError,
  formatCommandMetadata,
  formatSkillMetadata,
  formatStdout,
  formatStderr,
} from './parser.js';
import { getCommandRegistry } from './registry.js';

// ============================================
// Skill Usage Tracking
// ============================================

/**
 * Skill usage state type.
 */
interface SkillUsage {
  usageCount: number;
  lastUsedAt: number;
}

/**
 * Track skill usage for analytics.
 * Original: MD1 (trackSkillUsage) in chunks.112.mjs:2362-2376
 */
export function trackSkillUsage(
  skillName: string,
  getState: () => { skillUsage?: Record<string, SkillUsage> },
  setState: (updater: (state: unknown) => unknown) => void
): void {
  const existingUsage = getState().skillUsage?.[skillName];
  const currentTime = Date.now();
  const newCount = (existingUsage?.usageCount ?? 0) + 1;

  // Update state if changed
  if (
    !existingUsage ||
    existingUsage.usageCount !== newCount ||
    existingUsage.lastUsedAt !== currentTime
  ) {
    setState((state: unknown) => {
      const s: Record<string, unknown> =
        state && typeof state === 'object' ? (state as Record<string, unknown>) : {};

      const prevSkillUsage: Record<string, SkillUsage> =
        s.skillUsage && typeof s.skillUsage === 'object'
          ? (s.skillUsage as Record<string, SkillUsage>)
          : {};

      return {
        ...s,
        skillUsage: {
          ...prevSkillUsage,
          [skillName]: {
            usageCount: newCount,
            lastUsedAt: currentTime,
          },
        },
      };
    });
  }
}

// ============================================
// Main Entry Point
// ============================================

/**
 * Parse and execute slash command input.
 * Original: OP2 (parseSlashCommandInput) in chunks.112.mjs:2482-2570
 */
export async function parseSlashCommandInput(
  input: string,
  context: CommandExecutionContext,
  options?: {
    setProcessing?: (processing: boolean) => void;
    setCommandJSX?: (jsx: { jsx: JSX.Element | null; shouldHidePromptInput: boolean }) => void;
    telemetry?: (event: string) => void;
  }
): Promise<CommandExecutionResult> {
  // Step 1: Extract command parts
  const parsed = extractCommandParts(input);
  if (!parsed) {
    options?.telemetry?.('tengu_input_slash_missing');
    return createFormatError();
  }

  const { commandName, args, isMcp } = parsed;

  // Step 2: Classify command type
  const builtinSet = getCommandRegistry().getBuiltinNameSet();
  const commandType = classifyCommand(commandName, isMcp, builtinSet);

  // Step 3: Check if command exists
  if (!commandExists(commandName, context.options.commands)) {
    // Check if it's actually a file path
    const isFile = isFilePath(`/${commandName}`);

    if (isValidCommandName(commandName) && !isFile) {
      // Unknown skill error
      options?.telemetry?.('tengu_input_slash_invalid');
      return createUnknownSkillError(commandName);
    }

    // Treat as regular user prompt (file path or invalid name)
    options?.telemetry?.('tengu_input_prompt');
    return {
      messages: [createUserMessage({ content: input })],
      shouldQuery: true,
    };
  }

  // Step 4: Execute the command
  options?.setProcessing?.(true);
  options?.telemetry?.('tengu_input_command');

  return executeSlashCommand(commandName, args, context, options?.setCommandJSX);
}

// ============================================
// Command Execution Dispatcher
// ============================================

/**
 * Execute a slash command.
 * Original: ab5 (executeSlashCommand) in chunks.112.mjs:2597-2747
 */
export async function executeSlashCommand(
  commandName: string,
  args: string,
  context: CommandExecutionContext,
  setCommandJSX?: (jsx: { jsx: JSX.Element | null; shouldHidePromptInput: boolean }) => void
): Promise<CommandExecutionResult> {
  // 1. Lookup command definition
  const command = findCommand(commandName, context.options.commands);

  // 2. Block non-user-invocable skills
  if (command.userInvocable === false) {
    return {
      messages: [
        createUserMessage({ content: `/${commandName}` }),
        createUserMessage({
          content: `This skill can only be invoked by Claude, not directly by users. Ask Claude to use the "${commandName}" skill for you.`,
        }),
      ],
      shouldQuery: false,
      command,
    };
  }

  // 3. Route by command type
  try {
    switch (command.type) {
      case 'local-jsx':
        return handleLocalJSXCommand(command as LocalJSXCommand, args, context, setCommandJSX);

      case 'local':
        return handleLocalCommand(command as LocalCommand, args, context);

      case 'prompt':
        return handlePromptCommand(command as PromptCommand, args, context);

      default:
        throw new Error(`Unknown command type: ${(command as SlashCommand).type}`);
    }
  } catch (error) {
    return handleCommandError(error, command, args);
  }
}

// ============================================
// Type-Specific Handlers
// ============================================

/**
 * Handle local-jsx command (interactive UI).
 * From ab5, chunks.112.mjs:2614-2655
 */
async function handleLocalJSXCommand(
  command: LocalJSXCommand,
  args: string,
  context: CommandExecutionContext,
  setCommandJSX?: (jsx: { jsx: JSX.Element | null; shouldHidePromptInput: boolean }) => void
): Promise<CommandExecutionResult> {
  return new Promise((resolve) => {
    const onComplete = (output: string, displayOptions?: CommandDisplayOptions) => {
      if (displayOptions?.display === 'skip') {
        resolve({ messages: [], shouldQuery: false, command });
        return;
      }

      const metadata = formatCommandMetadata(command, args);

      // Build messages based on display option
      const messages: CommandMessage[] =
        displayOptions?.display === 'system'
          ? [
              { role: 'system', content: metadata },
              { role: 'system', content: output },
            ]
          : [createUserMessage({ content: metadata }), createUserMessage({ content: output })];

      resolve({
        messages,
        shouldQuery: displayOptions?.shouldQuery ?? false,
        command,
      });
    };

    command.call(onComplete, context, args).then((jsxElement) => {
      // Non-interactive: skip rendering
      if (context.options.isNonInteractiveSession) {
        resolve({ messages: [], shouldQuery: false, command });
        return;
      }

      // Render JSX component
      setCommandJSX?.({ jsx: jsxElement, shouldHidePromptInput: true });
    });
  });
}

/**
 * Handle local command (text output).
 * From ab5, chunks.112.mjs:2656-2701
 */
async function handleLocalCommand(
  command: LocalCommand,
  args: string,
  context: CommandExecutionContext
): Promise<CommandExecutionResult> {
  const userMsg = createUserMessage({ content: formatCommandMetadata(command, args) });

  try {
    const result = await command.call(args, context);

    if (result.type === 'skip') {
      return { messages: [], shouldQuery: false, command };
    }

    if (result.type === 'compact') {
      // Handle compaction result
      return {
        messages: [
          userMsg,
          createUserMessage({
            content: `Conversation compacted. Kept ${result.compactionResult.messagesToKeep} messages. Summary: ${result.compactionResult.summary}`,
          }),
        ],
        shouldQuery: false,
        command,
      };
    }

    // Normal text result
    return {
      messages: [userMsg, createUserMessage({ content: formatStdout(result.value) })],
      shouldQuery: false,
      command,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      messages: [userMsg, createUserMessage({ content: formatStderr(errorMessage) })],
      shouldQuery: false,
      command,
    };
  }
}

/**
 * Handle prompt command (LLM invocation).
 * From ab5, chunks.112.mjs:2703-2732
 */
async function handlePromptCommand(
  command: PromptCommand,
  args: string,
  context: CommandExecutionContext
): Promise<CommandExecutionResult> {
  // Fork context: Execute in separate agent
  if (command.context === 'fork') {
    return executeForkedSlashCommand(command, args, context);
  }

  // Normal: Process in main thread
  return processPromptSlashCommand(command, args, context);
}

// ============================================
// Prompt Command Processing
// ============================================

/**
 * Process prompt-type slash command.
 * Original: RP2 (processPromptSlashCommand) in chunks.112.mjs:2778-2818
 */
export async function processPromptSlashCommand(
  command: PromptCommand,
  args: string,
  context: CommandExecutionContext
): Promise<CommandExecutionResult> {
  // Some prompt commands are explicitly disabled for non-interactive sessions.
  // Source uses `disableNonInteractive`; we map it via `supportsNonInteractive: false`.
  if (context.options.isNonInteractiveSession && command.supportsNonInteractive === false) {
    return { messages: [], shouldQuery: false, command };
  }

  // 1. Get the prompt content from command
  const promptContent = await command.getPromptForCommand(args, context);

  // 2. Format metadata string for display
  const metadataString = formatSkillMetadata(command, args);

  // 3. Parse allowed tools from command
  const allowedTools = command.allowedTools ?? [];

  // 4. Build message array
  const messages: CommandMessage[] = [
    createUserMessage({ content: metadataString }),
    createUserMessage({ content: promptContent as unknown as any, isMeta: true }),
  ];

  return {
    messages,
    shouldQuery: true,
    allowedTools,
    model: command.model,
    command,
  };
}

/**
 * Execute forked slash command in separate agent.
 * Original: ib5 (executeForkedSlashCommand)
 */
export async function executeForkedSlashCommand(
  command: PromptCommand,
  args: string,
  context: CommandExecutionContext
): Promise<CommandExecutionResult> {
  if (context.options.isNonInteractiveSession && command.supportsNonInteractive === false) {
    return { messages: [], shouldQuery: false, command };
  }

  // Get prompt content
  const promptContent = await command.getPromptForCommand(args, context);

  // Format metadata
  const metadataString = formatSkillMetadata(command, args);

  // Build messages for forked execution
  const messages: CommandMessage[] = [
    createUserMessage({ content: metadataString }),
    createUserMessage({ content: promptContent as unknown as any, isMeta: true }),
  ];

  return {
    messages,
    shouldQuery: true,
    allowedTools: command.allowedTools,
    model: command.model,
    command,
  };
}

// ============================================
// Error Handling
// ============================================

/**
 * Handle command execution error.
 */
function handleCommandError(
  error: unknown,
  command: SlashCommand,
  args: string
): CommandExecutionResult {
  const userMsg = createUserMessage({ content: formatCommandMetadata(command, args) });

  // Check for abort error
  if (error instanceof Error && error.name === 'AbortError') {
    return {
      messages: [userMsg, createUserMessage({ content: 'Command was aborted' })],
      shouldQuery: false,
      command,
    };
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  return {
    messages: [userMsg, createUserMessage({ content: formatStderr(errorMessage) })],
    shouldQuery: false,
    command,
  };
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
