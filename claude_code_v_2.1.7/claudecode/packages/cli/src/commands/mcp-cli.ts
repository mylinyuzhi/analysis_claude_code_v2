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
import {
  getMcpState,
  initializeMcp,
  getServerList,
  getToolList,
  getResourceList,
  findTool,
  searchTools,
  callMcpTool,
  readMcpResource,
  getServerError,
  McpConnectionError,
  type McpServerInfo,
  type McpToolInfo,
  type McpResourceInfo,
} from '../mcp/state.js';
import {
  isRunningInEndpoint,
  sendMcpCommand,
} from '../endpoint/detection.js';

// ============================================
// Types
// ============================================

interface TelemetryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// Constants
// ============================================

const MCP_COMMAND_SERVERS = 'servers';
const MCP_COMMAND_TOOLS = 'tools';
const MCP_COMMAND_INFO = 'info';
const MCP_COMMAND_CALL = 'call';
const MCP_COMMAND_GREP = 'grep';
const MCP_COMMAND_RESOURCES = 'resources';
const MCP_COMMAND_READ = 'read';

const DEFAULT_TIMEOUT_MS = 100000000; // ~27 hours (effectively unlimited)

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
  successMetrics?: (data: T) => Record<string, unknown>,
  failureMetrics?: Record<string, unknown>
): Promise<TelemetryResult<T>> {
  const startTime = Date.now();

  try {
    const data = await executor();
    const durationMs = Date.now() - startTime;

    // Track telemetry
    if (successMetrics) {
      const metrics = successMetrics(data);
      console.debug(`[Telemetry] ${commandName} succeeded:`, { ...metrics, duration_ms: durationMs });
    }

    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const durationMs = Date.now() - startTime;

    // Track telemetry
    console.debug(`[Telemetry] ${commandName} failed:`, {
      ...failureMetrics,
      error: errorMessage.slice(0, 200),
      duration_ms: durationMs,
    });

    console.error(`Error in ${commandName}: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

/**
 * Format text with ANSI styling.
 */
const chalk = {
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
  dim: (text: string) => `\x1b[2m${text}\x1b[0m`,
};

/**
 * Format JSON output.
 */
function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

// ============================================
// Command Implementations
// ============================================

/**
 * Format server list for display.
 * Original: M$1 in cli.chunks.mjs
 */
function formatServerListOutput(servers: McpServerInfo[]): McpServerInfo[] {
  return servers.map((server) => ({
    name: server.name,
    type: server.type,
    hasTools: server.hasTools || false,
    hasResources: server.hasResources || false,
    hasPrompts: server.hasPrompts || false,
    error: server.error,
  }));
}

/**
 * Filter tools by server.
 * Original: R$1 in cli.chunks.mjs
 */
function filterTools(tools: McpToolInfo[], params: { server?: string }): McpToolInfo[] {
  if (params.server) {
    return tools.filter((t) => t.server === params.server);
  }
  return tools;
}

/**
 * Filter resources by server.
 * Original: T$1 in cli.chunks.mjs
 */
function filterResources(resources: McpResourceInfo[], params: { server?: string }): McpResourceInfo[] {
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
        MCP_COMMAND_SERVERS,
        async () => {
          // Check if running in endpoint mode
          if (isRunningInEndpoint()) {
            return await sendMcpCommand(MCP_COMMAND_SERVERS, {
              command: 'servers',
            }) as McpServerInfo[];
          }

          // Standalone mode - initialize MCP and get servers
          await initializeMcp();
          return formatServerListOutput(getServerList());
        },
        (data) => ({ server_count: data.length })
      );

      if (!result.success) {
        process.exit(1);
      }

      const servers = result.data || [];
      if (options.json) {
        console.log(formatJson(servers));
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
        MCP_COMMAND_TOOLS,
        async () => {
          const params = { server: serverFilter };

          if (isRunningInEndpoint()) {
            return await sendMcpCommand(MCP_COMMAND_TOOLS, {
              command: 'tools',
              params,
            }) as McpToolInfo[];
          }

          await initializeMcp();
          return filterTools(getToolList(), params);
        },
        (data) => ({ tool_count: data.length, filtered: !!serverFilter })
      );

      if (!result.success) {
        process.exit(1);
      }

      const tools = result.data || [];
      if (options.json) {
        console.log(formatJson(tools));
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
        MCP_COMMAND_INFO,
        async () => {
          const { server, tool } = parseToolIdentifier(toolIdentifier);
          const params = { server, toolName: tool };

          if (isRunningInEndpoint()) {
            return await sendMcpCommand(MCP_COMMAND_INFO, {
              command: 'info',
              params,
            }) as McpToolInfo;
          }

          await initializeMcp();
          const toolInfo = findTool(server, tool);

          if (!toolInfo) {
            // Check for server error
            const serverError = getServerError(server);
            if (serverError) {
              throw new Error(serverError);
            }
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
        console.log(formatJson(toolData));
      } else {
        console.log(chalk.bold(`Tool: ${toolIdentifier}`));
        console.log(chalk.dim(`Server: ${toolData.server}`));
        if (toolData.description) {
          console.log(chalk.dim(`Description: ${toolData.description}`));
        }
        console.log();
        console.log(chalk.bold('Input Schema:'));
        console.log(formatJson(toolData.inputSchema));
      }
    });

  // call command
  program
    .command('call')
    .description('Invoke an MCP tool')
    .argument('<tool>', 'Tool identifier in format <server>/<tool>')
    .argument('<args>', 'Tool arguments as JSON string or "-" for stdin')
    .option('--json', 'Output in JSON format')
    .option('--timeout <ms>', 'Timeout in milliseconds (default: MCP_TOOL_TIMEOUT env var or effectively infinite)')
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
      const startTime = Date.now();

      try {
        let result: unknown;

        if (isRunningInEndpoint()) {
          result = await sendMcpCommand(
            MCP_COMMAND_CALL,
            {
              command: 'call',
              params: { server, tool, args, timeoutMs: timeout },
            },
            timeout
          );
        } else {
          await initializeMcp();
          result = await callMcpTool(tool, server, args, {
            debug: options.debug,
            timeout,
          });
        }

        // Output result
        const output = options.json
          ? formatJson(result)
          : typeof result === 'string'
            ? result
            : formatJson(result);

        await new Promise<void>((resolve) => {
          process.stdout.write(output + '\n', () => resolve());
        });

        process.exit(0);
      } catch (error) {
        console.error(chalk.red('Error calling tool:'), String(error));

        const durationMs = Date.now() - startTime;
        const errorType = error instanceof McpConnectionError
          ? 'connection_failed'
          : 'tool_execution_failed';

        console.debug(`[Telemetry] call failed:`, {
          tool: `${server}/${tool}`,
          error_type: errorType,
          duration_ms: durationMs,
        });

        process.exit(1);
      }
    });

  // grep command
  program
    .command('grep')
    .description('Search tool names and descriptions using regex patterns')
    .argument('<pattern>', 'Regex pattern to search for')
    .option('--json', 'Output in JSON format')
    .option('-i, --ignore-case', 'Case insensitive search (default: true)', true)
    .action(async (pattern, options) => {
      const result = await executeWithTelemetry(
        MCP_COMMAND_GREP,
        async () => {
          // Validate regex
          try {
            new RegExp(pattern, options.ignoreCase ? 'i' : '');
          } catch (error) {
            throw new Error(
              `Invalid regex pattern: ${error instanceof Error ? error.message : String(error)}`
            );
          }

          const params = { pattern, ignoreCase: options.ignoreCase };

          if (isRunningInEndpoint()) {
            return await sendMcpCommand(MCP_COMMAND_GREP, {
              command: 'grep',
              params,
            }) as McpToolInfo[];
          }

          await initializeMcp();
          return searchTools(pattern, { ignoreCase: options.ignoreCase });
        },
        (data) => ({ match_count: data.length })
      );

      if (!result.success) {
        process.exit(1);
      }

      const matches = result.data || [];
      if (options.json) {
        console.log(formatJson(matches));
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
        MCP_COMMAND_RESOURCES,
        async () => {
          const params = { server: serverFilter };

          if (isRunningInEndpoint()) {
            return await sendMcpCommand(MCP_COMMAND_RESOURCES, {
              command: 'resources',
              params,
            }) as McpResourceInfo[];
          }

          await initializeMcp();
          return filterResources(getResourceList(), params);
        },
        (data) => ({ resource_count: data.length, filtered: !!serverFilter })
      );

      if (!result.success) {
        process.exit(1);
      }

      const resources = result.data || [];
      if (options.json) {
        console.log(formatJson(resources));
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
        let resolvedUri = uri;

        // Resolve URI if not directly provided
        if (!resolvedUri && resourceName) {
          if (isRunningInEndpoint()) {
            const resources = await sendMcpCommand(MCP_COMMAND_RESOURCES, {
              command: 'resources',
              params: { server },
            }) as McpResourceInfo[];

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
          } else {
            await initializeMcp();
            const resources = filterResources(getResourceList(), { server });
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
        }

        if (!resolvedUri) {
          console.error(chalk.red('Error: No resource URI specified'));
          process.exit(1);
        }

        // Read resource
        let result: { contents: Array<{ text?: string; blob?: string; mimeType?: string }> };

        if (isRunningInEndpoint()) {
          result = await sendMcpCommand(
            MCP_COMMAND_READ,
            {
              command: 'read',
              params: { server, uri: resolvedUri, timeoutMs: timeout },
            },
            timeout
          ) as typeof result;
        } else {
          if (!getMcpState().initialized) {
            await initializeMcp();
          }
          result = await readMcpResource(server, resolvedUri, {
            debug: options.debug,
            timeout,
          });
        }

        // Output result
        if (options.json) {
          console.log(formatJson(result));
        } else {
          for (const content of result.contents) {
            if (content.text) {
              console.log(content.text);
            } else if (content.blob) {
              console.log(`[Binary data: ${content.mimeType || 'unknown type'}]`);
            }
          }
        }

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
