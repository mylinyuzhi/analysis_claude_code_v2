/**
 * @claudecode/integrations - IDE Integration
 *
 * This module handles deep integration with various IDEs including:
 * - Process-based IDE detection
 * - MCP-based connection handling (SSE/WebSocket)
 * - Extension installation and management
 * - Terminal keybinding configuration
 * - Diff view integration
 * - Context attachments
 *
 * Supported IDEs:
 * - VS Code family: VS Code, Cursor, Windsurf
 * - JetBrains family: IntelliJ, PyCharm, WebStorm, etc.
 */

export * from './types.js';
export * from './config.js';
export * from './detection.js';
export * from './connection.js';
export * from './extension.js';
export * from './keybindings.js';
export * from './diff.js';
export * from './attachments.js';
export * from './hooks.js';
