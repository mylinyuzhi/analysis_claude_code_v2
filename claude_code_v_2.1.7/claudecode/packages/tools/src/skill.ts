/**
 * @claudecode/tools - Skill Tool
 *
 * Execute a skill within the main conversation.
 * Skills provide specialized capabilities and domain knowledge.
 *
 * Reconstructed from chunks.113.mjs:408-753+
 *
 * Key symbols:
 * - MP2 → executeSkillFromTool
 * - RP2 → processPromptSlashCommand
 * - OD1 → registerSkillHooks
 * - ob5 → formatSkillMetadata
 * - eS → findCommand
 * - Cc → commandExists
 */

import { z } from 'zod';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, basename, dirname } from 'path';
import {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  toolSuccess,
  toolError,
} from './base.js';
import type { SkillInput, SkillOutput, ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';

// ============================================
// Constants
// ============================================

const MAX_RESULT_SIZE = 30000;

// ============================================
// Skill Types
// ============================================

/**
 * Skill definition interface.
 */
interface SkillDefinition {
  name: string;
  type: 'prompt' | 'action' | 'fork';
  description?: string;
  progressMessage?: string;
  allowedTools?: string[];
  model?: string;
  userInvocable?: boolean;
  content: string;
  filePath: string;
  hooks?: Record<string, unknown>;
}

/**
 * Skill registry - loaded skills cached here.
 */
const skillRegistry = new Map<string, SkillDefinition>();

/**
 * Running skills to prevent concurrent invocation.
 */
const runningSkills = new Set<string>();

// ============================================
// Skill Loading
// ============================================

/**
 * Discover skill directories.
 */
function getSkillDirectories(): string[] {
  const dirs: string[] = [];

  // User skills directory
  const userSkillsDir = join(process.env.HOME || '', '.claude', 'skills');
  if (existsSync(userSkillsDir)) {
    dirs.push(userSkillsDir);
  }

  // Project skills directory
  const cwd = process.cwd();
  const projectSkillsDir = join(cwd, '.claude', 'skills');
  if (existsSync(projectSkillsDir)) {
    dirs.push(projectSkillsDir);
  }

  return dirs;
}

/**
 * Parse SKILL.md frontmatter.
 * Original: chunks.152.mjs - Skill frontmatter parser
 */
function parseSkillFrontmatter(content: string): Partial<SkillDefinition> {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return {};
  }

  const frontmatter = frontmatterMatch[1];
  if (frontmatter === undefined) {
    return {};
  }
  const result: Partial<SkillDefinition> = {};

  // Parse key: value pairs
  const lines = frontmatter.split('\n');
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      const key = match[1];
      const value = match[2];
      if (!key || value === undefined) {
        continue;
      }
      switch (key) {
        case 'name':
          result.name = value.trim();
          break;
        case 'type':
          result.type = value.trim() as 'prompt' | 'action' | 'fork';
          break;
        case 'description':
          result.description = value.trim();
          break;
        case 'progressMessage':
          result.progressMessage = value.trim();
          break;
        case 'model':
          result.model = value.trim();
          break;
        case 'allowedTools':
          result.allowedTools = value.split(',').map((s) => s.trim());
          break;
        case 'userInvocable':
          result.userInvocable = value.trim() !== 'false';
          break;
      }
    }
  }

  return result;
}

/**
 * Load a skill from a SKILL.md file.
 */
function loadSkillFromFile(filePath: string): SkillDefinition | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const frontmatter = parseSkillFrontmatter(content);

    // Extract skill name from filename or frontmatter
    const name = frontmatter.name || basename(dirname(filePath));

    // Extract content after frontmatter
    const contentMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    const afterFrontmatter = contentMatch?.[1];
    const skillContent = (afterFrontmatter ?? content).trim();

    return {
      name,
      type: frontmatter.type || 'prompt',
      description: frontmatter.description,
      progressMessage: frontmatter.progressMessage,
      allowedTools: frontmatter.allowedTools,
      model: frontmatter.model,
      userInvocable: frontmatter.userInvocable ?? true,
      content: skillContent,
      filePath,
    };
  } catch (error) {
    console.debug(`Failed to load skill from ${filePath}:`, error);
    return null;
  }
}

