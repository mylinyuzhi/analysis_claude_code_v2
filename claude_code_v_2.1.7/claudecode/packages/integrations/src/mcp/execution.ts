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
import { logMcpDebug, logMcpError, sanitizeServerName } from './connection.js';
import { parseBoolean, parseBooleanFalse } from '@claudecode/shared';
import { trackEvent, processImage, countTokens } from '@claudecode/platform';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

import { z } from 'zod';

// ============================================
// Internal Helpers
// ============================================

/**
 * Tool result schema hint for LLM.
 * Original: iC in chunks.131.mjs:1382
 */
const toolResultSchema = z.any();

/**
 * Format schema hint.
 * Original: QZ1 in chunks.89.mjs:2359
 */
function formatSchemaHint(type: string, schema?: any): string {
  switch (type) {
    case "toolResult": return "Plain text";
    case "structuredContent": return schema ? `JSON with schema: ${schema}` : "JSON";
    case "contentArray": return schema ? `JSON array with schema: ${schema}` : "JSON array";
    default: return "";
  }
}

/**
 * Format file reference for large output.
 * Original: BZ1 in chunks.89.mjs:2370
 */
function formatFileReference(filepath: string, originalSize: number, format: string): string {
  const GREP_TOOL = "Grep"; // DI in chunks.58.mjs:3114
  const BASH_LIMIT = 400000; // U42 in chunks.89.mjs:2392
  
  return `Error: result (${originalSize.toLocaleString()} characters) exceeds maximum allowed tokens. Output has been saved to ${filepath}.
Format: ${format}
Use offset and limit parameters to read specific portions of the file, the ${GREP_TOOL} tool to search for specific content, and jq to make structured queries.
REQUIREMENTS FOR SUMMARIZATION/ANALYSIS/REVIEW:
- You MUST read the content from the file at ${filepath} in sequential chunks until 100% of the content has been read.
- If you receive truncation warnings when reading the file ("[N lines truncated]"), reduce the chunk size until you have read 100% of the content without truncation ***DO NOT PROCEED UNTIL YOU HAVE DONE THIS***. Bash output is limited to ${BASH_LIMIT.toLocaleString()} chars.
- Before producing ANY summary or analysis, you MUST explicitly describe what portion of the content you have read. ***If you did not read the entire content, you MUST explicitly state this.***`;
}

/**
 * Summarize schema for large content.
 * Original: TF1 in chunks.131.mjs:1305
 */
function summarizeSchema(A: any, Q = 2): any {
  if (A === null) return "null";
  if (Array.isArray(A)) {
    if (A.length === 0) return "[]";
    return `[${summarizeSchema(A[0], Q - 1)}]`;
  }
  if (typeof A === "object") {
    if (Q <= 0) return "{...}";
    let G = Object.entries(A).slice(0, 10).map(([Y, J]) => `${Y}: ${summarizeSchema(J, Q - 1)}`),
      Z = Object.keys(A).length > 10 ? ", ..." : "";
    return `{${G.join(", ")}${Z}}`;
  }
  return typeof A;
}

/**
 * Get MCP tool timeout.
 * Original: U3A in chunks.148.mjs:3508
 */
export function getMCPToolTimeout(): number {
  return parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10) || 1e8;
}

/**
 * Check if keep-alive is enabled.
 * Original: E42 in chunks.89.mjs:2214
 */
function isKeepAliveEnabled(): boolean {
  return (globalThis as any).tG1 !== null;
}

/**
 * Send keep-alive notification.
 * Original: H42 in chunks.89.mjs:2210
 */
function sendKeepAlive(): void {
  const tG1 = (globalThis as any).tG1;
  if (tG1) tG1();
}

/**
 * Map server name to indexing tool name for telemetry.
 * Original: w42 in chunks.89.mjs:2556
 */
