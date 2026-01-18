/**
 * @claudecode/integrations - Chrome Module
 *
 * Chrome browser automation integration.
 *
 * Key features:
 * - Socket-based communication with Chrome extension
 * - 18 MCP tools for browser automation
 * - Tab management, page interaction, content capture
 * - GIF recording support
 *
 * Reconstructed from chunks.145.mjs, chunks.149.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Socket Client
// ============================================

export {
  encodeMessage,
  decodeMessage,
  ChromeSocketClient,
  getSocketPath,
  createSocketClient,
} from './socket-client.js';

// ============================================
// Tools
// ============================================

export {
  CHROME_TOOL_DEFINITIONS,
  getChromeTool,
  getChromeToolNames,
  isValidChromeTool,
  getMcpToolName,
  extractChromeToolName,
} from './tools.js';

// ============================================
// Skill Registration
// ============================================

import type { ChromeSkillConfig } from './types.js';
import { CHROME_CONSTANTS, CHROME_MCP_TOOLS } from './types.js';

/**
 * Chrome skill configuration.
 * Original: TI9 (registerClaudeInChromeSkill) in chunks.149.mjs
 */
export const CHROME_SKILL_CONFIG: ChromeSkillConfig = {
  name: 'claude-in-chrome',
  description: 'Automates your Chrome browser to interact with web pages - clicking elements, filling forms, capturing screenshots, reading console logs, and navigating sites. Opens pages in new tabs within your existing Chrome session. Requires site-level permissions before executing (configured in the extension).',
  whenToUse: 'When the user wants to interact with web pages, automate browser tasks, capture screenshots, read console logs, or perform any browser-based actions. Always invoke BEFORE attempting to use any mcp__claude-in-chrome__* tools.',
  allowedTools: CHROME_MCP_TOOLS,
  userInvocable: true,
};

/**
 * Chrome skill prompt.
 * Original: Fq7 in chunks.149.mjs
 */
export const CHROME_SKILL_PROMPT = `
Now that this skill is invoked, you have access to Chrome browser automation tools. You can now use the mcp__claude-in-chrome__* tools to interact with web pages.

IMPORTANT: Start by calling mcp__claude-in-chrome__tabs_context_mcp to get information about the user's current browser tabs.
`;

/**
 * Check if Chrome integration is available.
 * Original: I$A (isClaudeInChromeEnabled)
 */
export function isChromeIntegrationAvailable(): boolean {
  // Check if socket path exists
  const socketPath = getSocketPath();
  try {
    const fs = require('fs');
    return fs.existsSync(socketPath);
  } catch {
    return false;
  }
}

// Re-export socket path function
import { getSocketPath } from './socket-client.js';
