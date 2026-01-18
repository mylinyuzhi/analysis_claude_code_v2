/**
 * @claudecode/core - Tool Registry
 *
 * Central registry for managing and accessing tools.
 * Reconstructed from chunks.115.mjs, chunks.144.mjs
 */

import type {
  Tool,
  ToolGroup,
  ToolGroupings,
  ToolUseContext,
  PermissionResult,
} from './types.js';
import {
  BUILTIN_TOOL_NAMES,
  ALWAYS_EXCLUDED_TOOLS,
  ASYNC_SAFE_TOOLS,
} from './types.js';

// ============================================
// Tool Registry
// ============================================

/**
 * Central tool registry singleton
 */
class ToolRegistry {
  private tools: Map<string, Tool> = new Map();
  private mcpTools: Map<string, Tool> = new Map();

  /**
   * Register a built-in tool
   */
  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  /**
   * Register an MCP tool
   */
  registerMcpTool(tool: Tool, serverName: string): void {
    const mcpName = `mcp__${serverName}__${tool.name}`;
    this.mcpTools.set(mcpName, {
      ...tool,
      name: mcpName,
    });
  }

  /**
   * Unregister an MCP tool
   */
  unregisterMcpTool(toolName: string): void {
    this.mcpTools.delete(toolName);
  }

  /**
   * Clear all MCP tools
   */
  clearMcpTools(): void {
    this.mcpTools.clear();
  }

  /**
   * Get a tool by name
   */
  get(name: string): Tool | undefined {
    return this.tools.get(name) || this.mcpTools.get(name);
  }

  /**
   * Get all registered tools
   */
  getAll(): Tool[] {
    return [...this.tools.values(), ...this.mcpTools.values()];
  }

  /**
   * Get all built-in tools
   */
  getBuiltinTools(): Tool[] {
    return [...this.tools.values()];
  }

  /**
   * Get all MCP tools
   */
  getMcpTools(): Tool[] {
    return [...this.mcpTools.values()];
  }

  /**
   * Check if a tool exists
   */
  has(name: string): boolean {
    return this.tools.has(name) || this.mcpTools.has(name);
  }

  /**
   * Get enabled tools
   */
  getEnabled(): Tool[] {
    return this.getAll().filter((tool) => tool.isEnabled());
  }

  /**
   * Get tool names
   */
  getNames(): string[] {
    return [...this.tools.keys(), ...this.mcpTools.keys()];
  }
}

/**
 * Global tool registry instance
 */
export const toolRegistry = new ToolRegistry();

// ============================================
// Tool Groupings
// ============================================

/**
 * Get standard tool groupings for UI and permissions.
 * Original: XG9 in chunks.144.mjs:1259-1281
 */
export function getToolGroupings(): ToolGroupings {
  return {
    READ_ONLY: {
      name: 'Read-only tools',
      toolNames: new Set([
        'Glob',
        'Grep',
        'Task',
        'Read',
        'WebFetch',
        'WebSearch',
        'TaskOutput',
        'KillShell',
        'LSP',
      ]),
    },
    EDIT: {
      name: 'Edit tools',
      toolNames: new Set(['Edit', 'Write', 'NotebookEdit']),
    },
    EXECUTION: {
      name: 'Execution tools',
      toolNames: new Set(['Bash']),
    },
    MCP: {
      name: 'MCP tools',
      toolNames: new Set(),
      isMcp: true,
    },
    OTHER: {
      name: 'Other tools',
      toolNames: new Set(['TodoWrite', 'Skill', 'AskUserQuestion', 'EnterPlanMode', 'ExitPlanMode']),
    },
  };
}

/**
 * Get the group for a specific tool
 */
export function getToolGroup(toolName: string): ToolGroup | undefined {
  const groupings = getToolGroupings();

  // Check if MCP tool
  if (toolName.startsWith('mcp__')) {
    return groupings.MCP;
  }

  // Check each group
  for (const group of Object.values(groupings)) {
    if (group.toolNames.has(toolName)) {
      return group;
    }
  }

  return groupings.OTHER;
}

// ============================================
// Tool Filtering
// ============================================

