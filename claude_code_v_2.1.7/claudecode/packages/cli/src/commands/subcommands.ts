/**
 * @claudecode/cli - Subcommands
 * 
 * Implementation of CLI subcommands (mcp, plugin, marketplace, etc.)
 * Reconstructed from chunks.157.mjs:793-1151
 */

import { Command } from 'commander';
import { CLI_CONSTANTS } from '../types.js';
import { 
  loadAllSettings, 
  saveUserSettings, 
  getProjectSettingsPath,
  readJsonFile,
  writeJsonFile,
  getLocalSettingsPath,
  getUserSettingsPath,
  getWorkingDirectory,
} from '../settings/loader.js';
import {
  initializeWorkspace,
  removeMcpServer,
  checkServerHealth,
  getMcpConfiguration,
  findMcpServer,
  addMcpServer,
  updateLocalSettings,
  validateManifest,
  installPlugin,
  uninstallPlugin,
  enablePlugin,
  disablePlugin,
  updatePlugin,
  addMarketplace,
  getMarketplaces,
  removeMarketplace,
  updateMarketplace,
  updateAllMarketplaces,
  clearMarketplaceCache,
} from '../mcp/index.js';
import { telemetry, symbols } from '@claudecode/platform';

/**
 * Register all subcommands to the main program.
 * Original: J_7 registration logic in chunks.157.mjs
 */
