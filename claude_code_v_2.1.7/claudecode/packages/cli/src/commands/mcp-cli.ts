/**
 * @claudecode/cli - MCP CLI Handler
 *
 * MCP (Model Context Protocol) CLI for interacting with MCP servers
 * outside of the main interactive session.
 *
 * Reconstructed from cli.chunks.mjs:5055-5326
 *
 * Key symbols:
 * - de → mcpCliProgram
 * - nX9 → mcpCliHandler
 * - vuA → executeWithTelemetry
 * - rP0 → parseToolIdentifier
 */

import { Command } from 'commander';

// ============================================
// Types
// ============================================

interface ServerInfo {
  name: string;
  type: 'connected' | 'failed' | 'disconnected' | 'pending';
  hasTools?: boolean;
  hasResources?: boolean;
  hasPrompts?: boolean;
  error?: string;
}

interface ToolInfo {
  server: string;
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

interface ResourceInfo {
  server: string;
  name?: string;
  uri: string;
  mimeType?: string;
}

interface TelemetryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// Constants
// ============================================

const DEFAULT_TIMEOUT_MS = 60000; // 1 minute

// ============================================
// Utilities
// ============================================

/**
 * Parse tool identifier in format server/tool.
 * Original: rP0 in cli.chunks.mjs
 */
function parseToolIdentifier(identifier: string): { server: string; tool: string } {
  const slashIndex = identifier.indexOf('/');
  if (slashIndex === -1) {
    throw new Error(`Invalid tool identifier '${identifier}'. Expected format: server/tool`);
  }
  return {
    server: identifier.substring(0, slashIndex),
    tool: identifier.substring(slashIndex + 1),
  };
}

/**
 * Check if running in endpoint mode (Claude Code instance already running).
 * Original: P$ in cli.chunks.mjs
 */
function isRunningInEndpoint(): boolean {
  // Check for Claude Code state file or socket
  // In standalone mode, this returns false
  return false; // Default to standalone mode for now
}

/**
 * Get default timeout from environment.
 * Original: U3A in cli.chunks.mjs
 */
function getDefaultTimeout(): number {
  const envTimeout = process.env.MCP_TOOL_TIMEOUT;
  if (envTimeout) {
    const parsed = parseInt(envTimeout, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return DEFAULT_TIMEOUT_MS;
}

/**
 * Execute command with telemetry wrapper.
 * Original: vuA in cli.chunks.mjs
 */
async function executeWithTelemetry<T>(
  commandName: string,
  executor: () => Promise<T>,
  _successMetrics?: (data: T) => Record<string, unknown>,
  _failureMetrics?: Record<string, unknown>
): Promise<TelemetryResult<T>> {
  try {
    const data = await executor();
    // Track telemetry (omitted for now)
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Track telemetry (omitted for now)
    console.error(`Error in ${commandName}: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

/**
 * Format text with chalk-like styling.
 */
const chalk = {
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
  dim: (text: string) => `\x1b[2m${text}\x1b[0m`,
};

// ============================================
// MCP State (Stub Implementation)
// ============================================

interface McpState {
  clients: Map<string, { type: string; hasTools: boolean; hasResources: boolean; hasPrompts: boolean }>;
  tools: ToolInfo[];
  resources: ResourceInfo[];
  normalizedNames: Map<string, string>;
}

/**
 * Get MCP state.
 * In a full implementation, this would connect to MCP servers.
 */
function getMcpState(): McpState {
  return {
    clients: new Map(),
    tools: [],
    resources: [],
    normalizedNames: new Map(),
  };
}

/**
 * Initialize MCP connections.
 */
async function initializeMcp(): Promise<void> {
  // Load MCP configuration and connect to servers
  // This would normally read from ~/.claude/settings.json
}

// ============================================
// Command Implementations
// ============================================

/**
 * Format server list.
 * Original: M$1 in cli.chunks.mjs
 */
function formatServerList(clients: Map<string, any>): ServerInfo[] {
  const servers: ServerInfo[] = [];
  for (const [name, client] of clients) {
    servers.push({
      name,
      type: client.type || 'connected',
      hasTools: client.hasTools || false,
      hasResources: client.hasResources || false,
      hasPrompts: client.hasPrompts || false,
    });
  }
  return servers;
}

/**
 * Filter tools by server.
 * Original: R$1 in cli.chunks.mjs
 */
function filterTools(tools: ToolInfo[], params: { server?: string }): ToolInfo[] {
  if (params.server) {
    return tools.filter((t) => t.server === params.server);
  }
  return tools;
}

/**
 * Search tools by pattern.
 * Original: j$1 in cli.chunks.mjs
 */
function searchTools(
  tools: ToolInfo[],
  params: { pattern: string; ignoreCase?: boolean }
): ToolInfo[] {
  const regex = new RegExp(params.pattern, params.ignoreCase ? 'i' : '');
  return tools.filter((t) => {
    return regex.test(t.name) || (t.description && regex.test(t.description));
  });
}

/**
 * Find tool by name.
 * Original: _$1 in cli.chunks.mjs
 */
function findTool(
  tools: ToolInfo[],
  params: { server: string; toolName: string }
): ToolInfo | undefined {
  return tools.find((t) => t.server === params.server && t.name === params.toolName);
}

/**
 * Filter resources by server.
 * Original: T$1 in cli.chunks.mjs
 */
function filterResources(
  resources: ResourceInfo[],
  params: { server?: string },
  _normalizedNames?: Map<string, string>
): ResourceInfo[] {
  if (params.server) {
    return resources.filter((r) => r.server === params.server);
  }
  return resources;
}

// ============================================
// MCP CLI Program
// ============================================

/**
 * Create MCP CLI program.
 * Original: de in cli.chunks.mjs
 */
function createMcpCliProgram(): Command {
  const program = new Command();
  program
    .name('claude --mcp-cli')
    .description('MCP CLI for interacting with MCP servers')
    .version('2.1.7');

  // servers command
  program
    .command('servers')
    .description('List all connected MCP servers')
    .option('--json', 'Output in JSON format')
    .action(async (options) => {
      const result = await executeWithTelemetry(
        'servers',
        async () => {
          if (isRunningInEndpoint()) {
            // In endpoint mode, send command to running instance
            console.error('Endpoint mode not implemented');
            return [];
          }
          await initializeMcp();
          return formatServerList(getMcpState().clients);
        },
        (data) => ({ server_count: data.length })
      );

      if (!result.success) {
        process.exit(1);
      }

      const servers = result.data || [];
      if (options.json) {
        console.log(JSON.stringify(servers));
      } else if (servers.length === 0) {
        console.log('No MCP servers configured.');
      } else {
        servers.forEach((server) => {
          const status =
            server.type === 'connected'
              ? chalk.green('connected')
              : server.type === 'failed'
                ? chalk.red('failed')
                : chalk.yellow(server.type);

          let capabilities = '';
          if (server.type === 'connected') {
            const caps = [];
            if (server.hasTools) caps.push('tools');
            if (server.hasResources) caps.push('resources');
            if (server.hasPrompts) caps.push('prompts');
            if (caps.length > 0) capabilities = ` (${caps.join(', ')})`;
          }
          console.log(`${server.name} - ${status}${capabilities}`);
        });
      }
    });

  // tools command
  program
    .command('tools')
    .description('List all available tools')
    .argument('[server]', 'Filter by server name')
    .option('--json', 'Output in JSON format')
    .action(async (serverFilter, options) => {
      const result = await executeWithTelemetry(
        'tools',
        async () => {
          await initializeMcp();
          return filterTools(getMcpState().tools, { server: serverFilter });
        },
        (data) => ({ tool_count: data.length, filtered: !!serverFilter })
      );

      if (!result.success) {
        process.exit(1);
      }

      const tools = result.data || [];
      if (options.json) {
        console.log(JSON.stringify(tools));
      } else if (tools.length === 0) {
        console.log('No tools available.');
      } else if (serverFilter) {
        tools.forEach((tool) => console.log(tool.name));
      } else {
        tools.forEach((tool) => console.log(`${tool.server}/${tool.name}`));
      }
    });

  // info command
  program
    .command('info')
    .description('Get detailed information about a tool')
    .argument('<tool>', 'Tool identifier in format <server>/<tool>')
    .option('--json', 'Output in JSON format')
    .action(async (toolIdentifier, options) => {
      const result = await executeWithTelemetry(
        'info',
        async () => {
          const { server, tool } = parseToolIdentifier(toolIdentifier);
          await initializeMcp();
          const state = getMcpState();
          const toolInfo = findTool(state.tools, { server, toolName: tool });

          if (!toolInfo) {
            throw new Error(`Tool '${tool}' not found on server '${server}'`);
          }
          return toolInfo;
        },
        () => ({ tool_found: true }),
        { tool_found: false }
      );

      if (!result.success) {
        process.exit(1);
      }

      const toolData = result.data!;
      if (options.json) {
        console.log(JSON.stringify(toolData));
      } else {
        console.log(chalk.bold(`Tool: ${toolIdentifier}`));
        console.log(chalk.dim(`Server: ${toolData.server}`));
        if (toolData.description) {
          console.log(chalk.dim(`Description: ${toolData.description}`));
        }
        console.log();
        console.log(chalk.bold('Input Schema:'));
        console.log(JSON.stringify(toolData.inputSchema, null, 2));
      }
    });

  // call command
  program
    .command('call')
    .description('Invoke an MCP tool')
    .argument('<tool>', 'Tool identifier in format <server>/<tool>')
    .argument('<args>', 'Tool arguments as JSON string or "-" for stdin')
    .option('--json', 'Output in JSON format')
    .option('--timeout <ms>', 'Timeout in milliseconds')
    .option('--debug', 'Show debug output')
    .action(async (toolIdentifier, argsInput, options) => {
      const { server, tool } = parseToolIdentifier(toolIdentifier);

      // Handle stdin input
      if (argsInput === '-') {
        const chunks: Buffer[] = [];
        for await (const chunk of process.stdin) {
          chunks.push(chunk as Buffer);
        }
        argsInput = Buffer.concat(chunks).toString('utf-8').trim();
      }

      // Parse JSON arguments
      let args: Record<string, unknown>;
      try {
        args = JSON.parse(argsInput);
      } catch (error) {
        console.error(chalk.red('Error: Invalid JSON arguments'));
        console.error(String(error));
        process.exit(1);
      }

      const timeout = parseInt(options.timeout || '', 10) || getDefaultTimeout();

      try {
        await initializeMcp();

        // Execute the tool
        // In a full implementation, this would call the MCP server
        console.log(chalk.yellow('Tool execution not implemented in standalone mode'));
        console.log(`Server: ${server}`);
        console.log(`Tool: ${tool}`);
        console.log(`Args: ${JSON.stringify(args, null, 2)}`);
        console.log(`Timeout: ${timeout}ms`);

        process.exit(0);
      } catch (error) {
        console.error(chalk.red('Error calling tool:'), String(error));
        process.exit(1);
      }
    });

  // grep command
  program
    .command('grep')
    .description('Search tool names and descriptions using regex patterns')
    .argument('<pattern>', 'Regex pattern to search for')
    .option('--json', 'Output in JSON format')
    .option('-i, --ignore-case', 'Case insensitive search', true)
    .action(async (pattern, options) => {
      const result = await executeWithTelemetry(
        'grep',
        async () => {
          // Validate regex
          try {
            new RegExp(pattern, options.ignoreCase ? 'i' : '');
          } catch (error) {
            throw new Error(
              `Invalid regex pattern: ${error instanceof Error ? error.message : String(error)}`
            );
          }

          await initializeMcp();
          return searchTools(getMcpState().tools, { pattern, ignoreCase: options.ignoreCase });
        },
        (data) => ({ match_count: data.length })
      );

      if (!result.success) {
        process.exit(1);
      }

      const matches = result.data || [];
      if (options.json) {
        console.log(JSON.stringify(matches));
      } else if (matches.length === 0) {
        console.log(chalk.yellow('No tools found matching pattern'));
      } else {
        matches.forEach((tool) => {
          console.log(chalk.bold(`${tool.server}/${tool.name}`));
          if (tool.description) {
            const desc =
              tool.description.length > 100
                ? tool.description.slice(0, 100) + '...'
                : tool.description;
            console.log(chalk.dim(`  ${desc}`));
          }
          console.log();
        });
      }
    });

  // resources command
  program
    .command('resources')
    .description('List MCP resources')
    .argument('[server]', 'Filter by server name')
    .option('--json', 'Output in JSON format')
    .action(async (serverFilter, options) => {
      const result = await executeWithTelemetry(
        'resources',
        async () => {
          await initializeMcp();
          const state = getMcpState();
          return filterResources(state.resources, { server: serverFilter }, state.normalizedNames);
        },
        (data) => ({ resource_count: data.length, filtered: !!serverFilter })
      );

      if (!result.success) {
        process.exit(1);
      }

      const resources = result.data || [];
      if (options.json) {
        console.log(JSON.stringify(resources));
      } else if (resources.length === 0) {
        console.log('No resources available.');
      } else {
        resources.forEach((resource) => {
          console.log(`${resource.server}/${resource.name || resource.uri}`);
        });
      }
    });

  // read command
  program
    .command('read')
    .description('Read an MCP resource')
    .argument('<resource>', 'Resource identifier in format <server>/<resource> or <server> <uri>')
    .argument('[uri]', 'Optional: Direct resource URI')
    .option('--json', 'Output in JSON format')
    .option('--timeout <ms>', 'Timeout in milliseconds')
    .option('--debug', 'Show debug output')
    .action(async (resourceArg, uriArg, options) => {
      let server: string;
      let resourceName: string | undefined;
      let uri: string | undefined;

      // Parse arguments
      if (uriArg) {
        server = resourceArg;
        uri = uriArg;
      } else {
        const parsed = parseToolIdentifier(resourceArg);
        server = parsed.server;
        resourceName = parsed.tool;
      }

      const timeout = parseInt(options.timeout || '', 10) || getDefaultTimeout();

      try {
        await initializeMcp();

        // Resolve URI if not directly provided
        let resolvedUri = uri;
        if (!resolvedUri && resourceName) {
          const state = getMcpState();
          const resources = filterResources(state.resources, { server });
          const resource = resources.find(
            (r) => r.name === resourceName || r.uri === resourceName
          );

          if (!resource) {
            console.error(
              chalk.red(`Error: Resource '${resourceName}' not found on server '${server}'`)
            );
            process.exit(1);
          }
          resolvedUri = resource.uri;
        }

        // Read resource
        console.log(chalk.yellow('Resource reading not implemented in standalone mode'));
        console.log(`Server: ${server}`);
        console.log(`URI: ${resolvedUri}`);
        console.log(`Timeout: ${timeout}ms`);

        process.exit(0);
      } catch (error) {
        console.error(chalk.red('Error reading resource:'), String(error));
        process.exit(1);
      }
    });

  return program;
}

// ============================================
// Main Handler
// ============================================

/**
 * Handle MCP CLI mode.
 * Original: nX9 (mcpCliHandler) in chunks.157.mjs
 */
export async function handleMcpCli(args: string[]): Promise<number> {
  const program = createMcpCliProgram();

  try {
    await program.parseAsync(args, { from: 'user' });
    return 0;
  } catch (error) {
    console.error('MCP CLI Error:', error instanceof Error ? error.message : String(error));
    return 1;
  }
}

// ============================================
// Export
// ============================================

export { createMcpCliProgram, parseToolIdentifier };