function mapToIndexingTool(serverName: string): string | undefined {
  const patterns = [
    { pattern: /^sourcegraph$/i, tool: "sourcegraph" },
    { pattern: /^cody$/i, tool: "cody" },
    { pattern: /^openctx$/i, tool: "openctx" },
    { pattern: /^aider$/i, tool: "aider" },
    { pattern: /^continue$/i, tool: "continue" },
    { pattern: /^github[-_]?copilot$/i, tool: "github-copilot" },
    { pattern: /^cursor$/i, tool: "cursor" },
    { pattern: /^codeium$/i, tool: "codeium" },
    { pattern: /^tabnine$/i, tool: "tabnine" },
    { pattern: /^augment$/i, tool: "augment" },
    { pattern: /^windsurf$/i, tool: "windsurf" },
    { pattern: /^aide$/i, tool: "aide" },
    { pattern: /^pieces$/i, tool: "pieces" },
    { pattern: /^qodo$/i, tool: "qodo" },
    { pattern: /^amazon[-_]?q$/i, tool: "amazon-q" },
    { pattern: /^gemini$/i, tool: "gemini" }
  ];
  for (const { pattern, tool } of patterns) {
    if (pattern.test(serverName)) return tool;
  }
  return undefined;
}

/**
 * Max tokens for MCP output.
 * Original: eG1 in chunks.89.mjs:2241
 */
function getMaxMcpOutputTokens(): number {
  return parseInt(process.env.MAX_MCP_OUTPUT_TOKENS || "25000", 10);
}

/**
 * Max chars for MCP output before truncation.
 * Original: B85 in chunks.89.mjs:2263
 */
function getMaxChars(): number {
  return getMaxMcpOutputTokens() * 4;
}

/**
 * Truncation threshold factor.
 * Original: Q85 in chunks.89.mjs:2349
 */
const TRUNCATION_THRESHOLD_FACTOR = 0.5;

/**
 * Count characters in content.
 * Original: fX0 in chunks.89.mjs:2253
 */
function getCharCount(content: any): number {
  if (typeof content === "string") return content.length;
  return JSON.stringify(content).length;
}

/**
 * Check if output exceeds character limit.
 * Original: ixA in chunks.89.mjs:2313
 */
async function exceedsOutputLimit(content: any): Promise<boolean> {
  if (!content) return false;
  const maxTokens = getMaxMcpOutputTokens();
  if (getCharCount(content) <= maxTokens * TRUNCATION_THRESHOLD_FACTOR) return false;
  
  try {
    const messages = typeof content === "string" 
      ? [{ role: "user", content }] 
      : [{ role: "user", content }];
    const tokens = await countTokens(messages as any, []);
    return !!(tokens && tokens > maxTokens);
  } catch (err) {
    logMcpError("execution", err);
    return false;
  }
}

/**
 * Get truncation footer.
 * Original: G85 in chunks.89.mjs:2267
 */
function getTruncationFooter(): string {
  return `\n\n[OUTPUT TRUNCATED - exceeded ${getMaxMcpOutputTokens()} token limit]\n\nThe tool output was truncated. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data. If pagination is not available, inform the user that you are working with truncated output and results may be incomplete.`;
}

/**
 * Truncate string to char limit.
 * Original: Z85 in chunks.89.mjs:2275
 */
function truncateString(str: string, limit: number): string {
  if (str.length <= limit) return str;
  return str.slice(0, limit);
}

/**
 * Truncate content array to char limit.
 * Original: Y85 in chunks.89.mjs:2280
 */
async function truncateContentArray(content: any[], limit: number): Promise<any[]> {
  let truncated: any[] = [];
  let currentChars = 0;
  
  for (const item of content) {
    const remainingLimit = limit - currentChars;
    if (remainingLimit <= 0) break;
    
    if (item.type === "text") {
      if (item.text.length <= remainingLimit) {
        truncated.push(item);
        currentChars += item.text.length;
      } else {
        truncated.push({
          type: "text",
          text: item.text.slice(0, remainingLimit)
        });
        break;
      }
    } else if (item.type === "image") {
      const IMAGE_CHARS = 1600 * 4; // z42 * 4 in chunks.89.mjs:2296
      if (currentChars + IMAGE_CHARS <= limit) {
        truncated.push(item);
        currentChars += IMAGE_CHARS;
      } else {
        const imageLimit = Math.floor(remainingLimit * 0.75);
        if (imageLimit > 0) {
          try {
            // OeB would resize image, here we just skip if too large for simplicity or implement resize
            // For now, let's just skip if it doesn't fit comfortably
          } catch {}
        }
      }
    } else {
      truncated.push(item);
    }
  }
  return truncated;
}

/**
 * Truncate output if it exceeds token limit.
 * Original: J85 in chunks.89.mjs:2330
 */
async function truncateOutput(content: any): Promise<any> {
  if (!content) return content;
  const limit = getMaxChars();
  const footer = getTruncationFooter();
  
  if (typeof content === "string") {
    return truncateString(content, limit) + footer;
  } else {
    const truncated = await truncateContentArray(content, limit);
    truncated.push({
      type: "text",
      text: footer
    });
    return truncated;
  }
}