/**
 * Discover and load all skills.
 */
function discoverSkills(): void {
  const dirs = getSkillDirectories();

  for (const dir of dirs) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skillPath = join(dir, entry.name, 'SKILL.md');
          if (existsSync(skillPath)) {
            const skill = loadSkillFromFile(skillPath);
            if (skill) {
              skillRegistry.set(skill.name, skill);
            }
          }
        }
      }
    } catch {
      // Directory may not be readable
    }
  }
}

/**
 * Get a skill by name.
 */
function getSkill(name: string): SkillDefinition | undefined {
  // Lazy load skills
  if (skillRegistry.size === 0) {
    discoverSkills();
  }

  return skillRegistry.get(name);
}

/**
 * Check if a skill exists.
 * Original: Cc (commandExists) in chunks.112.mjs
 */
function skillExists(name: string): boolean {
  return getSkill(name) !== undefined;
}

/**
 * Get all available skill names.
 */
function getAvailableSkills(): string[] {
  if (skillRegistry.size === 0) {
    discoverSkills();
  }
  return Array.from(skillRegistry.keys());
}

// ============================================
// Skill Execution
// ============================================

/**
 * Format skill metadata for display.
 * Original: ob5 (formatSkillMetadata) in chunks.112.mjs
 */
function formatSkillMetadata(skill: SkillDefinition, args: string): string {
  return `<command-name>/${skill.name}</command-name>
${args ? `<command-args>${args}</command-args>` : ''}
${skill.progressMessage ? `<progress-message>${skill.progressMessage}</progress-message>` : ''}`;
}

/**
 * Execute a skill from the Skill tool.
 * Original: MP2 (executeSkillFromTool) in chunks.112.mjs
 */
async function executeSkillFromTool(
  skillName: string,
  args: string | undefined,
  _context: ToolContext
): Promise<{
  success: boolean;
  result?: string;
  error?: string;
  metadata?: string;
}> {
  // Find the skill
  const skill = getSkill(skillName);
  if (!skill) {
    return {
      success: false,
      error: `Unknown skill: ${skillName}. Available skills: ${getAvailableSkills().join(', ') || 'none'}`,
    };
  }

  // Check if skill is already running
  if (runningSkills.has(skillName)) {
    return {
      success: false,
      error: `Skill "${skillName}" is already running. Wait for it to complete.`,
    };
  }

  // Must be prompt type for tool invocation
  if (skill.type !== 'prompt') {
    return {
      success: false,
      error: `Skill "${skillName}" is type "${skill.type}". Only prompt-type skills can be invoked via the Skill tool. Use /${skillName} directly.`,
    };
  }

  try {
    runningSkills.add(skillName);

    // Format metadata for the transcript
    const metadata = formatSkillMetadata(skill, args || '');

    // Build the prompt content
    let promptContent = skill.content;

    // Replace {{args}} placeholder if present
    if (args) {
      promptContent = promptContent.replace(/\{\{args\}\}/g, args);
    }

    // In a full implementation, this would:
    // 1. Register skill hooks via registerSkillHooks (OD1)
    // 2. Build message array via processPromptSlashCommand (RP2)
    // 3. Return messages for the LLM to process

    // For now, return the skill content as the result
    return {
      success: true,
      result: `<skill-instructions>
${promptContent}
</skill-instructions>

The skill "${skill.name}" has been loaded. Follow the instructions above.`,
      metadata,
    };
  } finally {
    runningSkills.delete(skillName);
  }
}

// ============================================
// Input/Output Schemas
// ============================================

/**
 * Skill tool input schema.
 * Original: Hf5 in chunks.113.mjs
 */
const skillInputSchema = z.object({
  skill: z.string().describe('The skill name. E.g., "commit", "review-pr", or "pdf"'),
  args: z.string().optional().describe('Optional arguments for the skill'),
});

