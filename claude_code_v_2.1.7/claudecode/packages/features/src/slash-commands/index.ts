/**
 * @claudecode/features - Slash Commands Module
 *
 * Slash command parsing, registration, and execution system.
 *
 * Key features:
 * - Command extraction from user input
 * - Built-in and custom command registration
 * - Type-based execution dispatch (local, local-jsx, prompt)
 * - Skill usage tracking
 *
 * Reconstructed from chunks.112.mjs, chunks.136.mjs, chunks.146.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Parser
// ============================================

export {
  extractCommandParts,
  isValidCommandName,
  isFilePath,
  commandExists,
  findCommand,
  classifyCommand,
  createUserMessage,
  createSystemMessage,
  createFormatError,
  createUnknownSkillError,
  formatCommandMetadata,
  formatSkillMetadata,
  formatStdout,
  formatStderr,
} from './parser.js';

// ============================================
// Registry
// ============================================

export {
  SlashCommandRegistry,
  getCommandRegistry,
  resetCommandRegistry,
  createBuiltinCommand,
  registerBuiltinCommands,
  lookupCommand,
  isBuiltinCommand,
} from './registry.js';

// ============================================
// Execution
// ============================================

export {
  trackSkillUsage,
  parseSlashCommandInput,
  executeSlashCommand,
  processPromptSlashCommand,
  executeForkedSlashCommand,
} from './execution.js';