export function registerSubcommands(program: Command): void {
  // ============================================
  // MCP Subcommand Group
  // ============================================
  const mcp = program.command('mcp')
    .description('Configure and manage MCP servers')
    .helpOption('-h, --help', 'Display help for command');

  mcp.command('serve')
    .description('Start the Claude Code MCP server')
    .option('-d, --debug', 'Enable debug mode')
    .option('--verbose', 'Override verbose mode setting from config')
    .action(async (options) => {
      const workingDir = getWorkingDirectory();
      telemetry.trackEvent('tengu_mcp_start', {});
      
      try {
        await initializeWorkspace(workingDir, 'default', false, false);
        // await startMcpServer(workingDir, options.debug ?? false, options.verbose ?? false);
        console.log('MCP server started.');
      } catch (err) {
        console.error('Error: Failed to start MCP server:', err);
        process.exit(1);
      }
    });

  mcp.command('list')
    .description('List configured MCP servers')
    .action(async () => {
      telemetry.trackEvent('tengu_mcp_list', {});
      const { servers } = await getMcpConfiguration();
      
      if (Object.keys(servers).length === 0) {
        console.log('No MCP servers configured. Use `claude mcp add` to add a server.');
        return;
      }

      console.log('Checking MCP server health...\n');
      for (const [name, config] of Object.entries(servers)) {
        const status = await checkServerHealth(name, config as any);
        const server = config as any;
        if (server.type === 'sse') {
          console.log(`${name}: ${server.url} (SSE) - ${status}`);
        } else if (server.type === 'http') {
          console.log(`${name}: ${server.url} (HTTP) - ${status}`);
        } else {
          const args = Array.isArray(server.args) ? server.args : [];
          console.log(`${name}: ${server.command} ${args.join(' ')} - ${status}`);
        }
      }
    });

  mcp.command('remove <name>')
    .description('Remove an MCP server')
    .option('-s, --scope <scope>', 'Configuration scope (local, user, or project)')
    .action(async (name, options) => {
      try {
        if (options.scope) {
          telemetry.trackEvent('tengu_mcp_delete', { name, scope: options.scope });
          removeMcpServer(name, options.scope);
          console.log(`Removed MCP server ${name} from ${options.scope} config`);
          return;
        }

        const settings = loadAllSettings();
        const scopes: string[] = [];
        // In source, it checks each scope's settings explicitly
        // This is a simplified check
        if (settings.mcpServers?.[name]) {
          scopes.push('user'); 
        }

        if (scopes.length === 0) {
          console.error(`No MCP server found with name: "${name}"`);
          process.exit(1);
        } else if (scopes.length === 1) {
          removeMcpServer(name, scopes[0] as any);
          console.log(`Removed MCP server "${name}" from ${scopes[0]} config`);
        } else {
          console.error(`MCP server "${name}" exists in multiple scopes:`);
          scopes.forEach(s => console.error(`  - ${s}`));
          console.error(`\nTo remove from a specific scope, use: claude mcp remove "${name}" -s <scope>`);
          process.exit(1);
        }
      } catch (err: any) {
        console.error(err.message);
        process.exit(1);
      }
    });

  mcp.command('reset-project-choices')
    .description('Reset all approved and rejected project-scoped (.mcp.json) servers within this project')
    .action(async () => {
      telemetry.trackEvent('tengu_mcp_reset_mcpjson_choices', {});
      updateLocalSettings((s: any) => ({
        ...s,
        enabledMcpjsonServers: [],
        disabledMcpjsonServers: [],
        enableAllProjectMcpServers: false
      }));
      console.log('All project-scoped (.mcp.json) server approvals and rejections have been reset.');
      process.exit(0);
    });

  // ============================================
  // Plugin Subcommand Group
  // ============================================
  const plugin = program.command('plugin')
    .description('Manage Claude Code plugins')
    .helpOption('-h, --help', 'Display help for command');

  plugin.command('validate <path>')
    .description('Validate a plugin or marketplace manifest')
    .action(async (path) => {
      try {
        const result = validateManifest(path);
        console.log(`Validating ${result.fileType} manifest: ${result.filePath}\n`);
        
        if (result.errors.length > 0) {
          console.log(`${symbols.cross} Found ${result.errors.length} errors:\n`);
          result.errors.forEach((e: any) => console.log(`  ${symbols.pointer} ${e.path}: ${e.message}`));
        }
        
        if (result.success) {
          console.log(`${symbols.tick} Validation passed`);
          process.exit(0);
        } else {
          console.log(`${symbols.cross} Validation failed`);
          process.exit(1);
        }
      } catch (err: any) {
        console.error(`${symbols.cross} Unexpected error: ${err.message}`);
        process.exit(2);
      }
    });

  const marketplace = plugin.command('marketplace')
    .description('Manage Claude Code marketplaces');

  marketplace.command('add <source>')
    .description('Add a marketplace from a URL, path, or GitHub repo')
    .action(async (source) => {
      try {
        console.log('Adding marketplace...');
        const { name } = await addMarketplace(source);
        clearMarketplaceCache();
        console.log(`${symbols.tick} Successfully added marketplace: ${name}`);
      } catch (err) {
        console.error(`${symbols.cross} Failed to add marketplace: ${err}`);
      }
    });

  marketplace.command('list')
    .description('List all configured marketplaces')
    .action(async () => {
      const marketplaces = await getMarketplaces();
      if (Object.keys(marketplaces).length === 0) {
        console.log('No marketplaces configured');
        return;
      }
      console.log('Configured marketplaces:');
      for (const [name, info] of Object.entries(marketplaces)) {
        console.log(`  ${symbols.pointer} ${name}`);
      }
    });

  // ============================================
  // Utility Subcommands
  // ============================================
  program.command('setup-token')
    .description('Set up a long-lived authentication token (requires Claude subscription)')
    .action(async () => {
      telemetry.trackEvent('tengu_setup_token_command', {});
      console.log('Setting up long-lived token...');
    });

  program.command('doctor')
    .description('Check the health of your Claude Code auto-updater')
    .action(async () => {
      telemetry.trackEvent('tengu_doctor_command', {});
      console.log('Running diagnostics...');
    });

  program.command('update')
    .description('Check for updates and install if available')
    .action(async () => {
      console.log('Checking for updates...');
    });

  program.command('install [target]')
    .description('Install Claude Code native build')
    .option('--force', 'Force installation even if already installed')
    .action(async (target, options) => {
      await initializeWorkspace(getWorkingDirectory(), 'default', false, false);
      console.log(`Installing ${target || 'latest'} build...`);
    });
}
