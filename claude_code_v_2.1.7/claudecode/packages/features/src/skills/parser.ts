/**
 * @claudecode/features - Skill Parser
 *
 * Parsing utilities for SKILL.md files.
 * Reconstructed from chunks.16.mjs, chunks.130.mjs
 */

import type { SkillFrontmatter, SkillDefinition } from './types.js';
import { SKILL_CONSTANTS } from './types.js';

// ============================================
// Frontmatter Parsing
// ============================================

/**
 * Parse YAML frontmatter from markdown content.
 * Original: NV (parseFrontmatter) in chunks.16.mjs:892-919
 *
 * Format:
 * ---
 * key: value
 * key2: value2
 * ---
 * content
 */
export function parseFrontmatter(content: string): {
  frontmatter: SkillFrontmatter;
  content: string;
} {
  const pattern = /^---\s*\n([\s\S]*?)---\s*\n?/;
  const match = content.match(pattern);

  if (!match) {
    return { frontmatter: {}, content };
  }

  const yamlContent = match[1] || '';
  const markdownContent = content.slice(match[0].length);
  const frontmatter: SkillFrontmatter = {};

  // Parse YAML line by line (simple parser)
  const lines = yamlContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    let value: string | string[] | boolean = trimmed.slice(colonIndex + 1).trim();

    // Handle quoted strings
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Handle arrays (simple format: ["a", "b"])
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value);
      } catch {
        // Keep as string if parse fails
      }
    }

    // Handle booleans
    if (value === 'true') value = true as any;
    if (value === 'false') value = false as any;

    (frontmatter as any)[key] = value;
  }

  return { frontmatter, content: markdownContent };
}

/**
 * Extract first heading from markdown content.
 * Original: Wx (extractFirstHeading) in chunks.130.mjs
 *
 * Used as fallback description if not specified in frontmatter.
 */
export function extractFirstHeading(content: string): string | null {
  // Match # Heading or ## Heading
  const match = content.match(/^#+\s+(.+?)$/m);
  const captured = match?.[1];
  return captured ? captured.trim() : null;
}

/**
 * Normalize frontmatter keys to camelCase.
 */
function normalizeFrontmatter(frontmatter: SkillFrontmatter): {
  name?: string;
  description?: string;
  version?: string;
  whenToUse?: string;
  argumentHint?: string;
  allowedTools?: string[];
  model?: string;
  disableModelInvocation: boolean;
} {
  return {
    name: frontmatter.name,
    description: frontmatter.description,
    version: frontmatter.version,
    whenToUse: frontmatter.when_to_use ?? frontmatter['when-to-use'],
    argumentHint: frontmatter.argument_hint ?? frontmatter['argument-hint'],
    allowedTools: normalizeAllowedTools(
      frontmatter.allowed_tools ?? frontmatter['allowed-tools']
    ),
    model: frontmatter.model,
    disableModelInvocation:
      frontmatter['disable-model-invocation'] ??
      frontmatter.disableModelInvocation ??
      false,
  };
}

/**
 * Normalize allowed tools to array.
 */
function normalizeAllowedTools(tools: string | string[] | undefined): string[] | undefined {
  if (!tools) return undefined;
  if (Array.isArray(tools)) return tools;
  if (tools === '*') return undefined; // All tools
  return [tools];
}

// ============================================
// Skill Parsing
// ============================================

/**
 * Parse SKILL.md file content into skill definition.
 * Original: Part of cO0 (loadSkillsFromDirectory) in chunks.130.mjs
 */
export function parseSkillFile(
  filePath: string,
  fileContent: string
): SkillDefinition | { error: string } {
  try {
    const { frontmatter, content } = parseFrontmatter(fileContent);
    const normalized = normalizeFrontmatter(frontmatter);

    // Determine name (from frontmatter or directory name)
    const name = normalized.name ?? extractNameFromPath(filePath);
    if (!name) {
      return { error: 'Skill name could not be determined' };
    }

    // Determine description (from frontmatter or first heading)
    const description =
      normalized.description ??
      extractFirstHeading(content) ??
      'No description';

    return {
      name,
      description,
      version: normalized.version,
      filePath,
      content,
      whenToUse: normalized.whenToUse,
      argumentHint: normalized.argumentHint,
      userInvocable: !normalized.disableModelInvocation || !!normalized.whenToUse,
      allowedTools: normalized.allowedTools,
      model: normalized.model,
      disableModelInvocation: normalized.disableModelInvocation,
    };
  } catch (error) {
    return {
      error: `Failed to parse skill file: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Extract skill name from file path.
 * E.g., /path/to/my-skill/SKILL.md -> my-skill
 */
function extractNameFromPath(filePath: string): string | null {
  const parts = filePath.split(/[/\\]/);
  const fileName = parts.pop();

  // If it's SKILL.md, use parent directory name
  if (fileName?.toLowerCase() === SKILL_CONSTANTS.SKILL_FILENAME.toLowerCase()) {
    return parts.pop() ?? null;
  }

  // Otherwise use file name without extension
  if (fileName) {
    return fileName.replace(/\.md$/i, '');
  }

  return null;
}

// ============================================
// Argument Injection
// ============================================

/**
 * Inject arguments into skill content.
 * Replaces $ARGUMENTS placeholder with actual arguments.
 */
export function injectArguments(content: string, args?: string): string {
  if (!args) {
    return content.replace(SKILL_CONSTANTS.ARGUMENTS_PLACEHOLDER, '');
  }
  return content.replace(SKILL_CONSTANTS.ARGUMENTS_PLACEHOLDER, args);
}

/**
 * Check if content has arguments placeholder.
 */
export function hasArgumentsPlaceholder(content: string): boolean {
  return content.includes(SKILL_CONSTANTS.ARGUMENTS_PLACEHOLDER);
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
