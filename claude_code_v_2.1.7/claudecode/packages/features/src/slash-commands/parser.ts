/**
 * @claudecode/features - Slash Command Parser
 *
 * Parsing utilities for slash commands.
 * Reconstructed from chunks.112.mjs
 */

import { existsSync } from 'fs';
import type {
  ExtractedCommand,
  SlashCommand,
  CommandExecutionResult,
  CommandMessage,
} from './types.js';
import { COMMAND_CONSTANTS } from './types.js';

// ============================================
// Command Extraction
// ============================================

/**
 * Extract command parts from user input.
 * Original: wP2 (extractCommandParts) in chunks.112.mjs:2323-2337
 */
export function extractCommandParts(input: string): ExtractedCommand | null {
  const trimmedInput = input.trim();

  // Must start with "/" to be a slash command
  if (!trimmedInput.startsWith('/')) {
    return null;
  }

  // Split by space, skip the leading "/"
  const tokens = trimmedInput.slice(1).split(' ');

  // Command name is required
  if (!tokens[0]) {
    return null;
  }

  let commandName = tokens[0];
  let isMcp = false;
  let argsStartIndex = 1;

  // Detect MCP marker: "/toolname (MCP) args..."
  if (tokens.length > 1 && tokens[1] === COMMAND_CONSTANTS.MCP_MARKER) {
    commandName = commandName + ' ' + COMMAND_CONSTANTS.MCP_MARKER;
    isMcp = true;
    argsStartIndex = 2; // Skip "(MCP)" token
  }

  // Join remaining tokens as args
  const args = tokens.slice(argsStartIndex).join(' ');

  return {
    commandName,
    args,
    isMcp,
  };
}

// ============================================
// Command Validation
// ============================================

/**
 * Validate command name format.
 * Original: nb5 (isValidCommandName) in chunks.112.mjs:2478-2479
 */
export function isValidCommandName(commandName: string): boolean {
  return !/[^a-zA-Z0-9:\-_]/.test(commandName);
}

/**
 * Check if input appears to be a file path.
 * Used as fallback to avoid treating file paths as commands.
 */
export function isFilePath(input: string): boolean {
  // Check if it looks like an absolute path that exists
  return input.startsWith('/') && existsSync(input);
}

// ============================================
// Command Lookup
// ============================================

/**
 * Check if a command exists in the registry.
 * Original: Cc (commandExists) in chunks.146.mjs:2324-2326
 *
 * @param commandName - Name to look up
 * @param commands - Command list to search
 * @returns True if command exists
 */
export function commandExists(commandName: string, commands: SlashCommand[]): boolean {
  return commands.some(
    (cmd) =>
      cmd.name === commandName ||
      cmd.userFacingName() === commandName ||
      cmd.aliases?.includes(commandName)
  );
}

/**
 * Find a command by name with alias resolution.
 * Original: eS (findCommand) in chunks.146.mjs:2328-2332
 *
 * @param commandName - Name or alias to look up
 * @param commands - Command list to search
 * @returns Command object
 * @throws ReferenceError if command not found
 */
export function findCommand(commandName: string, commands: SlashCommand[]): SlashCommand {
  const command = commands.find(
    (cmd) =>
      cmd.name === commandName ||
      cmd.userFacingName() === commandName ||
      cmd.aliases?.includes(commandName)
  );

  if (!command) {
    // Build helpful error message listing all available commands
    const availableCommands = commands
      .map((cmd) => {
        const name = cmd.userFacingName();
        return cmd.aliases ? `${name} (aliases: ${cmd.aliases.join(', ')})` : name;
      })
      .sort()
      .join(', ');

    throw new ReferenceError(
      `Command ${commandName} not found. Available commands: ${availableCommands}`
    );
  }

  return command;
}

// ============================================
// Command Classification
// ============================================

/**
 * Classify command type.
 * Original: Part of OP2 in chunks.112.mjs:2502
 *
 * @param commandName - Command name
 * @param isMcp - Whether MCP marker was present
 * @param builtinSet - Set of built-in command names
 * @returns Classification type
 */
