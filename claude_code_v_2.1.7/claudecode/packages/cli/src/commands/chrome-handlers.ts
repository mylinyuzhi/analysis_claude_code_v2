/**
 * @claudecode/cli - Chrome Handlers
 *
 * Handlers for Chrome integration modes:
 * - Chrome MCP server mode (--claude-in-chrome-mcp)
 * - Chrome native host mode (--chrome-native-host)
 *
 * Reconstructed from chunks.157.mjs
 */

import { 
  startNativeHostBridge, 
  startChromeMcpClient 
} from '@claudecode/integrations/chrome';
import { 
  Server, 
  StdioServerTransport 
} from '@claudecode/integrations/mcp';

/**
 * Handle Chrome MCP server mode.
 * Original: oX9 (claudeInChromeMcp) in chunks.157.mjs
 *
 * This starts an MCP server that the Chrome extension can connect to
 * via the native host bridge.
 */
export async function handleChromeMcp(): Promise<void> {
  await startChromeMcpClient(Server, StdioServerTransport);
}

/**
 * Handle Chrome native host mode.
 * Original: AI9 (chromeNativeHostMain) in chunks.157.mjs
 *
 * This process:
 * 1. Reads native messaging from Chrome extension (stdin)
 * 2. Forwards to MCP server (socket)
 * 3. Returns responses via native messaging (stdout)
 */
export async function handleChromeNative(): Promise<void> {
  await startNativeHostBridge();
}
