/**
 * @claudecode/integrations - Chrome MCP Tools
 *
 * Tool definitions for Chrome browser automation.
 * Reconstructed from chunks.145.mjs (Pe array)
 */

import type { ChromeMcpTool, ChromeMcpToolName } from './types.js';

// ============================================
// Tool Definitions
// ============================================

/**
 * All Chrome MCP tool definitions.
 * Original: Pe array in chunks.145.mjs:4-445
 */
export const CHROME_TOOL_DEFINITIONS: ChromeMcpTool[] = [
  // ---- Tab Management ----
  {
    name: 'tabs_context_mcp',
    title: 'Tabs Context',
    description: 'Get context information about the current MCP tab group. Returns all tab IDs inside the group if it exists. CRITICAL: You must get the context at least once before using other browser automation tools so you know what tabs exist.',
    inputSchema: {
      type: 'object',
      properties: {
        createIfEmpty: {
          type: 'boolean',
          description: 'Creates a new MCP tab group if none exists',
        },
      },
    },
  },
  {
    name: 'tabs_create_mcp',
    title: 'Create Tab',
    description: 'Creates a new tab in the MCP tab group and navigates to the specified URL.',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to navigate to',
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'tabs_close_mcp',
    title: 'Close Tab',
    description: 'Closes a tab by its ID.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab to close',
        },
      },
      required: ['tabId'],
    },
  },
  {
    name: 'tabs_focus_mcp',
    title: 'Focus Tab',
    description: 'Focuses (activates) a tab by its ID.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab to focus',
        },
      },
      required: ['tabId'],
    },
  },
  {
    name: 'tabs_navigate_mcp',
    title: 'Navigate Tab',
    description: 'Navigates an existing tab to a new URL.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab to navigate',
        },
        url: {
          type: 'string',
          description: 'The URL to navigate to',
        },
      },
      required: ['tabId', 'url'],
    },
  },

  // ---- Page Interaction ----
  {
    name: 'page_click_mcp',
    title: 'Click Element',
    description: 'Clicks an element on the page identified by a CSS selector.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab',
        },
        selector: {
          type: 'string',
          description: 'CSS selector for the element to click',
        },
        button: {
          type: 'string',
          enum: ['left', 'right', 'middle'],
          description: 'Mouse button to use',
        },
        clickCount: {
          type: 'number',
          description: 'Number of clicks (1 for single, 2 for double)',
        },
      },
      required: ['tabId', 'selector'],
    },
  },
  {
    name: 'page_fill_mcp',
    title: 'Fill Input',
    description: 'Fills an input field with the specified value.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab',
        },
        selector: {
          type: 'string',
          description: 'CSS selector for the input element',
        },
        value: {
          type: 'string',
          description: 'The value to fill',
        },
      },
      required: ['tabId', 'selector', 'value'],
    },
  },
  {
    name: 'page_select_mcp',
    title: 'Select Option',
    description: 'Selects an option in a select element.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab',
        },
        selector: {
          type: 'string',
          description: 'CSS selector for the select element',
        },
        value: {
          type: 'string',
          description: 'The value of the option to select',
        },
      },
      required: ['tabId', 'selector', 'value'],
    },
  },
  {
    name: 'page_hover_mcp',
    title: 'Hover Element',
    description: 'Hovers over an element on the page.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab',
        },
        selector: {
          type: 'string',
          description: 'CSS selector for the element to hover',
        },
      },
      required: ['tabId', 'selector'],
    },
  },
  {
    name: 'page_scroll_mcp',
    title: 'Scroll Page',
    description: 'Scrolls the page or an element.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab',
        },
        selector: {
          type: 'string',
          description: 'CSS selector for element to scroll (optional, defaults to page)',
        },
        direction: {
          type: 'string',
          enum: ['up', 'down', 'left', 'right'],
          description: 'Direction to scroll',
        },
        amount: {
          type: 'number',
          description: 'Amount to scroll in pixels',
        },
      },
      required: ['tabId'],
    },
  },
  {
    name: 'page_keyboard_mcp',
    title: 'Keyboard Input',
    description: 'Sends keyboard input to the page.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab',
        },
        key: {
          type: 'string',
          description: 'Key to press (e.g., "Enter", "Tab", "a")',
        },
        modifiers: {
          type: 'array',
          items: { type: 'string' },
          description: 'Modifier keys (e.g., ["ctrl", "shift"])',
        },
      },
      required: ['tabId', 'key'],
    },
  },

  // ---- Content Capture ----
  {
    name: 'screenshot_mcp',
    title: 'Screenshot',
    description: 'Captures a screenshot of the page or a specific element.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab',
        },
        fullPage: {
          type: 'boolean',
          description: 'Capture the full scrollable page',
        },
        selector: {
          type: 'string',
          description: 'CSS selector for element to capture (optional)',
        },
      },
      required: ['tabId'],
    },
  },
  {
    name: 'snapshot_mcp',
    title: 'Page Snapshot',
    description: 'Gets a snapshot of the page DOM structure for accessibility tree analysis.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab',
        },
      },
      required: ['tabId'],
    },
  },
  {
    name: 'console_logs_mcp',
    title: 'Console Logs',
    description: 'Gets console log messages from the page.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab',
        },
        level: {
          type: 'string',
          enum: ['all', 'log', 'warn', 'error', 'info', 'debug'],
          description: 'Filter by log level',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of entries to return',
        },
      },
      required: ['tabId'],
    },
  },
  {
    name: 'network_logs_mcp',
    title: 'Network Logs',
    description: 'Gets network request logs from the page.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of entries to return',
        },
      },
      required: ['tabId'],
    },
  },

  // ---- Script Execution ----
  {
    name: 'evaluate_mcp',
    title: 'Evaluate JavaScript',
    description: 'Executes JavaScript code in the page context and returns the result.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab',
        },
        expression: {
          type: 'string',
          description: 'JavaScript expression to evaluate',
        },
      },
      required: ['tabId', 'expression'],
    },
  },

  // ---- Recording ----
  {
    name: 'gif_record_mcp',
    title: 'Start GIF Recording',
    description: 'Starts recording the page as a GIF animation.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab',
        },
        fps: {
          type: 'number',
          description: 'Frames per second (default: 10)',
        },
      },
      required: ['tabId'],
    },
  },
  {
    name: 'gif_stop_mcp',
    title: 'Stop GIF Recording',
    description: 'Stops GIF recording and returns the animation.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: {
          type: 'number',
          description: 'The ID of the tab',
        },
      },
      required: ['tabId'],
    },
  },
];