export function classifyCommand(
  commandName: string,
  isMcp: boolean,
  builtinSet: Set<string>
): 'mcp' | 'custom' | string {
  if (isMcp) {
    return 'mcp';
  }
  if (!builtinSet.has(commandName)) {
    return 'custom';
  }
  return commandName;
}

// ============================================
// Message Creation
// ============================================

/**
 * Create a user message object.
 * Original: H0 (createUserMessage)
 */
export function createUserMessage(options: {
  content: string | unknown[];
  isMeta?: boolean;
  uuid?: string;
}): CommandMessage {
  return {
    role: 'user',
    content: options.content as any,
    isMeta: options.isMeta,
    uuid: options.uuid,
  };
}

/**
 * Create a system message object.
 */
export function createSystemMessage(content: string): CommandMessage {
  return {
    role: 'system',
    content,
  };
}

/**
 * Create an error result for invalid command format.
 */
export function createFormatError(): CommandExecutionResult {
  return {
    messages: [createUserMessage({ content: 'Commands are in the form `/command [args]`' })],
    shouldQuery: false,
  };
}

/**
 * Create an error result for unknown skill.
 */
export function createUnknownSkillError(commandName: string): CommandExecutionResult {
  return {
    messages: [createUserMessage({ content: `Unknown skill: ${commandName}` })],
    shouldQuery: false,
  };
}

// ============================================
// Metadata Formatting
// ============================================

/**
 * Format command metadata for display.
 * Original: ckA (formatCommandMetadata) in chunks.112.mjs:2749-2752
 */
export function formatCommandMetadata(command: SlashCommand, args: string): string {
  const name = command.userFacingName();
  return `<${COMMAND_CONSTANTS.COMMAND_NAME_TAG}>/${name}</${COMMAND_CONSTANTS.COMMAND_NAME_TAG}>
            <${COMMAND_CONSTANTS.COMMAND_MESSAGE_TAG}>${name}</${COMMAND_CONSTANTS.COMMAND_MESSAGE_TAG}>
            <${COMMAND_CONSTANTS.COMMAND_ARGS_TAG}>${args}</${COMMAND_CONSTANTS.COMMAND_ARGS_TAG}>`;
}

/**
 * Format skill metadata string.
 * Original: ob5 (formatSkillMetadata) in chunks.112.mjs:2765-2768
 */
export function formatSkillMetadata(
  command: SlashCommand,
  args: string
): string {
  if (command.userInvocable !== false) return formatUserInvocableMetadata(command.userFacingName(), args);
  if (command.loadedFrom === 'skills' || command.loadedFrom === 'plugin') return formatSkillFormatMetadata(command.userFacingName(), command.progressMessage);
  return formatUserInvocableMetadata(command.userFacingName(), args);
}

/**
 * Format user-invocable command metadata.
 * Original: LP2 in chunks.112.mjs:2760-2763
 */
function formatUserInvocableMetadata(name: string, args: string): string {
  return `<${COMMAND_CONSTANTS.COMMAND_NAME_TAG}>/${name}</${COMMAND_CONSTANTS.COMMAND_NAME_TAG}>
<${COMMAND_CONSTANTS.COMMAND_ARGS_TAG}>${args}</${COMMAND_CONSTANTS.COMMAND_ARGS_TAG}>`;
}

/**
 * Format model-only skill metadata.
 * Original: xz0 in chunks.112.mjs:2755-2758
 */
function formatSkillFormatMetadata(name: string, progressMessage: string = 'loading'): string {
  return `<skill-format>true</skill-format>
<skill-name>${name}</skill-name>
${progressMessage ? `<skill-progress>${progressMessage}</skill-progress>` : ''}`;
}

// ============================================
// Output Formatting
// ============================================

/**
 * Format stdout output.
 */
export function formatStdout(output: string): string {
  return `<${COMMAND_CONSTANTS.STDOUT_TAG}>${output}</${COMMAND_CONSTANTS.STDOUT_TAG}>`;
}

/**
 * Format stderr output.
 */
export function formatStderr(error: string): string {
  return `<${COMMAND_CONSTANTS.STDERR_TAG}>${error}</${COMMAND_CONSTANTS.STDERR_TAG}>`;
}
