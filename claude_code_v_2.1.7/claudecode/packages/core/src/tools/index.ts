/**
 * @claudecode/core - Tool Framework
 *
 * Central module for tool management, registration, and execution.
 *
 * Key components:
 * - Tool interface and types
 * - Tool registry for managing available tools
 * - Base tool classes for implementation
 * - Tool grouping and filtering utilities
 */

// Re-export types
export * from './types.js';

// Re-export registry
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
} from './registry.js';

// Re-export base classes
export {
  BaseTool,
  ReadOnlyTool,
  FileTool,
  createSchema,
  createPassthroughSchema,
} from './base-tool.js';

// Re-export execution flow
export {
  executeSingleTool,
  executeToolWithValidation,
  executeToolWithProgress,
  findToolByName,
  getToolDisplayName,
  parseMcpToolName,
  getMcpServerType,
  createUserRejectedToolResult,
  formatValidationError,
  USER_REJECTED_CONTENT,
  CANCELLED_BY_USER_MESSAGE,
} from './execution.js';
