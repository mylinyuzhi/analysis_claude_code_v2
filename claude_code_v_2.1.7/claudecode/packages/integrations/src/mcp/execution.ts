/**
 * @claudecode/integrations - MCP Tool Execution
 *
 * Execute MCP tools with timeout, progress monitoring, and result processing.
 * Reconstructed from chunks.131.mjs:1369-1433
 */

import type {
  McpConnectedServer,
  McpToolResult,
  McpContent,
} from './types.js';
import { MCP_CONSTANTS } from './types.js';
import { normalizeToolName } from './discovery.js';
import { parseBoolean } from '@claudecode/shared';
import { telemetry } from '@claudecode/platform';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

// ============================================
// Timeout Configuration
// ============================================

/**
 * Get MCP tool timeout.
 * Original: U3A (getMCPToolTimeout) in chunks.148.mjs:3508-3510
 */
export function getMCPToolTimeout(): number {
  const envTimeout = process.env.MCP_TOOL_TIMEOUT;
  if (envTimeout) {
    const parsed = parseInt(envTimeout, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return MCP_CONSTANTS.DEFAULT_TOOL_TIMEOUT;
}

// ============================================
// Keep-Alive Management
// ============================================

/**
 * Check if keep-alive is enabled.
 * Original: E42 (isKeepAliveEnabled) in chunks.131.mjs
 */
function isKeepAliveEnabled(): boolean {
  return parseBoolean(process.env.ENABLE_MCP_KEEPALIVE) || parseBoolean(process.env.MCP_KEEPALIVE);
}

/**
 * Send keep-alive signal.
 * Original: H42 (sendKeepAlive) in chunks.131.mjs
 */
function sendKeepAlive(client: McpConnectedServer): void {
  // Best-effort keepalive. Different MCP clients may expose different methods.
  try {
    const c: any = client.client as any;
    if (typeof c?.ping === 'function') {
      void c.ping();
      return;
    }
    if (typeof c?.keepAlive === 'function') {
      void c.keepAlive();
      return;
    }
    if (typeof c?.request === 'function') {
      // Some clients support raw request (method name varies).
      void c.request('ping', {});
    }
  } catch {
    // ignore
  }
}

// ============================================
// Telemetry
// ============================================

/**
 * Map server name to indexing tool for telemetry.
 * Original: w42 (mapToIndexingTool) in chunks.131.mjs
 */
function mapToIndexingTool(serverName: string): string | null {
  const name = serverName.toLowerCase();
  if (name === 'ide') return 'ide';
  if (name.includes('index')) return 'code_indexing';
  return null;
}

/**
 * Track telemetry event.
 */
function trackEvent(eventName: string, data: Record<string, unknown>): void {
  try {
    telemetry.logEvent(eventName, data as any);
  } catch {
    // ignore
  }
  if (process.env.DEBUG_TELEMETRY) {
    console.log(`[Telemetry] ${eventName}:`, data);
  }
}

// ============================================
// Result Processing
// ============================================

/**
 * Check if content exceeds output limit.
 * Original: ixA (exceedsOutputLimit) in chunks.131.mjs
 */
async function exceedsOutputLimit(content: unknown): Promise<boolean> {
  if (!content) return false;

  const str = typeof content === 'string' ? content : JSON.stringify(content);
  // Default limit is around 100K characters
  return str.length > 100000;
}

/**
 * Check if content contains images.
 * Original: sB7 (containsImages) in chunks.131.mjs
 */
function containsImages(content: unknown): boolean {
  if (!content) return false;
  if (Array.isArray(content)) {
    return content.some(
      (item) => item && typeof item === 'object' && 'type' in item && item.type === 'image'
    );
  }
  return false;
}

/**
 * Save large content to file.
 * Original: hX0 (saveToLargeOutputFile) in chunks.131.mjs
 */
async function saveToLargeOutputFile(content: unknown): Promise<string> {
  const timestamp = Date.now();
  const fileName = `mcp-large-output-${timestamp}`;
  const contentString = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  const saveResult = await saveContentToFile(contentString, fileName);
  if (isSaveError(saveResult)) {
    return `Error: result (${contentString.length.toLocaleString()} characters) exceeds maximum allowed tokens. Failed to save output to file: ${saveResult.error}. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data.`;
  }
  return formatFileReference(saveResult.filepath, saveResult.originalSize, '');
}

/**
 * Save content to file with name.
 * Original: Z4A (saveContentToFile) in chunks.131.mjs
 */
async function saveContentToFile(
  content: string,
  fileName: string
): Promise<{ filepath: string; originalSize: number } | { error: string }> {
  try {
    const baseDir = path.join(os.tmpdir(), 'claude-code-mcp');
    await fs.mkdir(baseDir, { recursive: true });
    const filepath = path.join(baseDir, `${fileName}.txt`);
    await fs.writeFile(filepath, content, 'utf8');
    return { filepath, originalSize: content.length };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Check if save result is an error.
 * Original: Y4A (isSaveError) in chunks.131.mjs
 */
function isSaveError(
  result: { filepath: string; originalSize: number } | { error: string }
): result is { error: string } {
  return 'error' in result;
}

/**
 * Format schema hint.
 * Original: QZ1 (formatSchemaHint) in chunks.131.mjs
 */
function formatSchemaHint(type: string, schema?: unknown): string {
  if (!schema) return '';
  return `Schema: ${JSON.stringify(schema)}`;
}

/**
 * Format file reference.
 * Original: BZ1 (formatFileReference) in chunks.131.mjs
 */
function formatFileReference(
  filepath: string,
  originalSize: number,
  schemaHint: string
): string {
  return `Result saved to: ${filepath} (${originalSize.toLocaleString()} characters)${schemaHint ? `\n${schemaHint}` : ''}`;
}

/**
 * Summarize schema for large content.
 * Original: TF1 (summarizeSchema) in chunks.131.mjs
 */
function summarizeSchema(content: unknown): unknown {
  if (!content) return undefined;
  if (Array.isArray(content)) {
    if (content.length === 0) return undefined;
    return { type: 'array', itemCount: content.length };
  }
  if (typeof content === 'object') {
    return { type: 'object', keys: Object.keys(content as object) };
  }
  return undefined;
}

/**
 * Normalize tool response to standard format.
 * Original: sq0 (normalizeToolResponse) in chunks.131.mjs:1320-1342
 */
async function normalizeToolResponse(
  response: McpToolResult,
  toolName: string,
  serverName: string
): Promise<{
  content: unknown;
  type: string;
  schema?: unknown;
}> {
  if (response && typeof response === 'object') {
    // Format 1: Simple toolResult string
    if ('toolResult' in response) {
      return {
        content: String(response.toolResult),
        type: 'toolResult',
      };
    }

    // Format 2: Structured content (JSON object)
    if ('structuredContent' in response && response.structuredContent !== undefined) {
      return {
        content: JSON.stringify(response.structuredContent),
        type: 'structuredContent',
        schema: summarizeSchema(response.structuredContent),
      };
    }

    // Format 3: Content array (MCP standard format)
    if ('content' in response && Array.isArray(response.content)) {
      const { convertMcpContent } = await import('./discovery.js');
      const convertedContent = (
        await Promise.all(
          response.content.map((item) => convertMcpContent(item as McpContent, serverName))
        )
      ).flat();
      return {
        content: convertedContent,
        type: 'contentArray',
        schema: summarizeSchema(convertedContent),
      };
    }
  }

  // Unknown format - throw error
  const errorMsg = `Unexpected response format from tool ${toolName}`;
  console.error(`[MCP] ${serverName}: ${errorMsg}`);
  throw new Error(errorMsg);
}

/**
 * Process tool result for size and format.
 * Original: tB7 (processToolResult) in chunks.131.mjs:1349-1367
 */
async function processToolResult(
  toolResponse: McpToolResult,
  toolName: string,
  serverName: string
): Promise<unknown> {
  // Step 1: Normalize response format
  const { content: processedContent, type: contentType, schema: schemaInfo } =
    await normalizeToolResponse(toolResponse, toolName, serverName);

  // Step 2: IDE clients get full content (no truncation)
  if (serverName === 'ide') {
    return processedContent;
  }

  // Step 3: Check if content exceeds size limit
  if (!(await exceedsOutputLimit(processedContent))) {
    return processedContent;
  }

  // Step 4: If large output files enabled, save to file directly
  if (parseBoolean(process.env.ENABLE_MCP_LARGE_OUTPUT_FILES)) {
    return await saveToLargeOutputFile(processedContent);
  }

  // Step 5: Empty content passes through
  if (!processedContent) {
    return processedContent;
  }

  // Step 6: Content with images goes to file storage
  if (containsImages(processedContent)) {
    return await saveToLargeOutputFile(processedContent);
  }

  // Step 7: Save large text content to file
  const timestamp = Date.now();
  const fileName = `mcp-${normalizeToolName(serverName)}-${normalizeToolName(toolName)}-${timestamp}`;
  const contentString =
    typeof processedContent === 'string'
      ? processedContent
      : JSON.stringify(processedContent, null, 2);

  const saveResult = await saveContentToFile(contentString, fileName);

  // Step 8: Handle save failure
  if (isSaveError(saveResult)) {
    return `Error: result (${contentString.length.toLocaleString()} characters) exceeds maximum allowed tokens. Failed to save output to file: ${saveResult.error}. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data.`;
  }

  // Step 9: Return file reference with metadata
  const schemaHint = formatSchemaHint(contentType, schemaInfo);
  return formatFileReference(saveResult.filepath, saveResult.originalSize, schemaHint);
}

// ============================================
// Main Tool Execution
// ============================================

/**
 * Format elapsed time for logging.
 */
function formatElapsedTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${Math.floor(ms / 1000)}s`;
  }
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

/**
 * Execute MCP tool with timeout and progress monitoring.
 * Original: zr2 (executeMcpTool) in chunks.131.mjs:1369-1433
 */
export async function executeMcpTool({
  client,
  tool,
  args,
  meta,
  signal,
}: {
  client: McpConnectedServer;
  tool: string;
  args: Record<string, unknown>;
  meta?: object;
  signal?: AbortSignal;
}): Promise<unknown> {
  const startTime = Date.now();
  let progressInterval: ReturnType<typeof setInterval> | undefined;
  let keepAliveInterval: ReturnType<typeof setInterval> | undefined;

  try {
    // Step 1: Log tool call initiation
    console.debug(`[MCP] ${client.name}: Calling MCP tool: ${tool}`);

    // Step 2: Setup 30-second progress monitoring
    progressInterval = setInterval(() => {
      const elapsedMs = Date.now() - startTime;
      const elapsedStr = formatElapsedTime(elapsedMs);
      console.debug(`[MCP] ${client.name}: Tool '${tool}' still running (${elapsedStr} elapsed)`);
    }, MCP_CONSTANTS.PROGRESS_INTERVAL);

    // Step 3: Setup keep-alive if enabled (50s interval)
    if (isKeepAliveEnabled()) {
      keepAliveInterval = setInterval(() => {
        sendKeepAlive(client);
      }, MCP_CONSTANTS.KEEPALIVE_INTERVAL);
    }

    // Step 4: Get timeout (default: 100M ms ~ 27 hours)
    const toolTimeout = getMCPToolTimeout();

    // Step 5: Create timeout promise
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => {
        reject(
          new Error(
            `MCP tool call '${tool}' timed out after ${Math.floor(toolTimeout / 1000)}s`
          )
        );
      }, toolTimeout);
    });

    // Step 6: Execute tool call with race against timeout
    const toolResult = await Promise.race([
      client.client.callTool(
        {
          name: tool,
          arguments: args,
          _meta: meta,
        },
        undefined,
        {
          signal,
          timeout: toolTimeout,
        }
      ),
      timeoutPromise,
    ]).finally(() => {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    });

    // Step 7: Check for error response
    if ('isError' in toolResult && toolResult.isError) {
      let errorMessage = 'Unknown error';

      // Extract error from content or error property
      if ('content' in toolResult && Array.isArray(toolResult.content) && toolResult.content.length > 0) {
        const firstContent = toolResult.content[0] as { text?: string };
        if (firstContent && typeof firstContent === 'object' && 'text' in firstContent) {
          errorMessage = firstContent.text || errorMessage;
        }
      } else if ('error' in toolResult) {
        errorMessage = String(toolResult.error);
      }

      console.error(`[MCP] ${client.name}: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    // Step 8: Format duration for logging
    const totalTime = Date.now() - startTime;
    const durationStr = formatElapsedTime(totalTime);
    console.debug(`[MCP] ${client.name}: Tool '${tool}' completed successfully in ${durationStr}`);

    // Step 9: Emit telemetry if applicable
    const indexingTool = mapToIndexingTool(client.name);
    if (indexingTool) {
      trackEvent('tengu_code_indexing_tool_used', {
        tool: indexingTool,
        source: 'mcp',
        success: true,
      });
    }

    // Step 10: Process and return result
    return await processToolResult(toolResult as McpToolResult, tool, client.name);
  } catch (error) {
    // Clean up intervals
    if (progressInterval !== undefined) clearInterval(progressInterval);
    if (keepAliveInterval !== undefined) clearInterval(keepAliveInterval);

    const totalTime = Date.now() - startTime;

    // Log errors (except AbortError which is expected during cancellation)
    if (error instanceof Error && error.name !== 'AbortError') {
      console.debug(
        `[MCP] ${client.name}: Tool '${tool}' failed after ${Math.floor(totalTime / 1000)}s: ${error.message}`
      );
    }

    // Re-throw unless it was an abort
    if (!(error instanceof Error) || error.name !== 'AbortError') {
      throw error;
    }
  } finally {
    // Always clean up intervals
    if (progressInterval !== undefined) clearInterval(progressInterval);
    if (keepAliveInterval !== undefined) clearInterval(keepAliveInterval);
  }
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免 TS2323/TS2484。