/**
 * Skill tool output schema.
 */
const skillOutputSchema = z.object({
  skillName: z.string(),
  executed: z.boolean(),
  result: z.string().optional(),
  error: z.string().optional(),
});

// ============================================
// Skill Tool
// ============================================

/**
 * Skill tool implementation.
 * Original: Skill tool in chunks.113.mjs:408-753+
 */
export const SkillTool = createTool<SkillInput, SkillOutput>({
  name: TOOL_NAMES.SKILL,
  maxResultSizeChars: MAX_RESULT_SIZE,

  async description() {
    return `Execute a skill within the main conversation

When users ask you to perform tasks, check if any of the available skills can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

When users ask you to run a "slash command" or reference "/<something>" (e.g., "/commit", "/review-pr"), they are referring to a skill. Use this tool to invoke the corresponding skill.

Example:
  User: "run /commit"
  Assistant: [Calls Skill tool with skill: "commit"]`;
  },

  async prompt() {
    return `How to invoke:
- Use this tool with the skill name and optional arguments
- Examples:
  - skill: "pdf" - invoke the pdf skill
  - skill: "commit", args: "-m 'Fix bug'" - invoke with arguments
  - skill: "review-pr", args: "123" - invoke with arguments

Important:
- When a skill is relevant, you must invoke this tool IMMEDIATELY
- Only use skills listed in "Available skills"
- Do not invoke a skill that is already running
- Do not use this tool for built-in CLI commands (like /help, /clear, etc.)`;
  },

  inputSchema: skillInputSchema,
  outputSchema: skillOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe() {
    return false; // Skills may modify state
  },

  isReadOnly() {
    return false; // Skills can perform actions
  },

  async checkPermissions(input) {
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    // Skill format not empty (errorCode: 1)
    if (!input.skill || input.skill.trim() === '') {
      return validationError('Skill name cannot be empty', 1);
    }

    // Normalize skill name (remove leading slash if present)
    const skillName = input.skill.replace(/^\//, '');

    // Check skill exists (errorCode: 2)
    if (!skillExists(skillName)) {
      const available = getAvailableSkills();
      return validationError(
        `Unknown skill: "${skillName}". ${available.length > 0 ? `Available skills: ${available.join(', ')}` : 'No skills available.'}`,
        2
      );
    }

    // Check skill is not already running (errorCode: 4)
    if (runningSkills.has(skillName)) {
      return validationError(`Skill "${skillName}" is already running`, 4);
    }

    // Check skill is prompt type (errorCode: 5)
    const skill = getSkill(skillName);
    if (skill && skill.type !== 'prompt') {
      return validationError(
        `Skill "${skillName}" is type "${skill.type}". Only prompt-type skills can be invoked via the Skill tool.`,
        5
      );
    }

    return validationSuccess();
  },

  async call(input, context) {
    const { skill, args } = input;

    // Normalize skill name
    const skillName = skill.replace(/^\//, '');

    try {
      // Execute the skill
      const execResult = await executeSkillFromTool(skillName, args, context);

      if (!execResult.success) {
        const errorResult: SkillOutput = {
          skillName,
          executed: false,
          error: execResult.error,
        };
        return toolError(execResult.error || 'Skill execution failed', undefined, errorResult);
      }

      // Return successful result
      const result: SkillOutput = {
        skillName,
        executed: true,
        result: execResult.result,
      };

      return toolSuccess(result);
    } catch (error) {
      const errorResult: SkillOutput = {
        skillName,
        executed: false,
        error: (error as Error).message,
      };
      return toolError(`Failed to execute skill: ${(error as Error).message}`, undefined, errorResult);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    if (result.error) {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: `Skill error: ${result.error}`,
        is_error: true,
      };
    }

    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: result.result || `Skill "${result.skillName}" executed successfully.`,
    };
  },
});

// ============================================
// Export
// ============================================

export {
  // Helper functions for skill management
  getSkill,
  skillExists,
  getAvailableSkills,
  discoverSkills,
  runningSkills,
};