/**
 * Truncate output if necessary based on limit check.
 * Original: hX0 in chunks.89.mjs:2344
 */
async function saveToLargeOutputFile(content: any): Promise<any> {
  if (!await exceedsOutputLimit(content)) return content;
  return await truncateOutput(content);
}

/**
 * Check if content contains images.
 * Original: sB7 in chunks.131.mjs:1344
 */
function containsImages(content: any): boolean {
  if (!content || typeof content === "string") return false;
  return content.some((item: any) => item.type === "image");
}

/**
 * Save content to a temporary file.
 * Original: Z4A in chunks.89.mjs:2412
 */
async function saveContentToFile(content: string, fileName: string): Promise<{ filepath: string; originalSize: number } | { error: string }> {
  try {
    const baseDir = path.join(os.tmpdir(), "claude-code", "tool-results");
    await fs.mkdir(baseDir, { recursive: true });
    const filepath = path.join(baseDir, `${fileName}.txt`);
    await fs.writeFile(filepath, content, "utf-8");
    return { filepath, originalSize: content.length };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: msg };
  }
}

/**
 * Check if save result is an error.
 */
function isSaveError(result: any): result is { error: string } {
  return result && "error" in result;
}

/**
 * Convert MCP content item to Claude format.
 * Original: Er2 in chunks.131.mjs:1242-1303
 */
export async function convertMcpContent(contentItem: any, serverName: string): Promise<any[]> {
  const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]); // nB7 in chunks.131.mjs:1561
  
  // Text content
  if (contentItem.type === "text") {
    return [{ type: "text", text: contentItem.text }];
  }
  
  // Image content
  if (contentItem.type === "image") {
    if (!IMAGE_MIME_TYPES.has(contentItem.mimeType)) {
      return [{ type: "text", text: `[Unsupported image type: ${contentItem.mimeType}]` }];
    }
    const buffer = Buffer.from(String(contentItem.data), "base64");
    const processed = await processImage(buffer, undefined, contentItem.mimeType);
    return [{
      type: "image",
      source: {
        type: "base64",
        media_type: contentItem.mimeType,
        data: processed.base64
      }
    }];
  }
  
  // Resources
  if (contentItem.type === "resource") {
    const resource = contentItem.resource;
    if (resource?.text) {
      return [{ type: "text", text: `Resource: ${resource.uri}\n${resource.text}` }];
    }
    if (resource?.blob) {
      const mimeType = resource.mimeType || "application/octet-stream";
      if (IMAGE_MIME_TYPES.has(mimeType)) {
        const buffer = Buffer.from(resource.blob, "base64");
        const processed = await processImage(buffer, undefined, mimeType);
        return [{
          type: "image",
          source: {
            type: "base64",
            media_type: mimeType,
            data: processed.base64
          }
        }];
      }
      return [{ type: "text", text: `[Binary resource: ${resource.uri} (${mimeType})]` }];
    }
  }
  
  // Resource link (URI reference)
  if (contentItem.type === "resource_link") {
    return [{
      type: "text",
      text: `Resource link: ${contentItem.uri}`
    }];
  }
  
  // Unknown type - pass through as text
  return [{
    type: "text",
    text: JSON.stringify(contentItem)
  }];
}

/**
 * Normalize tool response to standard format.
 * Original: sq0 in chunks.131.mjs:1320
 */
async function normalizeToolResponse(response: McpToolResult, toolName: string, serverName: string): Promise<{
  content: any;
  type: string;
  schema?: any;
}> {
  if (response && typeof response === "object") {
    if ("toolResult" in response) {
      return { content: String(response.toolResult), type: "toolResult" };
    }
    if ("structuredContent" in response && response.structuredContent !== undefined) {
      return {
        content: JSON.stringify(response.structuredContent),
        type: "structuredContent",
        schema: summarizeSchema(response.structuredContent)
      };
    }
    if ("content" in response && Array.isArray(response.content)) {
      const converted = (await Promise.all(response.content.map(item => convertMcpContent(item, serverName)))).flat();
      return {
        content: converted,
        type: "contentArray",
        schema: summarizeSchema(converted)
      };
    }
  }
  const msg = `Unexpected response format from tool ${toolName}`;
  logMcpError(serverName, msg);
  throw Error(msg);
}

