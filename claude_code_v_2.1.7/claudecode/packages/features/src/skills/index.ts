/**
 * @claudecode/features - Skills Module
 *
 * Skill loading, parsing, and execution system.
 *
 * Key features:
 * - SKILL.md file parsing with YAML frontmatter
 * - Skill discovery from project and user directories
 * - Plugin skill integration
 * - LLM and user invocable skill support
 * - Argument injection via $ARGUMENTS placeholder
 * - Multi-source loading with deduplication
 *
 * Architecture:
 * - types.ts: Type definitions
 * - parser.ts: SKILL.md file parsing
 * - registry.ts: Skill registry management
 * - loader.ts: Multi-source skill loading pipeline
 *
 * Reconstructed from chunks.130.mjs, chunks.133.mjs, chunks.146.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Parser
// ============================================

export {
  parseFrontmatter,
  extractFirstHeading,
  parseSkillFile,
  injectArguments,
  hasArgumentsPlaceholder,
} from './parser.js';

// ============================================
// Registry
// ============================================

export {
  SkillRegistry,
  loadSkillsFromDirectory,
  discoverSkills,
  toRegisteredSkill,
  getSkillRegistry,
  resetSkillRegistry,
  initializeSkills,
} from './registry.js';

// ============================================
// Loader
// ============================================

export {
  // Types
  type DirectoryCommandSource,
  type LoadedSkillEntry,
  type PluginWithSkills,
  type SkillLoadContext,
  type SkillLoadResult,

  // Directory utilities
  getUserSkillsDir,
  getManagedSkillsDir,
  getProjectSkillDirs,

  // Scanning
  scanSkillDirectory,
  loadSkillsFromPath,

  // Loading
  loadSkillDirectoryCommands,
  getPluginSkills,

  // Bundled skills
  registerBundledSkill,
  getBundledSkills,
  clearBundledSkills,

  // Main orchestrator
  getSkills,
  getSkillsCached,
  clearSkillCaches,

  // Aggregation & filtering (source-aligned)
  type GetAllCommandsContext,
  getAllCommands,
  getLLMInvocableSkills,
  getUserSkills,
  clearAllCommandCaches,
} from './loader.js';
