/**
 * @claudecode/features - Slash Command Registry
 *
 * Registry for managing slash commands.
 * Reconstructed from chunks.146.mjs
 */

import type { SlashCommand, CommandRegistry } from './types.js';
import { COMMAND_CONSTANTS } from './types.js';

// ============================================
// Command Registry Class
// ============================================

/**
 * Slash command registry.
 * Manages built-in and custom commands.
 */
export class SlashCommandRegistry implements CommandRegistry {
  private commands: Map<string, SlashCommand> = new Map();
  private builtinCommands: Set<string> = new Set();

  /**
   * Register a command.
   */
  register(command: SlashCommand): void {
    this.commands.set(command.name, command);
    if (command.loadedFrom === 'builtin') {
      this.builtinCommands.add(command.name);
    }
  }

  /**
   * Unregister a command.
   */
  unregister(name: string): boolean {
    this.builtinCommands.delete(name);
    return this.commands.delete(name);
  }

  /**
   * Get command by name.
   */
  get(name: string): SlashCommand | undefined {
    return this.commands.get(name);
  }

  /**
   * Check if command exists.
   */
  has(name: string): boolean {
    return this.commands.has(name);
  }

  /**
   * Get all commands.
   */
  getAll(): SlashCommand[] {
    return Array.from(this.commands.values());
  }

  /**
   * Get built-in commands.
   */
  getBuiltin(): SlashCommand[] {
    return this.getAll().filter((cmd) => this.builtinCommands.has(cmd.name));
  }

  /**
   * Get custom commands.
   */
  getCustom(): SlashCommand[] {
    return this.getAll().filter((cmd) => !this.builtinCommands.has(cmd.name));
  }

  /**
   * Get visible commands (not hidden).
   */
  getVisible(): SlashCommand[] {
    return this.getAll().filter((cmd) => !cmd.isHidden);
  }

  /**
   * Get enabled commands.
   */
  getEnabled(): SlashCommand[] {
    return this.getAll().filter((cmd) => cmd.isEnabled());
  }

  /**
   * Get command names.
   */
  getNames(): string[] {
    return Array.from(this.commands.keys());
  }

  /**
   * Get builtin command names as Set.
   * Original: xs() in chunks.146.mjs:2447
   */
  getBuiltinNameSet(): Set<string> {
    return new Set(this.builtinCommands);
  }

  /**
   * Clear all commands.
   */
  clear(): void {
    this.commands.clear();
    this.builtinCommands.clear();
  }

  /**
   * Get command count.
   */
  get size(): number {
    return this.commands.size;
  }
}

// ============================================
// Singleton Instance
// ============================================

let registryInstance: SlashCommandRegistry | null = null;

/**
 * Get singleton command registry.
 */
export function getCommandRegistry(): SlashCommandRegistry {
  if (!registryInstance) {
    registryInstance = new SlashCommandRegistry();
  }
  return registryInstance;
}

/**
 * Reset command registry (for testing).
 */
export function resetCommandRegistry(): void {
  if (registryInstance) {
    registryInstance.clear();
  }
  registryInstance = null;
}

// ============================================
// Built-in Command Registration
// ============================================

/**
 * Create a built-in command template.
 * Helper for creating consistent command objects.
 */
export function createBuiltinCommand<T extends SlashCommand>(
  config: Omit<T, 'loadedFrom' | 'userFacingName'> & {
    userFacingName?: () => string;
  }
): T {
  return {
    ...config,
    loadedFrom: 'builtin',
    userFacingName: config.userFacingName ?? (() => config.name),
  } as T;
}

/**
 * Register all built-in commands.
 * Original: nY9() in chunks.146.mjs:2447
 */
export function registerBuiltinCommands(commands: SlashCommand[]): void {
  const registry = getCommandRegistry();
  for (const command of commands) {
    registry.register({
      ...command,
      loadedFrom: 'builtin',
    });
  }
}

// ============================================
// Command Lookup Utilities
// ============================================

/**
 * Find command by name with alias resolution.
 * Uses the singleton registry.
 */
export function lookupCommand(commandName: string): SlashCommand | undefined {
  const registry = getCommandRegistry();
  const commands = registry.getAll();

  return commands.find(
    (cmd) =>
      cmd.name === commandName ||
      cmd.userFacingName() === commandName ||
      cmd.aliases?.includes(commandName)
  );
}

/**
 * Check if command name is a built-in command.
 */
export function isBuiltinCommand(commandName: string): boolean {
  return COMMAND_CONSTANTS.BUILTIN_COMMANDS.includes(
    commandName as (typeof COMMAND_CONSTANTS.BUILTIN_COMMANDS)[number]
  );
}

// ============================================
// Export
// ============================================

export {
  SlashCommandRegistry,
  getCommandRegistry,
  resetCommandRegistry,
  createBuiltinCommand,
  registerBuiltinCommands,
  lookupCommand,
  isBuiltinCommand,
};