/**
 * Process tool result for size and format.
 * Original: tB7 in chunks.131.mjs:1349
 */
export async function processToolResult(
  toolResponse: McpToolResult,
  toolName: string,
  serverName: string
): Promise<unknown> {
  const { content, type, schema } = await normalizeToolResponse(toolResponse, toolName, serverName);
  
  if (serverName === "ide") return content;
  if (!await exceedsOutputLimit(content)) return content;
  
  // NOTE: Logic in chunks.131.mjs:1357 - if flag is FALSE (via iX), save to file
  if (parseBooleanFalse(process.env.ENABLE_MCP_LARGE_OUTPUT_FILES)) {
    return await saveToLargeOutputFile(content);
  }
  
  if (!content) return content;
  if (containsImages(content)) return await saveToLargeOutputFile(content);
  
  const timestamp = Date.now();
  const fileName = `mcp-${sanitizeServerName(serverName)}-${sanitizeServerName(toolName)}-${timestamp}`;
  const contentString = typeof content === "string" ? content : JSON.stringify(content, null, 2);
  const saveResult = await saveContentToFile(contentString, fileName);
  
  if (isSaveError(saveResult)) {
    return `Error: result (${contentString.length.toLocaleString()} characters) exceeds maximum allowed tokens. Failed to save output to file: ${saveResult.error}. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data.`;
  }
  
  const schemaHint = formatSchemaHint(type, schema);
  return formatFileReference(saveResult.filepath, saveResult.originalSize, schemaHint);
}

// ============================================
// Main Tool Execution
// ============================================

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
  let progressInterval: any;
  let keepAliveInterval: any;

  try {
    logMcpDebug(client.name, `Calling MCP tool: ${tool}`);

    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      logMcpDebug(client.name, `Tool '${tool}' still running (${Math.floor(elapsed / 1000)}s elapsed)`);
    }, 30000);

    if (isKeepAliveEnabled()) {
      keepAliveInterval = setInterval(() => {
        sendKeepAlive();
      }, 50000);
    }

    const toolTimeout = getMCPToolTimeout();
    let timeoutHandle: any;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => {
        reject(Error(`MCP tool call '${tool}' timed out after ${Math.floor(toolTimeout / 1000)}s`));
      }, toolTimeout);
    });

    const toolResult = await Promise.race([
      client.client.callTool(
        { name: tool, arguments: args, _meta: meta },
        toolResultSchema,
        { signal, timeout: toolTimeout }
      ),
      timeoutPromise,
    ]).finally(() => {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    });

    if ("isError" in toolResult && toolResult.isError) {
      let msg = "Unknown error";
      if ("content" in toolResult && Array.isArray(toolResult.content) && toolResult.content.length > 0) {
        const first = toolResult.content[0];
        if (first && typeof first === "object" && "text" in first) msg = first.text;
      } else if ("error" in toolResult) {
        msg = String(toolResult.error);
      }
      logMcpError(client.name, msg);
      throw Error(msg);
    }

    const elapsed = Date.now() - startTime;
    const durationStr = elapsed < 1000 ? `${elapsed}ms` : elapsed < 60000 ? `${Math.floor(elapsed / 1000)}s` : `${Math.floor(elapsed / 60000)}m ${Math.floor((elapsed % 60000) / 1000)}s`;
    logMcpDebug(client.name, `Tool '${tool}' completed successfully in ${durationStr}`);

    const indexingTool = mapToIndexingTool(client.name);
    if (indexingTool) {
      trackEvent("tengu_code_indexing_tool_used", {
        tool: indexingTool,
        source: "mcp",
        success: true,
      });
    }

    return await processToolResult(toolResult as McpToolResult, tool, client.name);
  } catch (err) {
    if (progressInterval !== undefined) clearInterval(progressInterval);
    if (keepAliveInterval !== undefined) clearInterval(keepAliveInterval);
    const elapsed = Date.now() - startTime;
    if (err instanceof Error && err.name !== "AbortError") {
      logMcpDebug(client.name, `Tool '${tool}' failed after ${Math.floor(elapsed / 1000)}s: ${err.message}`);
    }
    if (!(err instanceof Error) || err.name !== "AbortError") throw err;
  } finally {
    if (progressInterval !== undefined) clearInterval(progressInterval);
    if (keepAliveInterval !== undefined) clearInterval(keepAliveInterval);
  }
}