/**
 * Filter tools for subagent execution
 */
export function filterToolsForSubagent(
  tools: Tool[],
  options: {
    isAsync?: boolean;
    agentTools?: string[];
    excludeTools?: string[];
  } = {}
): Tool[] {
  const { isAsync, agentTools, excludeTools } = options;

  return tools.filter((tool) => {
    // Always exclude certain tools from subagents
    if (ALWAYS_EXCLUDED_TOOLS.has(tool.name)) {
      return false;
    }

    // Exclude specified tools
    if (excludeTools?.includes(tool.name)) {
      return false;
    }

    // Filter by agent-specified tools
    if (agentTools && agentTools.length > 0) {
      if (!agentTools.includes(tool.name)) {
        return false;
      }
    }

    // For async agents, only include async-safe tools
    if (isAsync && !ASYNC_SAFE_TOOLS.has(tool.name)) {
      return false;
    }

    // Must be enabled
    return tool.isEnabled();
  });
}

/**
 * Filter tools by permission context
 * Original: mz0 in chunks.113.mjs
 */
export function filterToolsByPermission(
  tools: Tool[],
  permissionContext: { mode: string },
  excludeTools?: string[]
): Tool[] {
  return tools.filter((tool) => {
    // Check exclusion list
    if (excludeTools?.includes(tool.name)) {
      return false;
    }

    // In plan mode, only allow certain tools
    if (permissionContext.mode === 'plan') {
      const planModeTools = new Set([
        'Read',
        'Glob',
        'Grep',
        'WebFetch',
        'WebSearch',
        'Task',
        'ExitPlanMode',
        'AskUserQuestion',
      ]);
      return planModeTools.has(tool.name);
    }

    return tool.isEnabled();
  });
}

// ============================================
// Concurrency Safety
// ============================================

/**
 * Check if tools can run concurrently
 */
export function canRunConcurrently(tools: Tool[], inputs: unknown[]): boolean {
  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const input = inputs[i];

    if (!tool.isConcurrencySafe(input)) {
      return false;
    }
  }

  return true;
}

/**
 * Partition tools into concurrent and sequential groups
 */
export function partitionByConcurrency(
  toolsWithInputs: Array<{ tool: Tool; input: unknown }>
): {
  concurrent: Array<{ tool: Tool; input: unknown }>;
  sequential: Array<{ tool: Tool; input: unknown }>;
} {
  const concurrent: Array<{ tool: Tool; input: unknown }> = [];
  const sequential: Array<{ tool: Tool; input: unknown }> = [];

  for (const item of toolsWithInputs) {
    if (item.tool.isConcurrencySafe(item.input)) {
      concurrent.push(item);
    } else {
      sequential.push(item);
    }
  }

  return { concurrent, sequential };
}

// ============================================
// Tool Resolution
// ============================================

/**
 * Resolve a tool by name with fallback
 */
export function resolveTool(
  name: string,
  fallbackTools?: Tool[]
): Tool | undefined {
  // Try registry first
  const registryTool = toolRegistry.get(name);
  if (registryTool) {
    return registryTool;
  }

  // Try fallback list
  if (fallbackTools) {
    return fallbackTools.find((t) => t.name === name);
  }

  return undefined;
}

/**
 * Convert tools to API format
 */
export function toolsToApiFormat(
  tools: Tool[]
): Array<{
  name: string;
  description: string;
  input_schema: unknown;
}> {
  return Promise.all(
    tools.map(async (tool) => ({
      name: tool.name,
      description: await tool.description(),
      input_schema: {
        type: 'object',
        properties: {}, // Would be derived from inputSchema
        required: [],
      },
    }))
  ) as unknown as Array<{
    name: string;
    description: string;
    input_schema: unknown;
  }>;
}

// ============================================
// Export
// ============================================

export {
  ToolRegistry,
  toolRegistry,
  getToolGroupings,
  getToolGroup,
  filterToolsForSubagent,
  filterToolsByPermission,
  canRunConcurrently,
  partitionByConcurrency,
  resolveTool,
  toolsToApiFormat,
};