// ============================================
// Tool Lookup
// ============================================

/**
 * Get tool definition by name.
 */
export function getChromeTool(name: ChromeMcpToolName): ChromeMcpTool | undefined {
  return CHROME_TOOL_DEFINITIONS.find((tool) => tool.name === name);
}

/**
 * Get all tool names.
 */
export function getChromeToolNames(): ChromeMcpToolName[] {
  return CHROME_TOOL_DEFINITIONS.map((tool) => tool.name);
}

/**
 * Check if tool name is valid.
 */
export function isValidChromeTool(name: string): name is ChromeMcpToolName {
  return CHROME_TOOL_DEFINITIONS.some((tool) => tool.name === name);
}

/**
 * Get MCP tool name with prefix.
 */
export function getMcpToolName(name: ChromeMcpToolName): string {
  return `mcp__claude-in-chrome__${name}`;
}

/**
 * Extract Chrome tool name from MCP tool name.
 */
export function extractChromeToolName(mcpName: string): ChromeMcpToolName | null {
  const prefix = 'mcp__claude-in-chrome__';
  if (!mcpName.startsWith(prefix)) return null;
  const name = mcpName.slice(prefix.length);
  return isValidChromeTool(name) ? name : null;
}

// ============================================
// Export
// ============================================

export {
  CHROME_TOOL_DEFINITIONS,
  getChromeTool,
  getChromeToolNames,
  isValidChromeTool,
  getMcpToolName,
  extractChromeToolName,
};
